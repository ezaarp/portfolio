import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', to: 'home' },
        { name: 'Projects', to: 'projects' },
        { name: 'Certifications', to: 'certifications' },
        { name: 'Contact', to: 'contact' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="home"
                        smooth={true}
                        duration={500}
                        className="text-2xl font-bold cursor-pointer"
                    >
                        <span className="text-white font-extrabold text-3xl tracking-tight">Eza.</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                spy={true}
                                smooth={true}
                                duration={500}
                                offset={-80}
                                className="text-dark-300 hover:text-primary-400 cursor-pointer transition-colors font-medium"
                                activeClass="text-primary-400"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center glass rounded-lg"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-3">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        spy={true}
                                        smooth={true}
                                        duration={500}
                                        offset={-80}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-3 glass rounded-lg hover:border-primary-500 cursor-pointer transition-all"
                                        activeClass="border-primary-500"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400"
                style={{
                    width: '0%',
                    scaleX: 0,
                    transformOrigin: '0%',
                }}
                whileInView={{
                    scaleX: typeof window !== 'undefined'
                        ? window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
                        : 0
                }}
            />
        </nav>
    );
}
