import { useRef, useState, useMemo, useEffect } from 'react';
import React from 'react';
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame,
    AnimatePresence
} from 'framer-motion';
import { projects } from '../data/projects';
import { Github, ExternalLink, LayoutGrid, GalleryHorizontal, Lock } from 'lucide-react';
import Marquee from './Marquee';

const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// --- Parallax Text Component (Existing) ---
function ParallaxText({ children, baseVelocity = 100 }) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef(1);
    const isHovered = useRef(false);

    useAnimationFrame((t, delta) => {
        if (isHovered.current) return;

        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    // Clone children to inject hover handlers
    const childrenWithHover = useMemo(() => {
        return React.Children.map(children, (child) => {
            return React.cloneElement(child, {
                onMouseEnter: () => isHovered.current = true,
                onMouseLeave: () => isHovered.current = false
            });
        });
    }, [children]);

    return (
        <div className="m-0 whitespace-nowrap flex flex-nowrap py-20 pointer-events-none">
            <motion.div className="flex flex-nowrap gap-8 pointer-events-auto" style={{ x }}>
                {childrenWithHover}
                {childrenWithHover}
                {childrenWithHover}
                {childrenWithHover}
            </motion.div>
        </div>
    );
}

// --- AutoScrollText Helper Component ---
const AutoScrollText = ({ children, className }) => {
    const [shouldScroll, setShouldScroll] = useState(false);
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                // Check if content width is greater than container width
                setShouldScroll(textRef.current.scrollWidth > containerRef.current.clientWidth);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [children]);

    return (
        <div ref={containerRef} className="w-full overflow-hidden flex">
            {shouldScroll ? (
                <div className="w-full flex">
                    <motion.div
                        className={`flex whitespace-nowrap ${className}`}
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 15,
                        }}
                    >
                        <span ref={textRef} className="mr-8">{children}</span>
                        <span className="mr-8">{children}</span>
                    </motion.div>
                </div>
            ) : (
                <span ref={textRef} className={`truncate ${className} block w-full`}>{children}</span>
            )}
        </div>
    );
};


function ProjectCard({ project, isGrid = false, onMouseEnter, onMouseLeave }) {
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
            className={`
        group relative overflow-hidden bg-dark-900 border border-dark-700 rounded-2xl transition-all duration-500 transform-gpu
        ${isGrid
                    // Increased height for Grid View (500px) and removed hover scale/rotate for stability
                    ? 'w-full h-[500px] hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10'
                    // Standard Horizontal Scroll View
                    : 'h-[350px] w-[300px] md:h-[450px] md:w-[400px] flex-shrink-0 hover:border-white/40 hover:scale-110 hover:-rotate-2 hover:shadow-2xl hover:shadow-white/10 mx-4 cursor-pointer'
                }
      `}
        >
            <div className={`absolute inset-0 transition-all duration-500 ${isGrid ? 'group-hover:opacity-40' : ''}`}> {/* Dim image on hover in Grid Mode to make text pop */}
                <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start transform transition-transform duration-300 w-full translate-y-0">
                <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                            key={idx}
                            // Increased font size for Grid View
                            className={`px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-md font-bold text-white uppercase tracking-wider border border-white/20
                                ${isGrid ? 'text-xs' : 'text-[10px]'}
                            `}
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <div className="w-full mb-3">
                    <AutoScrollText
                        className={`font-black text-white uppercase italic ${isGrid ? 'text-3xl' : 'text-2xl'}`} // Bigger title in Grid
                    >
                        {project.title}
                    </AutoScrollText>
                </div>

                {/* Description: Always visible in Grid Mode, Hover-only in Scroll Mode */}
                <div className={`w-full transition-all duration-500 ease-in-out overflow-hidden mb-4
                    ${isGrid ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100'}
                `}>
                    <AutoScrollText className={`text-gray-300 leading-relaxed ${isGrid ? 'text-base' : 'text-xs md:text-sm'}`}>
                        {project.description}
                    </AutoScrollText>
                </div>

                <div className={`flex gap-4 transition-opacity duration-300 delay-100 mt-2
                    ${isGrid ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}>
                    {project.githubUrl ? (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white text-dark-950 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <Github size={24} />
                        </a>
                    ) : (
                        <div className="p-3 bg-dark-800 text-dark-400 border border-dark-600 rounded-full cursor-not-allowed flex items-center justify-center group/lock relative">
                            <Lock size={24} />
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark-900 border border-dark-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/lock:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                Private Repo
                            </span>
                        </div>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-dark-800 text-white border border-dark-600 rounded-full hover:bg-dark-700 transition-colors"
                        >
                            <ExternalLink size={24} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Projects() {
    const [isGridView, setIsGridView] = useState(false);

    return (
        <section id="projects" className="bg-transparent min-h-screen py-20 flex flex-col justify-center overflow-hidden -mt-32 relative z-50">
            <div className="mb-4 pointer-events-none">
                <Marquee text="FEATURED PROJECTS • RECENT WORK • " />
            </div>

            {/* View Toggle Button */}
            <div className="flex justify-center mb-6 relative z-10">
                <button
                    onClick={() => setIsGridView(!isGridView)}
                    className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                >
                    <div className="relative w-5 h-5">
                        <motion.div
                            initial={false}
                            animate={{ opacity: isGridView ? 1 : 0, scale: isGridView ? 1 : 0.5 }}
                            className="absolute inset-0"
                        >
                            <GalleryHorizontal size={20} className="text-white" />
                        </motion.div>
                        <motion.div
                            initial={false}
                            animate={{ opacity: !isGridView ? 1 : 0, scale: !isGridView ? 1 : 0.5 }}
                            className="absolute inset-0"
                        >
                            <LayoutGrid size={20} className="text-white" />
                        </motion.div>
                    </div>
                    <span className="text-white font-medium tracking-wide text-sm">
                        {isGridView ? "SWITCH TO SCROLL" : "VIEW ALL PROJECTS"}
                    </span>
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isGridView ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                        className="px-4 md:px-8 max-w-7xl mx-auto w-full"
                    >
                        {/* Changed grid layout to max 2 columns for larger cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} isGrid={true} />
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-dark-400 text-sm">Showing {projects.length} Projects</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="scroll"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full transform -rotate-1 scale-105"
                    >
                        <ParallaxText baseVelocity={-2}>
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </ParallaxText>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
