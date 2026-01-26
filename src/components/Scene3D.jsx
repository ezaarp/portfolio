import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedSphere() {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;
    });

    return (
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.5}>
            <MeshDistortMaterial
                color="#0ea5e9"
                attach="material"
                distort={0.3}
                speed={1.5}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="#38bdf8" intensity={0.5} />
                <AnimatedSphere />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
}
