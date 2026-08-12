/* ═══════════════════════════════════════════════════════════
   ANANYA PAPPU — PORTFOLIO JAVASCRIPT
   Scroll-based reveals, counters, skill bars, navigation
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Navigation ──
  const navbar = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu.querySelectorAll('a');

  // Scroll-based navbar styling
  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('.section');
  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navMenu.querySelector(`a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ── Intersection Observer for Scroll Reveal ──
  const revealClasses = [
    'reveal', 'reveal-left', 'reveal-right', 'reveal-flip',
    'reveal-up', 'reveal-scale', 'reveal-drop', 'reveal-zoom',
    'reveal-slide-bl', 'reveal-slide-br', 'waterfall-item',
    'stagger-item', 'pop-item', 'bounce-in', 'typewriter-item'
  ];

  const revealSelector = revealClasses.map(c => '.' + c).join(', ');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.style.animationDelay || el.dataset.delay || 0) * 1000;
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll(revealSelector).forEach(el => {
    revealObserver.observe(el);
  });

  // ── Stagger animations for list items ──
  const staggerContainers = document.querySelectorAll('.exp-list, .edu-highlights, .outcomes-grid, .tech-tags');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.children;
        Array.from(items).forEach((item, i) => {
          setTimeout(() => {
            item.classList.add('revealed');
          }, i * 150);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });

  staggerContainers.forEach(container => {
    staggerObserver.observe(container);
  });

  // ── Skill Bar Animation ──
  const skillSection = document.getElementById('skills');
  let skillsAnimated = false;

  const animateSkillBars = () => {
    if (skillsAnimated) return;
    const fills = skillSection.querySelectorAll('.skill-fill');
    const pcts = skillSection.querySelectorAll('.skill-pct');

    fills.forEach(fill => {
      const target = fill.dataset.width;
      fill.style.width = target + '%';
    });

    // Animate percentage counters
    pcts.forEach(pct => {
      const target = parseInt(pct.dataset.target);
      animateCounter(pct, 0, target, 1200, '%');
    });

    skillsAnimated = true;
  };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateSkillBars, 300);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (skillSection) skillObserver.observe(skillSection);

  // ── Stat Counter Animation ──
  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, 0, target, 1500);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(stat => statObserver.observe(stat));

  // ── Counter animation utility ──
  function animateCounter(el, start, end, duration, suffix = '') {
    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  // ── Contact Form Underline Sequential Draw ──
  const contactSection = document.getElementById('contact');
  let formAnimated = false;

  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !formAnimated) {
        formAnimated = true;
        const underlines = contactSection.querySelectorAll('.form-underline');
        underlines.forEach((line, i) => {
          setTimeout(() => {
            line.style.width = '100%';
            setTimeout(() => {
              line.style.width = '0';
            }, 600);
          }, i * 300);
        });

        // Pulse the send button after form finishes rendering
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
          setTimeout(() => {
            sendBtn.classList.add('pulse');
            setTimeout(() => sendBtn.classList.remove('pulse'), 1500);
          }, underlines.length * 300 + 600);
        }

        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (contactSection) contactObserver.observe(contactSection);

  // ── Certification Card Mouse-Follow Tilt ──
  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
    });
  });

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 10;
        const top = target.offsetTop - offset;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Landing page parallax-like floating shapes ──
  const shapes = document.querySelectorAll('.shape');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    shapes.forEach((shape, i) => {
      const factor = (i + 1) * 8;
      shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });

  // ── Ken Burns effect on cert images ──
  const certImageWraps = document.querySelectorAll('.cert-image-wrap');
  certImageWraps.forEach(wrap => {
    const placeholder = wrap.querySelector('.cert-image-placeholder');
    if (placeholder) {
      const parent = wrap.closest('.cert-card');
      parent.addEventListener('mouseenter', () => {
        placeholder.style.transform = 'scale(1.05)';
        placeholder.style.transition = 'transform 3s ease-out';
      });
      parent.addEventListener('mouseleave', () => {
        placeholder.style.transform = 'scale(1)';
      });
    }
  });

  // ── Form validation feedback ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderBottomColor = '#ef4444';
          setTimeout(() => {
            input.style.borderBottomColor = '';
          }, 2000);
        }
      });
      if (!valid) {
        e.preventDefault();
      }
    });
  }

  // ── Initial trigger for elements already in view ──
  setTimeout(() => {
    handleNavScroll();
    highlightNav();
  }, 100);
});

// ── Projects Data Registry ──
window.projectsData = [
  {
    id: 'datagen',
    title: 'DATAGEN — Synthetic Dataset Generation Framework',
    projectUrl: null // No live demo URL currently available
  },
  {
    id: 'rr',
    title: 'RR — Author Website & Publishing CMS',
    projectUrl: 'https://rr-author-website-author-website.vercel.app'
  },
  {
    id: 'ethosai',
    title: 'ETHOSAI — Intelligent Healthcare Smart Check-In System',
    projectUrl: 'https://ethos-ai-api-server.vercel.app'
  }
];
