import React from 'react';
import { createRoot } from 'react-dom/client';
import { InstagramFeed } from './InstagramFeed';

const sampleNavPostUrls = [
  'https://www.instagram.com/p/DFhQ9N-vJ9Y/',
  'https://www.instagram.com/reel/C32sXyvP4_Z/'
];

// Navigation & Full Overlay Mega Menu Script
export function initNavigation() {
  const toggleBtn = document.getElementById('menu-toggle');
  const overlay = document.getElementById('mega-menu-overlay');

  if (!toggleBtn || !overlay) return;

  // Mount Instagram Feed in nav overlay if container exists
  const navRoot = document.getElementById('nav-instagram-feed-root');
  if (navRoot && !navRoot.hasChildNodes()) {
    const root = createRoot(navRoot);
    root.render(React.createElement(InstagramFeed, { postUrls: sampleNavPostUrls }));
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = overlay.classList.contains('active');
    if (isOpen) {
      overlay.classList.remove('active');
      toggleBtn.classList.remove('is-active');
      document.body.style.overflow = '';
    } else {
      overlay.classList.add('active');
      toggleBtn.classList.add('is-active');
      document.body.style.overflow = 'hidden';

      // Process Instagram embeds when overlay opens
      setTimeout(() => {
        if (window.instgrm?.Embeds) {
          window.instgrm.Embeds.process();
        }
      }, 50);
    }
  });

  // Close overlay when clicking any navigation link
  const navLinks = overlay.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('active');
      toggleBtn.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });

  initNavCountdown();
}

function initNavCountdown() {
  // Target Event Date: September 15, 2026 at 9:00:00 AM local time
  const targetDate = new Date(2026, 8, 15, 9, 0, 0).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = Math.max(0, targetDate - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    setFlipDigit('days-t', Math.floor(d / 10));
    setFlipDigit('days-u', d % 10);
    setFlipDigit('hours-t', Math.floor(h / 10));
    setFlipDigit('hours-u', h % 10);
    setFlipDigit('mins-t', Math.floor(m / 10));
    setFlipDigit('mins-u', m % 10);
    setFlipDigit('secs-t', Math.floor(s / 10));
    setFlipDigit('secs-u', s % 10);
  }

  function setFlipDigit(id: string, val: number) {
    const card = document.getElementById(id);
    if (!card) return;
    const currentVal = card.getAttribute('data-val');
    const newStr = String(val);
    if (currentVal !== newStr) {
      card.setAttribute('data-val', newStr);
      const valEl = card.querySelector('.flip-val');
      if (valEl) valEl.textContent = newStr;

      card.classList.remove('flip-anim');
      void card.offsetWidth; // Force reflow
      card.classList.add('flip-anim');
    }
  }

  update();
  setInterval(update, 1000);
}
