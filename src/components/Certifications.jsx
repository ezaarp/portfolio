import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, ExternalLink, Calendar, ArrowUpRight } from 'lucide-react';
import { certifications } from '../data/certifications';
import Marquee from './Marquee';

function CertificationItem({ cert, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex flex-col md:flex-row gap-6 p-6 border-b border-white/5 hover:bg-white/5 transition-colors duration-300 rounded-lg"
        >
            {/* Date - Left Column on Desktop */}
            <div className="md:w-32 flex-shrink-0 pt-1">
                <span className="text-sm font-mono text-dark-400 flex items-center gap-2 group-hover:text-primary-400 transition-colors">
                    <Calendar size={14} />
                    {new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
            </div>

            {/* Main Content */}
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                            {cert.name}
                        </h3>
                        <p className="text-primary-300 font-medium flex items-center gap-2 mb-3">
                            <Award size={16} />
                            {cert.issuer}
                        </p>
                    </div>

                    {cert.credentialUrl && (
                        <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-white hover:bg-white hover:text-dark-950 transition-all transform group-hover:rotate-45"
                        >
                            <ArrowUpRight size={20} />
                        </a>
                    )}
                </div>

                <p className="text-dark-300 text-sm leading-relaxed max-w-2xl">
                    {cert.description}
                </p>

                {/* Mobile Link */}
                {cert.credentialUrl && (
                    <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="md:hidden mt-4 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-primary-400 transition-colors"
                    >
                        View Credential <ArrowUpRight size={14} />
                    </a>
                )}
            </div>
        </motion.div>
    );
}

export default function Certifications() {
    return (
        <section id="certifications" className="min-h-screen py-20 bg-transparent">
            <Marquee text="CERTIFICATIONS • ACHIEVEMENTS • " direction="right" />

            <div className="max-w-5xl mx-auto px-4 md:px-8 mt-10">
                <div className="space-y-2">
                    {certifications.map((cert, index) => (
                        <CertificationItem key={cert.id} cert={cert} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
