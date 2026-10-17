/* ============================================
   Main JS — Ifeanyichukwu Collins Portfolio
   Shared across all 4 pages. Page-specific
   code is guarded so it no-ops on other pages.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  /* ============ HERO ANIMATIONS ============ */
  if (document.querySelector('.hero-text')) {
    gsap.from('.hero-text > *', {
      opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: "power3.out"
    });
  }
  if (document.querySelector('.hero-image')) {
    gsap.from('.hero-image', {
      opacity: 0, scale: 0.8, duration: 1, ease: "power3.out", delay: 0.3
    });
  }
  if (document.querySelector('.glow-avatar')) {
    gsap.from('.glow-avatar', { scale: 0.8, opacity: 0, duration: 0.8, delay: 0.3 });
  }
  if (document.querySelector('.hero-badge')) {
    gsap.from('.hero-badge', { opacity: 0, y: -20, duration: 0.6, delay: 0.2 });
  }
  if (document.querySelector('.hero-title')) {
    gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, delay: 0.3 });
  }
  if (document.querySelector('.hero-desc')) {
    gsap.from('.hero-desc', { opacity: 0, y: 20, duration: 0.6, delay: 0.5 });
  }

  /* ============ TYPEWRITER (index only) ============ */
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    const words = ["Ifeanyichukwu Collins", "a Full-Stack Dev", "an AI Engineer", "a Problem Solver"];
    let wordIdx = 0, charIdx = 0, deleting = false;
    function type() {
      const word = words[wordIdx];
      if (!deleting) {
        typeEl.textContent = word.substring(0, ++charIdx);
        if (charIdx === word.length) { deleting = true; setTimeout(type, 2000); return; }
      } else {
        typeEl.textContent = word.substring(0, --charIdx);
        if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; }
      }
      setTimeout(type, deleting ? 35 : 75);
    }
    type();
  }

  /* ============ ANIMATED COUNTERS ============ */
  const counters = document.querySelectorAll('.counter, .stat-counter');
  if (counters.length) {
    function animateCounter(counter) {
      const target = parseInt(counter.getAttribute('data-target'));
      let current = 0;
      const totalFrames = 130;
      const increment = target / totalFrames;
      let frame = 0;
      function update() {
        frame++;
        current += increment;
        if (frame < totalFrames) {
          counter.innerText = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target;
        }
      }
      update();
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          if (parseInt(counter.innerText) === 0) animateCounter(counter);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  /* ============ SKILL BARS (about only) ============ */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length) {
    const percentSpans = document.querySelectorAll('.skill-percent');
    const animateSkills = () => {
      skillBars.forEach(bar => {
        bar.style.width = bar.getAttribute('data-skill') + '%';
      });
      percentSpans.forEach(span => {
        const parentBar = span.closest('.skill-item')?.querySelector('.skill-bar-fill');
        const targetVal = parentBar ? parseInt(parentBar.getAttribute('data-skill')) : 0;
        let currentVal = 0;
        const step = targetVal / 60;
        const interval = setInterval(() => {
          currentVal += step;
          if (currentVal >= targetVal) {
            span.innerText = targetVal + '%';
            clearInterval(interval);
          } else {
            span.innerText = Math.floor(currentVal) + '%';
          }
        }, 20);
      });
    };

    ScrollTrigger.create({
      trigger: ".skill-bar-wrapper",
      start: "top 80%",
      once: true,
      onEnter: () => animateSkills()
    });
  }

  /* ============ TIMELINE (about only) ============ */
  if (document.querySelector('.timeline-line')) {
    ScrollTrigger.create({
      trigger: ".timeline-line",
      start: "top 80%",
      once: true,
      onEnter: () => gsap.to("#timelineFill", { scaleY: 1, duration: 1.2, ease: "power2.out" })
    });
  }

  /* ============ CARD STAGGER FADE-INS ============ */
  gsap.utils.toArray('.about-card, .project-card, .card-glow-green, .card-glow-blue, .stat-card, .stat-item, .process-step').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 1, y: 0,
        duration: 0.6,
        delay: (i % 6) * 0.08,
        ease: "power2.out"
      }
    );
  });

  /* ============ PROJECT FILTERS (projects only) ============ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    const projectCards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        let visibleCount = 0;
        projectCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('hidden');
            gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, delay: visibleCount * 0.05 });
            visibleCount++;
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ============ MOBILE MENU ============ */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  const line3 = document.getElementById('line3');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.style.transform = 'translateX(0)';
    line1.style.transform = 'rotate(45deg) translateY(6.5px)';
    line2.style.opacity = '0';
    line3.style.transform = 'rotate(-45deg) translateY(-6.5px)';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menuOpen = false;
    mobileMenu.style.transform = 'translateX(100%)';
    line1.style.transform = 'rotate(0deg) translateY(0)';
    line2.style.opacity = '1';
    line3.style.transform = 'rotate(0deg) translateY(0)';
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  }
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  /* ============ NAVBAR SCROLL SHADOW ============ */
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 30 ? '0 10px 40px rgba(0, 0, 0, 0.6)' : 'none';
    });
  }

  /* ============ SMOOTH SCROLL (index only) ============ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

});