import { useState, useRef, lazy, Suspense, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Github, ArrowUpRight, Lock, Orbit, List, X } from 'lucide-react';
import { projects } from '../data/projects';
import useMediaQuery from '../hooks/useMediaQuery';

const ProjectSpiral = lazy(() => import('./ProjectSpiral'));

const channelFor = (category) => (category === 'Security' ? 'alert' : 'signal');
const pid = (id) => `PRJ-${String(id).padStart(2, '0')}`;
const EASE = [0.16, 1, 0.3, 1];
const GRID_BG = {
    backgroundImage: 'linear-gradient(to right, rgb(var(--ink) / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--ink) / 0.04) 1px, transparent 1px)',
    backgroundSize: '56px 56px',
};

function DisciplineTag({ category }) {
    const isSec = channelFor(category) === 'alert';
    return (
        <span className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border ${isSec ? 'text-alert border-alert/40' : 'text-signal border-signal/40'}`}>
            {category}
        </span>
    );
}

function ProjectLinks({ project, size = 16 }) {
    return (
        <div className="flex items-center gap-1.5">
            {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source`}
                    className="w-9 h-9 flex items-center justify-center border border-line bg-surface text-ink-soft hover:text-ink hover:border-ink transition-colors">
                    <Github size={size} />
                </a>
            ) : (
                <span title="Private repository"
                    className="w-9 h-9 flex items-center justify-center border border-line bg-surface text-ink-faint cursor-not-allowed">
                    <Lock size={size} />
                </span>
            )}
            {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} live`}
                    className="w-9 h-9 flex items-center justify-center border border-line bg-surface text-ink-soft hover:text-paper hover:bg-signal hover:border-signal transition-colors">
                    <ArrowUpRight size={size} />
                </a>
            )}
        </div>
    );
}

function ProjectCard({ project, onSelect }) {
    const isSec = channelFor(project.category) === 'alert';
    return (
        <button onClick={() => onSelect(project)} className="sheet group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-1 hover:border-ink">
            <div className={`h-0.5 w-full ${isSec ? 'bg-alert' : 'bg-signal'}`} />
            <div className="flex items-center justify-between px-4 pt-3">
                <span className="font-mono text-[11px] text-ink-faint">{pid(project.id)}</span>
                <DisciplineTag category={project.category} />
            </div>
            <div className="px-4 pt-3">
                <div className="relative overflow-hidden border border-line bg-paper-soft">
                    <img src={project.image} alt={project.title} loading="lazy"
                        className="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.03]" />
                </div>
            </div>
            <div className="px-4 py-4">
                <h3 className="font-display font-bold text-xl text-ink leading-tight">{project.title}</h3>
                <p className="mt-2 text-[13.5px] text-ink-soft leading-relaxed line-clamp-2">{project.description}</p>
            </div>
        </button>
    );
}

function HoverLabel({ info }) {
    return (
        <AnimatePresence>
            {info && (
                <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95, x: "-50%" }} 
                    animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="pointer-events-none fixed z-[55] bottom-12 left-1/2"
                >
                    <div className="flex items-center gap-3 bg-white border border-zinc-200 shadow-2xl rounded-xl p-1.5 pr-6">
                        <img src={info.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-sans font-medium tracking-wide text-zinc-900 text-sm sm:text-base whitespace-nowrap">{info.title}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Animated details modal opened by clicking a project.
function DetailModal({ project, onClose }) {
    return (
        <AnimatePresence>
            {project && (
                <motion.div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div
                        initial={{ opacity: 0, y: 32, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.92 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 14 }}
                        className="relative z-10 w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-surface rounded-3xl shadow-2xl"
                    >
                        <button onClick={onClose} aria-label="Close"
                            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-ink text-paper hover:bg-signal transition-colors">
                            <X size={18} />
                        </button>
                        <div className="bg-paper-soft">
                            <img src={project.image} alt={project.title} className="w-full h-56 sm:h-64 object-cover" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="font-mono text-[11px] text-ink-faint">{pid(project.id)}</span>
                                <DisciplineTag category={project.category} />
                            </div>
                            <h3 className="font-display font-black text-ink text-2xl md:text-3xl tracking-tight leading-tight">{project.title}</h3>
                            <p className="mt-3 text-ink-soft leading-relaxed">{project.description}</p>
                            <div className="mt-5 flex flex-wrap gap-1.5">
                                {project.technologies.map((tech) => (
                                    <span key={tech} className="font-mono text-[11px] text-ink-soft bg-paper border border-line px-2 py-0.5">{tech}</span>
                                ))}
                            </div>
                            <div className="mt-6 pt-5 border-t border-line flex items-center justify-between">
                                <span className="label">{project.githubUrl ? 'Source available' : 'Private repository'}</span>
                                <ProjectLinks project={project} />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function BigListItem({ p, onSelect, containerRef }) {
    const itemRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: itemRef,
        container: containerRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0.0, 0.5, 1.0], [0.65, 1.0, 0.65]);
    const opacity = useTransform(scrollYProgress, [0.1, 0.45, 0.55, 0.9], [0.15, 1.0, 1.0, 0.15]);
    const isSec = channelFor(p.category) === 'alert';

    return (
        <motion.button 
            ref={itemRef}
            onClick={() => onSelect(p)}
            style={{ scale, opacity }}
            className="group block w-full text-center py-1.5 md:py-2"
        >
            <span className={`font-display font-black tracking-tight leading-[1.0] text-[clamp(1.8rem,5vw,4.5rem)] text-ink-soft transition-colors ${isSec ? 'hover:text-alert' : 'hover:text-signal'}`}>
                {p.title}
            </span>
        </motion.button>
    );
}

function BigList({ onSelect }) {
    const containerRef = useRef(null);
    return (
        <div 
            ref={containerRef} 
            className="absolute inset-0 overflow-y-auto no-scrollbar scroll-smooth snap-y snap-mandatory flex flex-col items-center"
        >
            <div className="h-[50vh] shrink-0" />
            <div className="w-full max-w-frame mx-auto px-5 md:px-10 flex flex-col items-center gap-0">
                {projects.map((p, i) => (
                    <motion.div 
                        key={p.id} 
                        className="snap-center w-full"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <BigListItem p={p} onSelect={onSelect} containerRef={containerRef} />
                    </motion.div>
                ))}
            </div>
            <div className="h-[45vh] shrink-0" />
        </div>
    );
}

function Toggle({ view, setView }) {
    return (
        <div className="absolute right-6 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5 font-mono text-xs md:text-sm tracking-wider pointer-events-auto z-50">
            <button onClick={() => setView('spiral')} className={`transition-all duration-300 ${view === 'spiral' ? 'text-ink font-bold scale-110' : 'text-ink-soft hover:text-ink'}`}>spiral</button>
            <div className="w-[1.5px] h-10 bg-ink-faint rounded-full" />
            <button onClick={() => setView('list')} className={`transition-all duration-300 ${view === 'list' ? 'text-ink font-bold scale-110' : 'text-ink-soft hover:text-ink'}`}>list</button>
        </div>
    );
}

function SharedHeader({ isList }) {
    return (
        <div className="w-full px-6 md:px-12 lg:px-16 relative pointer-events-none z-20">
            <div className={`pb-5 border-b ${isList ? 'border-line-strong mb-10' : 'border-transparent'}`}>
                <h2 className="flex items-center gap-4 font-display font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-tight text-ink pointer-events-auto w-max">
                    <span className="w-1.5 h-8 md:h-12 bg-signal rounded-full" /> Selected Work
                </h2>
            </div>
        </div>
    );
}

export default function Projects() {
    const [view, setView] = useState('spiral');
    const [hoverInfo, setHoverInfo] = useState(null);
    const [selected, setSelected] = useState(null);

    // Duplicate projects to ensure the spiral is infinitely tall and doesn't snap while visible
    const spiralItems = useMemo(() => {
        if (!projects || projects.length === 0) return [];
        let arr = [...projects];
        while (arr.length < 40) {
            arr = [...arr, ...projects];
        }
        return arr;
    }, []);

    const reduce = useReducedMotion();
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const canSpiral = isDesktop && !reduce;
    const spin = useRef(0); // wheel impulse that drives the loop flow

    // Spiral: full-screen view. Projects loop top -> bottom infinitely; wheel drives the flow.
    if (view === 'spiral' && canSpiral) {
        return (
            <section id="work" className="relative h-full overflow-hidden" onWheel={(e) => { spin.current += e.deltaY * 0.00045; }}>
                <div className="absolute inset-0 -z-10" style={GRID_BG} />

                <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-zinc-400 animate-spin" /></div>}>
                    <ProjectSpiral
                        items={spiralItems}
                        paused={false}
                        spin={spin}
                        onHover={(proj) => setHoverInfo(proj ? { title: proj.title, image: proj.image } : null)}
                        onSelect={setSelected}
                    />
                </Suspense>

                <div className="absolute top-20 md:top-24 inset-x-0 z-20 pointer-events-none">
                    <SharedHeader isList={false} />
                </div>
                <Toggle view={view} setView={setView} />

                <HoverLabel info={hoverInfo} />
                <DetailModal project={selected} onClose={() => setSelected(null)} />
            </section>
        );
    }

    // List / grid (scrolls internally within the view)
    return (
        <section id="work" className="relative h-full overflow-hidden flex flex-col pt-20 md:pt-24">
            <div className="shrink-0 z-20 pointer-events-none">
                <SharedHeader isList={true} />
            </div>
            <Toggle view={view} setView={setView} />

            <div className="flex-1 relative">
                {view === 'spiral' && !canSpiral && (
                    <div className="absolute inset-0 overflow-y-auto pb-10 max-w-frame mx-auto px-5 md:px-10">
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((p, i) => (
                                <motion.div key={p.id}
                                    initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: EASE }}>
                                    <ProjectCard project={p} onSelect={setSelected} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'list' && <BigList onSelect={setSelected} />}
            </div>

            <DetailModal project={selected} onClose={() => setSelected(null)} />
        </section>
    );
}
