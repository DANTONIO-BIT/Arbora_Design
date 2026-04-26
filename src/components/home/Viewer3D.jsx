import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'

const Model = ({ url }) => {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

const Viewer3D = ({ modelUrl, fallbackImage }) => {
  const [active, setActive] = useState(false)

  if (!active) {
    return (
      <div className="w-full h-full relative group cursor-pointer" onClick={() => setActive(true)}>
        <img 
          alt="Vista 3D del proyecto"
          src={fallbackImage}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
          <div className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-4 border border-white/40 hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1.5m0 0L10 14m2-1.5l-2 1.5m2 1.5l2-1.5M6 15l-2 1.5m0 0L2 14m2-1.5l-2 1.5m2 1.5l2-1.5M12 10v8m0 0l-3-3m3 3l3-3m-3-5v8m0 0l-3-3m3 3l3-3"/>
            </svg>
            <span className="text-white text-xs font-bold uppercase tracking-widest">Activar Experiencia 3D</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-surface-container-high relative">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 45 }}>
          <Environment preset="city" />
          <Stage intensity={0.5} environment="city" adjustCamera intensity={1} contactShadow={false}>
            <Model url={modelUrl} />
          </Stage>
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
          <ContactShadows opacity={0.4} scale={10} blur={2} far={10} resolution={256} color="#000000" />
        </Canvas>
      </Suspense>
      
      <button 
        onClick={() => setActive(false)}
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors z-10"
      >
        Cerrar 3D
      </button>
    </div>
  )
}

export default Viewer3D