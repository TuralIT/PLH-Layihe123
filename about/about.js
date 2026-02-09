/**
 * PROBIZ LEGAL HUB - About Page Self-Contained JavaScript
 * Consolidated from main.js for complete isolation
 */

'use strict';

window.PROBIZ = window.PROBIZ || {};

/**
 * UI Module - Handles navbar scroll behavior and progress bar
 */
PROBIZ.ui = (function() {
    const navbar = document.querySelector('.plh-nav');
    const progressBar = document.getElementById("scroll-progress");

    const init = () => {
        _bindScrollEvents();
    };

    const _bindScrollEvents = () => {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Navbar scroll state
            if (scrollY > 50) navbar.classList.add('nav-scrolled');
            else navbar.classList.remove('nav-scrolled');

            // Scroll progress bar
            if (progressBar) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (scrollY / height) * 100;
                progressBar.style.width = `${scrolled}%`;
            }

            // Mobile CTA visibility
            const mobileCTA = document.querySelector('.mobile-sticky-cta');
            if (mobileCTA) {
                if (scrollY > 300) mobileCTA.classList.add('cta-visible');
                else mobileCTA.classList.remove('cta-visible');
            }
        }, { passive: true });
    };

    return { init };
})();

/**
 * Motion Module - Handles Lenis smooth scroll, GSAP animations
 */
PROBIZ.motion = (function() {
    const isMobile = window.innerWidth < 992;

    const init = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('PROBIZ Motion: GSAP or ScrollTrigger not found. Animations disabled.');
            return;
        }

        _initLenis();
        _registerGSAP();
        _scrollReveals();

        if (!isMobile) {
            _magneticInteractions();
        }
    };

    const _initLenis = () => {
        if (typeof Lenis === 'undefined' || isMobile) return;

        const lenis = new Lenis({
            lerp: 0.05,
            wheelMultiplier: 0.9,
            smoothWheel: true,
            wrapper: window,
            content: document.body
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    };

    const _registerGSAP = () => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ ease: "power3.out", duration: 1.0 });
    };

    const _scrollReveals = () => {
        const revealElements = document.querySelectorAll('.class-to-animate, .row.mb-5');

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

    const _magneticInteractions = () => {
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

/**
 * About Page Specific Animations Module
 */
PROBIZ.aboutAnimations = (function() {
    
    const init = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            // Fallback: make elements visible without animation
            document.querySelectorAll('.animate-fade-up').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        
        _animateHeroElements();
        _animateStatCounters();
        _animateValueCards();
        _animateImageParallax();
    };

    /**
     * Hero section fade-up animation
     */
    const _animateHeroElements = () => {
        gsap.to('.animate-fade-up', {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });
    };

    /**
     * Stat Counter Animation - counts from 0 to target on scroll
     */
    const _animateStatCounters = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const hasPlus = stat.innerHTML.includes('+');
            
            ScrollTrigger.create({
                trigger: stat,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(stat, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power2.out",
                        onUpdate: function() {
                            stat.innerHTML = Math.ceil(this.targets()[0].innerHTML) + (hasPlus ? '<span class="stat-icon">+</span>' : '');
                        }
                    });
                }
            });
        });
    };

    /**
     * Values Cards - reveal animation on scroll
     * Note: Initial state (opacity: 0, y: 50) is set in CSS to prevent jump on refresh
     */
    const _animateValueCards = () => {
        gsap.to('.value-card', {
            scrollTrigger: {
                trigger: '.value-card',
                start: "top 95%"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });
    };

    /**
     * Image Grid Parallax Effect
     */
    const _animateImageParallax = () => {
        const imageGrid = document.querySelector('.about-image-grid');
        if (!imageGrid) return;

        gsap.to('.about-img-item img', {
            scrollTrigger: {
                trigger: '.about-image-grid',
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -30,
            ease: "none"
        });
    };

    return { init };
})();

/**
 * Initialize all modules on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.ui.init();
    PROBIZ.motion.init();
    PROBIZ.aboutAnimations.init();
});
