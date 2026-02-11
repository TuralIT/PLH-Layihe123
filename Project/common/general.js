/**
 * PROBIZ LEGAL HUB - SHARED JAVASCRIPT FRAMEWORK (general.js)
 * Centralized functionality shared across all pages.
 */

'use strict';

// =============================================================================
// 1. GLOBAL NAMESPACE
// =============================================================================
window.PROBIZ = window.PROBIZ || {};

// =============================================================================
// 2. UI MODULE - Navbar Scroll, Progress Bar, Mobile CTA
// =============================================================================
PROBIZ.ui = (function() {
    const navbar = document.querySelector('.plh-nav');
    const progressBar = document.getElementById("scroll-progress");

    const init = () => {
        if (!navbar) {
            console.warn('PROBIZ UI: Navbar element not found.');
            return;
        }
        _bindScrollEvents();
    };

    const _bindScrollEvents = () => {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Navbar scroll state
            if (scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }

            // Scroll progress bar
            if (progressBar) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                if (height > 0) {
                    const scrolled = (scrollY / height) * 100;
                    progressBar.style.width = `${scrolled}%`;
                }
            }

            // Mobile CTA visibility
            const mobileCTA = document.querySelector('.mobile-whatsapp-sticky');
            if (mobileCTA) {
                if (scrollY > 50) {
                    mobileCTA.classList.add('cta-visible');
                } else {
                    mobileCTA.classList.remove('cta-visible');
                }
            }
        }, { passive: true });
    };

    return { init };
})();

// =============================================================================
// 3. MOTION MODULE - Lenis Smooth Scroll, GSAP Setup, Magnetic Buttons
// =============================================================================
PROBIZ.motion = (function() {
    const isMobile = window.innerWidth < 992;

    const init = () => {
        _initLenis();
        _registerGSAP();

        if (!isMobile) {
            _magneticInteractions();
        }
    };

    /**
     * Initialize Lenis Smooth Scrolling (Desktop Only)
     */
    const _initLenis = () => {
        if (typeof Lenis === 'undefined' || isMobile) {
            // Fallback for mobile - use native smooth scroll for anchors
            _handleAnchorClicks(null);
            return;
        }

        try {
            const lenis = new Lenis({
                lerp: 0.05,
                wheelMultiplier: 0.9,
                smoothWheel: true,
                wrapper: window,
                content: document.body
            });

            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);
            }

            // Handle anchor link clicks with Lenis
            _handleAnchorClicks(lenis);
            
        } catch (e) {
            console.warn('PROBIZ Motion: Lenis initialization failed.', e);
        }
    };

    /**
     * Handle Anchor Link Clicks (for smooth scroll to footer/sections)
     */
    const _handleAnchorClicks = (lenis) => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (!targetId || targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                
                if (lenis) {
                    // Use Lenis scrollTo for smooth scrolling
                    lenis.scrollTo(target, { offset: 0, duration: 1.2 });
                } else {
                    // Fallback for mobile - native smooth scroll
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };

    /**
     * Register GSAP Plugins
     */
    const _registerGSAP = () => {
        if (typeof gsap === 'undefined') {
            console.warn('PROBIZ Motion: GSAP not found.');
            return;
        }

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        gsap.defaults({ ease: "power3.out", duration: 1.0 });
    };

    /**
     * Magnetic Button Hover Effect (Desktop Only)
     */
    const _magneticInteractions = () => {
        if (typeof gsap === 'undefined') return;

        const buttons = document.querySelectorAll('.btn-accent, .btn-outline-white');
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
            });
        });
    };

    return { init };
})();

// =============================================================================
// 4. SCROLL REVEALS - Generic fade-up animations
// =============================================================================
PROBIZ.scrollReveals = (function() {
    const init = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            // Fallback: make elements visible without animation
            document.querySelectorAll('.class-to-animate').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const revealElements = document.querySelectorAll('.class-to-animate');
        revealElements.forEach(el => {
            gsap.fromTo(el,
                { y: 60, autoAlpha: 0 },
                {
                    y: 0, autoAlpha: 1,
                    duration: 1.1,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    };

    return { init };
})();

// =============================================================================
// 5. INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.ui.init();
    PROBIZ.motion.init();
    PROBIZ.scrollReveals.init();
});
