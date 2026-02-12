/**
 * INDEX PAGE - UNIQUE JAVASCRIPT (index.js)
 * Page-specific functionality only. Shared code is in ../common/general.js
 */

'use strict';

// Ensure namespace exists
window.PROBIZ = window.PROBIZ || {};

// =============================================================================
// 1. HERO CAROUSEL MODULE
// =============================================================================
PROBIZ.heroCarousel = (function() {
    let heroSliderInterval;
    let isAnimating = false; // Prevent rapid clicking

    const init = () => {
        const heroSection = document.querySelector('.hero');
        if (!heroSection || typeof gsap === 'undefined') return;

        const slides = document.querySelectorAll('.hero-slide');
        const prevBtn = document.querySelector('#prevSlide');
        const nextBtn = document.querySelector('#nextSlide');

        if (slides.length === 0) return;

        let current = 0;
        const total = slides.length;

        const changeSlide = (direction) => {
            if (isAnimating) return; // Stop if already animating
            isAnimating = true;

            const timeline = gsap.timeline({
                onComplete: () => {
                    isAnimating = false; // Release lock
                }
            });

            const currentSlide = slides[current];
            const nextIndex = direction === 'next'
                ? (current + 1) % total
                : (current - 1 + total) % total;
            const nextSlide = slides[nextIndex];

            // SMOOTH "FADE OVER" TRANSITION
            // 1. Ensure next slide is on top (zIndex 2) but transparent
            // 2. Current slide stays visible (zIndex 1)
            // 3. Fade next slide IN. No "dip" to background color.
            gsap.set(currentSlide, { zIndex: 1 });
            gsap.set(nextSlide, { zIndex: 2, autoAlpha: 0 });

            timeline.to(nextSlide, {
                autoAlpha: 1,
                duration: 1.5, // Slow, smooth change
                ease: 'power2.inOut'
            })
            .set(currentSlide, { zIndex: 0, autoAlpha: 0 }); // Hide old slide after new one is fully visible

            // Animate content inside the new slide
            const content = nextSlide.querySelectorAll('h1, p, .slide-btns');
            if (content.length > 0) {
                timeline.fromTo(content,
                    { y: 30, autoAlpha: 0 },
                    { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1.0, ease: 'power2.out' },
                    '-=1.0' // Start content animation while bg is still fading
                );
            }

            current = nextIndex;
        };

        // Initialize first slide
        gsap.set(slides, { autoAlpha: 0 });
        gsap.set(slides[0], { autoAlpha: 1 });

        // Auto-play
        heroSliderInterval = setInterval(() => changeSlide('next'), 3800);

        // Controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                clearInterval(heroSliderInterval);
                changeSlide('prev');
                heroSliderInterval = setInterval(() => changeSlide('next'), 3800);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                clearInterval(heroSliderInterval);
                changeSlide('next');
                heroSliderInterval = setInterval(() => changeSlide('next'), 3800);
            });
        }
    };

    return { init };
})();

// =============================================================================
// 2. PROTOCOL PINNING MODULE (STACKED CARDS ON SCROLL)
// =============================================================================
PROBIZ.processPinning = (function() {
    const init = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const pinContainer = document.querySelector('.protocol-pin-container');
        const cards = gsap.utils.toArray('.protocol-stack-card');

        if (!pinContainer || cards.length === 0) return;

        // Use matchMedia for robust responsive handling
        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 992px)",
            isMobile: "(max-width: 991px)"
        }, (context) => {
            let { isMobile } = context.conditions;

            // Initial State
            // Push cards down initially so they can slide up
            const offset = isMobile ? '130%' : '150%';
            gsap.set(cards, { y: offset, autoAlpha: 1 });

            // Create Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: pinContainer,
                    start: "top top",
                    end: isMobile ? "+=500%" : "+=500%",
                    pin: true,
                    scrub: 1.5,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                }
            });

            cards.forEach((card, i) => {
                const targetY = i * 20; // Stacking offset
                const scale = 1 - (i * 0.03);

                tl.to(card, {
                    y: targetY,
                    scale: scale,
                    duration: 1,
                    ease: "power2.out",
                }, i === 0 ? 0 : "-=0.1"); // Overlap animations slightly
            });
            
            return () => {
                // Optional cleanup if needed
                // matchMedia automatically reverts changes made during execution
            };
        });
    };

    return { init };
})();

// =============================================================================
// 3. TESTIMONIALS MARQUEE MODULE
// =============================================================================
PROBIZ.testimonials = (function() {
    const init = () => {
        if (typeof gsap === 'undefined') return;

        const tracks = document.querySelectorAll('.marquee-track-right');
        
        tracks.forEach(track => {
            const originalContent = track.innerHTML;
            track.innerHTML = originalContent + originalContent + originalContent + originalContent; // 4x total

            // Hybrid Approach: Calculate the exact width of ONE set (1/4th of total)
            // and pass it to CSS. This allows the CSS track to be 'width: auto' (not huge) 
            // while still animating the correct distance.
            const setMarqueeDistance = () => {
                const totalWidth = track.scrollWidth;
                const oneSetWidth = totalWidth / 4;
                track.style.setProperty('--marquee-end', `-${oneSetWidth}px`);
            };

            // Calculate immediately and on resize
            setMarqueeDistance();
            window.addEventListener('resize', setMarqueeDistance);
        });
    };

    return { init };
})();

// =============================================================================
// 4. ATTORNEY CARD REVEALS MODULE
// =============================================================================
PROBIZ.attorneyReveals = (function() {
    const init = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const attorneyCards = document.querySelectorAll('.attorney-card-gsap');
        if (attorneyCards.length === 0) return;

        gsap.from(attorneyCards, {
            y: 50,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
                trigger: attorneyCards[0],
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    };

    return { init };
})();

// =============================================================================
// 5. INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.heroCarousel.init();
    PROBIZ.processPinning.init();
    PROBIZ.testimonials.init();
    PROBIZ.attorneyReveals.init();
});

// Refresh ScrollTrigger on window load to ensure accurate calculations
// specially for pinned elements with images
window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});
