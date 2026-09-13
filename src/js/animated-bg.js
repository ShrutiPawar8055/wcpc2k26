/* ================================================
   ANIMATED-BG.JS — Lightweight floating particle background
   
   Adds subtle floating particles that drift upward
   to give the site a living, non-static feel.
   Remove this file to disable the animated background.
   ================================================ */

(function () {
  'use strict';

  const PARTICLE_COUNT = 30;
  const COLORS = ['rgba(78,159,61,0.15)', 'rgba(216,233,168,0.1)', 'rgba(30,81,40,0.12)'];

  const canvas = document.createElement('canvas');
  canvas.id = 'animatedBg';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let w, h;
  const particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: h + Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      speedY: -(0.15 + Math.random() * 0.35),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: 0.3 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  function init() {
    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = createParticle();
      p.y = Math.random() * h;
      particles.push(p);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < -20) {
        p.y = h + 20;
        p.x = Math.random() * w;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();

})();
