/* ============================================
   NILKANTH SIGNAGE — Premium JavaScript
   Animations · Interactions · Canvas
   ============================================ */

'use strict';

// =====================
// 1. CUSTOM CURSOR
// =====================
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth trail animation
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover expand on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .service-card, .gallery-item, .why-card, .btn');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
})();


// =====================
// 2. NAVBAR SCROLL EFFECT
// =====================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const body = document.body;

  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      body.classList.toggle('menu-open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        body.classList.remove('menu-open');
      });
    });
  }
})();


// =====================
// 3. HERO PARTICLE CANVAS
// =====================
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = [60, 30, 270, 220][Math.floor(Math.random() * 4)]; // neon, orange, purple, blue
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = `hsl(${this.hue}, 90%, 65%)`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `hsl(${this.hue}, 90%, 65%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Connection lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.12;
          ctx.strokeStyle = '#f0e234';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();

  // Mouse interaction
  let mx = -999, my = -999;
  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  });

  setInterval(() => {
    particles.forEach(p => {
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.x += dx * 0.03;
        p.y += dy * 0.03;
      }
    });
  }, 16);
})();


// =====================
// 4. HERO REVEAL ANIMATION
// =====================
(function heroReveal() {
  const lines = document.querySelectorAll('.line');
  const revealEls = document.querySelectorAll('.reveal-up');

  // Stagger line reveals on load
  setTimeout(() => {
    lines.forEach(line => line.classList.add('visible'));
    revealEls.forEach(el => el.classList.add('visible'));
  }, 300);
})();


// =====================
// 5. SCROLL REVEAL (IntersectionObserver)
// =====================
(function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger by data-index or natural order
        const delay = entry.target.dataset.index
          ? parseInt(entry.target.dataset.index) * 80
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


// =====================
// 6. ANIMATED COUNTERS
// =====================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const bars = document.querySelectorAll('.stat-bar-fill');

  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;

  let animated = false;
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      counters.forEach(el => {
        const target = parseInt(el.dataset.target);
        animateCounter(el, target, 1800);
        el.closest('.stat-item').classList.add('visible');
      });
      bars.forEach(bar => {
        const width = bar.dataset.width;
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 200);
      });
    }
  }, { threshold: 0.4 });

  statsObserver.observe(statsSection);
})();


// =====================
// 7. PARALLAX EFFECTS
// =====================
(function initParallax() {
  const glows = document.querySelectorAll('.hero-glow');
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Hero content subtle move
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity = 1 - scrollY / 600;
    }

    // Glow drift with scroll
    glows.forEach((glow, i) => {
      const speed = (i + 1) * 0.1;
      glow.style.transform += ` translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
})();


// =====================
// 8. GALLERY HOVER TILT
// =====================
(function initGalleryTilt() {
  const items = document.querySelectorAll('.gallery-item');

  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = ((y - centerY) / centerY) * -6;
      const rotY = ((x - centerX) / centerX) * 6;
      item.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      item.style.transition = 'transform 0.5s ease';
    });

    item.addEventListener('mouseenter', () => {
      item.style.transition = 'transform 0.1s ease';
    });
  });
})();


// =====================
// 9. SERVICE CARD GLOW ON MOUSE MOVE
// =====================
(function initCardGlow() {
  const cards = document.querySelectorAll('.service-card, .why-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(240,226,52,0.18), transparent 60%)`;
      }
    });
  });
})();


// =====================
// 10. SMOOTH SCROLL FOR NAV LINKS
// =====================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// =====================
// 11. FORM HANDLING
// =====================
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-btn');
    const span = btn.querySelector('span');
    const originalText = span.textContent;

    // Loading state
    btn.disabled = true;
    span.textContent = 'Sending...';
    btn.style.opacity = '0.7';

    // Simulate API call
    setTimeout(() => {
      span.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';
      btn.style.opacity = '1';

      // Create success ripple
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute; inset: 0; border-radius: inherit;
        background: rgba(255,255,255,0.3);
        animation: ripple 0.6s ease-out forwards;
      `;
      btn.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
        btn.disabled = false;
        span.textContent = originalText;
        btn.style.background = '';
        btn.style.opacity = '';
        form.reset();
      }, 2500);
    }, 1200);
  });
})();


// =====================
// 12. MARQUEE PAUSE ON HOVER
// =====================
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();


// =====================
// 13. SECTION ACTIVE NAV LINK
// =====================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navHeight = 80;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - navHeight - 50) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = '#fff';
      }
    });
  }, { passive: true });
})();


// =====================
// 14. CTA SHAPES ANIMATION
// =====================
(function initCtaShapes() {
  const shapes = document.querySelectorAll('.cta-shapes .shape');

  window.addEventListener('scroll', () => {
    const cta = document.querySelector('.cta-section');
    if (!cta) return;
    const rect = cta.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, 1 - (rect.top / window.innerHeight)));

    shapes.forEach((shape, i) => {
      const offset = progress * (i + 1) * 30;
      shape.style.transform = `translateY(${-offset}px)`;
    });
  }, { passive: true });
})();


// =====================
// 15. RIPPLE KEYFRAME INJECTION
// =====================
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      from { transform: scale(0); opacity: 1; }
      to { transform: scale(2); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();


// =====================
// 16. PERFORMANCE: Lazy Canvas Stop
// =====================
(function optimizeCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const observer = new IntersectionObserver((entries) => {
    // Canvas animations stop when hero not visible (handled via RAF - no-op when hidden naturally)
    // Placeholder for future optimization
  }, { threshold: 0 });

  observer.observe(canvas);
})();


// =====================
// 17. PAGE LOAD ANIMATION
// =====================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
});


console.log('%cNilkanth Radium Sticker & Signage', 'color:#f0e234;font-size:18px;font-weight:bold;');
console.log('%cBuilding brands that shine. 🔥', 'color:#ff6b35;font-size:13px;');