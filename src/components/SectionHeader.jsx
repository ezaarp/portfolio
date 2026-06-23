import { motion } from 'framer-motion';

// Clean section header: title + hairline rule + optional meta.
// No section numbers, no eyebrow stack. The headline carries the section.
export default function SectionHeader({ title, meta, accent = 'signal' }) {
    const bar = accent === 'alert' ? 'bg-alert' : 'bg-signal';
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
        >
            <div className="flex items-end justify-between gap-4 pb-4 border-b border-line-strong">
                <h2 className="flex items-center gap-3 font-display font-extrabold text-3xl md:text-5xl tracking-tight text-ink">
                    <motion.span
                        initial={{ height: 0 }}
                        whileInView={{ height: '1.6rem' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className={`w-1 ${bar} rounded-full`}
                    />
                    {title}
                </h2>
                {meta && <span className="label hidden sm:block pb-1.5">{meta}</span>}
            </div>
        </motion.div>
    );
}
