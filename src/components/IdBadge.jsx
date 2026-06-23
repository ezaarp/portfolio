import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

function Band({ maxSpeed = 50, minSpeed = 10 }) {
    const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
    const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
    const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };
    const { width, height } = useThree((s) => s.size);
    const [curve] = useState(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(),
    ]));
    const [dragged, drag] = useState(false);
    const [hovered, hover] = useState(false);

    const [frontTex, setFrontTex] = useState(null);
    const [backTex, setBackTex] = useState(null);
    const [bandTex, setBandTex] = useState(null);
    
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load('/IDCARD-FRONT.jpg', (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; setFrontTex(t); });
        loader.load('/IDCARD-BACK.jpg', (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; setBackTex(t); });
        loader.load('/LANYARD-EAD.jpg', (t) => { 
            t.colorSpace = THREE.SRGBColorSpace; 
            t.wrapS = t.wrapT = THREE.RepeatWrapping; 
            // Adjust repeat based on the new image's natural aspect ratio so it doesn't look stretched
            setBandTex(t); 
        });
    }, []);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.3, 0]]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => { document.body.style.cursor = 'auto'; };
        }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
        if (dragged) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
            card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
        }
        if (fixed.current) {
            [j1, j2].forEach((r) => {
                if (!r.current.lerped) r.current.lerped = new THREE.Vector3().copy(r.current.translation());
                const clamped = Math.max(0.1, Math.min(1, r.current.lerped.distanceTo(r.current.translation())));
                r.current.lerped.lerp(r.current.translation(), delta * (minSpeed + clamped * (maxSpeed - minSpeed)));
            });
            const cardPos = card.current.translation();
            const cardRot = card.current.rotation();
            const ringWorld = new THREE.Vector3(0, 1.3, 0).applyQuaternion(cardRot).add(cardPos);
            curve.points[0].copy(ringWorld);
            curve.points[1].copy(j2.current.lerped);
            curve.points[2].copy(j1.current.lerped);
            curve.points[3].copy(fixed.current.translation());
            band.current.geometry.setPoints(curve.getPoints(32));
            ang.copy(card.current.angvel());
            rot.copy(card.current.rotation());
            
            // Add a very subtle ambient sway (jiggle) so it feels alive
            const t = state.clock.elapsedTime;
            const swayY = Math.sin(t * 1.0) * 0.03;
            const swayZ = Math.cos(t * 1.5) * 0.015;
            
            card.current.wakeUp(); // Keep physics active for the idle animation
            card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25 + swayY, z: ang.z + swayZ });
        }
    });

    curve.curveType = 'chordal';

    return (
        <>
            <group position={[1.5, 4.25, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
                <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
                <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
                <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
                    <CuboidCollider args={[0.8, 1.125, 0.01]} />
                    <group
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={(e) => { try { e.target.releasePointerCapture(e.pointerId); } catch { } drag(false); }}
                        onPointerDown={(e) => {
                            try { e.target.setPointerCapture(e.pointerId); } catch { }
                            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
                        }}
                    >
                        <mesh>
                            <boxGeometry args={[1.6, 2.25, 0.02]} />
                            <meshPhysicalMaterial color="#FBFBF8" clearcoat={1} clearcoatRoughness={0.25} roughness={0.45} metalness={0.05} />
                        </mesh>
                        {/* Front Face */}
                        <mesh position={[0, 0, 0.011]}>
                            <planeGeometry args={[1.6, 2.25]} />
                            <meshPhysicalMaterial map={frontTex} clearcoat={1} clearcoatRoughness={0.18} roughness={0.35} metalness={0.05} toneMapped={false} />
                        </mesh>
                        {/* Back Face */}
                        <mesh position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
                            <planeGeometry args={[1.6, 2.25]} />
                            <meshPhysicalMaterial map={backTex} clearcoat={1} clearcoatRoughness={0.18} roughness={0.35} metalness={0.05} toneMapped={false} />
                        </mesh>
                        {/* clip + ring */}
                        <mesh position={[0, 1.2, 0]}>
                            <boxGeometry args={[0.46, 0.16, 0.07]} />
                            <meshStandardMaterial color="#B4B8BD" metalness={0.9} roughness={0.25} />
                        </mesh>
                        <mesh position={[0, 1.33, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.085, 0.022, 12, 24]} />
                            <meshStandardMaterial color="#B4B8BD" metalness={0.9} roughness={0.25} />
                        </mesh>
                    </group>
                </RigidBody>
            </group>
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial
                    color="white"
                    depthTest={true}
                    resolution={[width, height]}
                    useMap
                    map={bandTex}
                    repeat={[-1, 1]}
                    lineWidth={0.4}
                />
            </mesh>
        </>
    );
}

// The badge sits on top of the hero (z-40). The canvas keeps its native events so
// dragging works, and clicks that miss the badge are forwarded to the link/button
// underneath, so the buttons stay usable even though the badge renders over them.
function forwardMissedClick(e) {
    if (typeof e?.clientX !== 'number') return;
    // The badge canvas sits on top, so walk the full hit stack and click the first
    // link/button underneath it.
    for (const el of document.elementsFromPoint(e.clientX, e.clientY)) {
        const target = el.closest && el.closest('a, button');
        if (target) { target.click(); return; }
    }
}

export default function IdBadge() {
    return (
        <Canvas
            camera={{ position: [0, 0, 9], fov: 25 }}
            gl={{ alpha: true }}
            dpr={[1, 2]}
            onPointerMissed={forwardMissedClick}
        >
            <ambientLight intensity={Math.PI} />
            <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
                <Band />
            </Physics>
            <Environment blur={0.75}>
                <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, 0]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, 0]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, 0]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
        </Canvas>
    );
}
