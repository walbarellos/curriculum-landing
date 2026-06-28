/* ── CAROUSEL FACTORY ────────────────────────────── */
function makeCarousel({ carouselId, dotsId, prevId, nextId, autoDelay = 3500, counterEl = null }) {
  'use strict';
  const carousel = document.getElementById(carouselId);
  const dotsWrap = document.getElementById(dotsId);
  const prevBtn  = document.getElementById(prevId);
  const nextBtn  = document.getElementById(nextId);
  if (!carousel || !dotsWrap || !prevBtn || !nextBtn) return;

  const slides = Array.from(carousel.querySelectorAll('.fc-slide, .gal-slide'));
  const total  = slides.length;
  let current  = 0;
  let timer;

  // Build dots
  slides.forEach(function (sl, i) {
    const label = sl.dataset.label || String(i + 1);
    const d = document.createElement('button');
    d.className = 'fc-dot' + (i === 0 ? ' active' : '');
    d.title = label;
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', label);
    d.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    d.addEventListener('click', function () { clearAuto(); goTo(i); startAuto(); });
    dotsWrap.appendChild(d);
  });

  slides[0].classList.add('active');
  slides[0].setAttribute('aria-hidden', 'false');

  function goTo(idx) {
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    dotsWrap.children[current].classList.remove('active');
    dotsWrap.children[current].setAttribute('aria-selected', 'false');
    current = (idx + total) % total;
    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dotsWrap.children[current].classList.add('active');
    dotsWrap.children[current].setAttribute('aria-selected', 'true');
    if (counterEl) counterEl.textContent = (current + 1) + ' / ' + total;
  }

  prevBtn.addEventListener('click', function () { clearAuto(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', function () { clearAuto(); goTo(current + 1); startAuto(); });

  // Keyboard navigation on the carousel container
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { clearAuto(); goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { clearAuto(); goTo(current + 1); startAuto(); }
  });

  function startAuto() { timer = setInterval(function () { goTo(current + 1); }, autoDelay); }
  function clearAuto()  { clearInterval(timer); }

  startAuto();
}
