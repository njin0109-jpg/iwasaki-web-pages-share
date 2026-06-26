(() => {
  'use strict';

  // ============================================
  // 1. Sticky header shadow on scroll
  // ============================================
  const header = document.getElementById('site-header');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('is-scrolled', window.scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================
  // 2. Hamburger / Mobile drawer
  // ============================================
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('mobile-drawer');
  const overlay    = document.getElementById('drawer-overlay');

  if (hamburger && drawer) {
    const toggleDrawer = (open) => {
      const willOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', willOpen);
      drawer.setAttribute('aria-hidden', String(!willOpen));
      hamburger.setAttribute('aria-expanded', String(willOpen));
      hamburger.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
      document.body.classList.toggle('is-drawer-open', willOpen);
    };

    hamburger.addEventListener('click', () => toggleDrawer());

    if (overlay) {
      overlay.addEventListener('click', () => toggleDrawer(false));
    }

    drawer.addEventListener('click', (e) => {
      if (e.target instanceof Element && e.target.closest('a')) {
        toggleDrawer(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        toggleDrawer(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && drawer.classList.contains('is-open')) {
        toggleDrawer(false);
      }
    });
  }

  // ============================================
  // 3. Fade-up Intersection Observer
  // ============================================
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx * 60, 360)}ms`;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach((el) => io.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ============================================
  // 4. Smooth anchor scroll (header offset)
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
