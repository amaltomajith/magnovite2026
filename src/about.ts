import { initNavigation } from './navigation';
import { initGalaxySky } from './galaxySky';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initGalaxySky();
  initAboutPromoInlinePlayer();
});

function initAboutPromoInlinePlayer() {
  const playBtn = document.getElementById('about-play-promo-btn');
  const container = document.getElementById('about-promo-container');
  if (playBtn && container) {
    playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      container.innerHTML = `
        <div style="position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5); background: #000;">
          <iframe src="https://www.youtube-nocookie.com/embed/EGSUtEnfX9g?autoplay=1&rel=0" 
                  title="Magnovite 2026 Official Promo" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowfullscreen 
                  style="width: 100%; height: 100%; border: none; display: block;">
          </iframe>
        </div>
      `;
    });
  }
}
