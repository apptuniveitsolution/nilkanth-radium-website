/* ================================================================
   NILKANTH RADIUM STICKER & SIGNAGE — Premium Upgraded script.js
   ================================================================ */

/* ─── PAGE LOADER ─── */
(function () {
  const loader = document.getElementById('pageLoader');
  const fill = document.getElementById('loaderFill');
  const pct = document.getElementById('loaderPct');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => loader.classList.add('hidden'), 300);
    }
    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 80);
})();

/* ─── CURSOR GLOW ─── */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ─── HERO PARTICLE CANVAS ─── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [], W, H, animId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); init(); });

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.35;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '245,197,24' : '255,255,255';
  }
  Particle.prototype.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > W) this.speedX *= -1;
    if (this.y < 0 || this.y > H) this.speedY *= -1;
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  };

  function init() {
    particles = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    // draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(245,197,24,${0.06 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(animate);
  }
  init();
  animate();
})();

/* ─── STICKY HEADER ─── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
  // back to top
  const btt = document.getElementById('btt');
  if (btt) btt.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

/* ─── HAMBURGER ─── */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});
nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});
document.addEventListener('click', e => {
  if (!header.contains(e.target) && nav.classList.contains('open')) {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ─── SMOOTH SCROLL WITH OFFSET ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 74;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ─── BACK TO TOP ─── */
document.getElementById('btt')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── AOS (manual intersection observer) ─── */
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.aosDelay) || 0;
      setTimeout(() => el.classList.add('aos-animate'), delay);
      aosObserver.unobserve(el);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

/* ─── ACTIVE NAV ON SCROLL ─── */
const navLinks = document.querySelectorAll('.nav-link');
const sectionsAll = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sectionsAll.forEach(s => navObserver.observe(s));

/* ─── ANIMATED COUNTERS ─── */
function animateCounter(el, target, suffix) {
  let current = 0;
  const duration = 2000;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), '');
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
const statsSection = document.querySelector('.stats-section');
if (statsSection) statObserver.observe(statsSection);

/* ─── GALLERY FILTER ─── */
const filterBtns = document.querySelectorAll('.gf-btn');
const galleryItems = document.querySelectorAll('.gm-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ─── LIGHTBOX ─── */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const url = item.style.backgroundImage.slice(5, -2).replace('w=700', 'w=1400');
    lbImg.src = url;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
lbClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── TESTIMONIAL SLIDER ─── */
(function () {
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  const prev = document.getElementById('tcPrev');
  const next = document.getElementById('tcNext');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testi-card'));
  let visibleCount = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
  let current = 0;
  const total = cards.length;

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = Math.ceil(total / visibleCount);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('div');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i * visibleCount));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - visibleCount));
    const cardW = cards[0].offsetWidth + 20;
    track.style.transform = `translateX(-${current * cardW}px)`;
    track.style.transition = 'transform .45s cubic-bezier(0.25,0.46,0.45,0.94)';
    // update dots
    const activePage = Math.floor(current / visibleCount);
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === activePage));
  }

  prev?.addEventListener('click', () => goTo(current - visibleCount));
  next?.addEventListener('click', () => goTo(current + visibleCount));

  // Auto slide
  let autoSlide = setInterval(() => goTo(current + visibleCount >= total ? 0 : current + visibleCount), 5000);
  track.parentElement?.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement?.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goTo(current + visibleCount >= total ? 0 : current + visibleCount), 5000);
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + visibleCount : current - visibleCount);
  });

  window.addEventListener('resize', () => {
    visibleCount = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
    current = 0;
    track.style.transform = 'translateX(0)';
    buildDots();
  });

  buildDots();
})();

/* ─── CONTACT FORM ─── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const origHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Sending…</span>';
  btn.disabled = true;
  setTimeout(() => {
    formSuccess.classList.add('show');
    btn.innerHTML = origHTML;
    btn.disabled = false;
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1400);
});

/* ─── BUTTON RIPPLE EFFECT ─── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = this.querySelector('.btn-ripple');
    if (!ripple) return;
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      background:rgba(255,255,255,0.18);
      border-radius:50%;
      position:absolute;
      transform:scale(0);
      animation:rippleEffect .6s ease-out forwards;
    `;
  });
});
// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleEffect{to{transform:scale(1);opacity:0;}}`;
document.head.appendChild(rippleStyle);

/* ─── HERO LOAD ANIMATIONS ─── */
window.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll('.hero [data-aos]');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('aos-animate');
    }, 800 + parseInt(el.dataset.aosDelay || 0));
  });
});

/* ─── PARALLAX HERO BG (subtle) ─── */
const heroBgImg = document.querySelector('.hbg-img');
window.addEventListener('scroll', () => {
  if (!heroBgImg) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroBgImg.style.transform = `scale(1.08) translateY(${scrolled * 0.15}px)`;
  }
}, { passive: true });