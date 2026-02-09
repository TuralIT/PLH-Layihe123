'use strict';

/**
 * Partners Page Specific Script
 * Independent of main.js to ensure full control over animations and visibility.
 */

// --- Core UI & Navigation Logic (Ported from main.js) ---
const _initUI = () => {
    const navbar = document.querySelector('.plh-nav');
    const progressBar = document.getElementById("scroll-progress");
    const mobileCTA = document.querySelector('.mobile-sticky-cta');

    // Scroll Event Listener for Navbar & Progress Bar
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar Styling on Scroll
        if (scrollY > 50) navbar.classList.add('nav-scrolled');
        else navbar.classList.remove('nav-scrolled');

        // Progress Bar
        if (progressBar) {
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollY / height) * 100;
            progressBar.style.width = `${scrolled}%`;
        }

        // Mobile CTA Visibility
        if (mobileCTA) {
            if (scrollY > 300) mobileCTA.classList.add('cta-visible');
            else mobileCTA.classList.remove('cta-visible');
        }
    }, { passive: true });
};

// --- Motion & Animations ---
const _initMotion = () => {
    // 1. Initialize Lenis (Smooth Scrolling)
    const isMobile = window.innerWidth < 992;
    if (typeof Lenis !== 'undefined' && !isMobile) {
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
    }

    // 2. Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // 3. Hero Section Animation (Fade Up)
    gsap.utils.toArray('.animate-fade-up').forEach((el, i) => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.15, // Stagger effect based on index
            ease: 'power3.out'
        });
    });

    // 4. Strategic Partners Logos Animation
    // Ensure initial state is hidden to prevent "flash of unstyled content"
    gsap.set('.partner-logo-item', { y: 30, opacity: 0 });
    
    gsap.to('.partner-logo-item', {
        scrollTrigger: {
            trigger: '.partner-logo-grid',
            start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // 5. Client Portfolio Logos Animation (Updated)
    // Explicitly target the section ID for robust triggering
    // We are now using partner-logo-items here too
    
    ScrollTrigger.batch('#client-portfolio .partner-logo-item', {
        start: 'top 80%',
        onEnter: batch => gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.2)', 
            overwrite: true
        })
    });

    // 6. Magnetic Buttons (Interactive Polish)
    if (!isMobile) {
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
    }

    // 7. Footer Animations (Optional but nice)
    gsap.from('.plh-footer h3, .plh-footer p, .plh-footer .btn', {
        scrollTrigger: {
            trigger: '.plh-footer',
            start: 'top 90%'
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out'
    });
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    _initUI();      // Initialize Navbar/UI logic
    _initMotion();  // Initialize Animations
    
    // Initialize Tooltips (Bootstrap)
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
