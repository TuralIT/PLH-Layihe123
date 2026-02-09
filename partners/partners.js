'use strict';

/**
 * Partners Page - Self-Contained JavaScript
 * Migrated from: js/main.js + js/partners.js
 * This file contains all JavaScript functionality required for partners.html
 * to function independently without any root JS dependencies.
 */

// =============================================================================
// 1. CORE UI & NAVIGATION LOGIC
// =============================================================================

const _initUI = () => {
    const navbar = document.querySelector('.plh-nav');
    const progressBar = document.getElementById("scroll-progress");
    const mobileCTA = document.querySelector('.mobile-whatsapp-sticky');

    if (!navbar) {
        console.warn('Partners JS: Navbar element not found.');
        return;
    }

    // Scroll Event Listener for Navbar, Progress Bar & Mobile CTA
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar Styling on Scroll
        if (scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }

        // Progress Bar
        if (progressBar) {
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height > 0) {
                const scrolled = (scrollY / height) * 100;
                progressBar.style.width = `${scrolled}%`;
            }
        }

        // Mobile CTA Visibility
        if (mobileCTA) {
            if (scrollY > 300) {
                mobileCTA.classList.add('cta-visible');
            } else {
                mobileCTA.classList.remove('cta-visible');
            }
        }
    }, { passive: true });
};

// =============================================================================
// 2. MOTION & ANIMATIONS (GSAP + LENIS)
// =============================================================================

const _initMotion = () => {
    // Check for GSAP and ScrollTrigger
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('Partners Motion: GSAP or ScrollTrigger not found. Animations disabled.');
        // Fallback: Make elements visible without animation
        document.querySelectorAll('.animate-fade-up, .partner-logo-item').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const isMobile = window.innerWidth < 992;

    // 1. Initialize Lenis Smooth Scrolling (Desktop Only)
    if (typeof Lenis !== 'undefined' && !isMobile) {
        try {
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
        } catch (e) {
            console.warn('Partners Motion: Lenis initialization failed.', e);
        }
    }

    // 2. Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // 3. Hero Section Animation (Fade Up)
    const fadeUpElements = gsap.utils.toArray('.animate-fade-up');
    fadeUpElements.forEach((el, i) => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.15,
            ease: 'power3.out'
        });
    });

    // 4. Strategic Partners Logos Animation
    // Set initial state to prevent flash of unstyled content
    gsap.set('.partner-logo-item', { y: 30, opacity: 0 });

    // First section logo grid animation
    const firstLogoGrid = document.querySelector('.section-padding.bg-white .partner-logo-grid');
    if (firstLogoGrid) {
        gsap.to(firstLogoGrid.querySelectorAll('.partner-logo-item'), {
            scrollTrigger: {
                trigger: firstLogoGrid,
                start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out'
        });
    }

    // 5. Client Portfolio Logos Animation
    const clientPortfolioItems = document.querySelectorAll('#client-portfolio .partner-logo-item');
    if (clientPortfolioItems.length > 0) {
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
    }

    // 6. Magnetic Buttons (Desktop Only - Interactive Polish)
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

    // 7. Footer Animations
    const footerElements = document.querySelectorAll('.plh-footer h3, .plh-footer p, .plh-footer .btn');
    if (footerElements.length > 0) {
        gsap.from(footerElements, {
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
    }
};

// =============================================================================
// 3. BOOTSTRAP TOOLTIPS INITIALIZATION
// =============================================================================

const _initTooltips = () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltipTriggerList.length > 0 && typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
};

// =============================================================================
// 4. INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    _initUI();       // Initialize Navbar/UI logic
    _initMotion();   // Initialize Animations
    _initTooltips(); // Initialize Bootstrap Tooltips
});
