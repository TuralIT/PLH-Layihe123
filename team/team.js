/* ============================================
   TEAM PAGE - SELF-CONTAINED JS MODULE
   Migrated from: main.js + js/team.js
   ============================================ */
'use strict';

window.PROBIZ = window.PROBIZ || {};

/* ============================================
   SECTION 1: UI MODULE (from main.js)
   ============================================ */
PROBIZ.ui = (function() {
    const navbar = document.querySelector('.plh-nav');
    const progressBar = document.getElementById("scroll-progress");

    const init = () => {
        _bindScrollEvents();
    };

    const _bindScrollEvents = () => {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            if (scrollY > 50) navbar.classList.add('nav-scrolled');
            else navbar.classList.remove('nav-scrolled');

            if (progressBar) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (scrollY / height) * 100;
                progressBar.style.width = `${scrolled}%`;
            }

            const mobileCTA = document.querySelector('.mobile-sticky-cta');
            if (mobileCTA) {
                if (scrollY > 300) mobileCTA.classList.add('cta-visible');
                else mobileCTA.classList.remove('cta-visible');
            }
        }, { passive: true });
    };

    return { init };
})();

/* ============================================
   SECTION 2: MOTION MODULE (from main.js)
   ============================================ */
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

/* ============================================
   SECTION 3: TEAM MODULE (from js/team.js)
   ============================================ */
PROBIZ.team = (function() {
    
    // Team Data
    const teamData = {
        "julian-thorne": {
            name: "Julian Thorne",
            role: "Təsisçi Partnyor",
            img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
            bio: `
                <p>Julian Thorne PROBIZ Legal Hub-ın təsisçi partnyorudur və 20 ildən artıq təcrübəyə malikdir. O, əsasən mürəkkəb korporativ mübahisələr, beynəlxalq arbitraj və yüksək dəyərli M&A (Birləşmə və Satınalma) sövdələşmələri üzrə ixtisaslaşmışdır. Onun strateji yanaşması və dərin hüquqi bilikləri sayəsində şirkətimiz regionun ən nüfuzlu hüquq bürolarından birinə çevrilmişdir.</p>
                <p>Cənab Thorne, Energetika və Texnologiya sektorlarında fəaliyyət göstərən Fortune 500 şirkətlərinə məsləhət xidmətləri göstərmiş və dəyəri milyard dollarla ölçülən layihələrin hüquqi təminatını uğurla həyata keçirmişdir.</p>
                <p>O, hüquq ictimaiyyətində "strateji ustad" kimi tanınır və tez-tez beynəlxalq konfranslarda spiker kimi çıxış edir.</p>
            `,
            education: [
                "Hüquq Magistri (LL.M) - Harvard Law School",
                "Hüquq Bakalavrı - Bakı Dövlət Universiteti (Fərqlənmə)"
            ]
        },
        "elena-vance": {
            name: "Elena Vance",
            role: "Baş Partnyor",
            img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
            bio: `
                <p>Elena Vance Əqli Mülkiyyət və Texnologiya hüququ üzrə tanınmış ekspertdir. Silikon Vadisindəki iş təcrübəsi ilə o, yerli və beynəlxalq startaplara, eləcə də texnologiya nəhənglərinə innovasiyaların qorunması üzrə məsləhətlər verir. Onun təcrübəsi proqram təminatı lisenziyalaşdırılması, ticarət nişanlarının qorunması və patent mübahisələrini əhatə edir.</p>
                <p>Xanım Vance, rəqəmsal dövrdə bizneslərin qarşılaşdığı hüquqi çağırışları dərindən anlayır və müştərilərinə proaktiv həll yolları təklif edir.</p>
                <p>O, həmçinin Qadın Hüquqşünaslar Assosiasiyasının fəal üzvü və mentorudur.</p>
            `,
            education: [
                "Juris Doctor (J.D.) - Stanford Law School",
                "Bakalavr (Beynəlxalq Münasibətlər) - ADA Universiteti"
            ]
        },
        "marcus-sterling": {
            name: "Marcus Sterling",
            role: "Aparıcı Vəkil",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
            bio: `
                <p>Marcus Sterling məhkəmə zalında aqressiv və nəticəyə hesablanmış müdafiə taktikaları ilə tanınır. Kommersiya mübahisələri, vergi hüququ və ağ yaxalıq cinayətləri (white-collar crimes) üzrə ixtisaslaşan Marcus, müştərilərinin maraqlarını ən çətin vəziyyətlərdə belə qorumağı bacarır.</p>
                <p>Federal və yerli məhkəmələrdə çoxsaylı uğurlu işlərə imza atmışdır. Onun analitik zəkası və detallara diqqəti, ən mürəkkəb maliyyə sənədlərində belə həlledici sübutları tapmağa imkan verir.</p>
                <p>Boş vaxtlarında gənc hüquqşünaslara mühazirələr oxuyur.</p>
            `,
            education: [
                "Hüquq Magistri - London School of Economics (LSE)",
                "Bakalavr - Bakı Dövlət Universiteti"
            ]
        },
        "sarah-jenkins": {
            name: "Sarah Jenkins",
            role: "Partnyor",
            img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
            bio: `
                <p>Sarah Jenkins Ailə Hüququ və Mülki Mübahisələr şöbəsinə rəhbərlik edir. O, boşanma prosesləri, uşaq qəyyumluğu və miras məsələlərində müştərilərə həssas və peşəkar yanaşma təqdim edir. Sarah, emosional cəhətdən çətin prosesləri hüquqi müstəvidə səmərəli şəkildə həll etmək bacarığı ilə seçilir.</p>
                <p>Mübahisələrin məhkəmədənkənar həlli (mediasiya) sahəsində sertifikatlı mütəxəssisdir və bir çox ailə mübahisələrini sülh yolu ilə həll etmişdir.</p>
            `,
            education: [
                "Hüquq Bakalavrı - Durham University",
                "Sertifikatlı Mediator"
            ]
        },
        "david-chen": {
            name: "David Chen",
            role: "Məsləhətçi",
            img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
            bio: `
                <p>David Chen bank və maliyyə hüququ üzrə dərin biliyə malikdir. O, investisiya fondları, startaplar və fintech şirkətlərinə tənzimləmə və uyğunluq məsələlərində dəstək verir. David, qlobal maliyyə bazarlarındakı təcrübəsini yerli qanunvericiliklə uğurla birləşdirir.</p>
                <p>Müştərilərinə bizneslərini böyütmək üçün hüquqi riskləri minimuma endirməyə və investisiya cəlbediciliyini artırmağa kömək edir.</p>
            `,
            education: [
                "MBA - INSEAD",
                "Hüquq Bakalavrı - Pekin Universiteti"
            ]
        }
    };

    let modal;
    let modalEl;
    let modalImg;
    let modalRole;
    let modalName;
    let modalBio;
    let modalEducation;

    const init = () => {
        // Initialize modal elements after DOM is ready
        modalEl = document.getElementById('teamModal');
        if (!modalEl) return;
        
        modal = new bootstrap.Modal(modalEl);
        modalImg = document.getElementById('modalImg');
        modalRole = document.getElementById('modalRole');
        modalName = document.getElementById('modalName');
        modalBio = document.getElementById('modalBio');
        modalEducation = document.getElementById('modalEducation');

        _bindEvents();
        _animateGrid();
    };

    const _bindEvents = () => {
        const triggers = document.querySelectorAll('.team-card-trigger');
        
        triggers.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const id = card.getAttribute('data-id');
                _openModal(id);
            });
        });

        modalEl.addEventListener('hidden.bs.modal', () => {
            // Optional cleanup
        });
    };

    const _openModal = (id) => {
        const data = teamData[id];
        if (!data) return;

        // Populate Content
        modalImg.src = data.img;
        modalImg.alt = data.name;
        modalRole.textContent = data.role;
        modalName.textContent = data.name;
        modalBio.innerHTML = data.bio;
        
        // Populate Education
        modalEducation.innerHTML = '';
        data.education.forEach(edu => {
            const li = document.createElement('li');
            li.textContent = edu;
            modalEducation.appendChild(li);
        });

        modal.show();
    };

    const _animateGrid = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const cards = document.querySelectorAll('.team-card');
        
        gsap.fromTo(cards, 
            { 
                y: 100, 
                opacity: 0 
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".team-grid-section",
                    start: "top 80%",
                }
            }
        );
    };

    return { init };
})();

/* ============================================
   SECTION 4: INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    PROBIZ.ui.init();
    PROBIZ.motion.init();
    PROBIZ.team.init();
});
