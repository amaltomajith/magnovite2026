import { initNavigation } from './navigation';
import { initGalaxySky } from './galaxySky';

// Gallery Page Interactive Lightbox & Category Filtering Script
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initGalaxySky();

  const categoryTags = document.querySelectorAll('#gallery-categories .category-tag');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img') as HTMLImageElement;
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');

  // Category Filter
  categoryTags.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryTags.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-category');

      galleryCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          (card as HTMLElement).style.display = 'block';
        } else {
          (card as HTMLElement).style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal
  galleryCards.forEach((card) => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');

      if (modal && modalImg && modalCaption && imgSrc) {
        modalImg.src = imgSrc;
        modalCaption.textContent = title || '';
        modal.classList.add('active');
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});
