import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Shield, ChevronRight, Activity, Wifi, Server } from 'lucide-react';
import meImg from '../assets/me.png';

const Typewriter = ({ text, delay = 30, onComplete }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, delay, text, onComplete]);

    return <span>{currentText}</span>;
};

const CommandPrompt = ({ children }) => (
    <div className="flex items-center gap-2 text-green-400 font-mono text-base md:text-lg mb-3">
        <ChevronRight size={20} />
        <span className="text-blue-400">~</span>
        <span>{children}</span>
    </div>
);

export default function Hero() {
    const [step, setStep] = useState(0);

    return (
        // Changed min-h-screen to h-screen and ensured overflow-hidden to crop bottom of image
        <section id="home" className="h-screen pt-32 pb-20 flex items-center bg-transparent relative overflow-hidden px-4 md:px-12">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* MatrixRain removed from here, now global in App.jsx */}

                <div className="absolute top-24 left-8 text-xs font-mono text-primary-400/50 hidden md:block z-10">
                    <div className="flex items-center gap-2 mb-2"><Activity size={14} /> SYSTEM STATUS: ONLINE</div>
                    <div className="flex items-center gap-2 mb-2"><Server size={14} /> SERVER: ap-southeast-3</div>
                    <div className="flex items-center gap-2"><Wifi size={14} /> CONNECTED: 104.23.1.22</div>
                </div>

                <div className="absolute top-24 right-8 text-xs font-mono text-primary-400/50 hidden md:block text-right z-10">
                    <div className="mb-2">ENCRYPTION: AES-256</div>
                    <div className="mb-2">SECURE SHELL (SSH)</div>
                    <div>SESSION ID: #88291F</div>
                </div>

                <div className="absolute bottom-8 left-8 text-xs font-mono text-primary-400/50 hidden md:block z-10">
                    <div className="w-32 h-1 bg-dark-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary-500"
                            animate={{ width: ["0%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                    </div>
                    <div className="mt-1">SCANNING PORTS...</div>
                </div>
            </div>

            <div className="w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center relative z-10">

                {/* Left Column: Terminal */}
                <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full lg:w-[50%] ml-0 lg:ml-20 h-[80vh] md:h-[600px] lg:h-[800px] flex items-center relative z-40"
                >
                    <div className="w-full bg-[#0c0c0c]/90 backdrop-blur-md rounded-xl border border-dark-700 shadow-2xl font-mono text-sm md:text-base leading-relaxed relative overflow-hidden h-full flex flex-col">

                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-5"></div>

                        <div className="bg-dark-800/90 px-6 py-3 flex items-center justify-between border-b border-dark-700 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>
                            </div>
                            <div className="flex items-center gap-2 text-dark-400 text-sm select-none">
                                <Terminal size={16} />
                                <span>bash — andrarieza@portfolio</span>
                            </div>
                            <div className="w-16"></div>
                        </div>

                        <div className="p-8 text-dark-300 font-mono relative flex-grow overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>

                            <div className="mb-6">
                                <span>Last login: {new Date().toDateString()} on ttys000</span>
                            </div>

                            <div className="mb-8">
                                <CommandPrompt>
                                    <Typewriter text="whoami" onComplete={() => setTimeout(() => setStep(1), 500)} />
                                </CommandPrompt>
                                {step >= 1 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="pl-8 text-white font-bold text-2xl md:text-3xl mb-4"
                                    >
                                        <span className="text-green-400">root</span>@<span className="text-primary-400">Andrarieza</span>
                                    </motion.div>
                                )}
                            </div>

                            {step >= 1 && (
                                <div className="mb-8">
                                    <CommandPrompt>
                                        <Typewriter text="cat ./role.txt" onComplete={() => setTimeout(() => setStep(2), 500)} />
                                    </CommandPrompt>
                                    {step >= 2 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="pl-8 space-y-2"
                                        >
                                            <div className="flex items-center gap-3 text-primary-400">
                                                <Shield size={20} /> Cyber Security Analyst
                                            </div>
                                            <div className="flex items-center gap-3 text-purple-400">
                                                <Code size={20} /> Full Stack Web Developer
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {step >= 2 && (
                                <div className="mb-8">
                                    <CommandPrompt>
                                        <Typewriter text="echo $BIO" onComplete={() => setTimeout(() => setStep(3), 500)} />
                                    </CommandPrompt>
                                    {step >= 3 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="pl-8 text-dark-300 max-w-2xl leading-relaxed"
                                        >
                                            "Passionate about securing digital infrastructures and building robust, scalable web applications. Turning complex problems into elegant code."
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {step >= 3 && (
                                <div className="mb-8">
                                    <CommandPrompt>
                                        <Typewriter text="./init_portfolio.sh --verbose" onComplete={() => setTimeout(() => setStep(4), 500)} />
                                    </CommandPrompt>
                                    {step >= 4 && (
                                        <div className="pl-8 space-y-1">
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-green-500">
                                                [OK] Loading modules...
                                            </motion.div>
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-green-500">
                                                [OK] Initializing Projects...
                                            </motion.div>
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-green-500">
                                                [OK] Loading Certifications...
                                            </motion.div>
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-blue-400 mt-2">
                                                Ready! Scroll down to explore.
                                            </motion.div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step >= 4 && (
                                <div className="mt-6 flex items-center gap-2">
                                    <ChevronRight size={20} className="text-green-400" />
                                    <span className="text-blue-400">~</span>
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="w-3 h-6 bg-dark-400 block"
                                    ></motion.span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Image Background Overlay */}
                <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:flex items-end justify-end pointer-events-none z-30">

                    <div className="relative w-full h-[130%]" style={{ marginRight: '-50px', bottom: '-150px' }}>


                        <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            src={meImg}
                            alt="Andrarieza"
                            className="w-full h-full object-contain object-bottom filter grayscale contrast-125 scale-105 origin-bottom-right"
                        />
                        {/* Gradient Fade at Bottom to hide crop */}
                        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent z-40 pointer-events-none"></div>
                    </div>
                </div>

            </div>
        </section>
    );
}
