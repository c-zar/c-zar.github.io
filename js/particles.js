const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();

let particles = [];
const particleCount = 80; // Reduced for better performance

class Particle {
    constructor() {
        this.reset();
        this.size = Math.random() * 5 + 2;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = (Math.random() * 2 - 1) * 0.5;
        this.speedY = (Math.random() * 2 - 1) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset particle if it goes off-screen
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(157, 78, 221, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(157, 78, 221, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
        particle.update();
        particle.draw();
    }

    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    setCanvasSize();
    init();
});