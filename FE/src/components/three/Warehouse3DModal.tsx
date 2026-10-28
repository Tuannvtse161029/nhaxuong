import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { X, RotateCw, Eye, Maximize2, Minimize2, Box, Layers } from 'lucide-react'
import type { Property } from '@/types/property.types'

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
    if (!isOpen || !containerRef.current) return

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

    // Grass
    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(150, 150),
      new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 })
    )
    grass.rotation.x = -Math.PI / 2
    grass.position.y = -0.05
    scene.add(grass)

    // Apron
    const apron = new THREE.Mesh(
      new THREE.PlaneGeometry(85, 65),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
    )
    apron.rotation.x = -Math.PI / 2
    apron.position.y = 0.05
    apron.receiveShadow = true
    scene.add(apron)

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

    // Top trim & bottom trim
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.3 })
    const topTrim = new THREE.Mesh(
      new THREE.BoxGeometry(factoryW + 0.4, 0.8, factoryD + 0.4),
      trimMat
    )
    topTrim.position.set(0, factoryH - 0.4, 0)
    scene.add(topTrim)

    // Office Front
    const office = new THREE.Mesh(
      new THREE.BoxGeometry(18, 7.5, 6),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    )
    office.position.set(0, 7.5 / 2, factoryD / 2 + 3)
    office.castShadow = true
    scene.add(office)

    // Office Glass Facade
    const glassFacade = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 5.5),
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.75,
        roughness: 0.1,
        metalness: 0.9,
      })
    )
    glassFacade.position.set(0, 4, factoryD / 2 + 6.05)
    scene.add(glassFacade)

    // Roof Group (Can be hidden / opened)
    const roofGroup = new THREE.Group()
    const roofSlopeW = 24.5
    const roofSlopeD = factoryD + 2
    const roofSlopeH = 0.5
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.6,
    })

    const roofLeft = new THREE.Mesh(
      new THREE.BoxGeometry(roofSlopeW, roofSlopeH, roofSlopeD),
      roofMat
    )
    roofLeft.position.set(-11.5, factoryH + 2.4, 0)
    roofLeft.rotation.z = Math.PI / 15
    roofLeft.castShadow = true
    roofGroup.add(roofLeft)

    const roofRight = new THREE.Mesh(
      new THREE.BoxGeometry(roofSlopeW, roofSlopeH, roofSlopeD),
      roofMat
    )
    roofRight.position.set(11.5, factoryH + 2.4, 0)
    roofRight.rotation.z = -Math.PI / 15
    roofRight.castShadow = true
    roofGroup.add(roofRight)

    // Solar panels on roof
    const solar = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 22),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2, metalness: 0.8 })
    )
    solar.rotation.x = -Math.PI / 2
    solar.rotation.y = Math.PI / 15
    solar.position.set(-11.5, factoryH + 2.7, 0)
    roofGroup.add(solar)

    scene.add(roofGroup)

    // Interior Pallet Racks & Forklift
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.6 })
    const beamMat = new THREE.MeshStandardMaterial({ color: 0xf97316 })
    const boxColors = [0xd97706, 0x0284c7, 0x10b981, 0xeab308, 0xef4444]

    for (let row = -1; row <= 1; row++) {
      const zPos = row * 7
      for (let col = -2; col <= 2; col++) {
        const xPos = col * 7
        for (let lvl = 1; lvl <= 3; lvl++) {
          const beam = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.2, 2.5), beamMat)
          beam.position.set(xPos, lvl * 2.5, zPos)
          scene.add(beam)

          const boxMat = new THREE.MeshStandardMaterial({
            color: boxColors[(col + row + lvl + 10) % boxColors.length],
            roughness: 0.7,
          })
          const box = new THREE.Mesh(new THREE.BoxGeometry(2, 1.6, 2), boxMat)
          box.position.set(xPos - 1.1, lvl * 2.5 + 0.9, zPos)
          scene.add(box)
        }
      }
    }

    // Forklift
    const forklift = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 2, 3.5),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
    )
    forklift.position.set(-6, 1, 0)
    forklift.castShadow = true
    scene.add(forklift)

    // Transformer Substation 1500 kVA
    const subPad = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x64748b })
    )
    subPad.position.set(-30, 0.2, 5)
    scene.add(subPad)

    const transMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.7,
      roughness: 0.3,
    })
    const trans1 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3.5, 16), transMat)
    trans1.position.set(-32, 2, 5)
    scene.add(trans1)
    const trans2 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3.5, 16), transMat)
    trans2.position.set(-28, 2, 5)
    scene.add(trans2)

    // Store refs
    threeRefs.current = { scene, camera, renderer, controls, roofGroup }

    // Animation Loop
    const animate = () => {
      threeRefs.current.animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    setIsLoading(false)

    const handleResize = () => {
      if (!container || !camera || !renderer) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (threeRefs.current.animId) {
        cancelAnimationFrame(threeRefs.current.animId)
      }
      renderer.dispose()
    }
  }, [isOpen])

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

  const setCameraPreset = (preset: 'overview' | 'front' | 'inside' | 'substation') => {
    const { camera, controls } = threeRefs.current
    if (!camera || !controls) return

    controls.autoRotate = false
    setIsAutoRotate(false)

    if (preset === 'overview') {
      camera.position.set(55, 35, 60)
      controls.target.set(0, 5, 0)
    } else if (preset === 'front') {
      camera.position.set(0, 14, 55)
      controls.target.set(0, 6, 10)
    } else if (preset === 'inside') {
      if (!isRoofOpen) toggleRoof()
      camera.position.set(0, 18, 25)
      controls.target.set(0, 4, 0)
    } else if (preset === 'substation') {
      camera.position.set(-45, 14, 20)
      controls.target.set(-30, 2, 5)
    }
    controls.update()
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
                Three.js Engine • Tương tác xoay, phóng to/thu nhỏ và mở mái xem kết cấu kho
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* 3D Canvas Area */}
        <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
          <div ref={containerRef} className="w-full h-full" />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-white">
              <div className="text-center">
                <Box className="w-10 h-10 text-teal-500 animate-bounce mx-auto mb-2" />
                <p className="text-sm font-semibold">Đang nạp mô hình 3D kết cấu nhà xưởng...</p>
              </div>
            </div>
          )}

          {/* Floating HUD Controls */}
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

          {/* Bottom Camera Presets Strip */}
          <div className="absolute bottom-4 inset-x-0 z-10 flex justify-center">
            <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-2xl shadow-xl text-xs text-slate-300">
              <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">Góc nhìn:</span>
              <button
                type="button"
                onClick={() => setCameraPreset('overview')}
                className="px-3 py-1.5 rounded-xl hover:bg-slate-800 font-medium transition"
              >
                Tổng Thể
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('front')}
                className="px-3 py-1.5 rounded-xl hover:bg-slate-800 font-medium transition"
              >
                Mặt Tiền
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('inside')}
                className="px-3 py-1.5 rounded-xl hover:bg-slate-800 font-medium transition flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Nội Thất Kho</span>
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('substation')}
                className="px-3 py-1.5 rounded-xl hover:bg-slate-800 font-medium transition"
              >
                Trạm Điện
              </button>
            </div>
          </div>
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
