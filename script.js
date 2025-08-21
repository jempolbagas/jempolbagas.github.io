// script.js

// Wait for the entire HTML document to be loaded before running the script
document.addEventListener('DOMContentLoaded', function() {

    /* ==========================================================================
       Part 3.1: Essential Functionality
       ========================================================================== */
    
    // Dynamic Footer Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }


    /* ==========================================================================
       Part 3.2: Mobile Navigation
       ========================================================================== */

    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    /* ==========================================================================
       Part 3.3: The "Grand Entrance" (GSAP)
       ========================================================================== */

    // Create a GSAP timeline for the hero section entrance
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

    // Sequence the animations
    // We start "from" a state of being invisible/off-screen
    tl.from('.hero-content', { opacity: 0, scale: 0.95, duration: 0.5 })
      .from('.hero-image', { opacity: 0, scale: 0.9, y: -30 }, "-=0.3") // Overlap previous animation
      .from('.hero-title', { opacity: 0, y: 20 }, "-=0.3")
      .from('.hero-tagline', { opacity: 0, y: 20 }, "-=0.5")
      .from('.btn', { opacity: 0, y: 20 }, "-=0.6")
      .from('.hero-socials', { opacity: 0, y: 20 }, "-=0.7");


    /* ==========================================================================
       Part 3.4: On-Scroll Animations (GSAP ScrollTrigger)
       ========================================================================== */

    // Animate Section Titles on scroll
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: title,
                start: 'top 85%', // When the top of the title hits 85% from the top of the viewport
                toggleActions: 'play none none none'
            }
        });
    });

    // Animate Service Cards with a stagger effect
    gsap.from('.service-card', {
        opacity: 0,
        y: 40,
        duration: 0.5,
        stagger: 0.2, // Animate each card 0.2s after the previous one
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // Animate Skills & Project sections
    gsap.from('.skills-column', {
        opacity: 0,
        x: -50, // Slide in from the left
        duration: 0.8,
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    gsap.from('.project-card', {
        opacity: 0,
        x: 50, // Slide in from the right
        duration: 0.8,
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Animate Contact section
    gsap.from('.contact-container', {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    /* ==========================================================================
    Visual Refinement: Parallax Background
    ========================================================================== */

    gsap.to('body', {
        backgroundPosition: '50% 100%', // Move the background from 50% 0% to 50% 100%
        ease: 'none', // Linear movement
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true // This links the animation progress directly to the scrollbar position
        }
});

});