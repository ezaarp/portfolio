import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Instagram, ArrowUpRight, Send, Download } from 'lucide-react';
import SectionHeader from './SectionHeader';

const RESUME_HREF = '/CV_Andrarieza%20Rizqi%20Pradana.pdf'; // drop the résumé at public/

const channels = [
    { k: 'EMAIL', label: 'andrariezarizqip@gmail.com', href: 'mailto:andrariezarizqip@gmail.com', icon: Mail },
    { k: 'GITHUB', label: 'github.com/ezaarp', href: 'https://github.com/ezaarp', icon: Github },
    { k: 'LINKEDIN', label: 'in/andrariezarizqip', href: 'https://www.linkedin.com/in/andrariezarizqip/', icon: Linkedin },
    { k: 'INSTAGRAM', label: '@ezaarp', href: 'https://www.instagram.com/ezaarp/', icon: Instagram },
];

function ContactChannel({ k, label, href, icon: Icon }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-4 border-b border-line py-4 -mx-2 px-2 transition-colors hover:bg-paper-soft">
            <span className="font-mono text-[11px] text-ink-faint w-20 shrink-0">{k}</span>
            <Icon size={16} className="text-ink-soft group-hover:text-signal transition-colors shrink-0" />
            <span className="flex-1 font-mono text-[13px] text-ink truncate">{label}</span>
            <ArrowUpRight size={15} className="text-ink-faint group-hover:text-ink group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
        </a>
    );
}

export default function Contact() {
    const inputClass =
        'w-full bg-paper-soft border border-line px-3.5 py-2.5 text-ink text-sm placeholder:text-ink-soft focus:border-signal focus:bg-surface focus:outline-none transition-colors';

    return (
        <section id="contact" className="py-16 md:py-24">
            <div className="max-w-frame mx-auto px-5 md:px-10">
                <SectionHeader title="Contact" meta="Open to opportunities" />

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* left: pitch + channels */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-6"
                    >
                        <p className="font-display font-bold text-2xl md:text-3xl text-ink leading-tight tracking-tight max-w-md">
                            Have something to build, or something that needs auditing?
                        </p>
                        <p className="mt-4 text-ink-soft leading-relaxed max-w-md">
                            Available for internships, freelance builds, and security reviews.
                            Grab my CV or pick whichever channel suits you.
                        </p>

                        <a href={RESUME_HREF} target="_blank" rel="noopener noreferrer"
                            className="group mt-6 inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 font-mono text-[13px] uppercase tracking-wider hover:bg-signal transition-colors active:translate-y-px">
                            <Download size={15} /> Download CV
                        </a>

                        <div className="mt-8">
                            {channels.map((c) => <ContactChannel key={c.k} {...c} />)}
                        </div>
                    </motion.div>

                    {/* right: form */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-6"
                    >
                        <div className="sheet p-6">
                            <span className="label">Direct message</span>
                            <form
                                className="mt-5 space-y-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = e.target.name.value;
                                    const message = e.target.message.value;
                                    window.location.href =
                                        `mailto:andrariezarizqip@gmail.com?subject=${encodeURIComponent(`Portfolio contact from ${name}`)}&body=${encodeURIComponent(message)}`;
                                }}
                            >
                                <div>
                                    <label htmlFor="name" className="label block mb-1.5">Name</label>
                                    <input id="name" name="name" type="text" required placeholder="Your name" className={inputClass} />
                                </div>
                                <div>
                                    <label htmlFor="email" className="label block mb-1.5">Email</label>
                                    <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputClass} />
                                </div>
                                <div>
                                    <label htmlFor="message" className="label block mb-1.5">Message</label>
                                    <textarea id="message" name="message" rows="4" required placeholder="What are you working on?" className={`${inputClass} resize-none`} />
                                </div>
                                <button type="submit"
                                    className="group w-full flex items-center justify-center gap-2 bg-signal text-paper px-5 py-3 font-mono text-[13px] uppercase tracking-wider hover:bg-signal-ink transition-colors active:translate-y-px">
                                    <Send size={15} /> Send message
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* footer (legal © preserved) */}
                <footer className="mt-20 pt-6 border-t border-line-strong flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="label">© {new Date().getFullYear()} Andrarieza Rizqi Pradana</span>
                    <span className="label">Bandung, Indonesia</span>
                </footer>
            </div>
        </section>
    );
}
