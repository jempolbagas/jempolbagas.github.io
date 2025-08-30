// script.js

document.addEventListener('DOMContentLoaded', function() {

    document.documentElement.style.cursor = 'none';
    // ==========================================================
    // INTERACTIVE CONSTELLATION CANVAS
    // ==========================================================
    const canvas = document.getElementById('constellation-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        const glowRadius = 250; // The radius around the cursor where particles will glow
        const lineMaxDistance = 120; // Max distance for lines to appear

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5; 
                this.baseOpacity = Math.random() * 0.3 + 0.1; 
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

        function updateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const particle of particles) {
                particle.update();
            }

            // ==========================================================
            // PLEXUS EFFECT
            // ==========================================================
            // This nested loop compares every particle with every other particle

            for (let i = 0; i < particles.length; i++) {
                // ensures we don't compare particles to themselves or draw the same line twice.
                for (let j = i; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // 1. Check if the particles are close enough
                    if (distance < lineMaxDistance) {
                        // 2. Only draw a line if both particles are currently glowing
                        // from the cursor's proximity. 
                        const isP1Active = p1.opacity > p1.baseOpacity;
                        const isP2Active = p2.opacity > p2.baseOpacity;

                        if (isP1Active && isP2Active) {
                            // 3. Calculate line opacity based on distance.
                            // The closer the particles, the brighter the line.
                            const lineOpacity = 1 - (distance / lineMaxDistance);

                            // 4. Draw the elegant, glowing line.
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(0, 255, 180, ${lineOpacity * 0.5})`; 
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }
            // ==========================================================
            // END OF PLEXUS EFFECT LOGIC
            // ==========================================================
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
        updateCanvas();
    }

    // ==========================================================
    // SUBTLE ANIMATED CONSTELLATION BACKGROUND
    // ==========================================================
    const bgCanvas = document.getElementById('background-canvas');
    let bgCtx;
    let bgParticles = [];
    const bgLineMaxDistance = 150;

    function setupBackgroundCanvas() {
        if (!bgCanvas) return;
        bgCtx = bgCanvas.getContext('2d');

        function resizeBgCanvas() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
        }
        resizeBgCanvas();

        class BackgroundParticle {
            constructor() {
                this.x = Math.random() * bgCanvas.width;
                this.y = Math.random() * bgCanvas.height;
                this.size = Math.random() * 1.2 + 0.3;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random() * 0.3 + 0.1;
                this.color = `rgba(0, 255, 180, ${this.opacity})`;
            }

            draw() {
                bgCtx.beginPath();
                bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                bgCtx.fillStyle = this.color;
                bgCtx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > bgCanvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > bgCanvas.height) this.vy *= -1;
            }
        }

        function initBg() {
            bgParticles = [];
            const numberOfParticles = (bgCanvas.width * bgCanvas.height) / 12000;
            for (let i = 0; i < numberOfParticles; i++) {
                bgParticles.push(new BackgroundParticle());
            }
        }

        window.addEventListener('resize', () => {
            resizeBgCanvas();
            initBg();
        });

        initBg();
    }

    function updateBackgroundCanvas() {
        if (!bgCtx) return;

        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        for (const particle of bgParticles) {
            particle.update();
            particle.draw();
        }

        for (let i = 0; i < bgParticles.length; i++) {
            for (let j = i + 1; j < bgParticles.length; j++) {
                const p1 = bgParticles[i];
                const p2 = bgParticles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < bgLineMaxDistance) {
                    const lineOpacity = 1 - (distance / bgLineMaxDistance);
                    bgCtx.beginPath();
                    bgCtx.moveTo(p1.x, p1.y);
                    bgCtx.lineTo(p2.x, p2.y);
                    bgCtx.strokeStyle = `rgba(0, 255, 180, ${lineOpacity * 0.15})`;
                    bgCtx.lineWidth = 0.5;
                    bgCtx.stroke();
                }
            }
        }
    }

    const preloader = document.getElementById('preloader');
    const langButtons = document.querySelectorAll('.lang-btn');
    const bloomParticle = document.querySelector('.bloom-particle');
    const preloaderContent = document.querySelector('.preloader-content');

    // ==========================================================
    // PRELOADER ANIMATION TIMELINE
    // ==========================================================
    function runPreloaderAnimation() {
        bloomParticle.style.animation = 'pulse-glow 2s infinite ease-in-out';
        
        // Create the main GSAP timeline
        const tl = gsap.timeline();

        tl
            // Animate the particle into view and let it pulse for a bit
            .to(bloomParticle, { 
                opacity: 1, 
                duration: 1 
            })
            // Add a 1.5-second pause to let the pulse animation be seen
            .to({}, { duration: 1.5 }) 
            
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
     *  All GSAP animations
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

        gsap.from('.project-showcase-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.3,
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
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

    // Add click listeners to the language buttons
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.getAttribute('data-lang');
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
        Phase C: The Elastic String Cursor
       ========================================================================== */

    // Check if the user is on a touch device
    const isTouchDevice = 'ontouchstart' in window;

    if (!isTouchDevice) {
        // 1. SETUP
        const cursor = {
            element: null,
            path: null,
            points: [],
            mouse: { x: -100, y: -100 }, 
            lastMouse: { x: -100, y: -100 },
            position: { x: -100, y: -100 }, 
            velocity: { x: 0, y: 0 },
            size: 24, // The base diameter of the cursor
            stiffness: 0.77, // Spring stiffness
            damping: 0.23, // Damping factor
        };

        function setupCursor() {
            const svgNS = "http://www.w3.org/2000/svg";
            cursor.element = document.createElementNS(svgNS, "svg");
            cursor.element.setAttribute('class', 'elastic-cursor');
            cursor.element.setAttribute('viewBox', '0 0 100 100');
            cursor.element.setAttribute('width', '100');
            cursor.element.setAttribute('height', '100');

            cursor.path = document.createElementNS(svgNS, "path");
            cursor.element.appendChild(cursor.path);
            document.body.appendChild(cursor.element);

            // Create 8 points for a circle
            for (let i = 0; i < 8; i++) {
                cursor.points.push({ x: 50, y: 50 });
            }
            
            // Start the animation loop
            updateCursor();
        }

        // 2. THE PHYSICS & ANIMATION LOOP
        function updateCursor() {
            // Calculate spring forces
            const dx = cursor.mouse.x - cursor.position.x;
            const dy = cursor.mouse.y - cursor.position.y;
            const ax = dx * cursor.stiffness;
            const ay = dy * cursor.stiffness;

            // Apply acceleration to velocity, with damping
            cursor.velocity.x += ax;
            cursor.velocity.y += ay;
            cursor.velocity.x *= cursor.damping;
            cursor.velocity.y *= cursor.damping;

            // Update smoothed position
            cursor.position.x += cursor.velocity.x;
            cursor.position.y += cursor.velocity.y;

            // Shape Calculation 
            // Calculate stretch and rotation based on velocity
            const speed = Math.sqrt(cursor.velocity.x**2 + cursor.velocity.y**2);
            const stretch = Math.min(speed / 25, 1); // Adjusted sensitivity
            const angle = Math.atan2(cursor.velocity.y, cursor.velocity.x);
            
            const radius = cursor.size / 2;
            const svgCenter = 50; // The center of our 100x100 viewBox

            // Update the 8 points of our shape
            for (let i = 0; i < 8; i++) {
                const pointAngle = (i / 8) * 2 * Math.PI;
                
                // Add stretch effect to create an ellipse
                let stretchedRadius = radius;
                // Points on the axis of movement get stretched out
                if (i === 0 || i === 4) stretchedRadius += radius * stretch; 
                // Points perpendicular to movement get squashed
                if (i === 2 || i === 6) stretchedRadius -= radius * stretch * 0.5;

                // **THE FIX:** Calculate point positions relative to the SVG CENTER (50), not the absolute screen position.
                const targetX = svgCenter + Math.cos(pointAngle + angle) * stretchedRadius;
                const targetY = svgCenter + Math.sin(pointAngle + angle) * stretchedRadius;

                // Smoothly move the points towards their new target shape
                cursor.points[i].x += (targetX - cursor.points[i].x) * 0.5;
                cursor.points[i].y += (targetY - cursor.points[i].y) * 0.5;
            }

            // 3. GENERATE THE SVG PATH DATA
            // turn the 8 points into a smooth, curved path
            let pathData = `M ${cursor.points[0].x} ${cursor.points[0].y}`;
            for (let i = 1; i < 8; i++) {
                const midX = (cursor.points[i].x + cursor.points[(i + 1) % 8].x) / 2;
                const midY = (cursor.points[i].y + cursor.points[(i + 1) % 8].y) / 2;
                pathData += ` Q ${cursor.points[i].x} ${cursor.points[i].y}, ${midX} ${midY}`;
            }
            pathData += " Z";
            cursor.path.setAttribute("d", pathData);
            
            // Position the SVG container
            cursor.element.style.transform = `translate(${cursor.position.x - 50}px, ${cursor.position.y - 50}px)`;
        }

        // 4. EVENT LISTENERS
        window.addEventListener('mousemove', e => {
            cursor.mouse.x = e.clientX;
            cursor.mouse.y = e.clientY;
        });

        const interactiveElements = document.querySelectorAll('a, .btn, .lang-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => { /* Future hover effect logic here */ });
            el.addEventListener('mouseleave', () => { /* Future hover effect logic here */ });
        });

        setupCursor();
    }

    // ==========================================================
    // Master Animation Loop
    // ==========================================================
    function mainLoop() {
        if (canvas) {
            updateCanvas();
        }
        if (bgCanvas) {
            updateBackgroundCanvas();
        }
        if (!isTouchDevice) {
            updateCursor();
        }
        requestAnimationFrame(mainLoop);
    }
    setupBackgroundCanvas();
    mainLoop();
});