// script.js

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================================
    // INTERACTIVE CONSTELLATION CANVAS
    // ==========================================================
    const canvas = document.getElementById('constellation-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        const glowRadius = 250; // The radius around the cursor where particles will glow

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5; // Size between 0.5px and 2px
                this.baseOpacity = Math.random() * 0.3 + 0.1; // Base opacity between 0.1 and 0.4
                this.opacity = this.baseOpacity;
                this.color = `rgba(0, 255, 180, ${this.opacity})`;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < glowRadius) {
                        const newOpacity = 1 - (distance / glowRadius);
                        this.opacity = Math.max(newOpacity, this.baseOpacity);
                    } else {
                        this.opacity = this.baseOpacity;
                    }
                }
                this.color = `rgba(0, 255, 180, ${this.opacity})`;
                this.draw();
            }
        }

        function init() {
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 4000; // Adjust density based on screen size
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const particle of particles) {
                particle.update();
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            init();
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        
        // Remove mouse position when it leaves the window
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        init();
        animate();
    }

    const preloader = document.getElementById('preloader');
    const langButtons = document.querySelectorAll('.lang-btn');
    const bloomParticle = document.querySelector('.bloom-particle');
    const preloaderContent = document.querySelector('.preloader-content');

    // ==========================================================
    // NEW PRELOADER ANIMATION TIMELINE
    // ==========================================================
    function runPreloaderAnimation() {
        // 1. Initially, apply the CSS pulse animation to the particle
        bloomParticle.style.animation = 'pulse-glow 2s infinite ease-in-out';
        
        // 2. Create the main GSAP timeline
        const tl = gsap.timeline();

        tl
            // Animate the particle into view and let it pulse for a bit
            .to(bloomParticle, { 
                opacity: 1, 
                duration: 0.5 
            })
            // Add a 1.5-second pause to let the pulse animation be seen
            .to({}, { duration: 1.5 }) 
            
            // The BLOOM effect starts here
            .to(bloomParticle, {
                // Stop the CSS animation before GSAP takes full control
                onStart: () => bloomParticle.style.animation = 'none',
                
                // Expand the particle to fill the screen
                scale: 150,
                // Fade it out as it expands for a smooth transition
                opacity: 0,
                duration: 1.2,
                ease: 'power3.inOut'
            })
            
            // Reveal the content DURING the bloom for a seamless effect
            .to(preloaderContent, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, "-=1.0"); // The '-=1.0' starts this animation 1s before the previous one ends
    }

    // Run the animation as soon as the DOM is loaded
    runPreloaderAnimation();

    
    /**
     *  All GSAP animations are now inside this function.
     *  It will only be called after the language is selected.
     */
    function startAnimations() {
        // Refreshes ScrollTrigger to ensure positions are calculated correctly after the preloader is gone.
        ScrollTrigger.refresh();

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
    }

    /**
     * Sets the text content based on the selected language.
     * @param {string} lang - The selected language ('en' or 'id').
     */
    function setLanguage(lang) {
        const elements = document.querySelectorAll('[data-lang-en]');
        elements.forEach(element => {
            const translation = element.getAttribute(`data-lang-${lang}`);
            if (translation) {
                element.innerHTML = translation;
            }
        });
    }

    // Logic for handling language selection and starting the app
    function proceedToSite(lang) {
        setLanguage(lang);
        // Fade out the preloader
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                preloader.style.display = 'none';
                startAnimations();
            }
        });
    }

    // The 'if' block that checked localStorage has been removed.
    // The preloader will now always show on page load.

    // Add click listeners to the language buttons
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.getAttribute('data-lang');
            // The line that saved the language to localStorage has been removed.
            proceedToSite(selectedLang);
        });
    });

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
});