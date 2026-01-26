import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import MatrixRain from './components/MatrixRain';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
    useEffect(() => {
        // Smooth scroll for the entire page
        gsap.to(window, {
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
            }
        });
    }, []);

    return (
        <div className="min-h-screen bg-dark-950 text-white relative overflow-hidden">
            <MatrixRain />
            <div className="relative z-10">
                <Navigation />
                <Hero />
                <Projects />
                <Certifications />
                <Contact />
            </div>
        </div>
    );
}

export default App;
