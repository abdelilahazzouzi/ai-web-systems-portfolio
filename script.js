// ═══════════════════════════════════════════════════
// FAQ Accordion — with ARIA support
// ═══════════════════════════════════════════════════
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            const btn = item.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isActive) {
            faqItem.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

// ═══════════════════════════════════════════════════
// Form Submission
// ═══════════════════════════════════════════════════
const leadForm = document.getElementById('leadForm');
if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalContent = btn.innerHTML;
        btn.innerHTML = 'Sending…';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        setTimeout(() => {
            btn.style.display = 'none';
            const success = document.getElementById('formSuccess');
            if (success) success.classList.remove('hidden');
        }, 1000);
    });
}

// ═══════════════════════════════════════════════════
// Smooth Scroll for anchor links
// ═══════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        // Close mobile nav if open
        closeMobileNav();

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = 70;
            const top = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ═══════════════════════════════════════════════════
// Mobile Navigation
// ═══════════════════════════════════════════════════
const hamburger = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav-overlay');
const mobileClose = document.getElementById('mobile-nav-close');

function openMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('active');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMobileNav);
if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
});

// ═══════════════════════════════════════════════════
// IntersectionObserver — Reveal Animations
// ═══════════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger siblings in the same grid
            const siblings = entry.target.parentElement
                ? Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'))
                : [];
            const delay = siblings.indexOf(entry.target) * 60;

            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Math.min(delay, 300));

            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ═══════════════════════════════════════════════════
// Spotlight Card Mouse Tracking
// ═══════════════════════════════════════════════════
document.querySelectorAll('.card, .pricing-card, .process-step, .faq-item, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

// ═══════════════════════════════════════════════════
// Text Scramble Effect
// ═══════════════════════════════════════════════════
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 20);
            const end = start + Math.floor(Math.random() * 20);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const logo = document.querySelector('.logo');
if (logo) {
    const scrambleLogo = new TextScramble(logo);
    scrambleLogo.setText('Abdelilah // AI Web Systems');
    logo.addEventListener('mouseenter', () => {
        scrambleLogo.setText('Abdelilah // AI Web Systems');
    });
}

// ═══════════════════════════════════════════════════
// Magnetic Buttons
// ═══════════════════════════════════════════════════
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-glass, .badge').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

// ═══════════════════════════════════════════════════
// Sticky CTA on Scroll
// ═══════════════════════════════════════════════════
const stickyCta = document.getElementById('sticky-cta');
if (stickyCta) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 600) {
                    stickyCta.classList.remove('hidden');
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                    if (window.scrollY < 100) {
                        stickyCta.classList.add('hidden');
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ═══════════════════════════════════════════════════
// Interactive Hero Canvas (Particle Network)
// ═══════════════════════════════════════════════════
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    let mouse = { x: null, y: null };
    let isTabActive = true;

    function resize() {
        width = canvas.parentElement.offsetWidth;
        height = canvas.parentElement.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numParticles = Math.min(Math.floor((width * height) / 15000), 100);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        if (!isTabActive) {
            requestAnimationFrame(animate);
            return;
        }
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Connect particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - dist / 120 * 0.15})`;
                    ctx.stroke();
                }
            }
            
            // Connect to mouse
            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - dist / 150 * 0.3})`;
                    ctx.stroke();
                    // Slight magnetic pull
                    particles[i].x -= dx * 0.01;
                    particles[i].y -= dy * 0.01;
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    
    // Mouse tracking for hero section specifically
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.parentElement.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    document.addEventListener('visibilitychange', () => {
        isTabActive = document.visibilityState === 'visible';
    });

    resize();
    animate();
}
