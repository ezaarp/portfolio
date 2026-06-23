import * as THREE from 'three';
import { useEffect, useMemo, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const CARD_W = 3.2, CARD_H = 2.0;
const FLOW = -0.2;        // ambient speed (cards/sec)
const RX = 3.5;           // orbital cylinder — perfect circle x
const RY = 0.68;          // vertical separation step (slight gap)
const RZ = 3.5;           // orbital cylinder — perfect circle z
const ANGLE_STEP = Math.PI * 0.31; // slightly wider angular spacing for a small gap

const SEG = 32;           // high subdivision for paper curvature
const CURVE_STRENGTH = -0.25; // negative to bend inwards towards the spiral center
const CORNER = 0.12;      // rounded-corner radius, in card-height units

// Deform vertices to create a physical U-shaped paper curvature
function makeBentPlane(w, h) {
    const geo = new THREE.PlaneGeometry(w, h, SEG, SEG); // 32x32 for smooth bending
    const pos = geo.attributes.position;
    const hw = w / 2;
    for (let i = 0; i < pos.count; i++) {
        const nx = pos.getX(i) / hw; // -1 to 1
        // Smooth natural U-shape bend
        const curve = (1 - Math.cos(nx * Math.PI / 2)) * CURVE_STRENGTH; 
        pos.setZ(i, curve);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
}

const IMG_GEO = makeBentPlane(CARD_W, CARD_H);

// Clip a MeshBasicMaterial into a rounded rectangle (keeps three's colour management intact).
function roundCorners(material, aspect) {
    material.onBeforeCompile = (shader) => {
        shader.uniforms.uRadius = { value: CORNER };
        shader.uniforms.uAspect = { value: aspect };
        shader.fragmentShader = `uniform float uRadius;\nuniform float uAspect;\n` +
            shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `{
                    vec2 p = (vMapUv - 0.5) * vec2(uAspect, 1.0);
                    vec2 b = vec2(0.5 * uAspect, 0.5) - vec2(uRadius);
                    vec2 q = abs(p) - b;
                    float dd = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - uRadius;
                    float aa = fwidth(dd) + 1e-4;
                    gl_FragColor.a *= 1.0 - smoothstep(-aa, aa, dd);
                    if (gl_FragColor.a < 0.5) discard;
                }
                #include <dithering_fragment>`
            );
    };
    material.needsUpdate = true;
    return material;
}

function makePlaceholder(project, isSec) {
    const W = 32, H = 32;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#111215'; // Sleek dark skeleton block
    ctx.fillRect(0, 0, W, H);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

function Card({ project, isSec, groupRef, onHover, onSelect, onLoaded }) {
    const localRef = useRef();
    const setRefs = useCallback((el) => {
        localRef.current = el;
        if (groupRef) groupRef(el);
    }, [groupRef]);

    const placeholder = useMemo(() => makePlaceholder(project, isSec), []);

    // Matte, rounded paper materials (built once, maps swapped in on load).
    const mats = useMemo(() => {
        const make = (map, dw) => roundCorners(
            new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: dw, side: THREE.DoubleSide, toneMapped: false }),
            CARD_W / CARD_H,
        );
        return { blur: make(placeholder, false), sharp: make(placeholder, true) };
    }, []);

    useEffect(() => () => { mats.blur.dispose(); mats.sharp.dispose(); }, [mats]);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        let alive = true;
        img.onload = () => {
            if (!alive) return;
            try {
                const sharp = new THREE.Texture(img);
                sharp.colorSpace = THREE.SRGBColorSpace; sharp.anisotropy = 8;
                sharp.center.set(0.5, 0.5); // zoom around the centre on hover
                sharp.needsUpdate = true;
                const bw = 220, bh = Math.max(2, Math.round(bw * img.height / img.width));
                const c = document.createElement('canvas'); c.width = bw; c.height = bh;
                const ctx = c.getContext('2d');
                ctx.filter = 'blur(5px)';
                ctx.drawImage(img, -10, -10, bw + 20, bh + 20);
                const blur = new THREE.CanvasTexture(c); blur.colorSpace = THREE.SRGBColorSpace;
                mats.sharp.map = sharp; mats.sharp.needsUpdate = true;
                mats.blur.map = blur; mats.blur.needsUpdate = true;
                if (onLoaded) onLoaded();
            } catch (e) {
                if (onLoaded) onLoaded();
            }
        };
        img.onerror = () => { if (onLoaded) onLoaded(); };
        img.src = project.image;
        return () => { alive = false; };
    }, [project.image, mats]);

    return (
        <group ref={setRefs}
            onPointerOver={(e) => { 
                e.stopPropagation(); onHover(project, e); 
            }}
            onPointerMove={(e) => { 
                e.stopPropagation(); onHover(project, e); 
            }}
            onPointerOut={() => onHover(null)}
            onClick={(e) => { 
                e.stopPropagation(); onSelect(project); 
            }}
        >
            <mesh geometry={IMG_GEO} material={mats.blur} userData={{ blur: true }} />
            <mesh
                geometry={IMG_GEO} material={mats.sharp}
                position={[0, 0, 0.012]} userData={{ sharp: true }}
            />
        </group>
    );
}

function Spiral({ items, paused, spin, onHover, onSelect }) {
    const cardRefs = useRef([]);
    const hovered = useRef(-1);
    const prog = useRef(0);
    const introVelocity = useRef(-0.35); // Smooth initial entrance burst
    const N = items.length;
    const loadedCountRef = useRef(0);

    const mainGroup = useRef();

    useEffect(() => () => { document.body.style.cursor = 'auto'; }, []);

    useFrame((_, delta) => {
        const d = Math.min(delta, 0.05);
        const isLoaded = loadedCountRef.current >= N;
        
        if (!isLoaded) {
            if (mainGroup.current) mainGroup.current.position.y = 20;
            return;
        }

        if (mainGroup.current) {
            mainGroup.current.position.y += (0 - mainGroup.current.position.y) * Math.min(1, d * 3.5);
        }

        if (!paused) {
            prog.current += d * FLOW + (spin.current || 0) + introVelocity.current;
            
            if (Math.abs(introVelocity.current) > 0.001) {
                // Exponential decay: flawlessly smooth transition from fast to slow
                introVelocity.current += (0 - introVelocity.current) * Math.min(1, d * 4.5);
            } else {
                introVelocity.current = 0;
            }

            if (spin && spin.current) {
                spin.current *= 0.9;
                if (Math.abs(spin.current) < 1e-5) spin.current = 0;
            }
        }

        cardRefs.current.forEach((g, i) => {
            if (!g) return;
            const isHover = hovered.current === i;

            // Calculate wrapped relative position to allow continuous vertical helix scrolling
            let diff = (i - prog.current) % N;
            if (diff > N / 2) diff -= N;
            if (diff < -N / 2) diff += N;

            const angle = diff * ANGLE_STEP;

            // True 3D Corkscrew Helix (Perfect Cylinder)
            g.position.x = Math.sin(angle) * RX;
            g.position.z = Math.cos(angle) * RZ;
            g.position.y = -diff * RY;

            // Cylindrical rotation: cards rotate to face outward from the cylinder axis
            g.rotation.y = angle;
            // Pitch: slight tilt towards the viewer
            g.rotation.x = -diff * 0.12;
            // Roll: natural structural tilt (use sin so center angle=0 is not tilted)
            g.rotation.z = Math.sin(angle) * 0.12;

            const dist = Math.abs(diff);
            // Limit the minimum scale so cards at the top/bottom don't become tiny specks and stay overlapping
            const targetSc = (1.0 - Math.min(0.4, dist * 0.05)) * (isHover ? 1.05 : 1.0);
            const cur = g.scale.x;
            g.scale.setScalar(cur + (targetSc - cur) * Math.min(1, d * 6));

            // Opacity: Keep center cluster highly visible, fade out only at the far edges
            let op = 1.0;
            if (dist > 4) {
                op = Math.max(0, 0.92 - Math.pow((dist - 4) / 4, 2) * 0.9); // Fast fade at the extreme top/bottom
            } else {
                op = 1.0 - dist * 0.02; // Very subtle fade (1.0 to 0.92) in the center
            }
            
            // Keep a very wide cluster of cards sharp, and apply an aggressive blur fade at the extreme edges
            // so cards are 100% blurred before entering the screen and when leaving (at dist = ~8).
            const sharpAmt = isHover ? 1.0 : Math.max(0, Math.min(1, 1 - (dist - 3.5) * 0.25));

            const k = Math.min(1, d * 8); // smoothing for hover transitions
            g.children.forEach((m) => {
                if (!m.material) return;
                
                // Force cards further from the center to render ON TOP (Foreground Bokeh effect)
                m.renderOrder = Math.floor(dist * 100);

                if (m.userData.blur) {
                    m.material.opacity = op;
                } else if (m.userData.sharp) {
                    m.material.opacity = op * sharpAmt;
                    // Hover: gently darken the sheet for contrast.
                    // (We rely on the physical mesh scale for the pop effect, so texture zoom is unnecessary)
                    const tb = isHover ? 0.75 : 1.0;
                    const cb = m.material.color.r + (tb - m.material.color.r) * k;
                    m.material.color.setRGB(cb, cb, cb);
                }
            });
            g.renderOrder = Math.round((N - dist) * 10) + (isHover ? 500 : 0);
        });

        document.body.style.cursor = hovered.current >= 0 ? 'pointer' : 'auto';
    });

    return (
        <group ref={mainGroup}>
            {items.map((p, i) => (
                <Card
                    key={`${p.id}-${i}`}
                    project={p}
                    isSec={p.category === 'Security'}
                    groupRef={(el) => { cardRefs.current[i] = el; }}
                    onHover={(proj, e) => {
                        hovered.current = proj ? i : (hovered.current === i ? -1 : hovered.current);
                        onHover(proj, e);
                    }}
                    onSelect={onSelect}
                    onLoaded={() => { loadedCountRef.current++; }}
                />
            ))}
        </group>
    );
}

export default function ProjectSpiral({ items, paused, spin, onHover, onSelect }) {
    // Duplicate the array to fill the vertical space completely, making a seamless infinite loop
    const displayItems = [...items, ...items];
    return (
        <Canvas camera={{ position: [0, 0, 14], fov: 32 }} dpr={[1, 2]} gl={{ alpha: true }}>
            <Spiral items={displayItems} paused={paused} spin={spin} onHover={onHover} onSelect={onSelect} />
        </Canvas>
    );
}
