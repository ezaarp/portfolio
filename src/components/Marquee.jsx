import { motion, useReducedMotion } from 'framer-motion';

// A slim, single-line technical ticker: a status strip, not a billboard.
export default function Marquee({ items = [], direction = 'left', speed = 32 }) {
    const reduce = useReducedMotion();
    const sequence = [...items, ...items, ...items, ...items];

    return (
        <div className="relative overflow-hidden border-y border-line bg-paper-soft select-none">
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper-soft to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper-soft to-transparent z-10 pointer-events-none" />
            <motion.div
                className="flex whitespace-nowrap py-2.5"
                initial={{ x: direction === 'left' ? 0 : '-50%' }}
                animate={reduce ? {} : { x: direction === 'left' ? '-50%' : 0 }}
                transition={{ repeat: Infinity, ease: 'linear', duration: speed }}
            >
                {sequence.map((item, i) => (
                    <span key={i} className="flex items-center font-mono text-[11px] uppercase tracking-label text-ink-soft">
                        <span className="px-6">{item}</span>
                        <span className="text-line-strong">/</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
