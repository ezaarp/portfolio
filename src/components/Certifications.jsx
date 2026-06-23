import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { certifications } from '../data/certifications';
import SectionHeader from './SectionHeader';

const isSecurity = (cert) => /security|penetration|cyber/i.test(`${cert.name} ${cert.description}`);
const EASE = [0.16, 1, 0.3, 1];

function CredentialRow({ cert, index, reduce }) {
    const sec = isSecurity(cert);
    const accent = sec ? 'text-alert' : 'text-signal';
    const dateLabel = new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }).toUpperCase();

    return (
        <motion.a
            href={cert.credentialUrl || undefined}
            target={cert.credentialUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
            className="group sheet block px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink"
        >
            <div className="flex items-start gap-4">
                <div className="hidden sm:flex flex-col gap-2 w-36 shrink-0 pt-0.5">
                    <span className="font-mono text-[11px] text-ink-faint">CERT-{String(cert.id).padStart(2, '0')}</span>
                    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${accent}`}>
                        <ShieldCheck size={13} /> Verified
                    </span>
                    <span className="label !text-ink-faint">{dateLabel}</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display font-bold text-lg md:text-xl text-ink leading-snug group-hover:text-signal transition-colors">
                            {cert.name}
                        </h3>
                        {cert.credentialUrl && (
                            <span className="w-8 h-8 shrink-0 flex items-center justify-center border border-line text-ink-soft group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-all">
                                <ArrowUpRight size={16} />
                            </span>
                        )}
                    </div>

                    <p className="mt-1 font-mono text-[12px] uppercase tracking-wider text-ink-soft">{cert.issuer}</p>
                    <p className="mt-3 text-[13.5px] text-ink-soft leading-relaxed max-w-2xl">{cert.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 sm:hidden">
                        <span className="label !text-ink-faint">{dateLabel}</span>
                        <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${accent}`}>
                            <ShieldCheck size={12} /> Verified
                        </span>
                    </div>

                    {cert.credentialId && (
                        <p className="mt-3 font-mono text-[11px] text-ink-faint">
                            <span className="text-ink-soft">ID</span> · {cert.credentialId}
                        </p>
                    )}
                </div>
            </div>
        </motion.a>
    );
}

export default function Certifications() {
    const reduce = useReducedMotion();
    return (
        <section id="credentials" className="py-16 md:py-24">
            <div className="max-w-frame mx-auto px-5 md:px-10">
                <SectionHeader title="Credentials" meta={`${certifications.length} verified`} />
                <div className="grid gap-4">
                    {certifications.map((cert, index) => (
                        <CredentialRow key={cert.id} cert={cert} index={index} reduce={reduce} />
                    ))}
                </div>
            </div>
        </section>
    );
}
