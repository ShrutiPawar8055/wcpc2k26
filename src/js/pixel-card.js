/* ================================================
   PIXEL-CARD.JS — React Bits style pixel hover effect
   https://reactbits.dev/components/pixel-card
   
   Renders a grid of small pixels over the card.
   On hover, pixels near the cursor light up.
   Remove this file to disable the pixel effect.
   ================================================ */

(function () {
  'use strict';

  const GRID_SIZE = 7;
  const PIXEL_COLORS = ['#4E9F3D', '#D8E9A8', '#1E5128'];

  document.querySelectorAll('[data-pixel-card]').forEach(card => {
    const overlay = document.createElement('div');
    overlay.className = 'pixel-card-overlay';
    overlay.style.gridTemplateColumns = 'repeat(' + GRID_SIZE + ', 1fr)';
    overlay.style.gridTemplateRows = 'repeat(' + GRID_SIZE + ', 1fr)';

    const pixels = [];

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const px = document.createElement('div');
      px.className = 'px';
      px.style.background = PIXEL_COLORS[i % PIXEL_COLORS.length];
      overlay.appendChild(px);
      pixels.push(px);
    }

    card.appendChild(overlay);

    card.addEventListener('mouseenter', () => card.classList.add('is-hovered'));
    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-hovered');
      pixels.forEach(p => p.classList.remove('is-visible'));
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * GRID_SIZE;
      const y = ((e.clientY - rect.top) / rect.height) * GRID_SIZE;

      pixels.forEach((p, i) => {
        const col = i % GRID_SIZE;
        const row = Math.floor(i / GRID_SIZE);
        const dist = Math.sqrt(Math.pow(col - x, 2) + Math.pow(row - y, 2));
        p.classList.toggle('is-visible', dist < 2.8);
      });
    });
  });

})();
