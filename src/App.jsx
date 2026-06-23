import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Menu from './components/Menu';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import PageCurl from './components/PageCurl';

const VIEW_TRANSITION = { type: 'spring', stiffness: 210, damping: 24 };

function App() {
    const [view, setView] = useState('home');
    const [menuOpen, setMenuOpen] = useState(false);
    const go = (v) => { setView(v); setMenuOpen(false); };

    return (
        <div className="h-screen overflow-hidden bg-paper text-ink relative">
            <Navigation onOpenMenu={() => setMenuOpen(true)} onHome={() => go('home')} />
            <Menu open={menuOpen} view={view} onNavigate={go} onClose={() => setMenuOpen(false)} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.985, y: 22 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.985, y: -22 }}
                    transition={VIEW_TRANSITION}
                    className={`absolute inset-0 ${view === 'works' ? 'overflow-hidden' : 'overflow-y-auto'}`}
                >
                    {view === 'home' && <Hero onNavigate={go} />}
                    {view === 'works' && <Projects />}
                    {view === 'credentials' && <Certifications />}
                    {view === 'contact' && <Contact />}
                </motion.div>
            </AnimatePresence>
            
            <PageCurl />
        </div>
    );
}

export default App;
