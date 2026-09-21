import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from '../hooks/useReducedMotion'

extend({ ShaderMaterial: THREE.ShaderMaterial })

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  const { pointer } = useThree()
  const mousePos = useRef({ x: 0, y: 0 })
  
  const count = 3000
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 15
      positions[i3 + 1] = (Math.random() - 0.5) * 15
      positions[i3 + 2] = (Math.random() - 0.5) * 10
      
      const t = Math.random()
      colors[i3] = 0.357 + t * 0.1
      colors[i3 + 1] = 0.549 + t * 0.15
      colors[i3 + 2] = 1.0
    }
    
    return [positions, colors]
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    
    mousePos.current.x = THREE.MathUtils.lerp(mousePos.current.x, pointer.x * 0.5, 0.05)
    mousePos.current.y = THREE.MathUtils.lerp(mousePos.current.y, pointer.y * 0.5, 0.05)
    
    ref.current.rotation.x = state.clock.elapsedTime * 0.02 + mousePos.current.y * 0.1
    ref.current.rotation.y = state.clock.elapsedTime * 0.03 + mousePos.current.x * 0.1

    const posArray = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = positions[i3]
      const z = positions[i3 + 2]
      
      posArray[i3 + 2] = z + Math.sin(state.clock.elapsedTime * 0.5 + x * 0.5) * 0.1
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function GradientMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color('#5B8CFF') },
      uColor2: { value: new THREE.Color('#3DDC97') },
      uColor3: { value: new THREE.Color('#0B0F14') },
    }),
    []
  )

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          vec2 uv = vUv;
          
          float n = noise(uv * 10.0 + uTime * 0.1);
          
          float dist = length(uv - vec2(0.5 + uMouse.x * 0.2, 0.5 + uMouse.y * 0.2));
          float wave = sin(dist * 10.0 - uTime * 0.5) * 0.5 + 0.5;
          
          vec3 color = mix(uColor3, uColor1, wave * 0.15);
          color = mix(color, uColor2, (1.0 - dist) * 0.1 * wave);
          
          color += n * 0.02;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true,
    })
  }, [uniforms])

  useFrame((state) => {
    if (!meshRef.current) return
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uMouse.value.x = THREE.MathUtils.lerp(uniforms.uMouse.value.x, pointer.x, 0.05)
    uniforms.uMouse.value.y = THREE.MathUtils.lerp(uniforms.uMouse.value.y, pointer.y, 0.05)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={[20, 20, 1]} material={shaderMaterial}>
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <GradientMesh />
      <ParticleField />
      <ambientLight intensity={0.5} />
    </>
  )
}

export function HeroBackground() {
  const reducedMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(91, 140, 255, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(61, 220, 151, 0.1) 0%, transparent 50%), var(--color-bg)',
          }}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10">
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      )}
    </div>
  )
}
