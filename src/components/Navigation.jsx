import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const WOBBLE = { type: 'spring', stiffness: 300, damping: 12 };

export default function Navigation({ onOpenMenu, onHome }) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[60] pt-2">
            <div className="w-full px-6 md:px-12 lg:px-16">
                <div className="flex items-center justify-between h-20">
                    <button onClick={onHome} className="flex items-center gap-3 cursor-pointer group">
                        <img src="/favicon.png" alt="EZA Logo" className="h-12 md:h-14 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform" />
                        <span className="font-mono text-sm uppercase tracking-[0.25em] text-ink-faint hidden sm:inline group-hover:text-signal transition-colors mt-0.5">PORTFOLIO</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <motion.button
                            onClick={onOpenMenu}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={WOBBLE}
                            className="flex items-center gap-3 rounded-full bg-white shadow-lg pl-7 pr-5 py-3.5"
                            aria-label="Open menu"
                        >
                            <span className="font-mono text-lg font-medium lowercase tracking-wide text-black">menu</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-black" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
