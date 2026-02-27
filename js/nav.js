/* ============================================
   PROMPTPRENEUR.AI — Navigation
   Scroll hide/show, blur, Pixel P logo + Scale Pop
   ============================================ */

// ====== NAV HIDE/SHOW + SCROLL BLUR ======
let lastScroll = 0;
const navOuter = document.getElementById('navOuter');
window.addEventListener('scroll', () => {
  const c = window.scrollY;
  if (c > lastScroll && c > 120) {
    navOuter.style.transform = 'translateY(-100%)';
  } else {
    navOuter.style.transform = 'translateY(0)';
  }
  if (c > 40) navOuter.classList.add('scrolled');
  else navOuter.classList.remove('scrolled');
  lastScroll = c;
});

// ====== NAV PIXEL P LOGO (SVG + Scale Pop Hover) ======
(function() {
  const S = 8;
  const bodyRows = [
    [1,2,3,4,5,6,7,8,9,10],
    [1,2,3,4,5,6,7,8,9,10,11],
    [1,2,3,4,5,6,7,8,9,10,11,12],
    [1,2,3,4,5,6,7,8,9,10,11,12,13],
    [1,2,3,4,5,6,7,8,9,10,11,12,13],
    [1,2,3,4,5,6,7,8,9,10,11,12,13],
    [1,2,3,4,5,6,7,8,9,10,11,12],
    [1,2,3,4,5,6,7,8,9,10,11],
    [1,2,3,4,5,6,7,8,9,10],
    [1,2,3,4,5,6,7,8,9],
    [1,2,3,4,5],
    [1,2,3,4,5],
    [1,2,3,4,5],
    [1,2,3,4,5],
  ];
  const dissolvePixels = [
    [1,14,8],[2,14,8],[4,14,8],[5,14,8],
    [1,15,8],[3,15,8],[4,15,8],[5,15,8],
    [1,16,8],[2,16,8],[4,16,8],
    [2,17,8],[3,17,8],[5,17,8],
    [1,18,7],[3,18,7],
    [2,19,6],[4,19,6],
    [1,20,6],[3,20,5],
    [2,21,5],[4,21,4],
    [1,22,4],[3,22,3],
  ];

  const svg = document.getElementById('navLogoSvg');
  if (!svg) return;
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('fill', '#1a1714');
  const allRects = [];

  bodyRows.forEach((cols, row) => {
    cols.forEach((col, ci) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', col * S);
      rect.setAttribute('y', row * S);
      rect.setAttribute('width', S);
      rect.setAttribute('height', S);
      rect.dataset.row = row;
      rect.dataset.col = ci;
      rect.dataset.type = 'body';
      g.appendChild(rect);
      allRects.push(rect);
    });
  });

  dissolvePixels.forEach((p) => {
    const [col, row, size] = p;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', col * S);
    rect.setAttribute('y', row * S);
    rect.setAttribute('width', size);
    rect.setAttribute('height', size);
    rect.dataset.row = row;
    rect.dataset.type = 'dissolve';
    rect.dataset.dx = ((Math.random() - 0.5) * 16).toFixed(2);
    rect.dataset.dy = (8 + Math.random() * 20).toFixed(2);
    g.appendChild(rect);
    allRects.push(rect);
  });

  svg.appendChild(g);

  // Scale Pop hover animation
  let animating = false;
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInQuad(t) { return t * t; }

  function animateScalePop() {
    if (animating) return;
    animating = true;

    const pixelData = allRects.map((rect) => {
      const row = parseInt(rect.dataset.row);
      const col = parseInt(rect.dataset.col || 0);
      const type = rect.dataset.type;
      const delay = (row * 25 + col * 15) + Math.random() * 40;
      const duration = 420 + Math.random() * 160;
      const minScale = 0.08 + Math.random() * 0.12;
      const dx = type === 'dissolve' ? parseFloat(rect.dataset.dx) : 0;
      const dy = type === 'dissolve' ? parseFloat(rect.dataset.dy) : 0;
      return { rect, delay, duration, minScale, type, dx, dy };
    });

    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      pixelData.forEach(({ rect, delay, duration, minScale, type, dx, dy }) => {
        const t = (elapsed - delay) / duration;
        if (t <= 0) return;
        else if (t < 0.45) {
          const p = easeInQuad(t / 0.45);
          const s = 1 - p * (1 - minScale);
          const o = 1 - p * 0.7;
          if (type === 'dissolve') {
            rect.setAttribute('transform', `translate(${dx * p} ${dy * p}) scale(${s})`);
          } else {
            const cx = parseFloat(rect.getAttribute('x')) + S / 2;
            const cy = parseFloat(rect.getAttribute('y')) + S / 2;
            rect.setAttribute('transform', `translate(${cx * (1 - s)} ${cy * (1 - s)}) scale(${s})`);
          }
          rect.setAttribute('opacity', o);
        } else if (t < 1) {
          const p = easeOutCubic((t - 0.45) / 0.55);
          const s = minScale + p * (1.06 - minScale);
          const sFinal = Math.min(s, 1.06);
          const o = 0.3 + p * 0.7;
          if (type === 'dissolve') {
            rect.setAttribute('transform', `translate(${dx * (1 - p)} ${dy * (1 - p)}) scale(${Math.min(sFinal, 1)})`);
          } else {
            const cx = parseFloat(rect.getAttribute('x')) + S / 2;
            const cy = parseFloat(rect.getAttribute('y')) + S / 2;
            rect.setAttribute('transform', `translate(${cx * (1 - sFinal)} ${cy * (1 - sFinal)}) scale(${sFinal})`);
          }
          rect.setAttribute('opacity', Math.min(o, 1));
        } else if (t < 1.15) {
          const p = (t - 1) / 0.15;
          const s = 1.06 - p * 0.06;
          if (type === 'dissolve') {
            rect.setAttribute('transform', '');
          } else {
            const cx = parseFloat(rect.getAttribute('x')) + S / 2;
            const cy = parseFloat(rect.getAttribute('y')) + S / 2;
            rect.setAttribute('transform', `translate(${cx * (1 - s)} ${cy * (1 - s)}) scale(${s})`);
          }
          rect.setAttribute('opacity', '1');
        } else {
          rect.setAttribute('transform', '');
          rect.setAttribute('opacity', '1');
        }
      });

      if (elapsed < 1400) {
        requestAnimationFrame(tick);
      } else {
        allRects.forEach(rect => {
          rect.setAttribute('transform', '');
          rect.setAttribute('opacity', '1');
        });
        animating = false;
      }
    }
    requestAnimationFrame(tick);
  }

  document.getElementById('logoLink').addEventListener('mouseenter', animateScalePop);
})();
