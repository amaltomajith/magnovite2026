interface EventItem {
  title: string;
  desc: string;
  category: string;
  department:string;
  slug: string;
}

// Define state variables ONCE at the top level
let activeCategory = 'All';
let activeDepartment = 'All';
let searchQuery = '';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
/*                         | Event                 | Slug                    |   Image?|
| ------------------------ | --------------------- | ----------------------- | ------  |
| **CSE**                  |                       |                         |         |
| 1                        | Cipher Quest          | `cipher-quest`          | ❌      |
| 2                        | StrikeX               | `strikex`               | ❌      |
| 3                        | Sustain X             | `sustainx`              | ❌      |
| 4                        | Prompt Arcade         | `prompt-arcade`         | ❌      |
| **AIDS**                 |                       |                         |         |
| 5                        | Trace                 | `trace`                 | ❌      |
| 6                        | Pixel Whisper         | `pixelwhisper`          | ❌      |
| 7                        | Final Override        | `finaloverride`         | ❌      |
| 8                        | The Last Turn         | `lastturn`              | ❌      |
| **EEE**                  |                       |                         |         |
| 9                        | Gridlock              | `gridlock`              | ❌      |
| 10                       | Powerwiz              | `powerwiz`              | ❌      |
| 11                       | EV Motion 26          | `evmotion`              | ❌      |
| **Civil**                |                       |                         |         |
| 12                       | Arki Craft 2.0        | `arkicraft`             | ❌      |
| 13                       | Seismogami            | `seismogami`            | ❌      |
| 14                       | Eco Forge             | `eco-forge`             | ✅      |
| **Mech**                 |                       |                         |         |
| 15                       | Robo Soccer           | `robo-soccer`           | ✅      |
| 16                       | Bot Wars              | `botwars`               | ❌      |
| 17                       | Drone Obstacle        | `drone-obstacle`        | ✅      |
| **Automotive**           |                       |                         |         |
| 18                       | Apex Strategy         | `apex-strategy`         | ❌      |
| 19                       | Mud Run               | `mud-run`               | ❌      |
| 20                       | Drag Race Xtreme      | `drag-race-xtreme`      | ❌      |
| **Psychology**           |                       |                         |         |
| 21                       | How I Met Your Killer | `how-i-met-your-killer` | ✅      |
| 22                       | Shipwreck             | `shipwreck`             | ❌      |
| 23                       | Frames Unboxed        | `frames-unboxed`        | ✅      |
| 24                       | Switch and Scene      | `switch-and-scene`      | ✅      |
| **Architecture**         |                       |                         |         |
| 25                       | Battle Clay           | `battle-clay`           | ❌      |
| 26                       | Revival Outlook       | `revival-outlook`       | ✅      |
| 27                       | Utopian Land          | `utopian-land`          | ❌      |
| 28                       | Etherea               | `etherea`               | ❌      |
| 29                       | Archicraft            | `archicraft`            | ✅      |
| **Science & Humanities** |                       |                         |         |
| 30                       | The Bard's Gambit     | `bards-gambit`          | ❌      |
| 31                       | Canvas of Minds       | `canvas-of-minds`       | ❌      |
| 32                       | Squid Game            | `squid-game`            | ❌      |
| **MBA**                  |                       |                         |         |
| 33                       | Best Management Team  | `best-management-team`  | ❌      |
| 34                       | Qizz-Whizz            | `qizz-whizz`            | ❌      |
| 35                       | Startup Showdown      | `startup-showdown`      | ❌      |
| **BBA**                  |                       |                         |         |
| 36                       | Best Manager          | `best-manager`          | ✅      |
| 37                       | Corporate Crossfire   | `corporate-crossfire`   | ❌      |
| 38                       | Strategic Finance     | `strategic-finance`     | ❌      |
| 39                       | Marketing X PR        | `marketing-x-pr`        | ❌      |
| **IIIC**                 |                       |                         |         |
| 40                       | Case Craft            | `case-craft`            | ✅      |
| **Sports**               |                       |                         |         |
| 41                       | Chess Grandmaster     | `chess-grandmaster`     | ❌      |
| **General Fest**         |                       |                         |         |
| 42                       | Code Relay            | `code-relay`            | ✅      |
| 43                       | Reverse Coding        | `reverse-coding`        | ✅      |
| 44                       | Battle of the Bands   | `battle-of-the-bands`   | ✅      |
| 45                       | Acapella              | `acapella`              | ✅      |
| 46                       | CAD Design            | `cad-design`            | ✅      |
| 47                       | Spark Tank            | `spark-tank`            | ✅      |
| 48                       | Chamber of Secrets    | `chamber-of-secrets`    | ✅      |
| 49                       | Escape Room           | `escape-room`           | ✅      |
| 50                       | Street Dance Battle   | `street-dance-battle`   | ✅      |
| 51                       | Theme Dance           | `theme-dance`           | ✅      |
| 52                       | Non Theme Dance       | `non-theme-dance`       | ✅      |
| 53                       | Street Play           | `street-play`           | ✅      |
| 54                       | Argo Royale           | `argo-royale`           | ✅      |
| 55                       | RC Car Challenge      | `rc-car-challenge`      | ✅      |
| 56                       | Byte and Board        | `byte-and-board`        | ✅      |
| 57                       | Smart City            | `smart-city`            | ✅      |
| 58                       | Enigma                | `enigma`                | ✅      |
| 59                       | Finance Pitch         | `finance-pitch`         | ✅      |
| 60                       | Marketing Challenge   | `marketing-challenge`   | ✅      |
| 61                       | Human Resource        | `human-resource`        | ✅      |
| 62                       | The Chase             | `the-chase`             | ✅      |
| 63                       | Pixel Perspective     | `pixel-perspective`     | ✅      |
| 64                       | Pattern Play          | `pattern-play`          | ✅      |
| 65                       | The Nexus             | `the-nexus`             | ✅      |
| 66                       | Severance Cup         | `severance-cup`         | ✅      |
# ECE department
| 67                       | Gridlock	         	   |  'gridlock'             | ❌      |
| 68	                     | Powerwiz		           |  'powerwiz'             | ❌      |
| 69	                     | EV Motion 26	         |  'evmotion'             | ❌      |

*/ 
const EVENT_IMAGE_MAP: Record<string, string> = {
  // ─── Direct Matches / Synced ───
  'acapella': '/images/events/acapella.jpg',
  'antrix': '/images/events/antrix.png',
  'apex-strategy':'/images/events/apex-strategy.png',
  'arkicraft': '/images/events/arkicraft.png',
  'argo-royale': '/images/events/SEVERANCE CUP.jpg',
  'bards-gambit': '/images/events/bards-gambit.png', 
  'battle-clay': '/images/events/battle-clay.png',
  'battle-of-the-bands': '/images/events/battleofbands.jpg',
  'best-management-team': '/images/events/best-management-team.png',
  'best-manager': '/images/events/bestmanager.avif',
  'bitforge': '/images/events/bitforge.png',
  'bot-wars': '/images/events/bot-wars.png',
  'canvas-of-minds': '/images/events/canvas-of-minds.png',
  'casecraft-pitch-and-pivot': '/images/events/casecraft.jpg',
  'chamber-of-secrets': '/images/events/chamberofsecrets.jpg',
  'chess-grandmaster': '/images/events/chess-grandmaster.png',
  'cipher-quest': '/images/events/cipher-quest.png',
  'corporate-crossfire': '/images/events/businessplan.jpg',
  'drag-race-xtreme': '/images/events/drag-race-xtreme.png',
  'drone-maze-challenge': '/images/events/drone.jpg',
  'ecoforge-2-0': '/images/events/ecoforge.jpg',
  'escape-room': '/images/events/escaperoom.jpg',
  'etherea': '/images/events/etherea.png',
  'evmotion26': '/images/events/evmotion26.png',
  'final-override': '/images/events/finaloverride.png',
  'frames-unboxed': '/images/events/framesunboxed.jpg',
  'gridlock': '/images/events/grid.jpg',
  'how-i-met-your-killer': '/images/events/howimeturkiller.jpg',
  'infinity-code-red': '/images/events/infinity-code-red.png',
  'marketing-x-pr': '/images/events/marketing.jpg',
  'mud-run': '/images/events/mud-run.png',
  'non-theme-dance': '/images/events/nontheme.jpg',
  'pattern-play': '/images/events/patternplay.jpg',
  'pixel-perspective': '/images/events/pixelperspective.jpg',
  'pixel-whisper': '/images/events/pixel-whisper.png',
  'powerwiz': '/images/events/technicalworkshop.jpg',
  'prompt-arcade': '/images/events/coderelay.jpg',
  'quiz-whizz': '/images/events/finance.jpg',
  'rc-robo-soccer': '/images/events/robosoccer.jpg',
  'revival-outlook': '/images/events/reviwaloutlook.jpg',
  'seismogami': '/images/events/archicraft.jpg',
  'shipwreck': '/images/events/shipwreck.png',
  'spark-tank': '/images/events/sparktank.jpg',
  'squid-game': '/images/events/squid-game.png',
  'startup-showdown': '/images/events/startup-showdown.png',
  'strikex': '/images/events/strikex.png',
  'strategic-finance': '/images/events/strategic-finance.png',
  'street-dance-battle': '/images/events/streetdancebattle.JPG',
  'street-play': '/images/events/streetplay.jpg',
  'sustain-x': '/images/events/smartcity.jpg',
  'switch-and-scene': '/images/events/switchandscene.jpg',
  'the-chase': '/images/events/chase.jpg',
  'the-last-turn': '/images/events/the-last-turn.png',
  'the-nexus': '/images/events/thenexus.jpg',
  'theme-dance': '/images/events/themedance.jpg',
  'trace': '/images/events/enigma.jpg',
  'utopian-land': '/images/events/utopian-land.png'
};

const STATIC_EVENTS: EventItem[] = [
  // ─── COMPUTER SCIENCE & ENGINEERING ───
  { title: "Cipher Quest", slug: "cipher-quest", desc: "Cryptography challenges cracking Caesar, Vigenère, and Affine ciphers.", category: "Cybersecurity", department: "Computer Science & Engineering (CSE)" },
  { title: "StrikeX", slug: "strikex", desc: "EFootball™ Mobile tournament.", category: "Gaming", department: "Computer Science & Engineering (CSE)" },
  { title: "Sustain X", slug: "sustain-x", desc: "Build and pitch tech solutions aligned with the UN Sustainable Development Goals.", category: "Innovation", department: "Computer Science & Engineering (CSE)" },
  { title: "Prompt Arcade", slug: "prompt-arcade", desc: "Game development challenge where participants create a game and its website.", category: "Coding", department: "Computer Science & Engineering (CSE)" },

  // ─── AI & DATA SCIENCE ───
  { title: "Trace", slug: "trace", desc: "Digital forensics investigation tracking cyber footprints and analyzing evidence.", category: "Cybersecurity", department: "Artificial Intelligence & Data Science (AIDS)" },
  { title: "Pixel Whisper", slug: "pixel-whisper", desc: "Communication-free relay where teams recreate a target image through generative AI chains.", category: "Innovation", department: "Artificial Intelligence & Data Science (AIDS)" },
  { title: "Final Override", slug: "final-override", desc: "Five-stage technical escape mission recovering key fragments through forensics, decoding, and CTF.", category: "Cybersecurity", department: "Artificial Intelligence & Data Science (AIDS)" },
  { title: "The Last Turn", slug: "the-last-turn", desc: "Horror-themed maze escape with random obstructions, puzzles, and a ticking clock.", category: "Gaming", department: "Artificial Intelligence & Data Science (AIDS)" },

  // ─── ELECTRICAL & ELECTRONICS ENGINEERING ───
  { title: "Gridlock", slug: "gridlock", desc: "Design, operate, and stabilize a power grid through shifting generation, load, and contingencies.", category: "Electronics", department: "Electrical & Electronics Engineering (EEE)" },
  { title: "Powerwiz", slug: "powerwiz", desc: "Two-stage power electronics challenge combining converter design, simulation, and hardware testing.", category: "Electronics", department: "Electrical & Electronics Engineering (EEE)" },
  { title: "EV Motion 26", slug: "evmotion26", desc: "Three-stage EV challenge combining ADAS simulation, vehicle design, and prototype development.", category: "Electronics", department: "Electrical & Electronics Engineering (EEE)" },

  // ─── ELECTRONICS & COMMUNICATIONS ENGINEERING ───
  { title: "Infinity: Code Red", slug: "infinity-code-red", desc: "Find the Fragments. Unlock the Impossible.", category: "Electronics", department: "Electronics and Communication Engineering (ECE)" },
  { title: "Antrix", slug: "antrix", desc: "Shape the Wave. Define the Future", category: "Electronics", department: "Electronics and Communication Engineering (ECE)" },
  { title: "BitForge", slug: "bitforge", desc: "The code is flawed. The clock is ticking. Bring the logic to life.", category: "Electronics", department: "Electronics and Communication Engineering (ECE)" },

  // ─── CIVIL ENGINEERING ───
  { title: "Arki Craft 2.0", slug: "arkicraft", desc: "Translate a live civil planning brief into a complete, functional AutoCAD design under the clock.", category: "Design", department: "Civil Engineering" },
  { title: "Seismogami", slug: "seismogami", desc: "Build earthquake-resistant structures and test them against simulated seismic forces.", category: "Design", department: "Civil Engineering" },
  { title: "EcoForge 2.0", slug: "ecoforge-2-0", desc: "Engineer sustainable products from recycled materials in a green innovation challenge.", category: "Innovation", department: "Civil Engineering" },

  // ─── MECHANICAL ENGINEERING ───
  { title: "RC Robo Soccer", slug: "rc-robo-soccer", desc: "Build and deploy autonomous or RC bots in a fast-paced soccer tournament where engineering meets teamwork.", category: "Robotics", department: "Mechanical Engineering" },
  { title: "Bot Wars", slug: "bot-wars", desc: "Combat robot arena where strategy, power, and control determine the last bot standing.", category: "Robotics", department: "Mechanical Engineering" },
  { title: "Drone Maze Challenge", slug: "drone-maze-challenge", desc: "Pilot FPV drones through tight obstacle courses testing precision, speed, and control.", category: "Robotics", department: "Mechanical Engineering" },

  // ─── AUTOMOTIVE ENGINEERING ───
  { title: "Apex Strategy", slug: "apex-strategy", desc: "Develop and execute winning F1 race strategies using telemetry, tire data, and pit-stop timing.", category: "Automotive", department: "Automotive Engineering" },
  { title: "Mud Run", slug: "mud-run", desc: "RC off-road obstacle course racing through mud pits, rock gardens, ramps, and technical terrain.", category: "Automotive", department: "Automotive Engineering" },
  { title: "Drag Race Xtreme", slug: "drag-race-xtreme", desc: "High-speed RC drag racing over a 35m straight track — optimize acceleration, traction, and gearing.", category: "Automotive", department: "Automotive Engineering" },

  // ─── PSYCHOLOGY ───
  { title: "How I Met Your Killer", slug: "how-i-met-your-killer", desc: "Three-round murder mystery where teams analyze clues and interrogate suspects to crack the case.", category: "Gaming", department: "Psychology" },
  { title: "Shipwreck", slug: "shipwreck", desc: "Legendary figures debate survival in a lifeboat showdown of wit, logic, and charisma.", category: "Drama", department: "Psychology" },
  { title: "Frames Unboxed", slug: "frames-unboxed", desc: "On-the-spot filmmaking contest where teams craft short films from a surprise theme.", category: "Media", department: "Psychology" },
  { title: "Switch and Scene", slug: "switch-and-scene", desc: "Improv theatre duel with sudden role reversals, genre shifts, and emotional twists.", category: "Drama", department: "Psychology" },

  // ─── SCHOOL OF ARCHITECTURE ───
  { title: "Battle Clay", slug: "battle-clay", desc: "Transform raw clay into expressive 3D sculptures under time pressure.", category: "Design", department: "School of Architecture" },
  { title: "Revival Outlook", slug: "revival-outlook", desc: "Fashion design competition merging architecture, culture, and sustainable materials into wearable art.", category: "Design", department: "School of Architecture" },
  { title: "Utopian Land", slug: "utopian-land", desc: "Digital concept art competition building speculative cities and alternate realities.", category: "Design", department: "School of Architecture" },
  { title: "Etherea", slug: "etherea", desc: "Expressive sketching event turning imagination and observation into powerful visual stories.", category: "Design", department: "School of Architecture" },

  // ─── SCIENCE & HUMANITIES ───
  { title: "The Bard's Gambit", slug: "bards-gambit", desc: "Rhetoric and literary debate blending history, philosophy, and persuasive eloquence.", category: "Literary", department: "Science & Humanities" },
  { title: "Canvas of Minds", slug: "canvas-of-minds", desc: "Face-painting competition transforming STEM and literature concepts into living art.", category: "Design", department: "Science & Humanities" },
  { title: "Squid Game", slug: "squid-game", desc: "Team survival challenge inspired by the series, testing coordination, memory, and strategy.", category: "Gaming", department: "Science & Humanities" },

  // ─── MBA ───
  { title: "Best Management Team", slug: "best-management-team", desc: "Two-day airline-hotel merger simulation across marketing, finance, HR, and crisis communication.", category: "Management", department: "MBA" },
  { title: "Qizz-Whizz", slug: "quiz-whizz", desc: "Two-day business quiz testing observation, commercial reasoning, and strategic risk-taking.", category: "Management", department: "MBA" },
  { title: "Startup Showdown", slug: "startup-showdown", desc: "Entrepreneurship simulation from opportunity cards to investor pitch with unexpected crisis twists.", category: "Entrepreneurship", department: "MBA" },

  // ─── BBA ───
  { title: "Best Manager", slug: "best-manager", desc: "360° management simulation testing leadership, strategy, and crisis decision-making under pressure.", category: "Management", department: "BBA" },
  { title: "Corporate Crossfire", slug: "corporate-crossfire", desc: "Navigate corporate conflicts, stakeholder dilemmas, and ethical challenges under pressure.", category: "Management", department: "BBA" },
  { title: "Strategic Finance", slug: "strategic-finance", desc: "Dual-track competition merging corporate strategy decisions with wealth management challenges.", category: "Management", department: "BBA" },
  { title: "Marketing X PR", slug: "marketing-x-pr", desc: "High-stakes brand campaign and PR challenge turning bold ideas into powerful public narratives.", category: "Management", department: "BBA" },

  // ─── IIIC ───
  { title: "CaseCraft: Pitch & Pivot", slug: "casecraft-pitch-and-pivot", desc: "Analyze live industry cases, survive unexpected twists, and pitch solutions to investor panels.", category: "Management", department: "IIIC" },

  // ─── SPORTS ───
  { title: "Chess Grandmaster", slug: "chess-grandmaster", desc: "Competitive chess showdown testing strategic thinking, tactics, and decision-making precision.", category: "Sports", department: "Sports" },

  // ─── GENERAL FEST EVENTS ───
  { title: "Battle of the Bands", slug: "battle-of-the-bands", desc: "Live musical showdown featuring college rock and fusion bands competing for the crown.", category: "Music", department: "General Fest Events" },
  { title: "Acapella", slug: "acapella", desc: "Pure vocal harmony competition showcasing unassisted choral arrangements.", category: "Music", department: "General Fest Events" },
  { title: "Spark Tank", slug: "spark-tank", desc: "Pitch startup innovations and prototype business models to top venture mentors.", category: "Entrepreneurship", department: "General Fest Events" },
  { title: "Chamber of Secrets", slug: "chamber-of-secrets", desc: "Mystery puzzle solving and cryptographic riddle challenge across campus.", category: "Gaming", department: "General Fest Events" },
  { title: "Escape Room", slug: "escape-room", desc: "Immersive escape room filled with logic puzzles, mechanical keys, and hidden clues.", category: "Gaming", department: "General Fest Events" },
  { title: "Street Dance Battle", slug: "street-dance-battle", desc: "High-energy street dance battle featuring hip-hop, popping, and breaking duels.", category: "Dance", department: "General Fest Events" },
  { title: "Theme Dance", slug: "theme-dance", desc: "Choreographed group dance competition centering around futuristic storytelling themes.", category: "Dance", department: "General Fest Events" },
  { title: "Non Theme Dance", slug: "non-theme-dance", desc: "Freeform group dance showcasing versatile choreography and synchronized rhythms.", category: "Dance", department: "General Fest Events" },
  { title: "Street Play", slug: "street-play", desc: "Social awareness street play (Nukkad Natak) bringing loud, dramatic street theater.", category: "Drama", department: "General Fest Events" },
  { title: "Argo Royale", slug: "argo-royale", desc: "Tactical esports tournament featuring intense battle royale action and squad play.", category: "Gaming", department: "General Fest Events" },
  { title: "The Chase", slug: "the-chase", desc: "Campus-wide treasure hunt with real-time GPS clues and speed checkpoints.", category: "Gaming", department: "General Fest Events" },
  { title: "Pixel Perspective", slug: "pixel-perspective", desc: "Digital photography challenge focusing on macro aesthetics, lighting, and composition.", category: "Media", department: "General Fest Events" },
  { title: "Pattern Play", slug: "pattern-play", desc: "UI/UX wireframing and design-system creation sprint for web platforms.", category: "Design", department: "General Fest Events" },
  { title: "The Nexus", slug: "the-nexus", desc: "Cross-disciplinary innovation summit integrating tech, art, and business.", category: "Innovation", department: "General Fest Events" },
];

function setupCustomDropdown(
  containerId: string, 
  defaultLabel: string, 
  items: string[], 
  onSelect: (value: string) => void
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const trigger = container.querySelector('.dropdown-trigger') as HTMLButtonElement;
  const label = container.querySelector('.dropdown-label') as HTMLSpanElement;
  const menu = container.querySelector('.dropdown-menu') as HTMLDivElement;

  if (!trigger || !menu || !label) return;

  // Render options inside floating menu
  const options = ['All', ...items];
  menu.innerHTML = options
    .map(
      (item, idx) => `
      <div 
        class="dropdown-item ${idx === 0 ? 'active' : ''}" 
        data-value="${escapeHtml(item)}"
      >
        <span>${escapeHtml(item === 'All' ? defaultLabel : item)}</span>
      </div>
    `
    )
    .join('');

  // Toggle open / close
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // Close other dropdowns
    document.querySelectorAll('.custom-dropdown').forEach((el) => {
      if (el !== container) el.classList.remove('open');
    });
    container.classList.toggle('open');
  });

  // Option select handler
  menu.querySelectorAll('.dropdown-item').forEach((option) => {
    option.addEventListener('click', () => {
      const val = option.getAttribute('data-value') || 'All';
      
      // Update UI active states
      menu.querySelectorAll('.dropdown-item').forEach((i) => i.classList.remove('active'));
      option.classList.add('active');
      
      label.textContent = val === 'All' ? defaultLabel : val;
      container.classList.remove('open');
      
      onSelect(val);
    });
  });
}

function renderFilterDropdowns() {
  const departments = Array.from(
    new Set(STATIC_EVENTS.map((item) => item.department).filter(Boolean))
  ) as string[];

  const categories = Array.from(
    new Set(STATIC_EVENTS.map((item) => item.category).filter(Boolean))
  ) as string[];

  setupCustomDropdown('dept-dropdown', 'All Departments', departments, (val) => {
    activeDepartment = val;
    renderEvents();
  });

  setupCustomDropdown('cat-dropdown', 'All Categories', categories, (val) => {
    activeCategory = val;
    renderEvents();
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown').forEach((el) => el.classList.remove('open'));
  });
}

function renderEvents() {
  const gridContainer = document.getElementById('events-grid');
  const statusContainer = document.getElementById('events-status');
  if (!gridContainer || !statusContainer) return;

  const query = searchQuery.toLowerCase().trim();
  const filteredEvents = STATIC_EVENTS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.department && item.department.toLowerCase().includes(query));

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
    .map((event) => {
      const slug = event.slug || slugify(event.title);
      const rawSlug = slug.replace(/-/g, '');
      const imageSrc = EVENT_IMAGE_MAP[slug] || EVENT_IMAGE_MAP[rawSlug] || `/images/events/${slug}.jpg`;
      const fallbackSrc = '/images/events/robosoccer.jpg';

      return `
        <a href="/events/${slug}.html" class="event-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column;">
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
        </a>
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
import { initGalaxySky } from './galaxySky';

document.addEventListener('DOMContentLoaded', () => {
  initGalaxySky();
  initSearchListener();
  renderFilterDropdowns();
  renderEvents();
  initNavigation();
});
