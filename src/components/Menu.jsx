import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Instagram, Download, ArrowUpRight } from 'lucide-react';

const ITEMS = [
    { id: 'home', label: 'Profile' },
    { id: 'works', label: 'Works' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'contact', label: 'Contact' },
];

const SOCIALS = [
    { href: 'https://github.com/ezaarp', icon: Github, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/andrariezarizqip/', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://www.instagram.com/ezaarp/', icon: Instagram, label: 'Instagram' },
];

// Springy = low damping so it overshoots and wobbles.
const WOBBLE = { type: 'spring', stiffness: 240, damping: 14 };
const cardV = {
    hidden: { opacity: 0, x: 90, scale: 0.98 },
    show: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 19, staggerChildren: 0.06, delayChildren: 0.1 } },
    exit: { opacity: 0, x: 70, scale: 0.98, transition: { duration: 0.22 } },
};
const itemV = {
    hidden: { opacity: 0, y: 28, rotate: -2 },
    show: { opacity: 1, y: 0, rotate: 0, transition: WOBBLE },
};

export default function Menu({ open, view, onNavigate, onClose }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div className="fixed inset-0 z-[80] flex justify-end p-2 sm:p-4" initial="hidden" animate="show" exit="exit">
                    <motion.div
                        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
                        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }}
                        onClick={onClose}
                    />
                    <motion.div
                        variants={cardV}
                        className="relative h-full w-full sm:w-[58%] lg:w-[46%] flex flex-col justify-between bg-surface rounded-3xl shadow-2xl p-7 sm:p-9 overflow-hidden"
                    >
                        <div className="flex justify-end">
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} transition={WOBBLE}
                                className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-ink-soft hover:text-ink"
                            >
                                close
                                <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center"><X size={18} /></span>
                            </motion.button>
                        </div>

                        <nav className="flex-1 flex flex-col justify-center gap-1">
                            {ITEMS.map((item, i) => {
                                const active = view === item.id;
                                return (
                                    <motion.button
                                        key={item.id}
                                        variants={itemV}
                                        onClick={() => onNavigate(item.id)}
                                        whileHover={{ x: 14, transition: { type: 'spring', stiffness: 420, damping: 10 } }}
                                        className="group flex items-center gap-4 text-left w-fit"
                                    >
                                        <span className="font-mono text-[11px] text-ink-faint w-6 hidden sm:inline">{String(i + 1).padStart(2, '0')}</span>
                                        <span className={`font-display font-bold tracking-tight leading-[1.04] text-[clamp(2rem,5.5vw,3.75rem)] transition-colors ${active ? 'text-signal' : 'text-ink group-hover:text-signal'}`}>
                                            {item.label}
                                        </span>
                                        {active && <span className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse-dot" />}
                                    </motion.button>
                                );
                            })}
                        </nav>

                        <motion.div variants={itemV} className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5">
                            <div className="flex flex-col gap-2">
                                <a href="mailto:andrariezarizqip@gmail.com" className="font-mono text-[13px] text-ink-soft hover:text-ink transition-colors">
                                    andrariezarizqip@gmail.com
                                </a>
                                <a href="/CV_Andrarieza%20Rizqi%20Pradana.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-signal hover:text-signal-ink transition-colors">
                                    <Download size={14} /> Download CV
                                </a>
                            </div>
                            <div className="flex items-center gap-2.5">
                                {SOCIALS.map(({ href, icon: Icon, label }) => (
                                    <motion.a
                                        key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                                        whileHover={{ scale: 1.12, y: -3 }} whileTap={{ scale: 0.94 }} transition={WOBBLE}
                                        className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center hover:bg-signal transition-colors"
                                    >
                                        <Icon size={18} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
