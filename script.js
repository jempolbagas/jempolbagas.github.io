// script.js

document.addEventListener('DOMContentLoaded', function() {

    /* ==========================================================================
       Part 3.1: Essential Functionality
       ========================================================================== */
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
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
    Phase B (Revised): The Comet Cursor
    ========================================================================== */

    // Check if the user is on a touch device
    const isTouchDevice = 'ontouchstart' in window;

    if (!isTouchDevice) {
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);

        const trailElements = [];
        const numTrailElements = 25; // The number of particles in our trail
        const positions = []; // An array to store the history of cursor positions

        // Create the trail elements and add them to the DOM
        for (let i = 0; i < numTrailElements; i++) {
            const el = document.createElement('div');
            el.className = 'cursor-trail';
            document.body.appendChild(el);
            trailElements.push(el);
            positions.push({ x: -100, y: -100 }); // Start them off-screen
        }

        let mouseX = -100, mouseY = -100;

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Update the main dot's position instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            // Add the current position to the history
            positions.unshift({ x: mouseX, y: mouseY });
            // Remove the oldest position if the array is too long
            if (positions.length > numTrailElements) {
                positions.pop();
            }

            // Animate the trail elements
            trailElements.forEach((el, index) => {
                const pos = positions[index];
                if (pos) {
                    el.style.left = `${pos.x}px`;
                    el.style.top = `${pos.y}px`;

                    // Calculate scale and opacity based on position in the trail
                    const scale = (numTrailElements - index) / numTrailElements;
                    el.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    el.style.opacity = scale * 0.7;
                    el.style.width = `${scale * 15}px`;
                    el.style.height = `${scale * 15}px`;
                }
            });

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // We can add hover effects back here if desired
        const interactiveElements = document.querySelectorAll('a, .btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.style.transform = 'translate(-50%, -50%) scale(1)');
            el.addEventListener('mouseleave', () => cursorDot.style.transform = 'translate(-50%, -50%) scale(1)');
        });
    }

    /* ==========================================================================
       GSAP Animations
       ========================================================================== */
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
    tl.from('.hero-content', { opacity: 0, scale: 0.95, duration: 0.5 })
      .from('.hero-image', { opacity: 0, scale: 0.9, y: -30 }, "-=0.3")
      .from('.hero-title', { opacity: 0, y: 20 }, "-=0.3")
      .from('.hero-tagline', { opacity: 0, y: 20 }, "-=0.5")
      .from('.btn', { opacity: 0, y: 20 }, "-=0.6")
      .from('.hero-socials', { opacity: 0, y: 20 }, "-=0.7");

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            opacity: 0, y: 30, duration: 0.6,
            scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none none' }
        });
    });

    gsap.from('.service-card', {
        opacity: 0, y: 40, duration: 0.5, stagger: 0.2,
        scrollTrigger: { trigger: '.services-grid', start: 'top 80%', toggleActions: 'play none none none' }
    });

    gsap.from('.skills-column', {
        opacity: 0, x: -50, duration: 0.8,
        scrollTrigger: { trigger: '.skills-grid', start: 'top 80%', toggleActions: 'play none none none' }
    });

    gsap.from('.project-card', {
        opacity: 0, x: 50, duration: 0.8,
        scrollTrigger: { trigger: '.skills-grid', start: 'top 80%', toggleActions: 'play none none none' }
    });
    
    gsap.from('.contact-container', {
        opacity: 0, scale: 0.9, duration: 0.8,
        scrollTrigger: { trigger: '#contact', start: 'top 80%', toggleActions: 'play none none none' }
    });

    gsap.to('body', {
        backgroundPosition: '50% 100%', ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
    });
});