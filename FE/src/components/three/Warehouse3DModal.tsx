import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { X, RotateCw, Eye, Maximize2, Minimize2, Box, Layers, Globe } from 'lucide-react'
import type { Property } from '@/types/property.types'
import { cn } from '@/utils/cn'

interface Warehouse3DModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property | null
}

export function Warehouse3DModal({ isOpen, onClose, property }: Warehouse3DModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAutoRotate, setIsAutoRotate] = useState(true)
  const [isRoofOpen, setIsRoofOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'html' | 'three'>('three')

  // Three.js instances ref
  const threeRefs = useRef<{
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    renderer?: THREE.WebGLRenderer
    controls?: OrbitControls
    roofGroup?: THREE.Group
    animId?: number
  }>({})

  useEffect(() => {
    if (property?.model3dUrl) {
      setViewMode('html')
    } else {
      setViewMode('three')
    }
  }, [property, isOpen])

  useEffect(() => {
    if (!isOpen || viewMode !== 'three' || !containerRef.current) return

    setIsLoading(true)
    const container = containerRef.current
    const width = container.clientWidth || 800
    const height = container.clientHeight || 500

    // 1. Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x090d16)
    scene.fog = new THREE.FogExp2(0x090d16, 0.007)

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000)
    camera.position.set(55, 35, 60)

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = isAutoRotate
    controls.autoRotateSpeed = 1.0
    controls.maxPolarAngle = Math.PI / 2 - 0.02
    controls.minDistance = 15
    controls.maxDistance = 160

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.3)
    sunLight.position.set(60, 90, 50)
    sunLight.castShadow = true
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4)
    fillLight.position.set(-50, 40, -50)
    scene.add(fillLight)

    // 6. Build 3D Warehouse Models
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 160),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Factory Body
    const factoryW = 46
    const factoryH = 12
    const factoryD = 28
    const factoryBody = new THREE.Mesh(
      new THREE.BoxGeometry(factoryW, factoryH, factoryD),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.35, metalness: 0.5 })
    )
    factoryBody.position.set(0, factoryH / 2, 0)
    factoryBody.castShadow = true
    factoryBody.receiveShadow = true
    scene.add(factoryBody)

    // Roof Group
    const roofGroup = new THREE.Group()
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.7 })
    const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(factoryW + 2, 0.6, factoryD / 2 + 1), roofMat)
    roofLeft.position.set(0, factoryH + 2.5, -factoryD / 4)
    roofLeft.rotation.x = 0.18
    roofGroup.add(roofLeft)

    const roofRight = new THREE.Mesh(new THREE.BoxGeometry(factoryW + 2, 0.6, factoryD / 2 + 1), roofMat)
    roofRight.position.set(0, factoryH + 2.5, factoryD / 4)
    roofRight.rotation.x = -0.18
    roofGroup.add(roofRight)
    scene.add(roofGroup)

    threeRefs.current = {
      scene,
      camera,
      renderer,
      controls,
      roofGroup,
    }

    setIsLoading(false)

    // Animation Loop
    const animate = () => {
      threeRefs.current.animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (threeRefs.current.animId) cancelAnimationFrame(threeRefs.current.animId)
      renderer.dispose()
      if (container) container.innerHTML = ''
    }
  }, [isOpen, viewMode])

  // Controls Handlers
  const toggleAutoRotate = () => {
    const next = !isAutoRotate
    setIsAutoRotate(next)
    if (threeRefs.current.controls) {
      threeRefs.current.controls.autoRotate = next
    }
  }

  const toggleRoof = () => {
    const next = !isRoofOpen
    setIsRoofOpen(next)
    if (threeRefs.current.roofGroup) {
      threeRefs.current.roofGroup.visible = !next
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative flex flex-col w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden transition-all ${
          isFullscreen ? 'h-full max-w-none' : 'max-w-5xl h-[88vh]'
        }`}
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/70 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-500/20">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight truncate max-w-md sm:max-w-xl">
                Mô Phỏng 3D Xoay 360°: {property?.title || 'Khuôn Viên Nhà Xưởng Công Nghiệp'}
              </h3>
              <p className="text-[11px] text-teal-400">
                {viewMode === 'html' && property?.model3dUrl
                  ? 'Mô Hình 3D HTML Tải Lên • Trải nghiệm tương tác xoay 360° trực quan'
                  : 'Three.js Engine • Tương tác xoay, phóng to/thu nhỏ và mở mái xem kết cấu kho'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle when HTML 3D is available */}
            {property?.model3dUrl && (
              <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl text-xs border border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('html')}
                  className={cn(
                    'px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5',
                    viewMode === 'html' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  )}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>File 3D HTML</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('three')}
                  className={cn(
                    'px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5',
                    viewMode === 'three' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  )}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Three.js</span>
                </button>
              </div>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Content Area */}
        <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
          {viewMode === 'html' && property?.model3dUrl ? (
            <div className="w-full h-full bg-slate-950">
              <iframe
                src={property.model3dUrl}
                title={property.title || 'Mô hình 3D HTML'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <>
              <div ref={containerRef} className="w-full h-full" />

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-white">
                  <div className="text-center">
                    <Box className="w-10 h-10 text-teal-500 animate-bounce mx-auto mb-2" />
                    <p className="text-sm font-semibold">Đang nạp mô hình 3D kết cấu nhà xưởng...</p>
                  </div>
                </div>
              )}

              {/* Floating HUD Controls for Three.js */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={toggleAutoRotate}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition ${
                    isAutoRotate
                      ? 'bg-teal-600/90 text-white border-teal-400'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
                  <span>{isAutoRotate ? 'Tự Động Xoay: BẬT' : 'Tự Động Xoay: TẮT'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleRoof}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition ${
                    isRoofOpen
                      ? 'bg-amber-600/90 text-white border-amber-400'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isRoofOpen ? 'Đóng Mái Xưởng Lại' : 'Mở Mái Xưởng (Xem Kho)'}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>* Giữ chuột trái để xoay 360°, chuột phải để di chuyển, cuộn chuột để phóng to/thu nhỏ.</span>
          <span className="font-semibold text-teal-400">KCN Land 3D Web Engine</span>
        </div>
      </div>
    </div>
  )
}
