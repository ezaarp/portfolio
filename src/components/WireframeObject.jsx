import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';

// Reads the brand tokens from CSS variables so the object stays in sync with
// the active theme (light / dark), re-reading whenever the .dark class flips.
function useBrandColors() {
    const read = () => {
        if (typeof window === 'undefined') return { signal: 'rgb(30,60,255)', ink: 'rgb(21,23,28)' };
        const cs = getComputedStyle(document.documentElement);
        const toRgb = (name, fallback) => {
            const raw = cs.getPropertyValue(name).trim();
            if (!raw) return fallback;
            const [r, g, b] = raw.split(/[\s,]+/).map(Number);
            return `rgb(${r}, ${g}, ${b})`;
        };
        return {
            signal: toRgb('--signal', 'rgb(30,60,255)'),
            ink: toRgb('--ink', 'rgb(21,23,28)'),
        };
    };
    const [colors, setColors] = useState(read);
    useEffect(() => {
        const obs = new MutationObserver(() => setColors(read()));
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);
    return colors;
}

function Instrument({ reduce, colors, pointer }) {
    const group = useRef();
    const outer = useRef();
    const inner = useRef();

    useFrame((_, delta) => {
        const d = Math.min(delta, 0.05); // clamp on tab refocus
        if (!reduce) {
            if (outer.current) { outer.current.rotation.y += d * 0.18; outer.current.rotation.x += d * 0.06; }
            if (inner.current) { inner.current.rotation.y -= d * 0.12; }
        }
        if (group.current) {
            const tx = pointer.current.y * 0.25;
            const ty = pointer.current.x * 0.35;
            group.current.rotation.x += (tx - group.current.rotation.x) * 0.06;
            group.current.rotation.y += (ty - group.current.rotation.y) * 0.06;
        }
    });

    return (
        <group ref={group}>
            <mesh ref={outer}>
                <icosahedronGeometry args={[1.9, 1]} />
                <meshBasicMaterial color={colors.signal} wireframe transparent opacity={0.5} />
            </mesh>
            <mesh ref={inner}>
                <icosahedronGeometry args={[1.15, 0]} />
                <meshBasicMaterial color={colors.ink} wireframe transparent opacity={0.16} />
            </mesh>
        </group>
    );
}

export default function WireframeObject() {
    const reduce = useReducedMotion();
    const colors = useBrandColors();
    const pointer = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (reduce) return;
        const onMove = (e) => {
            pointer.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -((e.clientY / window.innerHeight) * 2 - 1),
            };
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, [reduce]);

    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            frameloop={reduce ? 'demand' : 'always'}
            style={{ background: 'transparent' }}
        >
            <Instrument reduce={reduce} colors={colors} pointer={pointer} />
        </Canvas>
    );
}
