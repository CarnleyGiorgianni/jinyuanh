/* ==========================================================================
   Jinyuanh.com - Main JavaScript
   ========================================================================== */

(function() {
    'use strict';

    // Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingPercent = document.getElementById('loading-percent');
    const loadingText = document.getElementById('loading-text');

    if (loadingScreen && loadingBar) {
        const loadSteps = [
            { text: 'INITIALIZING SYSTEM', percent: 15 },
            { text: 'LOADING NEURAL NETWORK', percent: 35 },
            { text: 'CONNECTING DATA STREAMS', percent: 55 },
            { text: 'COMPILING PRIVACY MODULES', percent: 75 },
            { text: 'OPTIMIZING UI COMPONENTS', percent: 90 },
            { text: 'READY', percent: 100 }
        ];

        let currentStep = 0;
        const loadingInterval = setInterval(() => {
            if (currentStep < loadSteps.length) {
                const step = loadSteps[currentStep];
                loadingBar.style.width = step.percent + '%';
                loadingPercent.textContent = step.percent + '%';
                loadingText.textContent = step.text;
                currentStep++;
            } else {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => loadingScreen.remove(), 600);
                }, 300);
            }
        }, 350);
    }

    // Navigation
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('svg');
            if (navMenu.classList.contains('active')) {
                icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
            } else {
                icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
            }
        });
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) navMenu.classList.remove('active');
            });
        });
    }

    // Reveal animations
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // Counters
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10);
                    const suffix = el.dataset.suffix || '';
                    const duration = 2000;
                    const startTime = performance.now();
                    const update = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
                        if (progress < 1) requestAnimationFrame(update);
                    };
                    requestAnimationFrame(update);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.3 });
        counters.forEach(c => counterObserver.observe(c));
    }

    // Bars
    const bars = document.querySelectorAll('.bar');
    if (bars.length > 0) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const height = bar.dataset.height || '50';
                    bar.style.height = '0%';
                    setTimeout(() => {
                        bar.style.transition = 'height 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                        bar.style.height = height + '%';
                    }, 100);
                    barObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.2 });
        bars.forEach(b => barObserver.observe(b));
    }

    // Particles Canvas
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });

        const init = () => {
            resize();
            particles = [];
            const count = Math.min(80, Math.floor(window.innerWidth / 18));
            for (let i = 0; i < count; i++) particles.push(createParticle());
        };

        const connect = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.strokeStyle = 'rgba(0, 229, 255, ' + (0.15 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.fillStyle = 'rgba(0, 229, 255, ' + p.opacity + ')';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            connect();
            animationId = requestAnimationFrame(animate);
        };

        const start = () => {
            if (window.innerWidth > 768) {
                if (!animationId) animate();
            } else {
                if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
            }
        };

        init();
        start();
        window.addEventListener('resize', () => { init(); start(); });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name') || '';
            const email = formData.get('email') || '';
            const message = formData.get('message') || '';
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            const subject = encodeURIComponent('[Jinyuanh.com] Inquiry from ' + name);
            const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
            window.location.href = 'mailto:contact@jinyuanh.com?subject=' + subject + '&body=' + body;
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    console.log('%c jinyuanh.com', 'color:#00e5ff;font-size:18px;font-weight:bold;font-family:monospace');

})();
