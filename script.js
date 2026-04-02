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

    // Tab Interface for Projects
    const tabs = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const target = tab.getAttribute('data-target');
            
            projectCards.forEach(card => {
                if (card.classList.contains(target) || target === 'all') {
                    card.classList.add('show');
                } else {
                    card.classList.remove('show');
                }
            });
        });
    });

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

        const color1 = new THREE.Color('#e5cba0'); // Cream
        const color2 = new THREE.Color('#8c111c'); // Burgundy

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
});
