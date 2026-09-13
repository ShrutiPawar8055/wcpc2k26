/* ================================================
   STROKE-TEXT.JS — React Bits style stroke text animation
   https://reactbits.dev/text-animations/stroke-text
   
   Wraps each character in [data-stroke-text] in a span
   with a staggered animation delay for a fill-in effect.
   Remove this file to disable the stroke text animation.
   ================================================ */

(function () {
  'use strict';

  document.querySelectorAll('[data-stroke-text]').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);

    Array.from(text).forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'stroke-char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.setProperty('--char-delay', (i * 0.04) + 's');
      el.appendChild(span);
    });
  });

})();
