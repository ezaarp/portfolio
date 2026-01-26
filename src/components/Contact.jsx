import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send, Instagram } from 'lucide-react';
import Marquee from './Marquee';

export default function Contact() {
    return (
        <section
            id="contact"
            className="min-h-screen py-20 bg-dark-950 flex flex-col justify-center overflow-hidden"
        >
            <Marquee text="GET IN TOUCH • LET'S CONNECT • " direction="right" />

            <div className="px-4 md:px-8 max-w-4xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Get In <span className="gradient-text">Touch</span>
                    </h2>
                    <p className="text-dark-300 text-lg max-w-2xl mx-auto">
                        Have a project in mind or want to collaborate? Feel free to reach out!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>

                        <div className="space-y-4 mb-8">
                            <a
                                href="mailto:andrariezarizqip@gmail.com"
                                className="flex items-center gap-4 glass p-4 rounded-lg hover:border-primary-500 transition-all group"
                            >
                                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                                    <Mail className="text-primary-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-dark-400">Email</p>
                                    <p className="font-medium group-hover:text-primary-400 transition-colors">
                                        andrariezarizqip@gmail.com
                                    </p>
                                </div>
                            </a>
                        </div>

                        <div className="flex gap-4">
                            <a
                                href="https://github.com/ezaarp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 glass rounded-lg flex items-center justify-center hover:border-primary-500 hover:bg-primary-500/10 transition-all"
                            >
                                <Github size={24} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/andrariezarizqip/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 glass rounded-lg flex items-center justify-center hover:border-primary-500 hover:bg-primary-500/10 transition-all"
                            >
                                <Linkedin size={24} />
                            </a>
                            <a
                                href="https://www.instagram.com/ezaarp/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 glass rounded-lg flex items-center justify-center hover:border-primary-500 hover:bg-primary-500/10 transition-all"
                            >
                                <Instagram size={24} />
                            </a>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass p-8 rounded-xl"
                    >
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            const name = e.target.name.value;
                            const message = e.target.message.value;
                            const mailtoLink = `mailto:andrariezarizqip@gmail.com?subject=Portfolio Contact from ${name}&body=${encodeURIComponent(message)}`;
                            window.location.href = mailtoLink;
                        }}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                                    placeholder="your.  email@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none"
                                    placeholder="Your message..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
                            >
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-16 pt-8 border-t border-dark-800"
                >
                    <p className="text-dark-400">
                        © 2026 Andrarieza Rizqi Pradana
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
