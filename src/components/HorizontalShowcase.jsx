import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Vertical scroll drives a horizontal pan. Pinning is done with CSS position:sticky
// (no GSAP pin-spacer), so it is StrictMode-safe and does not reparent React's DOM.
// Only mounted on desktop with motion enabled (the caller decides); cleans up fully.
export default function HorizontalShowcase({ children, ariaLabel }) {
    const wrap = useRef(null);
    const track = useRef(null);
    const bar = useRef(null);

    useEffect(() => {
        const wrapEl = wrap.current;
        const trackEl = track.current;
        if (!wrapEl || !trackEl) return;

        const ctx = gsap.context(() => {
            const distance = () => Math.max(trackEl.scrollWidth - window.innerWidth, 0);

            // Outer height defines the scroll length needed to complete the pan.
            const sizeWrap = () => { wrapEl.style.height = `${distance() + window.innerHeight}px`; };
            sizeWrap();

            gsap.to(trackEl, {
                x: () => -distance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: wrapEl,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onRefresh: sizeWrap,
                    onUpdate: (self) => {
                        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
                    },
                },
            });
        }, wrap);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={wrap} aria-label={ariaLabel} className="relative">
            <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center">
                <div ref={track} className="flex items-center gap-6 px-5 md:px-10 will-change-transform">
                    {children}
                </div>
                <div className="absolute bottom-8 left-5 md:left-10 right-5 md:right-10 h-px bg-line">
                    <div ref={bar} className="h-full bg-signal origin-left" style={{ transform: 'scaleX(0)' }} />
                </div>
            </div>
        </section>
    );
}
