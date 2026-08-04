// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Form Submission Mock
document.getElementById('leadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = 'Processing...';
    btn.style.opacity = '0.7';
    
    // Simulate network request
    setTimeout(() => {
        btn.style.display = 'none';
        document.getElementById('formSuccess').classList.remove('hidden');
    }, 1000);
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// --- React Bits Visual Animations ---

// 1. Squares Grid Canvas Animation
(() => {
    const canvas = document.getElementById('squares-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const squareSize = 48; // size of each grid square in pixels
    const gridColor = 'rgba(39, 39, 42, 0.15)'; // Zinc 800 with very low opacity
    const activeColor = 'rgba(255, 255, 255, 0.05)';

    let cols = Math.ceil(width / squareSize);
    let rows = Math.ceil(height / squareSize);

    const activeSquares = new Map(); // key: "col,row", value: { opacity, target, speed, state }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        cols = Math.ceil(width / squareSize);
        rows = Math.ceil(height / squareSize);
    });

    let mouseX = -9999;
    let mouseY = -9999;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouseX = -9999;
        mouseY = -9999;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Grid background fill
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Periodically select a random square to trigger a glowing flash animation
        if (Math.random() < 0.12) {
            const c = Math.floor(Math.random() * cols);
            const r = Math.floor(Math.random() * rows);
            const key = `${c},${r}`;
            if (!activeSquares.has(key)) {
                activeSquares.set(key, {
                    opacity: 0,
                    target: 0.08 + Math.random() * 0.06, // max opacity
                    speed: 0.0015 + Math.random() * 0.0025,
                    state: 'in' // 'in' or 'out'
                });
            }
        }

        // Render animated squares
        for (const [key, sq] of activeSquares.entries()) {
            const [c, r] = key.split(',').map(Number);

            if (sq.state === 'in') {
                sq.opacity += sq.speed;
                if (sq.opacity >= sq.target) {
                    sq.opacity = sq.target;
                    sq.state = 'out';
                }
            } else {
                sq.opacity -= sq.speed;
                if (sq.opacity <= 0) {
                    activeSquares.delete(key);
                    continue;
                }
            }

            ctx.fillStyle = `rgba(255, 255, 255, ${sq.opacity})`;
            ctx.fillRect(c * squareSize, r * squareSize, squareSize, squareSize);
        }

        // Highlight square under mouse & neighbors
        if (mouseX !== -9999 && mouseY !== -9999) {
            const mCol = Math.floor(mouseX / squareSize);
            const mRow = Math.floor(mouseY / squareSize);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.fillRect(mCol * squareSize, mRow * squareSize, squareSize, squareSize);

            // Subtle border outline of neighboring squares
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.lineWidth = 1;
            ctx.strokeRect((mCol - 1) * squareSize, (mRow - 1) * squareSize, squareSize * 3, squareSize * 3);
        }

        // Draw grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let c = 0; c <= cols; c++) {
            ctx.moveTo(c * squareSize, 0);
            ctx.lineTo(c * squareSize, height);
        }
        for (let r = 0; r <= rows; r++) {
            ctx.moveTo(0, r * squareSize);
            ctx.lineTo(width, r * squareSize);
        }
        ctx.stroke();

        requestAnimationFrame(animate);
    }

    animate();
})();

// 2. Spotlight Card Mouse Coordinates Tracking
document.querySelectorAll('.card, .pricing-card, .process-step, .faq-item').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 3. Decrypted / Scrambled Text Effect
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

// Scramble the logo text and hero title
const logo = document.querySelector('.logo');
if (logo) {
    const scrambleLogo = new TextScramble(logo);
    scrambleLogo.setText("Abdel // AI Web Systems");
    logo.addEventListener('mouseenter', () => {
        scrambleLogo.setText("Abdel // AI Web Systems");
    });
}

// 4. Magnetic Buttons / Elements
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-glass, .badge').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Pull towards cursor (12% intensity)
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});
