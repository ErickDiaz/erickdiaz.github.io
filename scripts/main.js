// Animations on scroll
AOS.init({
  anchorPlacement: 'top-left',
  duration: 800,
  once: true
});

// Sticky navbar scroll shadow
window.addEventListener('scroll', function () {
  const header = document.querySelector('header.navbar-main');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
});

document.addEventListener('DOMContentLoaded', function () {

  // ── GA4 event helpers ──────────────────────────────
  function gtagEvent(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }

  // CV download
  var cvBtn = document.querySelector('a[href="cv_print.html"]');
  if (cvBtn) {
    cvBtn.addEventListener('click', function () {
      gtagEvent('cv_download');
    });
  }

  // Hire Me CTA
  var hireMeBtn = document.querySelector('a.btn-info[href="#contact"]');
  if (hireMeBtn) {
    hireMeBtn.addEventListener('click', function () {
      gtagEvent('hire_me_click');
    });
  }

  // Contact form submit
  var contactForm = document.querySelector('form[action*="formspree"]');
  if (contactForm) {
    contactForm.addEventListener('submit', function () {
      gtagEvent('contact_form_submit');
    });
  }

  // Certificate modal views
  var certModal = document.getElementById('certModal');
  if (certModal) {
    certModal.addEventListener('show.bs.modal', function (event) {
      var button = event.relatedTarget;
      if (!button) return;
      var certTitle = button.closest('.card-body')
        ?.querySelector('.card-title')?.textContent?.trim();
      gtagEvent('certificate_view', { cert_name: certTitle || 'unknown' });
    });
  }

  // ── Mobile nav toggle ──────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const siteNav   = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      siteNav.classList.toggle('open');
    });
    siteNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('open');
      });
    });
  }

  // ── Dark mode toggle ───────────────────────────────
  const darkToggle = document.getElementById('darkToggle');
  const body       = document.body;

  function applyDark(isDark) {
    body.classList.toggle('dark', isDark);
    if (darkToggle) {
      darkToggle.innerHTML = isDark
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
      darkToggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  applyDark(localStorage.getItem('darkMode') === 'true');

  if (darkToggle) {
    darkToggle.addEventListener('click', function () {
      const isDark = !body.classList.contains('dark');
      localStorage.setItem('darkMode', isDark);
      applyDark(isDark);
    });
  }

  // ── Stats counter animation ────────────────────────
  const statEls = document.querySelectorAll('.stat-number[data-target]');

  if (statEls.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;  // ms
        const steps    = 50;
        const interval = duration / steps;
        let current = 0;

        el.textContent = '0' + suffix;

        const timer = setInterval(function () {
          current += target / steps;
          if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + suffix;
          }
        }, interval);

        counterObserver.unobserve(el);
      });
    }, { threshold: 0.6 });

    statEls.forEach(function (el) { counterObserver.observe(el); });
  }

  // ── Elapsed time for timeline entries ─────────────
  function calcElapsed(startStr, endStr) {
    var start = new Date(startStr + '-01');
    var end   = endStr === 'present' ? new Date() : new Date(endStr + '-01');

    var years  = end.getFullYear() - start.getFullYear();
    var months = end.getMonth()    - start.getMonth();
    if (months < 0) { years--; months += 12; }

    var parts = [];
    if (years  > 0) parts.push(years  + ' yr'  + (years  > 1 ? 's' : ''));
    if (months > 0) parts.push(months + ' mo'  + (months > 1 ? 's' : ''));
    return parts.length ? parts.join(' ') : '< 1 mo';
  }

  document.querySelectorAll('.elapsed-badge[data-start]').forEach(function (el) {
    var result = calcElapsed(el.dataset.start, el.dataset.end || 'present');
    el.textContent = '\u00b7 ' + result;   // · 3 yrs 4 mos
  });

});
