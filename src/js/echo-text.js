/* ================================================
   ECHO-TEXT.JS — React Bits Echo Text Effect (Vanilla JS)
   
   Animates echoes behind text based on entrance & cursor position.
   ================================================ */

(function () {
  'use strict';

  const directionVectors = {
    right: { x: 1, y: 0 },
    left: { x: -1, y: 0 },
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    diagonal: { x: 0.72, y: 0.72 }
  };

  const easing = {
    linear: t => t,
    'ease-out': t => 1 - Math.pow(1 - t, 3),
    'ease-in-out': t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    snappy: t => 1 - Math.pow(1 - t, 5)
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function initEchoText(el) {
    const text = el.getAttribute('data-echo-text') || el.textContent.trim();
    const echoes = parseInt(el.getAttribute('data-echoes') || '12', 10);
    const lag = parseFloat(el.getAttribute('data-lag') || '0.24');
    const offset = parseFloat(el.getAttribute('data-offset') || '36');
    const direction = el.getAttribute('data-direction') || 'right';
    const fade = parseFloat(el.getAttribute('data-fade') || '0.72');
    const blur = parseFloat(el.getAttribute('data-blur') || '3');
    const tint = el.getAttribute('data-tint') || '#61d348';
    const mode = el.getAttribute('data-mode') || 'both';
    const cursorRadius = parseFloat(el.getAttribute('data-cursor-radius') || '320');
    const duration = parseFloat(el.getAttribute('data-duration') || '900');
    const ease = el.getAttribute('data-ease') || 'ease-out';
    const color = el.getAttribute('data-color') || '#D8E9A8';

    el.textContent = '';
    el.classList.add('echo-text');

    const copyRefs = [];
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const echoCount = prefersReducedMotion ? 0 : clamp(echoes, 0, 24);

    // Render echo layers (from highest echo index down to 1)
    for (let index = echoCount; index >= 1; index--) {
      const span = document.createElement('span');
      span.setAttribute('aria-hidden', 'true');
      span.className = 'echo-text__echo';
      span.setAttribute('data-echo-index', index);
      span.textContent = text;
      const mixPercent = Math.min(72, 18 + index * 5);
      span.style.color = tint ? `color-mix(in srgb, ${tint} ${mixPercent}%, ${color})` : color;
      span.style.opacity = '0';
      el.appendChild(span);
      copyRefs[index] = span;
    }

    // Render front main layer (index 0)
    const frontSpan = document.createElement('span');
    frontSpan.className = 'echo-text__echo echo-text__echo--front';
    frontSpan.setAttribute('data-echo-index', '0');
    frontSpan.textContent = text;
    el.appendChild(frontSpan);
    copyRefs[0] = frontSpan;

    if (prefersReducedMotion) return;

    const vector = directionVectors[direction] || directionVectors.right;
    const safeOffset = clamp(offset, 0, 120);
    const safeCursorRadius = clamp(cursorRadius, 40, 1200);
    const safeLag = clamp(lag, 0.02, 0.5);
    const safeFade = clamp(fade, 0.1, 0.95);
    const safeBlur = clamp(blur, 0, 16);
    const safeDuration = Math.max(0, duration);
    const easeFn = easing[ease] || easing['ease-out'];
    const entranceEnabled = mode === 'entrance' || mode === 'both';
    const pointerEnabled = mode === 'pointer' || mode === 'both';

    const positions = Array.from({ length: echoCount + 1 }, (_, index) => {
      const entranceAmount = entranceEnabled ? safeOffset * (index + 0.35) : 0;
      return { x: vector.x * entranceAmount, y: vector.y * entranceAmount };
    });

    const state = {
      targetX: 0,
      targetY: 0,
      lastTargetX: 0,
      lastTargetY: 0,
      activity: entranceEnabled ? 1 : 0,
      positions,
      startTime: performance.now()
    };

    let canHover = false;
    if (pointerEnabled && window.matchMedia) {
      canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }

    function handlePointerMove(e) {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const reach = distance > 0 ? clamp(distance / safeCursorRadius, 0, 1) : 0;
      const dirX = distance > 0 ? deltaX / distance : 0;
      const dirY = distance > 0 ? deltaY / distance : 0;

      state.targetX = dirX * reach * safeOffset;
      state.targetY = dirY * reach * safeOffset * 0.72;
    }

    function handlePointerLeave() {
      state.targetX = 0;
      state.targetY = 0;
    }

    if (canHover) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      document.addEventListener('pointerleave', handlePointerLeave);
    }

    function renderFrame(now) {
      const elapsed = now - state.startTime;
      const entranceProgress = entranceEnabled && safeDuration > 0 ? clamp(elapsed / safeDuration, 0, 1) : 1;
      const easedEntrance = easeFn(entranceProgress);
      const entranceRest = entranceEnabled ? 1 - easedEntrance : 0;
      const targetVelocity = Math.hypot(state.targetX - state.lastTargetX, state.targetY - state.lastTargetY);

      state.lastTargetX = state.targetX;
      state.lastTargetY = state.targetY;

      let maxSeparation = 0;

      for (let index = 0; index <= echoCount; index++) {
        const copy = copyRefs[index];
        const current = state.positions[index];
        if (!copy || !current) continue;

        const entranceAmount = entranceRest * safeOffset * (index + 0.35);
        const desiredX = state.targetX + vector.x * entranceAmount;
        const desiredY = state.targetY + vector.y * entranceAmount;
        const lerp = clamp(0.34 / (1 + index * safeLag * 4.2), 0.018, 0.36);

        current.x += (desiredX - current.x) * lerp;
        current.y += (desiredY - current.y) * lerp;

        copy.style.transform = `translate3d(${current.x.toFixed(3)}px, ${current.y.toFixed(3)}px, 0)`;

        if (index > 0) {
          const front = state.positions[0];
          const separation = front ? Math.hypot(current.x - front.x, current.y - front.y) : 0;
          maxSeparation = Math.max(maxSeparation, separation);
          const depth = echoCount ? index / echoCount : 0;
          copy.style.filter = safeBlur > 0 ? `blur(${(safeBlur * depth).toFixed(2)}px)` : 'none';
        }
      }

      const separationActivity = safeOffset > 0 ? clamp(maxSeparation / (safeOffset * 2.25), 0, 1) : 0;
      const targetActivity = safeOffset > 0 ? clamp(targetVelocity / (safeOffset * 0.35), 0, 1) : 0;
      const nextActivity = Math.max(entranceRest, separationActivity, targetActivity);
      state.activity += (nextActivity - state.activity) * 0.18;

      for (let index = 1; index <= echoCount; index++) {
        const copy = copyRefs[index];
        if (!copy) continue;
        copy.style.opacity = String(Math.pow(safeFade, index) * state.activity);
      }

      requestAnimationFrame(renderFrame);
    }

    requestAnimationFrame(renderFrame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('[data-echo-text-el]').forEach(initEchoText);
    });
  } else {
    document.querySelectorAll('[data-echo-text-el]').forEach(initEchoText);
  }
})();
