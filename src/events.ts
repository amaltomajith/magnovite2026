// Replace with your Google Apps Script Web App deployment URL
const API_URL = "REPLACE_WITH_APPS_SCRIPT_URL";

interface EventItem {
  title: string;
  desc: string;
  category: string;
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

const DEFAULT_DEMO_EVENTS: EventItem[] = [
  { title: "Robo Soccer", desc: "Build autonomous or remote-controlled bots to compete in a high-stakes soccer tournament.", category: "Robotics" },
  { title: "Code Relay", desc: "Speed coding relay challenge where teams write modular code under pressure.", category: "Coding" },
  { title: "Reverse Coding", desc: "Analyze compiled binary behaviors and reverse engineer the source algorithm.", category: "Coding" },
  { title: "Battle of the Bands", desc: "Flagship live musical showdown featuring top college rock and fusion bands.", category: "Music" },
  { title: "Acapella", desc: "Vocal harmony competition showcasing pure unassisted choral arrangements.", category: "Music" },
  { title: "CAD Design", desc: "3D parametric modeling challenge testing precision, speed, and structural integrity.", category: "Design" },
  { title: "Spark Tank", desc: "Pitch startup innovations and prototype business models to top venture mentors.", category: "Entrepreneurship" },
  { title: "Chamber of Secrets", desc: "Mystery puzzle solving and cryptographic riddle challenge across campus.", category: "Gaming" },
  { title: "Escape Room", desc: "Immersive escape room filled with logic puzzles, mechanical keys, and hidden clues.", category: "Gaming" },
  { title: "Drone Obstacle", desc: "Navigate FPV drones through tight obstacle courses and precision air hoops.", category: "Robotics" },
  { title: "Best Manager", desc: "Comprehensive leadership test assessing crisis management, strategy, and stress handling.", category: "Management" },
  { title: "Street Dance Battle", desc: "High-energy street dance battle featuring hip-hop, popping, and breaking duels.", category: "Dance" },
  { title: "Theme Dance", desc: "Choreographed group dance competition centering around futuristic storytelling themes.", category: "Dance" },
  { title: "Non Theme Dance", desc: "Freeform group dance showcasing versatile choreography and synchronized rhythms.", category: "Dance" },
  { title: "Street Play", desc: "Social awareness street play (Nukkad Natak) bringing loud, dramatic street theater.", category: "Drama" },
  { title: "Argo Royale", desc: "Tactical esports tournament featuring intense battle royale action and squad play.", category: "Gaming" },
  { title: "RC Car Challenge", desc: "Off-road remote control car racing through rugged terrain and steep inclines.", category: "Robotics" },
  { title: "Byte and Board", desc: "Hardware assembly and micro-controller circuit building hackathon.", category: "Electronics" },
  { title: "Smart City", desc: "Model sustainable urban infrastructure using IoT sensors, renewable grids, and AI.", category: "Innovation" },
  { title: "Eco Forge", desc: "Sustainable green product engineering challenge using recycled materials.", category: "Innovation" },
  { title: "Enigma", desc: "Cybersecurity capture-the-flag (CTF) testing vulnerability exploitation and forensics.", category: "Cybersecurity" },
  { title: "Finance Pitch", desc: "Corporate financial modeling, portfolio risk analysis, and stock valuation challenge.", category: "Management" },
  { title: "Marketing Challenge", desc: "Brand positioning, guerilla ad campaigns, and social media viral marketing pitch.", category: "Management" },
  { title: "Human Resource", desc: "Corporate HR simulation resolving workplace disputes and organizational scaling.", category: "Management" },
  { title: "Case Craft", desc: "Real-world business case study analysis and consulting deck presentation.", category: "Management" },
  { title: "How I Met Your Killer", desc: "Murder mystery investigation analyzing crime scenes, forensic evidence, and alibis.", category: "Gaming" },
  { title: "The Chase", desc: "Campus-wide treasure hunt with real-time GPS clues and speed checkpoints.", category: "Gaming" },
  { title: "Pixel Perspective", desc: "Digital photography challenge focusing on macro aesthetics, lighting, and composition.", category: "Media" },
  { title: "Frames Unboxed", desc: "Short filmmaking contest highlighting cinematic storytelling and video editing.", category: "Media" },
  { title: "Archicraft", desc: "Architectural structure prototyping using minimalist building materials and geometry.", category: "Design" },
  { title: "Pattern Play", desc: "UI/UX wireframing and design design-system creation sprint for web platforms.", category: "Design" },
  { title: "Switch and Scene", desc: "Improv acting duel where performers switch characters dynamically mid-scene.", category: "Drama" },
  { title: "The Nexus", desc: "Cross-disciplinary innovation summit integrating tech, art, and business.", category: "Innovation" },
  { title: "Severance Cup", desc: "Inter-college debate championship on tech ethics, AI policy, and governance.", category: "Literary" }
];

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

  if (!API_URL || API_URL === "REPLACE_WITH_APPS_SCRIPT_URL") {
    console.info('[Events Pipeline] Displaying comprehensive event dataset.');
    cachedEvents = DEFAULT_DEMO_EVENTS;
    statusContainer.innerHTML = '';
    renderCategories();
    renderEvents();
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

    cachedEvents = data.length > 0 ? data : DEFAULT_DEMO_EVENTS;
    statusContainer.innerHTML = '';
    renderCategories();
    renderEvents();
  } catch (error) {
    console.error('[Events Fetch Error]', error);
    // Display demo dataset on error or fallback gracefully
    cachedEvents = DEFAULT_DEMO_EVENTS;
    statusContainer.innerHTML = '';
    renderCategories();
    renderEvents();
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
      <div class="status-empty">
        <p>No events match your current filter or search term.</p>
      </div>
    `;
    return;
  }

  statusContainer.innerHTML = '';

  gridContainer.innerHTML = filteredEvents
    .map((event) => {
      const slug = slugify(event.title);
      const rawSlug = slug.replace(/-/g, '');
      const imageSrc = EVENT_IMAGE_MAP[slug] || EVENT_IMAGE_MAP[rawSlug] || `/images/events/${slug}.jpg`;
      const fallbackSrc = '/images/shaanrahman.jpg';

      return `
        <article class="event-card">
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
  fetchEvents();
  initNavigation();
});
