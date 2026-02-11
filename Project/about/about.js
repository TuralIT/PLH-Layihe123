/**
 * ABOUT PAGE - UNIQUE JAVASCRIPT (about.js)
 * Page-specific functionality only. Shared code is in ../common/general.js
 */

'use strict';

// Ensure namespace exists
window.PROBIZ = window.PROBIZ || {};

// =============================================================================
// ABOUT PAGE ANIMATIONS MODULE
// =============================================================================
PROBIZ.aboutAnimations = (function() {
    
    const init = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            // Fallback: make elements visible without animation
            document.querySelectorAll('.animate-fade-up').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
            document.querySelectorAll('.value-card').forEach(el => {
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
            
            ScrollTrigger.create({
                trigger: stat,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(stat, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power2.out"
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

// =============================================================================
// INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.aboutAnimations.init();
});
