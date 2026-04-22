/* =============================================
   NILKANTH RADIUM STICKER & SIGNAGE — script.js
   ============================================= */

/* ─── STICKY HEADER ─── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── HAMBURGER MENU / SIDE DRAWER ─── */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navOverlay = document.getElementById('navOverlay');

function toggleNav() {
  const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !isExpanded);
  
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
  
  if (navOverlay) {
    navOverlay.classList.toggle('active');
  }
  
  // Body scroll lock
  if (nav.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

hamburger.addEventListener('click', toggleNav);

// Close drawer on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      toggleNav();
    }
  });
});

// Close drawer on backdrop overlay click
if (navOverlay) {
  navOverlay.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      toggleNav();
    }
  });
}

// Close drawer on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    toggleNav();
  }
});

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // stagger delay for sibling cards efficiently
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
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── BACK TO TOP ─── */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── CONTACT FORM ─── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form && formSuccess) {
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
}

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

/* ─── GALLERY FILTERING ─── */
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Manage active states
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filterValue = btn.getAttribute('data-filter');
    const allGalleryItems = document.querySelectorAll('.gallery-item');
    
    // Process display logically to prevent gaps
    allGalleryItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      
      if (filterValue === 'all' || itemCategory === filterValue) {
        item.classList.remove('hide');
        item.style.display = ''; // Restore grid flow naturally
        
        // Retrigger entrance animation cleanly
        item.style.animation = 'none';
        item.offsetHeight; // trigger reflow
        item.style.animation = 'fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      } else {
        item.classList.add('hide');
      }
    });
  });
});

/* ─── GALLERY LIGHTBOX (robust) ─── */
const lightbox = (() => {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeBtn.setAttribute('aria-label', 'Close Lightbox');
  
  const contentWrap = document.createElement('div');
  contentWrap.className = 'lightbox-content';
  
  const img = document.createElement('img');
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.autoplay = true;

  contentWrap.appendChild(img);
  contentWrap.appendChild(video);
  overlay.appendChild(closeBtn);
  overlay.appendChild(contentWrap);
  document.body.appendChild(overlay);

  const closeLightbox = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    video.pause();
    video.removeAttribute('src'); // Stop buffer completely
    video.load();
    img.removeAttribute('src');
  };

  closeBtn.addEventListener('click', closeLightbox);
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === contentWrap) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeLightbox();
    }
  });

  return { overlay, img, video };
})();

// Attach lightbox to all grid items, taking into account dynamically missing media
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const childImg = item.querySelector('img');
    const childVideo = item.querySelector('video');
    
    if (childVideo) {
      lightbox.img.style.display = 'none';
      lightbox.video.style.display = 'block';
      lightbox.video.src = childVideo.src || childVideo.currentSrc;
      lightbox.video.play().catch(e => console.log('Auto-play blocked:', e));
    } else if (childImg) {
      lightbox.video.style.display = 'none';
      lightbox.img.style.display = 'block';
      lightbox.img.src = childImg.src || childImg.currentSrc;
    } else {
      return;
    }
    
    lightbox.overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scrolling behind lightbox
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

/* ─── FALLBACK SAFETY FOR MISSING MEDIA ─── */
// If any image/video 404s, its entire parent card is removed keeping the grid clean.
window.addEventListener('load', () => {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      const galleryItem = this.closest('.gallery-item');
      if (galleryItem) {
        galleryItem.remove(); 
      } else {
        this.style.display = 'none';
      }
    });
    // Immediately catch already failed cached resources
    if (img.complete && img.naturalHeight === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });

  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', function() {
      const galleryItem = this.closest('.gallery-item');
      if (galleryItem) {
        galleryItem.remove();
      } else {
        this.style.display = 'none';
      }
    });
  });
});