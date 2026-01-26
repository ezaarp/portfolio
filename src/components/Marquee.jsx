import { motion } from 'framer-motion';

export default function Marquee({ text, direction = 'left', speed = 20 }) {
    return (
        <div className="relative flex overflow-hidden py-4 select-none bg-primary-500/5 rotate-[-2deg] scale-110 mb-20 border-y border-primary-500/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-transparent to-dark-950 z-10 pointer-events-none"></div>
            <motion.div
                className="flex whitespace-nowrap"
                initial={{ x: direction === 'left' ? 0 : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : 0 }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed,
                }}
            >
                {[...Array(4)].map((_, i) => (
                    <span
                        key={i}
                        className="text-6xl md:text-8xl font-black text-white px-8 uppercase tracking-tighter"
                        style={{
                            textShadow: '0 0 20px rgba(255,255,255,0.1)'
                        }}
                    >
                        {text}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
