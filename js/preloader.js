/* ============================================
   PROMPTPRENEUR.AI — Preloader
   Pixel P logo build animation + Scale Pop Boomerang loop
   ============================================ */

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

  const container = document.getElementById('preloaderLogo');
  if (!container) return;

  const styleTag = document.createElement('style');
  let css = '';
  const loopBase = 3.5;
  let pixelIndex = 0;

  bodyRows.forEach((cols, row) => {
    cols.forEach((col, ci) => {
      const minScale = 0.1 + Math.random() * 0.15;
      css += `@keyframes pl_b${pixelIndex}{0%,100%{opacity:1;transform:scale(1)}15%{opacity:1;transform:scale(1)}35%{opacity:0.3;transform:scale(${minScale})}55%{opacity:1;transform:scale(1.08)}65%{opacity:1;transform:scale(1)}}`;
      pixelIndex++;
    });
  });

  dissolvePixels.forEach((p, i) => {
    const dx = (Math.random() - 0.5) * 16;
    const dy = 8 + Math.random() * 20;
    css += `@keyframes pl_d${i}{0%,100%{opacity:1;transform:translate(0,0) scale(1)}15%{opacity:1;transform:translate(0,0) scale(1)}35%{opacity:0;transform:translate(${dx}px,${dy}px) scale(0)}55%{opacity:0.8;transform:translate(${dx*0.1}px,${dy*0.1}px) scale(1.1)}65%{opacity:1;transform:translate(0,0) scale(1)}}`;
  });

  styleTag.textContent = css;
  container.appendChild(styleTag);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 130 195');
  svg.setAttribute('fill', 'none');
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('fill', '#1a1714');

  pixelIndex = 0;

  bodyRows.forEach((cols, row) => {
    cols.forEach((col, ci) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', col * S);
      rect.setAttribute('y', row * S);
      rect.setAttribute('width', S);
      rect.setAttribute('height', S);
      const entryDel = row * 0.03 + ci * 0.012;
      rect.style.opacity = '0';
      rect.style.animation = `preloaderEntry 0.5s cubic-bezier(0.16,1,0.3,1) ${entryDel}s forwards`;
      const waveDel = (row * 0.06 + ci * 0.04);
      const loopDur = loopBase + Math.random() * 0.6;
      rect.dataset.loop = `pl_b${pixelIndex} ${loopDur}s ease-in-out ${waveDel}s infinite`;
      g.appendChild(rect);
      pixelIndex++;
    });
  });

  dissolvePixels.forEach((p, i) => {
    const [col, row, size] = p;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', col * S);
    rect.setAttribute('y', row * S);
    rect.setAttribute('width', size);
    rect.setAttribute('height', size);
    const entryDel = row * 0.03 + i * 0.015 + 0.1;
    rect.style.opacity = '0';
    rect.style.animation = `preloaderEntry 0.5s cubic-bezier(0.16,1,0.3,1) ${entryDel}s forwards`;
    const waveDel = (row * 0.06 + (i % 5) * 0.08);
    const loopDur = loopBase + 0.3 + Math.random() * 0.8;
    rect.dataset.loop = `pl_d${i} ${loopDur}s ease-in-out ${waveDel}s infinite`;
    g.appendChild(rect);
  });

  svg.appendChild(g);
  container.appendChild(svg);

  // Transition from entry animation to looping animation
  setTimeout(() => {
    g.querySelectorAll('rect').forEach(el => {
      if (el.dataset.loop) {
        el.style.opacity = '1';
        el.style.animation = el.dataset.loop;
      }
    });
  }, 1600);

  // Dismiss preloader
  setTimeout(() => {
    document.getElementById('preloader').classList.add('done');
  }, 5200);
})();
