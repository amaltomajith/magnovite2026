import { initGalaxySky } from './galaxySky';

// Navigation & Full Overlay Mega Menu Script
export function initNavigation() {
  const toggleBtn = document.getElementById('menu-toggle');
  const overlay = document.getElementById('mega-menu-overlay');

  // Initialize realistic live galaxy sky for hero sections
  initGalaxySky();

  if (!toggleBtn || !overlay) return;

  // Re-bind listener safely
  const newToggleBtn = toggleBtn.cloneNode(true) as HTMLElement;
  toggleBtn.parentNode?.replaceChild(newToggleBtn, toggleBtn);

  newToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = overlay.classList.contains('active');
    if (isOpen) {
      overlay.classList.remove('active');
      newToggleBtn.classList.remove('is-active');
      document.body.style.overflow = '';
    } else {
      overlay.classList.add('active');
      newToggleBtn.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close overlay when clicking any navigation link
  const navLinks = overlay.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('active');
      newToggleBtn.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });

  initNavCountdown();
}

function initNavCountdown() {
  // Target Event Date: September 15, 2026 at 9:00:00 AM local time
  const targetDate = new Date(2026, 8, 15, 9, 0, 0).getTime();

  function update() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    updateFlipCard('days-t', Math.floor(d / 10));
    updateFlipCard('days-u', d % 10);
    updateFlipCard('hours-t', Math.floor(h / 10));
    updateFlipCard('hours-u', h % 10);
    updateFlipCard('mins-t', Math.floor(m / 10));
    updateFlipCard('mins-u', m % 10);
    updateFlipCard('secs-t', Math.floor(s / 10));
    updateFlipCard('secs-u', s % 10);
  }

  function updateFlipCard(prefix: string, val: number) {
    const targets = [`nav-${prefix}`, `hero-${prefix}`, prefix];
    const nextVal = String(val);

    targets.forEach(id => {
      const cardEl = document.getElementById(id);
      if (!cardEl) return;

      const currentVal = cardEl.getAttribute('data-val') || '0';
      if (currentVal !== nextVal) {
        cardEl.setAttribute('data-val', nextVal);

        const topSpan = cardEl.querySelector('.flip-top span');
        const bottomSpan = cardEl.querySelector('.flip-bottom span');
        const leafTopSpan = cardEl.querySelector('.flip-leaf-top span');
        const leafBottomSpan = cardEl.querySelector('.flip-leaf-bottom span');

        if (topSpan && bottomSpan && leafTopSpan && leafBottomSpan) {
          leafTopSpan.textContent = currentVal;
          bottomSpan.textContent = currentVal;
          topSpan.textContent = nextVal;
          leafBottomSpan.textContent = nextVal;

          cardEl.classList.remove('is-flipping');
          void cardEl.offsetWidth; // Force reflow
          cardEl.classList.add('is-flipping');

          setTimeout(() => {
            bottomSpan.textContent = nextVal;
          }, 450);
        } else {
          const valEl = cardEl.querySelector('.flip-val');
          if (valEl) valEl.textContent = nextVal;
        }
      }
    });
  }

  update();
  setInterval(update, 1000);
}

// Auto-execute initialization on module load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initNavigation());
} else {
  initNavigation();
}

