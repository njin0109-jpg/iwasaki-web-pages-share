(() => {
  'use strict';

  // ===========================================
  // 1. Hamburger / Mobile drawer
  // ===========================================
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const body = document.body;

  if (hamburger && drawer) {
    const toggleDrawer = (open) => {
      const willOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', willOpen);
      drawer.setAttribute('aria-hidden', String(!willOpen));
      hamburger.setAttribute('aria-expanded', String(willOpen));
      hamburger.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
      body.classList.toggle('is-drawer-open', willOpen);
    };

    hamburger.addEventListener('click', () => toggleDrawer());

    drawer.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof Element && target.closest('a')) {
        toggleDrawer(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        toggleDrawer(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && drawer.classList.contains('is-open')) {
        toggleDrawer(false);
      }
    });
  }

  // ===========================================
  // 2. Fade-up Intersection Observer
  // ===========================================
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // stagger slightly within the same section
          const idx = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx * 60, 360)}ms`;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach((el) => io.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ===========================================
  // 3. Destination slider (mobile only — scroll-snap row)
  // ===========================================
  const destGrid = document.getElementById('destination-grid');
  const destPrev = document.querySelector('[data-dest-prev]');
  const destNext = document.querySelector('[data-dest-next]');

  if (destGrid && destPrev && destNext) {
    const scrollByCard = (direction) => {
      const card = destGrid.querySelector('.destination-card');
      if (!card) return;
      const gap = parseInt(getComputedStyle(destGrid).columnGap || '14', 10);
      const step = card.offsetWidth + (isNaN(gap) ? 14 : gap);
      destGrid.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    destPrev.addEventListener('click', () => scrollByCard(-1));
    destNext.addEventListener('click', () => scrollByCard(1));

    // On large screens, grid layout has no scroll – fall back to subtle nudge
    // by adjusting which card the user is viewing visually (no-op when no overflow).
  }

  // ===========================================
  // 4. Cases slider (all sizes — arrows + dots)
  // ===========================================
  const caseGrid = document.getElementById('case-grid');
  const casesPrev = document.querySelector('[data-cases-prev]');
  const casesNext = document.querySelector('[data-cases-next]');
  const dotsContainer = document.getElementById('cases-dots');

  if (caseGrid && dotsContainer) {
    const cards = Array.from(caseGrid.querySelectorAll('.case-card'));

    // Build dot set: number of "pages" depends on viewport
    const buildDots = () => {
      dotsContainer.innerHTML = '';
      const visiblePerPage = getVisiblePerPage();
      const pageCount = Math.max(1, Math.ceil(cards.length / visiblePerPage));
      for (let i = 0; i < pageCount; i++) {
        const btn = document.createElement('button');
        btn.className = 'slider-dot' + (i === 0 ? ' is-active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', `ページ ${i + 1}`);
        btn.dataset.page = String(i);
        btn.addEventListener('click', () => goToPage(i));
        dotsContainer.appendChild(btn);
      }
    };

    const getVisiblePerPage = () => {
      const w = window.innerWidth;
      if (w <= 768) return 1;
      if (w <= 960) return 2;
      return 4;
    };

    const getStep = () => {
      const card = cards[0];
      if (!card) return 0;
      const gap = parseInt(getComputedStyle(caseGrid).columnGap || '22', 10);
      return card.offsetWidth + (isNaN(gap) ? 22 : gap);
    };

    const goToPage = (page) => {
      const visiblePerPage = getVisiblePerPage();
      const step = getStep();
      caseGrid.scrollTo({ left: page * step * visiblePerPage, behavior: 'smooth' });
    };

    const updateActiveDot = () => {
      const visiblePerPage = getVisiblePerPage();
      const step = getStep();
      if (step === 0) return;
      const currentPage = Math.round(caseGrid.scrollLeft / (step * visiblePerPage));
      dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentPage);
      });
    };

    const scrollByPage = (direction) => {
      const visiblePerPage = getVisiblePerPage();
      const step = getStep();
      caseGrid.scrollBy({ left: direction * step * visiblePerPage, behavior: 'smooth' });
    };

    if (casesPrev) casesPrev.addEventListener('click', () => scrollByPage(-1));
    if (casesNext) casesNext.addEventListener('click', () => scrollByPage(1));

    let scrollTimer;
    caseGrid.addEventListener('scroll', () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(updateActiveDot, 80);
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        buildDots();
        updateActiveDot();
      }, 120);
    });

    buildDots();
  }

  // ===========================================
  // 5. Sticky-header shadow on scroll
  // ===========================================
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
})();
