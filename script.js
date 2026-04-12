/* =============================================
   NILKANTH RADIUM STICKER & SIGNAGE — script.js
   ============================================= */

/* ─── STICKY HEADER ─── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});

// close nav on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// close on outside click
document.addEventListener('click', (e) => {
  if (!header.contains(e.target) && nav.classList.contains('open')) {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger delay for sibling cards
      const siblings = Array.from(entry.target.parentNode.children).filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── ACTIVE NAV LINK ─── */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('#nav a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        link.style.background = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--gold)';
          link.style.background = 'rgba(245,197,24,0.08)';
        }
      });
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

/* ─── BACK TO TOP ─── */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 400);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── CONTACT FORM ─── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;

  setTimeout(() => {
    formSuccess.classList.add('show');
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    form.reset();

    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1200);
});

/* ─── SMOOTH SCROLL OFFSET FOR FIXED HEADER ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72);
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── HERO REVEAL ON LOAD ─── */
window.addEventListener('DOMContentLoaded', () => {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => {
      el.style.transitionDelay = '0ms';
      el.classList.add('visible');
    }, 200 + i * 150);
  });
});

/* ─── GALLERY LIGHTBOX (simple) ─── */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = (() => {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,.92);
    display:none;place-items:center;
    cursor:zoom-out;
  `;
  const img = document.createElement('img');
  img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 0 60px rgba(0,0,0,.8);';
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  return { overlay, img };
})();

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const bg = item.style.backgroundImage;
    const url = bg.slice(5, -2); // strip url(" ")
    lightbox.img.src = url.replace('w=600', 'w=1200');
    lightbox.overlay.style.display = 'grid';
    document.body.style.overflow = 'hidden';
  });
});

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current + suffix;
  }, 25);
}

const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();
      const num = parseInt(text);
      const suffix = text.replace(String(num), '');
      animateCounter(el, num, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.8 });

statNums.forEach(el => counterObserver.observe(el));
