document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navToggle = document.getElementById('navToggle');
  const navMenuWrap = document.getElementById('navMenuWrap');
  const navIndicator = document.getElementById('navIndicator');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  /* Mobile menu open/close */
  function closeMenu(){
    if (!navMenuWrap) return;
    navMenuWrap.classList.remove('open');
    if (navToggle) {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (navToggle && navMenuWrap) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenuWrap.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* Sliding active-tab indicator */
  function moveIndicator(link){
    if (!link || !navIndicator) return;
    navIndicator.style.width = `${link.offsetWidth}px`;
    navIndicator.style.left = `${link.offsetLeft}px`;
  }

  function setActiveLink(id){
    navLinks.forEach(link => {
      const isMatch = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
        moveIndicator(link);
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
      setActiveLink(link.getAttribute('href').slice(1));
    });
  });

  /* Highlight the tab in view as the user scrolls */
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(section => spy.observe(section));
  }

  window.addEventListener('load', () => {
    const current = document.querySelector('.nav-link.active') || navLinks[0];
    moveIndicator(current);
  });

  window.addEventListener('resize', () => {
    const current = document.querySelector('.nav-link.active');
    moveIndicator(current);
  });

  /* Fade + rise sections into view while scrolling down the page */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
});