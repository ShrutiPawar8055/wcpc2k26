/* ================================================
   MAIN.JS — Navigation, Gallery, Card Flip, Back-to-top
   ================================================ */

(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const isOpen = mainNav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  /* ---------- Fact card flip ---------- */
  document.querySelectorAll('.fact-card').forEach(card => {
    card.addEventListener('click', () => {
      const isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-expanded', isFlipped);
      const back = card.querySelector('.fact-face--back');
      if (back) back.setAttribute('aria-hidden', !isFlipped);
    });
  });

  /* ---------- Gallery slider ---------- */
  const viewport = document.getElementById('galleryViewport');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const dotsWrap = document.getElementById('galleryDots');

  if (viewport && dotsWrap) {
    const slides = Array.from(viewport.querySelectorAll('.gallery-slide'));
    let current = 0;
    let animating = false;

    function buildDots() {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(index, direction) {
      if (animating || index === current) return;
      animating = true;

      const oldSlide = slides[current];
      const newSlide = slides[index];

      oldSlide.classList.remove('is-active');
      oldSlide.style.display = 'none';

      newSlide.style.display = 'flex';
      newSlide.classList.add('is-active');

      const dir = direction !== undefined ? direction : (index > current ? 'right' : 'left');
      newSlide.classList.add('anim-' + dir);

      const dots = dotsWrap.querySelectorAll('.dot');
      dots[current].classList.remove('is-active');
      dots[index].classList.add('is-active');

      current = index;

      setTimeout(() => {
        newSlide.classList.remove('anim-right', 'anim-left');
        animating = false;
      }, 850);
    }

    function next() {
      goTo((current + 1) % slides.length, 'right');
    }

    function prev() {
      goTo((current - 1 + slides.length) % slides.length, 'left');
    }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    buildDots();
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
