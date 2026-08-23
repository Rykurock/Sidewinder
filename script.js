const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const galleryOpenButtons = document.querySelectorAll('[data-gallery-open]');
const galleryModal = document.querySelector('#gallery-modal');
const galleryClose = document.querySelector('[data-gallery-close]');
const galleryTrack = document.querySelector('[data-gallery-track]');
const galleryPrev = document.querySelector('[data-gallery-prev]');
const galleryNext = document.querySelector('[data-gallery-next]');
const heroVideo = document.querySelector('.hero-video');

const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

const closeNav = () => {
  navToggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('open');
};

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('open', !isOpen);
});

navLinks.forEach(link => link.addEventListener('click', closeNav));

// Keep the hero black until the local trailer has enough data to play,
// then fade it in so there is no flash of a fallback image.
const showHeroVideo = () => heroVideo?.classList.add('is-ready');
if (heroVideo) {
  if (heroVideo.readyState >= 3) {
    showHeroVideo();
  } else {
    heroVideo.addEventListener('canplay', showHeroVideo, { once: true });
  }
}

const openGallery = () => {
  if (!galleryModal) return;
  closeNav();
  galleryModal.showModal();
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => galleryTrack?.focus({ preventScroll: true }));
};

const closeGallery = () => {
  if (!galleryModal?.open) return;
  galleryModal.close();
};

galleryOpenButtons.forEach(button => button.addEventListener('click', openGallery));
galleryClose?.addEventListener('click', closeGallery);

galleryModal?.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
});

galleryModal?.addEventListener('click', (event) => {
  if (event.target === galleryModal) closeGallery();
});

const scrollGallery = (direction) => {
  if (!galleryTrack) return;
  galleryTrack.scrollBy({
    left: galleryTrack.clientWidth * 0.9 * direction,
    behavior: 'smooth'
  });
};

galleryPrev?.addEventListener('click', () => scrollGallery(-1));
galleryNext?.addEventListener('click', () => scrollGallery(1));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelector('#year').textContent = new Date().getFullYear();
