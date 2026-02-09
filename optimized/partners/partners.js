/**
 * PARTNERS PAGE - UNIQUE JAVASCRIPT (partners.js)
 * Page-specific functionality only. Shared code is in ../common/general.js
 */

'use strict';

// Ensure namespace exists
window.PROBIZ = window.PROBIZ || {};

// =============================================================================
// PARTNERS PAGE ANIMATIONS MODULE
// =============================================================================
PROBIZ.partnersAnimations = (function() {
    
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
        _animatePartnerLogos();
        _initTooltips();
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
     * Partner Logo Stagger Reveal - Animates both logo grids independently
     */
    const _animatePartnerLogos = () => {
        const grids = document.querySelectorAll('.partner-logo-grid');
        if (grids.length === 0) return;

        // Animate each grid independently with its own ScrollTrigger
        grids.forEach((grid) => {
            const logos = grid.querySelectorAll('.partner-logo-item');
            if (logos.length === 0) return;

            gsap.to(logos, {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: grid,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        });
    };

    /**
     * Initialize Bootstrap Tooltips
     */
    const _initTooltips = () => {
        if (typeof bootstrap === 'undefined') return;
        
        const tooltipTriggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggers.forEach(el => {
            new bootstrap.Tooltip(el);
        });
    };

    return { init };
})();

// =============================================================================
// INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.partnersAnimations.init();
});
