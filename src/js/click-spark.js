/* ================================================
   CLICK-SPARK.JS — React Bits style click spark burst
   https://reactbits.dev/animations/click-spark
   
   Adds a burst of particles on click anywhere on
   elements with [data-click-spark].
   Remove this file to disable the spark effect.
   ================================================ */

(function () {
  'use strict';

  const PARTICLE_COUNT = 12;
  const SPARK_COLORS = ['#4E9F3D', '#D8E9A8', '#1E5128', '#ECF2E3'];

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-click-spark]');
    if (!target) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'click-spark-particle';

      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5;
      const distance = 30 + Math.random() * 50;
      const size = 3 + Math.random() * 4;

      particle.style.left = e.clientX + 'px';
      particle.style.top = e.clientY + 'px';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
      particle.style.setProperty('--sx', Math.cos(angle) * distance + 'px');
      particle.style.setProperty('--sy', Math.sin(angle) * distance + 'px');

      document.body.appendChild(particle);

      particle.addEventListener('animationend', () => particle.remove());
    }
  });

})();
