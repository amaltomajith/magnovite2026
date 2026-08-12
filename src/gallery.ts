import { initNavigation } from './navigation';
import { initGalaxySky } from './galaxySky';

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: string;
  badge: string;
}

// 1. Image Registry Pool
const GALLERY_POOL: GalleryItem[] = [
  { id: '1', src: '/public/images/Gallery/GroupDance.jpg', title: 'Group Dance', category: 'cultural', badge: 'Cultural' },
  { id: '2', src: '/public/images/Gallery/FashionShow.jpg', title: 'Fashion Show', category: 'cultural', badge: 'Cultural' },
  { id: '3', src: '/public/images/Gallery/PrettyLady.jpg', title: 'Fashion Walk', category: 'cultural', badge: 'Fashion' },
  { id: '4', src: '/public/images/Gallery/StreetDance.jpg', title: 'Themed Dance', category: 'cultural', badge: 'Cultural' },
  { id: '5', src: '/public/images/Gallery/StreetPlay.jpg', title: 'Street Play', category: 'cultural', badge: 'Campus Life' },
  { id: '6', src: '/public/images/Gallery/DJnight.jpg', title: 'DJ Night', category: 'dj', badge: 'Cultural Nights' },
  { id: '7', src: '/public/images/Gallery/JinBro.jpg', title: 'Lighting the lamp', category: 'campus', badge: 'Campus Life' },
  { id: '8', src: '/public/images/Gallery/DJRubz.jpg', title: 'DJ RUBZ', category: 'dj', badge: 'Cultural Nights' },
  { id: '9', src: '/public/images/Gallery/AnotherDance.jpg', title: 'Themed Dance', category: 'cultural', badge: 'Cultural' },
  { id: '10', src: '/public/images/Gallery/imsolonely.jpg', title: 'Solo Act', category: 'cultural', badge: 'Cultural' },
  { id: '11', src: '/public/images/Gallery/BattleOfBands.jpg', title: 'Battle Of Bands', category: 'music', badge: 'Music' },
  { id: '12', src: '/public/images/Gallery/brightcoffee.jpg', title: 'Masala Coffee Live', category: 'music', badge: 'Concert' },
  { id: '13', src: '/public/images/Gallery/masalacoffeelead.jpg', title: 'Masala Coffee Lead', category: 'music', badge: 'Concert' },
  { id: '14', src: '/public/images/Gallery/masalacoffeepremass.jpg', title: 'Masala Coffee Band', category: 'music', badge: 'Concert' },
  { id: '15', src: '/public/images/Gallery/masscoffee.jpg', title: 'Masala Coffee Concert', category: 'music', badge: 'Concert' },
  { id: '16', src: '/public/images/Gallery/masalacoffeeviolin.jpg', title: 'Masala Coffee Violin Solo', category: 'music', badge: 'Concert' },
  { id: '17', src: '/public/images/Gallery/deadman.jpg', title: 'Fashion Show Act', category: 'cultural', badge: 'Fashion' },
  { id: '18', src: '/public/images/Gallery/kathak.jpg', title: 'Kathak Dance', category: 'cultural', badge: 'Cultural' }
];

const BENTO_SPANS = ['card-standard', 'card-wide', 'card-tall', 'card-large'];

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initGalaxySky();

  const gridContainer = document.getElementById('gallery-grid') as HTMLElement;
  const categoryTags = document.querySelectorAll<HTMLButtonElement>('#gallery-categories .category-tag');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img') as HTMLImageElement | null;
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');

  let currentCategory = 'all';
  let activeTimers: number[] = [];
  let currentModalIndex = -1;
  let activeFilteredPool: GalleryItem[] = [];

  // Random span allocation helper
  const getRandomSpan = (index: number): string => {
    if (index === 0) return 'card-large';
    const weights = ['card-standard', 'card-standard', 'card-wide', 'card-tall'];
    return weights[Math.floor(Math.random() * weights.length)];
  };

  // 2. Dynamic Grid Builder
  const buildGrid = (category: string) => {
    activeTimers.forEach(timer => clearInterval(timer));
    activeTimers = [];

    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    activeFilteredPool = category === 'all'
      ? [...GALLERY_POOL]
      : GALLERY_POOL.filter(item => item.category === category);

    if (activeFilteredPool.length === 0) {
      gridContainer.innerHTML = `<p style="color: rgba(255,255,255,0.5); grid-column: 1/-1; text-align: center; padding: 3rem 0;">No photos in this category yet.</p>`;
      return;
    }

    activeFilteredPool.forEach((item, index) => {
      const card = document.createElement('div');
      const spanClass = getRandomSpan(index);
      
      card.className = `gallery-card ${spanClass !== 'card-standard' ? spanClass : ''}`;
      card.setAttribute('data-id', item.id);
      card.setAttribute('data-category', item.category);

      card.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy" class="bento-img" />
        <div class="gallery-overlay">
          <span class="badge" style="width: fit-content; font-size: 0.75rem;">${item.badge}</span>
          <h3 class="card-title" style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-top: 0.3rem;">${item.title}</h3>
        </div>
      `;

      gridContainer.appendChild(card);
    });

    if (activeFilteredPool.length > 2) {
      startRandomImageSwaps(activeFilteredPool);
      startShapeShifting();
    }
  };

  // 3. Staggered Image Swapper (Prevents On-Screen Duplicates)
  const startRandomImageSwaps = (pool: GalleryItem[]) => {
    const swapTimer = window.setInterval(() => {
      const cards = Array.from(gridContainer.querySelectorAll<HTMLElement>('.gallery-card'));
      if (cards.length === 0) return;

      const targetCard = cards[Math.floor(Math.random() * cards.length)];
      
      // Collect IDs currently visible on screen
      const currentlyVisibleIds = new Set(
        cards.map(c => c.getAttribute('data-id')).filter(Boolean)
      );

      // Find pool items not currently displayed on grid
      const eligiblePool = pool.filter(i => !currentlyVisibleIds.has(i.id));
      if (eligiblePool.length === 0) return;

      const newItem = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];
      const imgEl = targetCard.querySelector<HTMLImageElement>('.bento-img');
      const titleEl = targetCard.querySelector<HTMLElement>('.card-title');
      const badgeEl = targetCard.querySelector<HTMLElement>('.badge');

      if (!imgEl || !titleEl || !badgeEl) return;

      targetCard.classList.add('is-swapping');

      setTimeout(() => {
        imgEl.src = newItem.src;
        imgEl.alt = newItem.title;
        titleEl.textContent = newItem.title;
        badgeEl.textContent = newItem.badge;
        targetCard.setAttribute('data-id', newItem.id);

        targetCard.classList.remove('is-swapping');
      }, 350);
    }, 4000);

    activeTimers.push(swapTimer);
  };

  // 4. Dynamic Shape Shifter
  const startShapeShifting = () => {
    const shiftTimer = window.setInterval(() => {
      const cards = Array.from(gridContainer.querySelectorAll<HTMLElement>('.gallery-card'));
      if (cards.length < 3) return;

      const card1 = cards[Math.floor(Math.random() * cards.length)];
      let card2 = cards[Math.floor(Math.random() * cards.length)];
      while (card1 === card2) {
        card2 = cards[Math.floor(Math.random() * cards.length)];
      }

      const randomSpan1 = BENTO_SPANS[Math.floor(Math.random() * BENTO_SPANS.length)];
      const randomSpan2 = BENTO_SPANS[Math.floor(Math.random() * BENTO_SPANS.length)];

      [card1, card2].forEach((card, idx) => {
        const newSpan = idx === 0 ? randomSpan1 : randomSpan2;
        card.classList.remove('card-wide', 'card-tall', 'card-large');
        if (newSpan !== 'card-standard') {
          card.classList.add(newSpan);
        }
      });
    }, 7000);

    activeTimers.push(shiftTimer);
  };

  // 5. Category Controls
  categoryTags.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryTags.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategory = btn.getAttribute('data-filter') || btn.getAttribute('data-category') || 'all';
      buildGrid(currentCategory);
    });
  });

  // 6. Lightbox & Navigation Operations
  const updateModalContent = (index: number) => {
    if (index < 0 || index >= activeFilteredPool.length) return;
    currentModalIndex = index;
    const item = activeFilteredPool[index];

    if (modalImg && modalCaption) {
      modalImg.src = item.src;
      modalCaption.textContent = item.title;
    }
  };

  const openModal = (itemId: string) => {
    const index = activeFilteredPool.findIndex(i => i.id === itemId);
    if (index === -1 || !modal) return;

    updateModalContent(index);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      currentModalIndex = -1;
    }
  };

  const navigateModal = (direction: 'next' | 'prev') => {
    if (currentModalIndex === -1 || activeFilteredPool.length === 0) return;
    
    let newIndex = direction === 'next' ? currentModalIndex + 1 : currentModalIndex - 1;
    if (newIndex >= activeFilteredPool.length) newIndex = 0;
    if (newIndex < 0) newIndex = activeFilteredPool.length - 1;

    updateModalContent(newIndex);
  };

  // Grid Click Handler
  gridContainer.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.gallery-card');
    if (!card) return;

    const id = card.getAttribute('data-id');
    if (id) openModal(id);
  });

  // Modal Event Listeners
  if (modalClose && modal) {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;

      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') navigateModal('next');
      if (e.key === 'ArrowLeft') navigateModal('prev');
    });

    // Mobile Touch Swipe Gesture Support
    let touchStartX = 0;
    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;

      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance < 0) navigateModal('next');
        else navigateModal('prev');
      }
    }, { passive: true });
  }

  // Initial Launch
  buildGrid(currentCategory);
});