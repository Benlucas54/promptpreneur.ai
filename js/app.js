/* ============================================
   PROMPTPRENEUR.AI — Main Application Logic
   ============================================ */

// ====== CUSTOM CURSOR ======
const cursor = document.getElementById('cursor');
let cursorX = 0, cursorY = 0, clientX = 0, clientY = 0;
document.addEventListener('mousemove', (e) => { clientX = e.clientX; clientY = e.clientY; });
function updateCursor() {
  cursorX += (clientX - cursorX) * 0.12;
  cursorY += (clientY - cursorY) * 0.12;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(updateCursor);
}
updateCursor();
document.querySelectorAll('a, button, .service-card, .process-step, .test-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
});

// ====== MAGNETIC BUTTONS ======
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0, 0)'; });
});

// ====== SCROLL REVEALS ======
const revealEls = document.querySelectorAll('.reveal-up');
const staggerParents = document.querySelectorAll('.stagger-parent');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => observer.observe(el));
staggerParents.forEach(el => observer.observe(el));

// ====== COUNT-UP ======
const metricVals = document.querySelectorAll('[data-count]');
let metricsCounted = false;
const metricsObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !metricsCounted) {
      metricsCounted = true;
      metricVals.forEach(el => {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }
  });
}, { threshold: 0.3 });
const mg = document.getElementById('metricsGrid');
if (mg) metricsObs.observe(mg);

// ====== PARALLAX ORBS ======
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  document.querySelectorAll('.orb').forEach((o, i) => {
    o.style.transform = `translateY(${s * (i + 1) * 0.025}px)`;
  });
});

// ====== SMOOTH SCROLL ======
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ====== AMPLIFIED CURSOR GRADIENT ======
const cursorGradientEl = document.getElementById('cursorGradient');
if (cursorGradientEl) {
  const heroSection = document.querySelector('.hero');
  heroSection.addEventListener('mousemove', (e) => {
    const rect = cursorGradientEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cursorGradientEl.style.setProperty('--mx', x + 'px');
    cursorGradientEl.style.setProperty('--my', y + 'px');
  });
  heroSection.addEventListener('mouseleave', () => {
    cursorGradientEl.style.setProperty('--mx', '-200px');
    cursorGradientEl.style.setProperty('--my', '-200px');
  });
}

// ====== PORTRAIT PIXEL REVEAL ======
const aboutImg = document.querySelector('.about-img');
if (aboutImg) {
  aboutImg.addEventListener('mousemove', (e) => {
    const rect = aboutImg.getBoundingClientRect();
    aboutImg.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    aboutImg.style.setProperty('--my', (e.clientY - rect.top) + 'px');
  });
  aboutImg.addEventListener('mouseleave', () => {
    aboutImg.style.setProperty('--mx', '-200px');
    aboutImg.style.setProperty('--my', '-200px');
  });
}
