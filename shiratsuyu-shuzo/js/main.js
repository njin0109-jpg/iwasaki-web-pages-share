/* ============================================================
   main.js — Site Interactions
   本格芋焼酎 白露
============================================================ */

(() => {
  'use strict';

  /* ---- Sticky Header ---- */
  const header = document.querySelector('.site-header');
  if (header) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('is-scrolled', window.scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---- Hamburger / Mobile Drawer ---- */
  const hamburger = document.querySelector('.hamburger');
  const drawer    = document.querySelector('.mobile-drawer');
  if (hamburger && drawer) {
    const toggle = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !hamburger.classList.contains('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      drawer.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      drawer.setAttribute('aria-hidden', String(!isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => toggle());
    drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1024) toggle(false); });
  }

  /* ---- Fade-up IntersectionObserver ---- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblings = Array.from(el.parentElement.querySelectorAll('.fade-up'));
          const index = siblings.indexOf(el);
          el.style.transitionDelay = `${index * 80}ms`;
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Back to Top ---- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

})();
