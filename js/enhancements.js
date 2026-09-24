/* ==========================================================================
   Jinyuanh.com - Enhancements Module
   Cursor effects, scroll progress, glitch text, magnetic buttons
   ========================================================================== */

(function() {
    'use strict';

    // Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#00e5ff,#7c4dff);z-index:9999;width:0;transition:width 0.1s;pointer-events:none;';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = Math.min(100, (window.scrollY / winHeight) * 100);
        progressBar.style.width = percent + '%';
    });

    // Custom Cursor (desktop)
    if (window.innerWidth > 1024) {
        const cursor = document.createElement('div');
        cursor.style.cssText = 'position:fixed;width:24px;height:24px;border:2px solid #00e5ff;border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform 0.1s,width 0.2s,height 0.2s;mix-blend-mode:difference;';
        const cursorDot = document.createElement('div');
        cursorDot.style.cssText = 'position:fixed;width:4px;height:4px;background:#00e5ff;border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform 0.15s;';
        document.body.appendChild(cursor);
        document.body.appendChild(cursorDot);

        let mx = 0, my = 0;
        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            cursorDot.style.left = mx + 'px';
            cursorDot.style.top = my + 'px';
        });

        let cx = 0, cy = 0;
        const animateCursor = () => {
            cx += (mx - cx) * 0.15;
            cy += (my - cy) * 0.15;
            cursor.style.left = cx + 'px';
            cursor.style.top = cy + 'px';
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        document.querySelectorAll('a, button, .card, .service-tile').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.borderColor = '#7c4dff';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '24px';
                cursor.style.height = '24px';
                cursor.style.borderColor = '#00e5ff';
            });
        });
    }

    // Glitch Text Effect on .gradient-text hover
    document.querySelectorAll('.gradient-text').forEach(el => {
        el.addEventListener('mouseenter', () => {
            const original = el.textContent;
            let iterations = 0;
            const chars = '!<>-_\\/[]{}—=+*^?#';
            const interval = setInterval(() => {
                el.textContent = original.split('').map((c, i) => {
                    if (i < iterations) return original[i];
                    if (c === ' ') return ' ';
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                iterations += 1/3;
                if (iterations >= original.length) {
                    clearInterval(interval);
                    el.textContent = original;
                }
            }, 30);
        });
    });

    // Magnetic Buttons
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.25) + 'px)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // Section Number Counters (data-counter attribute)
    document.querySelectorAll('[data-counter]').forEach(el => {
        const target = parseInt(el.dataset.counter, 10);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const startTime = performance.now();
                    const duration = 1500;
                    const update = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target).toLocaleString();
                        if (progress < 1) requestAnimationFrame(update);
                    };
                    requestAnimationFrame(update);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(el);
    });

    // Keyboard: 'g' for go home
    document.addEventListener('keydown', (e) => {
        if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
            const tag = document.activeElement ? document.activeElement.tagName : '';
            if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
                window.location.href = 'index.html';
            }
        }
    });

    // Easter Egg: rainbow on Konami code
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                document.body.style.animation = 'rainbowShift 3s linear';
                const style = document.createElement('style');
                style.textContent = '@keyframes rainbowShift{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}';
                document.head.appendChild(style);
                setTimeout(() => { document.body.style.animation = ''; }, 3000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

})();