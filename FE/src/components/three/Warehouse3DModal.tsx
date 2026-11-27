import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { X, RotateCw, Maximize2, Minimize2, Box, Layers, Globe } from 'lucide-react'
import type { Property } from '@/types/property.types'
import { ENV } from '@/config/env.config'
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
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight
    const isMobile = width < 640

    // 1. Scene - Nền sáng công nghiệp hiện đại
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8fafc)
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.003)

    // 2. Camera - adjust position for mobile portrait vs desktop landscape
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000)
    if (isMobile) {
      // Mobile portrait needs camera further back so the full structure fits comfortably
      camera.position.set(80, 50, 85)
    } else {
      camera.position.set(55, 35, 60)
    }

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
    controls.maxDistance = 220
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    }

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.3)
    sunLight.position.set(60, 90, 50)
    sunLight.castShadow = true
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.45)
    fillLight.position.set(-50, 40, -50)
    scene.add(fillLight)

    // 6. Build 3D Warehouse Models
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(180, 180),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* FLOATING CLOSE BUTTON FOR MOBILE & DESKTOP - ALWAYS VISIBLE WITH TOP Z-INDEX */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-2.5 right-2.5 sm:top-4 sm:right-4 z-[9999] flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-2xl border-2 border-white/60 active:scale-95 transition-all cursor-pointer"
        aria-label="Đóng cửa sổ xem 3D"
      >
        <X className="w-4 h-4 stroke-[3]" />
        <span>ĐÓNG ✕</span>
      </button>

      <div
        className={cn(
          'relative flex flex-col w-full bg-slate-900 border-0 sm:border border-slate-800 shadow-2xl overflow-hidden transition-all',
          isFullscreen
            ? 'h-full max-w-none'
            : 'h-[100dvh] sm:h-[88vh] sm:max-w-5xl sm:rounded-3xl'
        )}
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between border-b border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-950/80 text-white pr-28 sm:pr-32">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shrink-0">
              <Box className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm leading-tight truncate text-white">
                3D 360°: {property?.title || 'Khuôn Viên Nhà Xưởng'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-teal-400 truncate">
                {viewMode === 'html' && property?.model3dUrl
                  ? 'Mô Hình 3D Thực Tế • Vuốt ngón tay để xoay 360°'
                  : 'Engine Three.js • Vuốt để xoay, chụm để phóng to'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle when HTML 3D is available */}
            {property?.model3dUrl && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-800/90 p-0.5 rounded-xl text-xs border border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('html')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1',
                    viewMode === 'html' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  )}
                >
                  <Globe className="w-3 h-3" />
                  <span>3D HTML</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('three')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1',
                    viewMode === 'three' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  )}
                >
                  <Box className="w-3 h-3" />
                  <span>Three.js</span>
                </button>
              </div>
            )}

            <button
              onClick={toggleFullscreen}
              className="hidden sm:block p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3D Content Area */}
        <div className="relative flex-1 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
          {viewMode === 'html' && property?.model3dUrl ? (
            <div className="w-full h-full bg-white">
              <iframe
                src={
                  property.model3dUrl.startsWith('http')
                    ? property.model3dUrl
                    : property.model3dUrl.startsWith('/uploads/')
                    ? `${ENV.API_BASE_URL.replace(/\/api\/?$/, '')}${property.model3dUrl}`
                    : property.model3dUrl
                }
                title={property.title || 'Mô hình 3D HTML'}
                className="w-full h-full border-0 bg-white"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <>
              <div ref={containerRef} className="w-full h-full touch-none" />

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-white">
                  <div className="text-center p-4">
                    <Box className="w-8 h-8 text-teal-500 animate-bounce mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold">Đang nạp mô hình 3D kết cấu nhà xưởng...</p>
                  </div>
                </div>
              )}

              {/* Floating HUD Controls for Three.js */}
              <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={toggleAutoRotate}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-md border transition ${
                    isAutoRotate
                      ? 'bg-teal-600/90 text-white border-teal-400'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <RotateCw className={`w-3 h-3 ${isAutoRotate ? 'animate-spin' : ''}`} />
                  <span>{isAutoRotate ? 'Xoay: BẬT' : 'Xoay: TẮT'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleRoof}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-md border transition ${
                    isRoofOpen
                      ? 'bg-amber-600/90 text-white border-amber-400'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{isRoofOpen ? 'Đóng Mái' : 'Mở Mái Xưởng'}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-3 sm:px-6 py-2 bg-slate-950 border-t border-slate-800 text-[10px] sm:text-xs text-slate-400 flex items-center justify-between gap-2">
          <span className="truncate">
            * Vuốt 1 ngón để xoay 360°, chụm 2 ngón để phóng to / thu nhỏ.
          </span>
          <span className="font-semibold text-teal-400 shrink-0">Engine 3D Mobile</span>
        </div>
      </div>
    </div>
  )
}
