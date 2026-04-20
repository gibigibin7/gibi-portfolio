document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle logic
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu when a link is clicked
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
            const targetElem = document.querySelector(this.getAttribute('href'));
            if (targetElem) {
                targetElem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // If clicking a hero category, activate the corresponding tab
            if (this.classList.contains('num-block')) {
                const tabTarget = this.getAttribute('data-target');
                const tabBtn = document.querySelector(`.tab-btn[data-target="${tabTarget}"]`);
                if (tabBtn) tabBtn.click();
            }
        });
    });

    // --- Audio Synthesis for Luxury Pop ---
    let audioCtx = null;
    async function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }
        return audioCtx;
    }

    // Unlock audio on first interaction
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });

    function playLuxuryPop() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }

    function playSlideWhoosh() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.8);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.4);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.8);
    }

    function playLetterTick() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1500, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.03);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.03);
    }

    // Tab Interface for Projects
    const tabs = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');
    let soundTimeouts = []; // Track active sound timers to clear them on rapid click
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;

            // Trigger Audio wake-up in background (NO await)
            initAudio();

            const target = tab.getAttribute('data-target');
            
            // Clear any pending sounds from previous clicks
            soundTimeouts.forEach(t => clearTimeout(t));
            soundTimeouts = [];

            // Phase 1: High-Performance Reset
            // Only reset cards that are actually relevant or visible to save CPU
            projectCards.forEach(card => {
                if (card.classList.contains('show') || card.classList.contains('active')) {
                    card.classList.remove('show');
                    card.style.animation = 'none';
                    void card.offsetWidth; // Force reflow only for these
                }
            });

            // Update tab buttons
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Phase 2: Instant Reveal
            requestAnimationFrame(() => {
                revealNewCards(target);
            }); 
        });
    });

    function revealNewCards(target) {
        let count = 0;
        let soundCount = 0;
        const staggerDelay = 0.06; // Faster stagger for snappier feel

        projectCards.forEach(card => {
            if (card.classList.contains(target) || target === 'all') {
                const delay = count * staggerDelay;
                card.style.animation = `pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards, floating 4s ease-in-out ${delay + 0.5}s infinite`;
                card.classList.add('show');
                
                // Play sound capped to first 5 cards
                // Only play if audio context exists and is running (catch-up logic)
                if (soundCount < 5) {
                    const timer = setTimeout(() => {
                        if (audioCtx && audioCtx.state === 'running') {
                            playLuxuryPop();
                        }
                    }, delay * 1000);
                    soundTimeouts.push(timer);
                    soundCount++;
                }
                
                count++;
            }
        });
    }

    // Initial load state: Show Video Editing by default
    revealNewCards('video');

    // Direct link to YouTube Logic
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            if(card.hasAttribute('data-video') && card.getAttribute('data-video') !== "your_video_link_here") {
                let videoLink = card.getAttribute('data-video');
                // Convert embed link to watch link
                try {
                    if (videoLink.includes('/embed/')) {
                        const urlObj = new URL(videoLink);
                        const videoId = urlObj.pathname.split('/').pop();
                        videoLink = `https://www.youtube.com/watch?v=${videoId}`;
                    }
                } catch (e) {
                    console.error("Invalid video URL", e);
                }
                window.open(videoLink, '_blank');
            } else if(card.hasAttribute('data-link')) {
                window.open(card.getAttribute('data-link'), '_blank');
            }
        });
    });

    // Animate skills progress bars on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress');
                if (progressBar) {
                    const width = progressBar.style.width;
                    progressBar.style.width = '0';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 100);
                }
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.skill').forEach(skill => {
        observer.observe(skill);
    });

    // Highlight active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active-nav'));
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active-nav');
                }
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(sec => navObserver.observe(sec));

    // Floating Parallax Icons Logic
    const floatingIcons = document.querySelectorAll('.floating-icon');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                floatingIcons.forEach((icon, index) => {
                    const speed = parseFloat(icon.getAttribute('data-speed'));
                    // Add subtle tumbling rotation alongside parallax translation
                    const rotation = lastScrollY * speed * 0.2 + (index * 15); 
                    icon.style.transform = `translateY(${lastScrollY * speed}px) rotate(${rotation}deg)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initialize 3D Tilt Effect on Project Cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".project-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.3,
        });
    }

    // Initialize Three.js WebGL Particle Background
    const canvas = document.getElementById('bg-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        const color1 = new THREE.Color('#6D001A'); // Burgundy
        const color2 = new THREE.Color('#B5AC8A'); // Dusty Olive

        for(let i = 0; i < particlesCount * 3; i+=3) {
            // Position
            posArray[i] = (Math.random() - 0.5) * 10;
            posArray[i+1] = (Math.random() - 0.5) * 10;
            posArray[i+2] = (Math.random() - 0.5) * 10;

            // Color mix
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colorArray[i] = mixedColor.r;
            colorArray[i+1] = mixedColor.g;
            colorArray[i+2] = mixedColor.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        // Material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        // Mesh
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 3;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        const clock = new THREE.Clock();

        const tick = () => {
            const elapsedTime = clock.getElapsedTime();

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
            particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
            // Constant rotation disabled so particles only move with mouse
            // particlesMesh.rotation.z = -0.1 * elapsedTime;

            renderer.render(scene, camera);
            window.requestAnimationFrame(tick);
        };

        tick();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Contact Form Logic
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('contactSubmit');
    const submitText = document.getElementById('submitText');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            
            // UI feedback
            submitBtn.disabled = true;
            submitText.textContent = 'Sending...';
            formStatus.style.display = 'none';

            // Send Email via FormSubmit AJAX API
            fetch("https://formsubmit.co/ajax/gibingibin7@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: `New Portfolio Message from ${name}`
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    formStatus.textContent = 'Message sent successfully! Redirecting to WhatsApp...';
                    formStatus.style.color = '#4ade80';
                    formStatus.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Format message for WhatsApp
                    const waText = encodeURIComponent(`Hello Gibin,\n\nI just reached out from your portfolio website.\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:*\n${message}`);
                    
                    // Redirect to WhatsApp
                    setTimeout(() => {
                        window.open(`https://wa.me/919074693735?text=${waText}`, '_blank');
                    }, 1500);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.textContent = 'Oops! Something went wrong. Please try again.';
                formStatus.style.color = '#f87171';
                formStatus.style.display = 'block';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitText.textContent = 'Send Message';
            });
        });
    }

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Instant position for the dot
        if (cursorDot) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        }

        // Smooth position for the outline
        if (cursorOutline) {
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        }
    });

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .tab-btn, .num-block, .logo');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) cursorOutline.classList.add('cursor-hover');
            if (cursorDot) cursorDot.classList.add('cursor-hover-dot');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) cursorOutline.classList.remove('cursor-hover');
            if (cursorDot) cursorDot.classList.remove('cursor-hover-dot');
        });
    });

    const heroImage = document.querySelector('.hero-image');

    function startEntranceAnimations() {
        // --- Letter-by-Letter Name Animation ---
        const nameElement = document.querySelector('.name-gradient');
        if (nameElement) {
            const text = nameElement.getAttribute('data-name') || nameElement.textContent;
            nameElement.setAttribute('data-name', text); // Store original
            nameElement.textContent = '';
            
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char; // Handle spaces
                const delay = i * 0.05 + 0.5; // Start after 0.5s for clean entrance
                span.style.animationDelay = `${delay}s`;
                span.className = 'letter';
                nameElement.appendChild(span);

                // Attempt sparkle sound (may be blocked by browser on first load)
                setTimeout(() => {
                    if (audioCtx && audioCtx.state === 'running') playLetterTick();
                }, delay * 1000);
            });
        }

        // --- Profile Picture Animation ---
        setTimeout(() => {
            if (heroImage) heroImage.classList.add('animate');
            if (audioCtx && audioCtx.state === 'running') playSlideWhoosh();
        }, 1200); 
    }

    // Start immediately on load
    startEntranceAnimations();
});

