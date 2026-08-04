// Google Apps Script Web App deployment URL
const API_URL = "https://script.google.com/macros/s/AKfycbyCavqYo1p9VXhflQYaMyQu4WiimRanMwI6FDo0vAHiikTOJNf4lWIPxYX2EDcALhX9cQ/exec";

interface EventItem {
  title: string;
  desc: string;
  category: string;
  tagline?: string;
  prize?: string;
  date?: string;
  participants?: string;
  fee?: string;
  duration?: string;
  rules?: string;
  registrationUrl?: string;
  contacts?: string;
  [key: string]: any;
}

// In-Memory Data Cache (No localStorage/sessionStorage used)
let cachedEvents: EventItem[] = [];
let activeCategory = 'All';
let searchQuery = '';

/**
 * Client-Side Slugify Rule:
 * lowercase, trim, replace any run of non-alphanumeric characters with a single hyphen,
 * strip leading/trailing hyphens.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const EVENT_IMAGE_MAP: Record<string, string> = {
  'acapella': '/images/events/acapella.jpg',
  'antenna-design': '/images/events/antenna.jpg',
  'archicraft': '/images/events/archicraft.jpg',
  'argo-royale': '/images/events/argoroyale.png',
  'battle-of-the-bands': '/images/events/battleofbands.jpg',
  'battleofbands': '/images/events/battleofbands.jpg',
  'best-manager': '/images/events/bestmanager.avif',
  'business-plan': '/images/events/businessplan.jpg',
  'byte-and-board': '/images/events/byteandboard.jpg',
  'cad-design': '/images/events/cad.jpg',
  'case-craft': '/images/events/casecraft.jpg',
  'chamber-of-secrets': '/images/events/chamberofsecrets.jpg',
  'the-chase': '/images/events/chase.jpg',
  'code-relay': '/images/events/coderelay.jpg',
  'drone-obstacle': '/images/events/drone.jpg',
  'eco-forge': '/images/events/ecoforge.jpg',
  'enigma': '/images/events/enigma.jpg',
  'escape-room': '/images/events/escaperoom.jpg',
  'finance-pitch': '/images/events/finance.jpg',
  'frames-unboxed': '/images/events/framesunboxed.jpg',
  'grid-challenge': '/images/events/grid.jpg',
  'how-i-met-your-killer': '/images/events/howimeturkiller.jpg',
  'human-resource': '/images/events/humanresource.jpg',
  'marketing-challenge': '/images/events/marketing.jpg',
  'non-theme-dance': '/images/events/nontheme.jpg',
  'pattern-play': '/images/events/patternplay.jpg',
  'pixel-perspective': '/images/events/pixelperspective.jpg',
  'rc-car-challenge': '/images/events/rccarchallenge.jpg',
  'reverse-coding': '/images/events/reversecoding.jpg',
  'revival-outlook': '/images/events/reviwaloutlook.jpg',
  'robo-soccer': '/images/events/robosoccer.jpg',
  'severance-cup': '/images/events/SEVERANCE CUP.jpg',
  'smart-city': '/images/events/smartcity.jpg',
  'spark-tank': '/images/events/sparktank.jpg',
  'street-dance-battle': '/images/events/streetdancebattle.JPG',
  'street-play': '/images/events/streetplay.jpg',
  'switch-and-scene': '/images/events/switchandscene.jpg',
  'techism': '/images/events/techism.jpg',
  'technical-workshop': '/images/events/technicalworkshop.jpg',
  'theme-dance': '/images/events/themedance.jpg',
  'the-nexus': '/images/events/thenexus.jpg'
};

async function fetchEvents() {
  const statusContainer = document.getElementById('events-status');
  const gridContainer = document.getElementById('events-grid');
  
  if (!statusContainer || !gridContainer) return;

  statusContainer.innerHTML = `
    <div class="status-loading">
      <div class="spinner"></div>
      <p>Fetching latest events schedule...</p>
    </div>
  `;
  gridContainer.innerHTML = '';

  if (!API_URL) {
    statusContainer.innerHTML = `
      <div class="status-empty" style="text-align: center; padding: 3rem 1.5rem;">
        <p style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">No data record found.</p>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">API URL endpoint is not configured.</p>
      </div>
    `;
    return;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: Expected JSON array of events.");
    }

    if (data.length === 0) {
      cachedEvents = [];
      gridContainer.innerHTML = '';
      statusContainer.innerHTML = `
        <div class="status-empty" style="text-align: center; padding: 3rem 1.5rem;">
          <p style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">No data record found.</p>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">There are currently no events listed in the connected Google Sheet.</p>
        </div>
      `;
      return;
    }

    cachedEvents = data;
    statusContainer.innerHTML = '';
    renderCategories();
    renderEvents();
  } catch (error) {
    console.error('[Events Fetch Error]', error);
    cachedEvents = [];
    gridContainer.innerHTML = '';
    statusContainer.innerHTML = `
      <div class="status-error" style="text-align: center; padding: 3rem 1.5rem;">
        <p style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">No data record found.</p>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.4rem;">
          Unable to retrieve events from Google Sheets (${escapeHtml((error as Error).message)}).
        </p>
      </div>
    `;
  }
}

function renderCategories() {
  const container = document.getElementById('category-filters');
  if (!container) return;

  const categories = Array.from(
    new Set(cachedEvents.map((item) => item.category).filter(Boolean))
  );

  const allCategories = ['All', ...categories];

  container.innerHTML = allCategories
    .map(
      (cat) => `
      <button 
        class="filter-btn ${cat === activeCategory ? 'active' : ''}" 
        data-category="${escapeHtml(cat)}"
      >
        ${escapeHtml(cat)}
      </button>
    `
    )
    .join('');

  container.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      activeCategory = target.getAttribute('data-category') || 'All';
      
      container.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      target.classList.add('active');

      renderEvents();
    });
  });
}

function renderEvents() {
  const gridContainer = document.getElementById('events-grid');
  const statusContainer = document.getElementById('events-status');
  if (!gridContainer || !statusContainer) return;

  const query = searchQuery.toLowerCase().trim();
  const filteredEvents = cachedEvents.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  if (filteredEvents.length === 0) {
    gridContainer.innerHTML = '';
    statusContainer.innerHTML = `
      <div class="status-empty" style="text-align: center; padding: 3rem 1.5rem;">
        <p style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">No data record found.</p>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">No events match your current category filter or search query.</p>
      </div>
    `;
    return;
  }

  statusContainer.innerHTML = '';

  gridContainer.innerHTML = filteredEvents
    .map((event, index) => {
      const slug = slugify(event.title);
      const rawSlug = slug.replace(/-/g, '');
      const imageSrc = EVENT_IMAGE_MAP[slug] || EVENT_IMAGE_MAP[rawSlug] || `/images/events/${slug}.jpg`;
      const fallbackSrc = '/images/shaanrahman.jpg';

      return `
        <article class="event-card" data-event-index="${index}" style="cursor: pointer;">
          <div class="card-image-wrapper">
            <img 
              class="card-image" 
              src="${escapeHtml(imageSrc)}" 
              alt="${escapeHtml(event.title)}" 
              loading="lazy"
              onerror="this.onerror=null; this.src='${fallbackSrc}';"
            />
          </div>
          <div class="card-content">
            <span class="card-badge">${escapeHtml(event.category || 'General')}</span>
            <h3 class="card-title">${escapeHtml(event.title)}</h3>
            <p class="card-desc">${escapeHtml(event.desc)}</p>
          </div>
        </article>
      `;
    })
    .join('');

  // Attach click listeners to open rich detail view modal
  gridContainer.querySelectorAll('.event-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const idxAttr = card.getAttribute('data-event-index');
      if (idxAttr !== null) {
        const idx = parseInt(idxAttr, 10);
        if (filteredEvents[idx]) {
          openEventModal(filteredEvents[idx]);
        }
      }
    });
  });
}

export function openEventModal(event: EventItem) {
  const modalOverlay = document.getElementById('event-modal-overlay');
  const modalContent = document.getElementById('event-modal-content');
  if (!modalOverlay || !modalContent) return;

  const tagline = (event.tagline || event.Tagline || '').trim();
  const prize = (event.prize || event.Prize || '').trim();
  const date = (event.date || event.Date || '').trim();
  const participants = (event.participants || event.Participants || '').trim();
  const fee = (event.fee || event.Fee || '').trim();
  const duration = (event.duration || event.Duration || '').trim();
  const rulesRaw = (event.rules || event.Rules || '').trim();
  const regUrl = (event.registrationUrl || event.RegistrationUrl || '').trim();
  const contactsRaw = (event.contacts || event.Contacts || '').trim();

  // Info Grid Items (Only include non-empty values!)
  const infoItems: { label: string; val: string }[] = [];
  if (date) infoItems.push({ label: 'Date', val: date });
  if (participants) infoItems.push({ label: 'Participants', val: participants });
  if (fee) infoItems.push({ label: 'Registration Fee', val: fee });
  if (duration) infoItems.push({ label: 'Duration', val: duration });

  let infoGridHtml = '';
  if (infoItems.length > 0) {
    infoGridHtml = `
      <div class="modal-info-grid">
        ${infoItems
          .map(
            (item) => `
          <div class="info-grid-item">
            <span class="info-item-label">${escapeHtml(item.label)}</span>
            <span class="info-item-val">${escapeHtml(item.val)}</span>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  // Prize Card HTML (Highlight stat)
  let prizeCardHtml = '';
  if (prize) {
    prizeCardHtml = `
      <div class="modal-prize-card">
        <span class="modal-prize-label">PRIZE POOL</span>
        <div class="modal-prize-amount">🏆 ${escapeHtml(prize)}</div>
      </div>
    `;
  }

  // Rules List HTML (Split on " | ")
  let rulesHtml = '';
  if (rulesRaw) {
    const rulesList = rulesRaw
      .split(' | ')
      .map((r) => r.trim())
      .filter(Boolean);

    if (rulesList.length > 0) {
      rulesHtml = `
        <div class="modal-rules-section">
          <h4 class="modal-rules-title">Rules & Guidelines</h4>
          <ul class="modal-rules-list">
            ${rulesList.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
          </ul>
        </div>
      `;
    }
  }

  // Contacts Section HTML (Split on " ;; " and internal " | ")
  let contactsHtml = '';
  if (contactsRaw) {
    const contactEntries = contactsRaw
      .split(';;')
      .map((c) => c.trim())
      .filter(Boolean);

    if (contactEntries.length > 0) {
      const cardsHtml = contactEntries
        .map((contactStr) => {
          const parts = contactStr.split('|').map((p) => p.trim());
          const name = parts[0] || '';
          const phone = parts[1] || '';
          const email = parts[2] || '';

          const cleanPhone = phone.replace(/[^0-9+]/g, '');

          return `
            <div class="contact-card">
              <div class="contact-name">${escapeHtml(name)}</div>
              ${phone ? `<a href="tel:${escapeHtml(cleanPhone)}" class="contact-link contact-phone">📞 ${escapeHtml(phone)}</a>` : ''}
              ${email ? `<a href="mailto:${escapeHtml(email)}" class="contact-link contact-email">✉️ ${escapeHtml(email)}</a>` : ''}
            </div>
          `;
        })
        .join('');

      contactsHtml = `
        <div class="modal-contacts-section">
          <h4 class="modal-contacts-title">Event Organizers & Contacts</h4>
          <div class="modal-contacts-grid">
            ${cardsHtml}
          </div>
        </div>
      `;
    }
  }

  // Register Button HTML (EXACTLY TWO STATES: Active Link or Disabled "Registration opens soon")
  let registerBtnHtml = '';
  if (regUrl) {
    const targetUrl = `/registration.html?api=${encodeURIComponent(regUrl)}`;
    registerBtnHtml = `
      <a href="${escapeHtml(targetUrl)}" class="btn-primary modal-register-btn">
        <span>Register Now</span> ↗
      </a>
    `;
  } else {
    registerBtnHtml = `
      <button disabled class="btn-primary modal-register-btn disabled" aria-disabled="true">
        <span>Registration opens soon</span>
      </button>
    `;
  }

  modalContent.innerHTML = `
    <div class="modal-header-group">
      <span class="card-badge">${escapeHtml(event.category || 'General')}</span>
      <h2 class="modal-event-title">${escapeHtml(event.title)}</h2>
      ${tagline ? `<p class="modal-event-tagline">${escapeHtml(tagline)}</p>` : ''}
    </div>

    <p class="modal-event-desc">${escapeHtml(event.desc)}</p>

    ${prizeCardHtml}
    ${infoGridHtml}
    ${rulesHtml}
    ${contactsHtml}
    ${registerBtnHtml}
  `;

  modalOverlay.style.display = 'flex';
  void modalOverlay.offsetWidth; // Force reflow
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEventModal() {
  const modalOverlay = document.getElementById('event-modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      modalOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
}

function initModalListeners() {
  const modalOverlay = document.getElementById('event-modal-overlay');
  const closeBtn = document.getElementById('event-modal-close');

  if (!modalOverlay) return;

  closeBtn?.addEventListener('click', () => {
    closeEventModal();
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeEventModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeEventModal();
    }
  });
}

function initSearchListener() {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    renderEvents();
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

import { initNavigation } from './navigation';

document.addEventListener('DOMContentLoaded', () => {
  initSearchListener();
  initModalListeners();
  fetchEvents();
  initNavigation();
});
