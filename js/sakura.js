// js/sakura.js - Cozy Atmospheric Floating Sakura Petals Canvas Effect

class SakuraCanvasEffect {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.petals = [];
        this.numPetals = 35;
        this.enabled = true;
        this.animationFrame = null;

        this.init();
        window.addEventListener('resize', () => this.resize());
    }

    init() {
        this.resize();
        this.petals = [];
        for (let i = 0; i < this.numPetals; i++) {
            this.petals.push(this.createPetal(true));
        }
        this.animate();
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createPetal(initial = false) {
        return {
            x: Math.random() * this.width,
            y: initial ? Math.random() * this.height : -20,
            size: Math.random() * 8 + 6,
            speedY: Math.random() * 0.8 + 0.4,
            speedX: Math.random() * 0.6 - 0.3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            opacity: Math.random() * 0.5 + 0.3,
            swingAngle: Math.random() * Math.PI * 2,
            swingSpeed: Math.random() * 0.03 + 0.01,
            color: Math.random() > 0.3 ? '#FFB7C5' : '#F4A261' // Sakura Soft Pink & Soft Autumn Amber
        };
    }

    drawPetal(p) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.globalAlpha = p.opacity;

        this.ctx.beginPath();
        // Draw delicate sakura petal shape
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
        this.ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
        
        this.ctx.fillStyle = p.color;
        this.ctx.fill();

        // Soft inner glow stroke
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();

        this.ctx.restore();
    }

    animate() {
        if (!this.enabled) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            return;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.petals.length; i++) {
            let p = this.petals[i];

            p.swingAngle += p.swingSpeed;
            p.x += p.speedX + Math.sin(p.swingAngle) * 0.5;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;

            // Reset petal when it falls below screen
            if (p.y > this.height + 20 || p.x < -20 || p.x > this.width + 20) {
                this.petals[i] = this.createPetal(false);
            }

            this.drawPetal(p);
        }

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    toggle(state) {
        this.enabled = state;
        if (state) {
            if (!this.animationFrame) this.animate();
        } else {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }
}
