/* ── MAIN — observers, sidebar, cert modal, init ─── */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Fade-up IntersectionObserver ── */
    var fadeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          fadeObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-up').forEach(function (el) { fadeObs.observe(el); });

    /* ── Stack bars animate on visible ── */
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.stack-bar').forEach(function (b, i) {
            setTimeout(function () { b.classList.add('animated'); }, i * 80);
          });
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.stack-section > div').forEach(function (el) { barObs.observe(el); });

    /* ── Sidebar active dot tracking ── */
    var sections = document.querySelectorAll('section[id]');
    var dots = document.querySelectorAll('.side-dot');
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          dots.forEach(function (d) { d.classList.remove('active'); });
          var d = document.querySelector('.side-dot[data-s="' + e.target.id + '"]');
          if (d) d.classList.add('active');
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(function (s) { secObs.observe(s); });

    /* ── Init carousels ── */
    makeCarousel({
      carouselId: 'fcCarousel',
      dotsId:     'fcDots',
      prevId:     'fcPrev',
      nextId:     'fcNext',
      autoDelay:  3500
    });

    /* ── Certificate modal ── */
    var modal    = document.getElementById('certModal');
    var frame    = document.getElementById('cert-frame');
    var frameTitle = document.getElementById('cert-modal-title');

    window.openCertModal = function (src, label) {
      if (!modal || !frame) return;
      frame.src = src;
      if (frameTitle) frameTitle.textContent = label || 'Certificado';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      modal.focus();
    };

    window.closeCertModal = function () {
      if (!modal) return;
      modal.classList.remove('open');
      frame.src = '';
      document.body.style.overflow = '';
    };

    if (modal) {
      // Close on backdrop click
      modal.addEventListener('click', function (e) {
        if (e.target === modal) window.closeCertModal();
      });
      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
          window.closeCertModal();
        }
      });
    }

  });

})();
