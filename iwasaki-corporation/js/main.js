(() => {
  'use strict';

  // Mark JS available — enables fade-up initial hidden state
  document.documentElement.classList.add('js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Sticky header shadow on scroll ---
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile drawer ---
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const body = document.body;

  const openDrawer = () => {
    if (!drawer || !hamburger) return;
    drawer.classList.add('is-open');
    overlay?.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    body.classList.add('scroll-lock');
  };

  const closeDrawer = () => {
    if (!drawer || !hamburger) return;
    drawer.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    body.classList.remove('scroll-lock');
  };

  hamburger?.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    expanded ? closeDrawer() : openDrawer();
  });

  overlay?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Close drawer when an internal link is tapped
  drawer?.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', closeDrawer);
  });

  // --- Fade-up on scroll ---
  const targets = document.querySelectorAll('[data-animate="fade-up"]');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((el) => io.observe(el));

    // Initial manual sweep — reveal anything already in the viewport,
    // covers headless renderers where IO may not auto-fire on first paint.
    const reveal = () => {
      const vh = window.innerHeight;
      targets.forEach((el) => {
        if (el.classList.contains('is-visible')) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh - 40 && r.bottom > 0) {
          el.classList.add('is-visible');
        }
      });
    };
    // Run after first paint
    requestAnimationFrame(() => requestAnimationFrame(reveal));
    // Belt-and-braces: also run after fonts/images settle (covers headless renderers)
    window.addEventListener('load', reveal);
    setTimeout(reveal, 300);
  }

  // --- Smooth scroll offset already handled via CSS scroll-margin-top ---

  // --- Auto-update copyright year if a [data-year] placeholder is present ---
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
