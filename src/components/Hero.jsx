import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import meImg from '../assets/me.png';
import useMediaQuery from '../hooks/useMediaQuery';
import Marquee from './Marquee';

// Three.js + physics is heavy; code-split it and only mount on desktop.
const IdBadge = lazy(() => import('./IdBadge'));

const SPEC_ROWS = [
    { k: 'ROLE_01', v: 'Full-Stack Developer', tag: 'DEV' },
    { k: 'ROLE_02', v: 'Frontend Engineer', tag: 'DEV' },
    { k: 'BASED', v: 'Bandung, ID · UTC+7' },
];

const TICKER = ['Full-Stack Developer', 'React', 'TypeScript', 'Node.js', 'Three.js', 'Tailwind', 'Web Developer', 'Bandung, Indonesia', 'Open to opportunities'];

const EASE = [0.16, 1, 0.3, 1];

export default function Hero({ onNavigate = () => { } }) {
    const reduce = useReducedMotion();
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const cardRef = useRef(null);
    const [phase, setPhase] = useState(reduce ? 'main' : 'hi');

    useEffect(() => {
        if (reduce) return;
        const t1 = setTimeout(() => setPhase('name'), 1300);
        const t2 = setTimeout(() => setPhase('main'), 3300);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [reduce]);

    // Pointer tilt on the static portrait card (motion values, never state)
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rotX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 });
    const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 18 });
    const onMove = (e) => {
        if (reduce || !cardRef.current) return;
        const r = cardRef.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => { mx.set(0); my.set(0); };

    const showBadge = isDesktop && !reduce;
    const lineV = {
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
    };

    return (
        <section id="home" className="relative isolate h-full overflow-hidden">
            {/* The ID badge appears once the story begins */}
            {showBadge && phase === 'main' && (
                <Suspense fallback={null}>
                    <motion.div
                        data-badge className="absolute inset-0 z-40 hidden lg:block" aria-hidden="true"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.3 }}
                    >
                        <IdBadge />
                    </motion.div>
                </Suspense>
            )}

            <AnimatePresence mode="wait">
                {phase === 'hi' && (
                    <motion.div
                        key="hi" className="absolute inset-0 flex items-center justify-center px-6"
                        exit={{ opacity: 0, y: -28, transition: { duration: 0.4, ease: EASE } }}
                    >
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.7, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 11 }}
                            className="font-display font-black text-ink tracking-tight leading-none text-[clamp(4rem,17vw,12rem)]"
                        >
                            Hi<span className="text-signal">!</span>
                        </motion.h1>
                    </motion.div>
                )}

                {phase === 'name' && (
                    <motion.div
                        key="name" className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.06, filter: 'blur(6px)', transition: { duration: 0.45, ease: EASE } }}
                    >
                        <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-mono uppercase tracking-widest text-ink-soft mb-4 text-sm md:text-base">
                            My name is
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.15 }}
                            className="font-display font-black text-ink tracking-tight leading-[0.92] text-[clamp(2.6rem,9vw,6rem)]"
                        >
                            Andrarieza<br />Rizqi Pradana
                        </motion.h1>
                    </motion.div>
                )}

                {phase === 'main' && (
                    <motion.div key="main" className="relative z-10 h-full max-w-frame mx-auto px-5 md:px-10 flex items-center" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="grid lg:grid-cols-12 gap-10 w-full items-center">
                            <motion.div
                                className="lg:col-span-7 order-2 lg:order-1"
                                initial={reduce ? false : 'hidden'} animate="show"
                                variants={{ show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } } }}
                            >
                                <motion.div variants={lineV} className="flex items-center gap-3 mb-6">
                                    <span className="label whitespace-nowrap">Full-Stack Developer · Bandung, ID</span>
                                    <span className="h-px flex-1 bg-line-strong" />
                                </motion.div>

                                <motion.h1 variants={lineV} className="font-display font-black text-ink leading-[0.95] tracking-tight text-[clamp(2.6rem,6vw,4.4rem)]">
                                    Andrarieza<br />Rizqi Pradana
                                </motion.h1>

                                <motion.p variants={lineV} className="mt-6 max-w-md text-ink-soft text-base md:text-lg leading-relaxed">
                                    I design and build web applications end to end, from interface to deployment.
                                    Currently studying at Telkom University.
                                </motion.p>

                                <motion.div variants={lineV} className="mt-9 flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={() => onNavigate('works')}
                                        className="group inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 font-mono text-[13px] uppercase tracking-wider cursor-pointer transition-colors hover:bg-signal active:translate-y-px"
                                    >
                                        See my works
                                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => onNavigate('contact')}
                                        className="group inline-flex items-center gap-2 border border-line-strong bg-surface text-ink px-5 py-3.5 font-mono text-[13px] uppercase tracking-wider cursor-pointer transition-colors hover:border-ink active:translate-y-px"
                                    >
                                        Get in touch
                                        <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </motion.div>
                            </motion.div>

                            {/* Mobile / reduced-motion static credential card */}
                            <div className="lg:col-span-5 order-1 lg:order-2 [perspective:1200px] flex items-center">
                                {!showBadge && (
                                    <motion.div
                                        ref={cardRef}
                                        onMouseMove={onMove}
                                        onMouseLeave={onLeave}
                                        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
                                        initial={{ opacity: 0, scale: 0.97 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, ease: EASE }}
                                        className="sheet relative z-10"
                                    >
                                        <div className="bg-paper-soft border-b border-line overflow-hidden">
                                            <img src={meImg} alt="Andrarieza Rizqi Pradana" className="w-full h-[300px] sm:h-[360px] object-contain object-bottom" />
                                        </div>
                                        <div className="p-4 sm:p-5 font-mono text-[12px] sm:text-[13px]">
                                            {SPEC_ROWS.map((row) => (
                                                <div key={row.k} className="flex items-center gap-3 py-1.5 border-b border-line/60 last:border-0">
                                                    <span className="text-ink-faint w-[68px] shrink-0">{row.k}</span>
                                                    <span className="text-ink flex-1 truncate">{row.v}</span>
                                                    {row.tag && <span className="shrink-0 px-1.5 py-0.5 text-[10px] tracking-wider border text-signal border-signal/40">{row.tag}</span>}
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-2 pt-3">
                                                <span className="text-ink-faint">STATUS</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-dot" />
                                                <span className="text-ink">Open to opportunities</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Running text along the bottom of the landing */}
            {phase === 'main' && (
                <motion.div
                    className="absolute bottom-0 inset-x-0 z-50"
                    initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Marquee items={TICKER} speed={42} />
                </motion.div>
            )}
        </section>
    );
}
