import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function PageCurl() {
    return (
        <motion.a
            href="/CV_Andrarieza%20Rizqi%20Pradana.pdf"
            target="_blank"
            rel="noopener noreferrer"
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="fixed bottom-0 left-0 z-[100] block cursor-pointer group"
            variants={{
                rest: { width: 64, height: 64 },
                hover: { width: 220, height: 220 }
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            {/* REVEALED AREA (Underneath the page) */}
            <div 
                className="absolute inset-0 bg-ink text-paper overflow-hidden shadow-inner flex items-end justify-start"
                style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
            >
                <motion.div 
                    className="w-full h-full relative"
                    variants={{
                        rest: { opacity: 0, scale: 0.8 },
                        hover: { opacity: 1, scale: 1 }
                    }}
                >
                    <div className="absolute bottom-6 left-6 flex items-center gap-2 text-paper font-mono text-sm tracking-wider whitespace-nowrap">
                        <span>see my CV</span>
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                </motion.div>
            </div>

            {/* THE FOLD (Back of the paper) */}
            <div 
                className="absolute inset-0 drop-shadow-[-4px_4px_12px_rgba(0,0,0,0.4)] dark:drop-shadow-[-4px_4px_16px_rgba(0,0,0,0.8)] pointer-events-none"
            >
                <div 
                    className="w-full h-full bg-paper"
                    style={{ clipPath: 'polygon(0 0, 100% 100%, 100% 0)' }}
                >
                    {/* Lighting gradient to simulate the 3D curl */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/40 dark:from-black/60 dark:to-white/10" />
                </div>
            </div>
        </motion.a>
    );
}
