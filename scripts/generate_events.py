import os

events_data = [
    {
        'slug': 'robo-soccer',
        'title': 'Robo Soccer 🤖⚽',
        'category': 'Robotics',
        'tagline': 'High-stakes autonomous & RC bot soccer battle',
        'desc': 'Build autonomous or remote-controlled bots to compete in a high-stakes soccer tournament. Test your engineering skills, bot mobility, and strategic goal scoring against top rival teams.',
        'prize': '₹25,000',
        'date': '15 Sept 2026',
        'fee': '₹300',
        'team_size': '3-5 Members',
        'rounds': '2 Rounds (Group Stage + Knockout Finale)',
        'rules': [
            'Bots must fit within the specified dimensions (30cm x 30cm x 30cm) and weight limit (5kg).',
            'Both wired and wireless remote-controlled or autonomous bots are permitted.',
            'Matches consist of two halves of 5 minutes each with a 2-minute half-time break.',
            'Intentional damage to opponent bots will result in immediate disqualification.',
            'Decisions of the event referees are final and binding.'
        ],
        'faqs': [
            {'q': 'Can we use off-the-shelf chassis?', 'a': 'Yes, commercial chassis are permitted as long as custom modifications comply with weight limits.'},
            {'q': 'Are wired controllers allowed?', 'a': 'Yes, wired controllers with minimum 3-meter wire length are allowed.'}
        ],
        'contacts': [
            {'name': 'Arjun Mehta (Student POC)', 'phone': '+91 98765 11111', 'email': 'arjun.m@christuniversity.in'},
            {'name': 'Prof. Rajesh Kumar (Faculty Coordinator)', 'phone': '+91 98765 22222', 'email': 'rajesh.kumar@christuniversity.in'}
        ]
    },
    {
        'slug': 'code-relay',
        'title': 'Code Relay 💻⚡',
        'category': 'Coding',
        'tagline': 'Speed coding relay challenge under pressure',
        'desc': 'Speed coding relay challenge where teams write modular code under pressure. Teammates swap seats at timed intervals to complete complex algorithm challenges without verbal communication mid-relay.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2-4 Members',
        'rounds': '3 Rounds (Sprint, Modular Relay, Speed Fix)',
        'rules': [
            'Teams rotate programmers every 15 minutes upon signal.',
            'No verbal or non-verbal communication is allowed during rotation swaps.',
            'All code must pass automated test suites for correctness and execution time.',
            'No external AI assistance, code generators, or internet browsing permitted.',
            'Submissions are scored on accuracy, memory optimization, and speed.'
        ],
        'faqs': [
            {'q': 'What programming languages are supported?', 'a': 'C++, Java, Python, and JavaScript.'},
            {'q': 'Can we bring cheat sheets?', 'a': 'No physical or digital reference materials are allowed.'}
        ],
        'contacts': [
            {'name': 'Neha Sharma (Student Lead)', 'phone': '+91 98765 33333', 'email': 'neha.s@christuniversity.in'},
            {'name': 'Dr. Suresh V. (Faculty Lead)', 'phone': '+91 98765 44444', 'email': 'suresh.v@christuniversity.in'}
        ]
    },
    {
        'slug': 'reverse-coding',
        'title': 'Reverse Coding 🔍💻',
        'category': 'Coding',
        'tagline': 'Analyze binary outputs to reverse-engineer source algorithms',
        'desc': 'Analyze compiled binary behaviors, sample input-output pairs, and reverse engineer the underlying algorithms. Test your logical deduction, black-box analysis, and programming speed.',
        'prize': '₹10,000',
        'date': '16 Sept 2026',
        'fee': '₹150',
        'team_size': 'Individual / Duo',
        'rounds': '2 Rounds (Prelims + Final Challenge)',
        'rules': [
            'Participants are provided only executable binaries and input-output test patterns.',
            'Source code must be rewritten to match exact input-output behavior for hidden edge cases.',
            'Disassemblers and decompiler tools are permitted.',
            'Time-based tie breakers apply for identical test suite scores.'
        ],
        'faqs': [
            {'q': 'Is prior reverse-engineering experience required?', 'a': 'Basic programming logic and familiarity with input-output mapping is sufficient.'}
        ],
        'contacts': [
            {'name': 'Karan Gupta (Student Lead)', 'phone': '+91 98765 55555', 'email': 'karan.g@christuniversity.in'}
        ]
    },
    {
        'slug': 'battle-of-the-bands',
        'title': 'Battle of the Bands 🎸🥁',
        'category': 'Music',
        'tagline': 'Flagship live musical showdown for college bands',
        'desc': 'Flagship live musical showdown featuring top college rock, metal, indie, and fusion bands. Compete on the big stage with full sound setups, lighting, and energetic audience vibes.',
        'prize': '₹40,000',
        'date': '16 Sept 2026',
        'fee': '₹600',
        'team_size': '3-8 Members',
        'rounds': '1 Main Stage Performance (15 Mins Slot)',
        'rules': [
            'Performance slot is strictly limited to 15 minutes including setup and sound check.',
            'Bands must perform at least one original composition or creative arrangement.',
            'Drum kit and PA system provided; bands must bring their own instruments, processors, and breakables.',
            'Explicit or offensive lyrics are strictly prohibited.'
        ],
        'faqs': [
            {'q': 'Is backing track allowed?', 'a': 'No pre-recorded backing tracks are permitted; all music must be live.'}
        ],
        'contacts': [
            {'name': 'Rohan Das (Music Coordinator)', 'phone': '+91 98765 66666', 'email': 'rohan.d@christuniversity.in'}
        ]
    },
    {
        'slug': 'acapella',
        'title': 'Acapella 🎤🎶',
        'category': 'Music',
        'tagline': 'Pure unassisted vocal harmony competition',
        'desc': 'Vocal harmony competition showcasing pure unassisted choral arrangements. Blend beatboxing, vocal basslines, and rich harmonies without any instrumental backing.',
        'prize': '₹20,000',
        'date': '15 Sept 2026',
        'fee': '₹400',
        'team_size': '4-12 Members',
        'rounds': '1 Stage Performance (8 Mins)',
        'rules': [
            'Zero musical instruments permitted; all sounds must be produced vocally.',
            'Time limit: 8 minutes stage time.',
            'Scoring based on vocal pitch precision, arrangement complexity, rhythm, and dynamic expression.'
        ],
        'faqs': [
            {'q': 'Are vocal beatboxers allowed?', 'a': 'Yes, vocal percussion and beatboxing are encouraged.'}
        ],
        'contacts': [
            {'name': 'Priya Nair (Student Coordinator)', 'phone': '+91 98765 77777', 'email': 'priya.n@christuniversity.in'}
        ]
    },
    {
        'slug': 'cad-design',
        'title': 'CAD Design 📐💻',
        'category': 'Design',
        'tagline': '3D parametric modeling and structural design challenge',
        'desc': '3D parametric modeling challenge testing precision, speed, and structural integrity. Render technical engineering components and assemblies based on complex specification blueprints.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': 'Individual',
        'rounds': '2 Rounds (Part Modeling + Assembly)',
        'rules': [
            'Approved CAD software: SolidWorks, Fusion 360, AutoCAD, CATIA.',
            'Models must strictly adhere to geometric dimensioning and tolerancing (GD&T) specifications.',
            'Participants must submit raw CAD files and exported isometric renderings.'
        ],
        'faqs': [
            {'q': 'Are laptops provided?', 'a': 'Participants are required to bring their own laptops with pre-installed CAD software.'}
        ],
        'contacts': [
            {'name': 'Vikas Patel (Design Lead)', 'phone': '+91 98765 88888', 'email': 'vikas.p@christuniversity.in'}
        ]
    },
    {
        'slug': 'spark-tank',
        'title': 'Spark Tank 💡🚀',
        'category': 'Entrepreneurship',
        'tagline': 'Pitch startup innovations to top venture mentors',
        'desc': 'Pitch startup innovations, business models, and working prototypes to seasoned venture capital mentors and angel investors. Prove market viability, unit economics, and scalability.',
        'prize': '₹30,000',
        'date': '16 Sept 2026',
        'fee': '₹400',
        'team_size': '2-4 Members',
        'rounds': '2 Rounds (Elevator Pitch + Deep Dive Q&A)',
        'rules': [
            'Pitch deck maximum 10 slides.',
            'Time limit: 6 minutes presentation + 4 minutes investor Q&A.',
            'Working prototypes or wireframes earn bonus evaluation points.'
        ],
        'faqs': [
            {'q': 'Can early-stage ideas apply?', 'a': 'Yes, both conceptual startups and active MVP projects are welcome.'}
        ],
        'contacts': [
            {'name': 'Ananya Rao (E-Cell Coordinator)', 'phone': '+91 98765 99999', 'email': 'ananya.r@christuniversity.in'}
        ]
    },
    {
        'slug': 'chamber-of-secrets',
        'title': 'Chamber of Secrets 🔑🏛️',
        'category': 'Gaming',
        'tagline': 'Cryptographic puzzle & campus mystery adventure',
        'desc': 'Mystery puzzle solving and cryptographic riddle challenge across campus. Unravel hidden cyphers, physical clues, and logic locks to unlock the ultimate chamber.',
        'prize': '₹12,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2-3 Members',
        'rounds': '3 Timed Secret Stages',
        'rules': [
            'Teams must solve clues sequentially to receive stage coordinates.',
            'Use of external physical force or tampering with campus property leads to instant ban.',
            'Fastest completion time determines the winning team.'
        ],
        'faqs': [
            {'q': 'Is campus mobility required?', 'a': 'Yes, teams will move across multiple designated campus checkpoints.'}
        ],
        'contacts': [
            {'name': 'Siddharth M. (Gaming Lead)', 'phone': '+91 98765 00001', 'email': 'siddharth.m@christuniversity.in'}
        ]
    },
    {
        'slug': 'escape-room',
        'title': 'Escape Room 🚪🔐',
        'category': 'Gaming',
        'tagline': 'Immersive logic puzzle escape challenge',
        'desc': 'Immersive escape room filled with physical mechanisms, logic puzzles, encoded ciphers, and hidden keys. Escape within the 30-minute countdown clock.',
        'prize': '₹15,000',
        'date': '16 Sept 2026',
        'fee': '₹250',
        'team_size': '2-4 Members',
        'rounds': '1 Timed Room Run (30 Mins)',
        'rules': [
            'Maximum time allowed inside room: 30 minutes.',
            'Hints cost 2 minutes penalty per request.',
            'All items inside the room must remain intact.'
        ],
        'faqs': [
            {'q': 'Is mobile usage allowed inside?', 'a': 'Phones must be placed in sealed pouches prior to entering.'}
        ],
        'contacts': [
            {'name': 'Diya V. (Student Lead)', 'phone': '+91 98765 00002', 'email': 'diya.v@christuniversity.in'}
        ]
    },
    {
        'slug': 'drone-obstacle',
        'title': 'Drone Obstacle 🛸🏁',
        'category': 'Robotics',
        'tagline': 'Navigate FPV drones through tight air courses',
        'desc': 'Navigate FPV drones through tight obstacle courses, precision hoops, slalom poles, and elevation jumps. Show off pilot skill, speed, and aerial control.',
        'prize': '₹30,000',
        'date': '16 Sept 2026',
        'fee': '₹500',
        'team_size': '1-3 Members',
        'rounds': '2 Rounds (Time Trial + Obstacle Final)',
        'rules': [
            'Drone propeller guards are mandatory.',
            'Frequency checks are required before powering on transmitters.',
            'Drones missing gates incur 5-second time penalties per gate.'
        ],
        'faqs': [
            {'q': 'Are custom built FPV drones allowed?', 'a': 'Yes, both custom builds and commercial quadcopters are permitted.'}
        ],
        'contacts': [
            {'name': 'Rahul Verma (Robotics Lead)', 'phone': '+91 98765 00003', 'email': 'rahul.v@christuniversity.in'}
        ]
    },
    {
        'slug': 'best-manager',
        'title': 'Best Manager 👔📈',
        'category': 'Management',
        'tagline': 'Comprehensive leadership crisis management test',
        'desc': 'Comprehensive leadership test assessing crisis management, strategic pivot planning, high-pressure press conferences, and stress handling across multi-stage corporate simulations.',
        'prize': '₹25,000',
        'date': '15-16 Sept 2026',
        'fee': '₹350',
        'team_size': 'Individual',
        'rounds': '5 Intensive Stages over 2 Days',
        'rules': [
            'Individual participation only.',
            'Formal business attire mandatory during all simulation rounds.',
            'Participants are evaluated on decision quality, communication, resilience, and ethics.'
        ],
        'faqs': [
            {'q': 'Is overnight availability required?', 'a': 'Certain simulation tasks may involve late evening case deadlines.'}
        ],
        'contacts': [
            {'name': 'Meera Krishnan (Management POC)', 'phone': '+91 98765 00004', 'email': 'meera.k@christuniversity.in'}
        ]
    },
    {
        'slug': 'street-dance-battle',
        'title': 'Street Dance Battle 🕺🔥',
        'category': 'Dance',
        'tagline': 'High-energy 1v1 and 2v2 street dance duels',
        'desc': 'High-energy street dance battle featuring hip-hop, popping, locking, krump, and breaking duels. Face off in 1v1 cipher battles judged live by professional street dancers.',
        'prize': '₹30,000',
        'date': '15 Sept 2026',
        'fee': '₹400',
        'team_size': '1-2 Members',
        'rounds': 'Cypher Qualifier + Knockout Battles',
        'rules': [
            'Random DJ music track selection for each round.',
            'Each dancer gets 2 rounds of 45 seconds per duel.',
            'No physical contact or disrespect toward opponents allowed.'
        ],
        'faqs': [
            {'q': 'Can I register on-the-spot?', 'a': 'Online pre-registration is recommended as cypher slots are limited.'}
        ],
        'contacts': [
            {'name': 'Aakash R. (Dance Coordinator)', 'phone': '+91 98765 00005', 'email': 'aakash.r@christuniversity.in'}
        ]
    },
    {
        'slug': 'theme-dance',
        'title': 'Theme Dance 🎭💃',
        'category': 'Dance',
        'tagline': 'Choreographed group dance with futuristic themes',
        'desc': 'Choreographed group dance competition centering around futuristic storytelling themes. Combine synchronized formations, theatrical props, and high-impact choreography.',
        'prize': '₹45,000',
        'date': '16 Sept 2026',
        'fee': '₹700',
        'team_size': '6-16 Members',
        'rounds': '1 Main Stage Showcase (10 Mins)',
        'rules': [
            'Time limit: 8-10 minutes performance duration.',
            'Theme concept note must be submitted prior to performance.',
            'Props allowed; use of open fire, liquids, or glass is strictly banned.'
        ],
        'faqs': [
            {'q': 'What is the stage dimension?', 'a': 'Main stage area is 40ft x 30ft with professional lighting grid.'}
        ],
        'contacts': [
            {'name': 'Sneha Paul (Dance Lead)', 'phone': '+91 98765 00006', 'email': 'sneha.p@christuniversity.in'}
        ]
    },
    {
        'slug': 'non-theme-dance',
        'title': 'Non Theme Dance 💃✨',
        'category': 'Dance',
        'tagline': 'Freeform group dance showcasing versatile rhythms',
        'desc': 'Freeform group dance showcasing versatile choreography, energetic execution, and synchronized group dynamics without thematic constraints.',
        'prize': '₹35,000',
        'date': '16 Sept 2026',
        'fee': '₹600',
        'team_size': '6-16 Members',
        'rounds': '1 Stage Showcase (8 Mins)',
        'rules': [
            'Time limit: 6-8 minutes.',
            'Any dance style or fusion mix permitted.',
            'Scoring emphasizes synchronization, energy, stage coverage, and costume aesthetics.'
        ],
        'faqs': [
            {'q': 'Should audio track be submitted in advance?', 'a': 'Audio tracks in MP3 format must be submitted at registration desk 2 hours prior.'}
        ],
        'contacts': [
            {'name': 'Kavya S. (Student POC)', 'phone': '+91 98765 00007', 'email': 'kavya.s@christuniversity.in'}
        ]
    },
    {
        'slug': 'street-play',
        'title': 'Street Play (Nukkad Natak) 📢🎭',
        'category': 'Drama',
        'tagline': 'Loud dramatic street theater for social impact',
        'desc': 'Social awareness street play (Nukkad Natak) bringing loud, energetic, and dramatic street theater to campus. Deliver powerful social messages using dholak, choruses, and rhythm.',
        'prize': '₹30,000',
        'date': '15 Sept 2026',
        'fee': '₹500',
        'team_size': '8-20 Members',
        'rounds': '1 Open-Air Circle Performance (12 Mins)',
        'rules': [
            'Performance must take place in open 360-degree circle setup.',
            'Time limit: 12 minutes maximum.',
            'Only live acoustic instruments (dholak, gulal, tambourine) permitted; no microphones or sound systems.'
        ],
        'faqs': [
            {'q': 'Is script approval required?', 'a': 'Synopsis must be submitted during reporting.'}
        ],
        'contacts': [
            {'name': 'Manish Kumar (Drama Lead)', 'phone': '+91 98765 00008', 'email': 'manish.k@christuniversity.in'}
        ]
    },
    {
        'slug': 'argo-royale',
        'title': 'Argo Royale 🎮🎯',
        'category': 'Gaming',
        'tagline': 'Tactical esports battle royale tournament',
        'desc': 'Tactical esports tournament featuring intense battle royale action and squad play. Compete in custom lobby matches across classic maps to claim the winner title.',
        'prize': '₹20,000',
        'date': '15 Sept 2026',
        'fee': '₹300',
        'team_size': 'Squad (4 Players)',
        'rounds': '3 Custom Lobby Matches (Point System)',
        'rules': [
            'Players must play on mobile devices only (Emulators strictly banned).',
            'Hacking, third-party plug-ins, or teaming up results in immediate permanent ban.',
            'Points awarded based on finish placement and kill points.'
        ],
        'faqs': [
            {'q': 'Is campus Wi-Fi provided?', 'a': 'High-speed dedicated esports Wi-Fi network will be available.'}
        ],
        'contacts': [
            {'name': 'Yash Joshi (Esports Coordinator)', 'phone': '+91 98765 00009', 'email': 'yash.j@christuniversity.in'}
        ]
    },
    {
        'slug': 'rc-car-challenge',
        'title': 'RC Car Challenge 🏎️💨',
        'category': 'Robotics',
        'tagline': 'Off-road remote control car racing challenge',
        'desc': 'Off-road remote control car racing through rugged terrain, sharp chicanes, steep inclines, and mud traps. Test chassis durability, acceleration, and cornering precision.',
        'prize': '₹20,000',
        'date': '16 Sept 2026',
        'fee': '₹300',
        'team_size': '2-4 Members',
        'rounds': '2 Rounds (Qualifying Lap + Track Final)',
        'rules': [
            'Electric motor driven RC vehicles only (Nitro/Gas models not allowed).',
            'Maximum vehicle length 50cm, width 35cm.',
            'Track boundary penalties: 3-second addition per boundary hit.'
        ],
        'faqs': [
            {'q': 'Can we swap batteries between laps?', 'a': 'Battery swaps are allowed during designated pit stops.'}
        ],
        'contacts': [
            {'name': 'Tanmay Roy (Student POC)', 'phone': '+91 98765 00010', 'email': 'tanmay.r@christuniversity.in'}
        ]
    },
    {
        'slug': 'byte-and-board',
        'title': 'Byte and Board 🔌🛠️',
        'category': 'Electronics',
        'tagline': 'Hardware micro-controller circuit hackathon',
        'desc': 'Hardware assembly and micro-controller circuit building hackathon. Design embedded systems, interface sensors, write firmware, and solve real-world hardware automation tasks.',
        'prize': '₹18,000',
        'date': '15 Sept 2026',
        'fee': '₹250',
        'team_size': '2-3 Members',
        'rounds': '1 Hardware Sprint (6 Hours)',
        'rules': [
            'Microcontrollers allowed: Arduino, ESP32, Raspberry Pi Pico.',
            'Components must be soldered or breadboarded cleanly during the sprint.',
            'Teams must present live hardware demonstration to judges.'
        ],
        'faqs': [
            {'q': 'Are basic sensors provided?', 'a': 'Standard starter sensor kits will be provided on-site.'}
        ],
        'contacts': [
            {'name': 'Deepak N. (Electronics Lead)', 'phone': '+91 98765 00011', 'email': 'deepak.n@christuniversity.in'}
        ]
    },
    {
        'slug': 'smart-city',
        'title': 'Smart City 🏙️🌱',
        'category': 'Innovation',
        'tagline': 'Model sustainable urban IoT & green energy grids',
        'desc': 'Model sustainable urban infrastructure using IoT sensors, renewable energy grids, smart traffic management, and AI waste optimization. Present scale models and software dashboards.',
        'prize': '₹25,000',
        'date': '16 Sept 2026',
        'fee': '₹350',
        'team_size': '2-4 Members',
        'rounds': 'Physical Model Presentation + Deck Pitch',
        'rules': [
            'Model dimensions maximum 1m x 1m base.',
            'Project must address at least 2 UN Sustainable Development Goals.',
            'Working IoT sensor integration carries bonus weightage.'
        ],
        'faqs': [
            {'q': 'Is power supply provided for models?', 'a': 'Standard 230V AC power sockets will be provided at team booths.'}
        ],
        'contacts': [
            {'name': 'Shreya B. (Innovation POC)', 'phone': '+91 98765 00012', 'email': 'shreya.b@christuniversity.in'}
        ]
    },
    {
        'slug': 'eco-forge',
        'title': 'Eco Forge ♻️🌱',
        'category': 'Innovation',
        'tagline': 'Green product engineering from recycled materials',
        'desc': 'Sustainable green product engineering challenge using upcycled waste materials. Engineer functional consumer or industrial prototypes from discarded electronic and plastic scrap.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2-4 Members',
        'rounds': 'Prototype Build & Life-Cycle Assessment Pitch',
        'rules': [
            'Minimum 70% of material used must be upcycled/recycled scrap.',
            'Teams must bring raw scrap materials; basic tools provided on campus.',
            'Assessment covers durability, commercial viability, and eco-impact.'
        ],
        'faqs': [
            {'q': 'Are power tools allowed?', 'a': 'Basic safety-approved handheld power tools are permitted.'}
        ],
        'contacts': [
            {'name': 'Aditya K. (Green Cell Lead)', 'phone': '+91 98765 00013', 'email': 'aditya.k@christuniversity.in'}
        ]
    },
    {
        'slug': 'enigma',
        'title': 'Enigma CTF 🔐💻',
        'category': 'Cybersecurity',
        'tagline': 'Capture-The-Flag cybersecurity hacking challenge',
        'desc': 'Cybersecurity capture-the-flag (CTF) testing vulnerability exploitation, web hacking, reverse engineering, binary exploitation, and digital forensics.',
        'prize': '₹20,000',
        'date': '16 Sept 2026',
        'fee': '₹250',
        'team_size': '1-3 Members',
        'rounds': 'Jeopardy Style CTF (5 Hours)',
        'rules': [
            'Jeopardy style flag submission system.',
            'Attacking CTF platform infrastructure or denial of service leads to disqualification.',
            'Sharing flags between competing teams is strictly prohibited.'
        ],
        'faqs': [
            {'q': 'What OS is recommended?', 'a': 'Kali Linux or custom security distributions.'}
        ],
        'contacts': [
            {'name': 'Nikhil Jain (CyberSec Lead)', 'phone': '+91 98765 00014', 'email': 'nikhil.j@christuniversity.in'}
        ]
    },
    {
        'slug': 'finance-pitch',
        'title': 'Finance Pitch 📊📈',
        'category': 'Management',
        'tagline': 'Corporate financial modeling & stock valuation',
        'desc': 'Corporate financial modeling, portfolio risk analysis, M&A valuation, and stock pitch presentation before senior investment banking judges.',
        'prize': '₹18,000',
        'date': '15 Sept 2026',
        'fee': '₹250',
        'team_size': '2 Members',
        'rounds': '2 Rounds (Financial Valuation + Pitch Deck)',
        'rules': [
            'Excel DCF models and pitch decks must be submitted in advance.',
            'Presentations strictly timed at 7 minutes + 3 minutes Q&A.',
            'Plagiarism of analyst research reports results in DQ.'
        ],
        'faqs': [
            {'q': 'Are financial templates provided?', 'a': 'Case data files are released at event start.'}
        ],
        'contacts': [
            {'name': 'Pooja Hegde (Finance Lead)', 'phone': '+91 98765 00015', 'email': 'pooja.h@christuniversity.in'}
        ]
    },
    {
        'slug': 'marketing-challenge',
        'title': 'Marketing Challenge 📣🎯',
        'category': 'Management',
        'tagline': 'Brand positioning & guerilla ad campaign sprint',
        'desc': 'Brand positioning, guerilla ad campaign design, viral social media reels creation, and crisis PR management sprint for a mystery product.',
        'prize': '₹20,000',
        'date': '16 Sept 2026',
        'fee': '₹300',
        'team_size': '2-4 Members',
        'rounds': '2 Rounds (Campaign Reel + Strategy Deck)',
        'rules': [
            'Reels/videos must not exceed 60 seconds duration.',
            'All graphics and video assets must be created during the event window.',
            'Judging based on creativity, viral potential, target market positioning.'
        ],
        'faqs': [
            {'q': 'Can we use mobile editing apps?', 'a': 'Yes, Canva, CapCut, Premiere, etc. are allowed.'}
        ],
        'contacts': [
            {'name': 'Varun Malhotra (Marketing POC)', 'phone': '+91 98765 00016', 'email': 'varun.m@christuniversity.in'}
        ]
    },
    {
        'slug': 'human-resource',
        'title': 'Human Resource Simulation 👥📋',
        'category': 'Management',
        'tagline': 'Corporate HR crisis negotiation & organizational scaling',
        'desc': 'Corporate HR simulation resolving high-stakes union disputes, executive retention crises, workplace ethics investigations, and organizational restructuring.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2 Members',
        'rounds': '2 Rounds (Crisis Roleplay + HR Policy Pitch)',
        'rules': [
            'Live roleplay simulation with corporate dispute actors.',
            'Evaluated on labor law awareness, empathy, negotiation tactics, and policy rigor.'
        ],
        'faqs': [
            {'q': 'Is prior HR legal knowledge required?', 'a': 'Basic employment principles apply; scenario briefs are provided.'}
        ],
        'contacts': [
            {'name': 'Ritika Sen (HR Cell Lead)', 'phone': '+91 98765 00017', 'email': 'ritika.s@christuniversity.in'}
        ]
    },
    {
        'slug': 'case-craft',
        'title': 'Case Craft 💼🔍',
        'category': 'Management',
        'tagline': 'Real-world business strategy case consulting',
        'desc': 'Real-world business case study analysis and management consulting deck presentation. Tackle complex operational bottlenecks and present actionable turnarounds.',
        'prize': '₹18,000',
        'date': '16 Sept 2026',
        'fee': '₹250',
        'team_size': '2-3 Members',
        'rounds': 'Executive Deck Submission & Boardroom Pitch',
        'rules': [
            'Max 8 slide deck format.',
            'Root cause analysis frameworks (MECE, 3Cs, Porter 5 Forces) encouraged.',
            '7-minute presentation time limit.'
        ],
        'faqs': [
            {'q': 'When is the case released?', 'a': 'Case statement is released 24 hours prior to final presentation.'}
        ],
        'contacts': [
            {'name': 'Gaurav T. (Consulting Lead)', 'phone': '+91 98765 00018', 'email': 'gaurav.t@christuniversity.in'}
        ]
    },
    {
        'slug': 'how-i-met-your-killer',
        'title': 'How I Met Your Killer 🕵️‍♂️🔍',
        'category': 'Gaming',
        'tagline': 'Murder mystery forensic crime scene investigation',
        'desc': 'Murder mystery investigation analyzing crime scenes, forensic physical evidence, suspect alibis, and hidden motives. Cross-examine suspects to unmask the killer.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2-4 Members',
        'rounds': '3 Investigation Phases',
        'rules': [
            'Teams inspect physical crime scene setups for physical evidence.',
            'Interrogate suspect actors within allocated time blocks.',
            'Final verdict submission must include motive, method, and evidence proof.'
        ],
        'faqs': [
            {'q': 'Is time a factor?', 'a': 'Accurate deductions take priority; tie-breakers use speed.'}
        ],
        'contacts': [
            {'name': 'Simran Kaur (Student Lead)', 'phone': '+91 98765 00019', 'email': 'simran.k@christuniversity.in'}
        ]
    },
    {
        'slug': 'the-chase',
        'title': 'The Chase 🏃‍♂️🗺️',
        'category': 'Gaming',
        'tagline': 'Campus-wide GPS treasure hunt & speed checkpoints',
        'desc': 'Campus-wide high-speed treasure hunt with real-time GPS clues, physical challenges, and speed checkpoints. Race against rival teams to claim the ultimate trophy.',
        'prize': '₹15,000',
        'date': '16 Sept 2026',
        'fee': '₹200',
        'team_size': '2-4 Members',
        'rounds': 'Non-stop Campus Race',
        'rules': [
            'All team members must cross checkpoints together.',
            'No vehicles or motorized transport allowed.',
            'Tampering with clue markers leads to immediate DQ.'
        ],
        'faqs': [
            {'q': 'Are comfortable shoes recommended?', 'a': 'Highly recommended as the hunt spans the entire campus.'}
        ],
        'contacts': [
            {'name': 'Abhishek P. (Gaming Lead)', 'phone': '+91 98765 00020', 'email': 'abhishek.p@christuniversity.in'}
        ]
    },
    {
        'slug': 'pixel-perspective',
        'title': 'Pixel Perspective 📸🏢',
        'category': 'Media',
        'tagline': 'Digital photography exploring architecture & form',
        'desc': 'Digital photography challenge focusing on architectural aesthetics, light interaction, macro perspective, and visual storytelling across campus and urban settings.',
        'prize': '₹22,000',
        'date': '15-16 Sept 2026',
        'fee': '₹300',
        'team_size': '2 Members',
        'rounds': '2 Rounds (Online Submission + On-the-Spot Capture)',
        'rules': [
            'DSLR, mirrorless, or mobile cameras permitted.',
            'Heavy manipulation/editing prohibited (basic exposure adjustments allowed).',
            'EXIF data must be preserved in RAW/JPEG submissions.'
        ],
        'faqs': [
            {'q': 'Are mobile cameras eligible?', 'a': 'Yes, high-resolution mobile photos are eligible.'}
        ],
        'contacts': [
            {'name': 'Rasana Sherin (Student POC)', 'phone': '+91 90488 51790', 'email': 'rasana.s@christuniversity.in'},
            {'name': 'Prof. Shynu Robert (Faculty Coordinator)', 'phone': '+91 94000 77230', 'email': 'shynu.robert@christuniversity.in'}
        ]
    },
    {
        'slug': 'frames-unboxed',
        'title': 'Frames Unboxed 🎬🎥',
        'category': 'Media',
        'tagline': 'Short filmmaking & cinematic storytelling contest',
        'desc': 'Short filmmaking contest highlighting cinematic storytelling, screenplay execution, direction, color grading, and sound design under tight theme constraints.',
        'prize': '₹25,000',
        'date': '16 Sept 2026',
        'fee': '₹350',
        'team_size': '2-5 Members',
        'rounds': 'Film Screening & Jury Q&A',
        'rules': [
            'Maximum duration: 5 minutes including credits.',
            'Film must include a mandatory prop specified at event start.',
            'Copyrighted music without license leads to penalty points.'
        ],
        'faqs': [
            {'q': 'What format should be submitted?', 'a': 'MP4 (1080p or 4K) via flash drive or cloud drive.'}
        ],
        'contacts': [
            {'name': 'Karthik Raja (Media Lead)', 'phone': '+91 98765 00021', 'email': 'karthik.r@christuniversity.in'}
        ]
    },
    {
        'slug': 'archicraft',
        'title': 'Archicraft 🏛️📐',
        'category': 'Design',
        'tagline': 'Architectural structure prototyping challenge',
        'desc': 'Architectural structure prototyping using minimalist building materials, popsicle sticks, balsa wood, and geometric physics. Test load capacity and design aesthetics.',
        'prize': '₹18,000',
        'date': '15 Sept 2026',
        'fee': '₹250',
        'team_size': '2-3 Members',
        'rounds': 'Build Phase + Structural Destruction Load Test',
        'rules': [
            'Materials provided on-site (balsa wood, adhesive, cutters).',
            'Bridge/truss span must exceed 40cm.',
            'Efficiency score = Max Load Sustained / Structure Weight.'
        ],
        'faqs': [
            {'q': 'How is winner decided?', 'a': 'Highest load-to-weight efficiency ratio wins.'}
        ],
        'contacts': [
            {'name': 'Nivedita M. (Design POC)', 'phone': '+91 98765 00022', 'email': 'nivedita.m@christuniversity.in'}
        ]
    },
    {
        'slug': 'pattern-play',
        'title': 'Pattern Play 🎨💻',
        'category': 'Design',
        'tagline': 'UI/UX wireframing & design system sprint',
        'desc': 'UI/UX wireframing and design-system creation sprint for web and mobile platforms. Redesign complex user flows for accessibility, beauty, and delight.',
        'prize': '₹15,000',
        'date': '16 Sept 2026',
        'fee': '₹200',
        'team_size': '1-2 Members',
        'rounds': 'Figma Design Sprint (4 Hours)',
        'rules': [
            'Figma software mandatory.',
            'Submissions must include interactive prototypes and component design tokens.',
            'Design rationale presentation (3 minutes) to UI judges.'
        ],
        'faqs': [
            {'q': 'Can we use UI kits?', 'a': 'Standard community kits allowed; core components must be custom.'}
        ],
        'contacts': [
            {'name': 'Ankit Verma (UI/UX Lead)', 'phone': '+91 98765 00023', 'email': 'ankit.v@christuniversity.in'}
        ]
    },
    {
        'slug': 'switch-and-scene',
        'title': 'Switch and Scene 🎭⚡',
        'category': 'Drama',
        'tagline': 'Improv acting duel with dynamic character swaps',
        'desc': 'Improv acting duel where performers switch characters, accents, emotions, and genres dynamically mid-scene upon judge buzzer signals.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2 Members',
        'rounds': 'Qualifiers + Sudden Death Improv Final',
        'rules': [
            'Performers must switch roles immediately on buzzer ring.',
            'No vulgarity or offensive humor permitted.',
            'Evaluated on spontaneity, comedic timing, and adaptability.'
        ],
        'faqs': [
            {'q': 'Are props given?', 'a': 'Surprise props are handed on stage.'}
        ],
        'contacts': [
            {'name': 'Shruti Das (Drama Lead)', 'phone': '+91 98765 00024', 'email': 'shruti.d@christuniversity.in'}
        ]
    },
    {
        'slug': 'the-nexus',
        'title': 'The Nexus ⚡🌐',
        'category': 'Innovation',
        'tagline': 'Cross-disciplinary flagship innovation summit',
        'desc': "The flagship event of Magnovite '26. The Nexus brings together visionaries, developers, designers, and strategists to build groundbreaking multi-disciplinary solutions combining tech, art, and business.",
        'prize': '₹50,000',
        'date': '15-16 Sept 2026',
        'fee': '₹500',
        'team_size': '2-4 Members',
        'rounds': '24-Hour Hackathon & Grand Stage Jury Pitch',
        'rules': [
            'Teams must build a working prototype during the 24-hour hackathon window.',
            'All code, designs, and pitch slides must be created during the summit.',
            'Final pitch limited to 7 minutes + 3 minutes jury Q&A.',
            'Decisions of the grand judging panel are final.'
        ],
        'faqs': [
            {'q': 'Is overnight stay provided?', 'a': 'Dedicated 24-hour hackathon bays with food and rest lounges are provided.'},
            {'q': 'Who is eligible?', 'a': 'Open to all undergraduate and postgraduate students.'}
        ],
        'contacts': [
            {'name': 'Prof. Ananya Sen (Faculty Lead)', 'phone': '+91 98765 43210', 'email': 'ananya.sen@christuniversity.in'},
            {'name': 'Rohan Kumar (Student Lead)', 'phone': '+91 91234 56789', 'email': 'rohan.kumar@christuniversity.in'}
        ]
    },
    {
        'slug': 'severance-cup',
        'title': 'Severance Cup ⚖️🗣️',
        'category': 'Literary',
        'tagline': 'Inter-college parliamentary debate championship',
        'desc': 'Inter-college debate championship on tech ethics, AI policy, digital governance, and societal dilemmas using Asian Parliamentary debate format.',
        'prize': '₹20,000',
        'date': '16 Sept 2026',
        'fee': '₹300',
        'team_size': '2 Members',
        'rounds': '3 Preliminary Rounds + Final Debate',
        'rules': [
            'Asian Parliamentary Debate format (Prime Minister / Leader of Opposition).',
            'Preparation time: 15 minutes post motion release.',
            'No electronic research permitted during prep time.'
        ],
        'faqs': [
            {'q': 'Are adjudicators provided?', 'a': 'Institutional adjudicators will judge all rounds.'}
        ],
        'contacts': [
            {'name': 'Aditi Roy (Debate Society POC)', 'phone': '+91 98765 00025', 'email': 'aditi.r@christuniversity.in'}
        ]
    }
]

os.makedirs('events', exist_ok=True)

html_template = '''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} — Magnovite '26</title>
    <meta name="description" content="{tagline}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body class="events-page-body">

    <!-- Global Luxury Header -->
    <header class="site-header">
      <div class="header-container">
        <a href="https://www.christuniversity.in/" target="_blank" class="nav-logo-link">
          <img src="/logos/christwhite.png" alt="CHRIST University" class="header-logo-christ" />
        </a>

        <div class="header-right-group">
          <button id="menu-toggle" class="menu-toggle-btn" aria-label="Toggle Navigation Menu">
            <div class="hamburger-icon">
              <span class="hamburger-line top"></span>
              <span class="hamburger-line middle"></span>
              <span class="hamburger-line bottom"></span>
            </div>
          </button>

          <a href="/index.html" class="nav-logo-link">
            <img src="/logos/magnovite.png" alt="Magnovite '26" class="header-logo-magnovite" />
          </a>
        </div>
      </div>
    </header>

    <!-- Full-Screen Editorial Mega Menu Overlay -->
    <div id="mega-menu-overlay" class="mega-menu-overlay">
      <div class="mega-menu-inner">
        <nav class="mega-nav-links">
          <a href="/index.html" class="mega-link">
            <span class="mega-num">01</span>
            <span class="mega-text">Home</span>
            <span class="mega-arrow">↗</span>
          </a>
          <a href="/events.html" class="mega-link active">
            <span class="mega-num">02</span>
            <span class="mega-text">Events</span>
            <span class="mega-arrow">↗</span>
          </a>
          <a href="/schedule.html" class="mega-link">
            <span class="mega-num">03</span>
            <span class="mega-text">Schedule</span>
            <span class="mega-arrow">↗</span>
          </a>
          <a href="/about.html" class="mega-link">
            <span class="mega-num">04</span>
            <span class="mega-text">About</span>
            <span class="mega-arrow">↗</span>
          </a>
          <a href="/gallery.html" class="mega-link">
            <span class="mega-num">05</span>
            <span class="mega-text">Gallery</span>
            <span class="mega-arrow">↗</span>
          </a>
          <a href="/events.html" class="mega-link">
            <span class="mega-num">06</span>
            <span class="mega-text">Register</span>
            <span class="mega-arrow">↗</span>
          </a>
        </nav>

        <div class="mega-hero-card">
          <div class="mega-hero-badge">
            <span class="pulse-dot"></span>
            MAGNOVITE '26 • SEP 15, 9:00 AM
          </div>

          <div class="mega-hero-content">
            <h3 class="mega-hero-title">TECHNICAL & CULTURAL FEST</h3>
            <p class="mega-hero-desc">Explore cutting-edge competitions, live performances, and multi-disciplinary challenges.</p>
          </div>

          <div class="mega-countdown-container">
            <div class="mega-countdown-label">COUNTDOWN TO OPENING</div>
            <div id="nav-flip-clock" class="flip-clock-grid">
              <div class="flip-unit"><div class="flip-card-num" id="nav-flip-days">00</div><div class="flip-unit-label">DAYS</div></div>
              <div class="flip-unit"><div class="flip-card-num" id="nav-flip-hours">00</div><div class="flip-unit-label">HOURS</div></div>
              <div class="flip-unit"><div class="flip-card-num" id="nav-flip-minutes">00</div><div class="flip-unit-label">MINS</div></div>
              <div class="flip-unit"><div class="flip-card-num" id="nav-flip-seconds">00</div><div class="flip-unit-label">SECS</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Event Details Content -->
    <main class="events-section container" style="padding-top: 7rem; padding-bottom: 5rem;">
      <div style="max-width: 900px; margin: 0 auto;">
        
        <!-- Back Link -->
        <a href="/events.html" class="btn-primary" style="display: inline-flex; width: auto; padding: 0.6rem 1.25rem; font-size: 0.9rem; text-decoration: none; margin-bottom: 1.5rem;">
          ← Back to Events Grid
        </a>

        <!-- Category Chip & Title -->
        <div style="margin-bottom: 1.25rem;">
          <span class="card-badge">{category}</span>
          <h1 class="hero-title" style="font-size: clamp(2rem, 4vw, 3.2rem); margin: 0.5rem 0 0.4rem;">{title}</h1>
          <p class="modal-event-tagline" style="font-size: 1.15rem; color: #ff9d5c; font-weight: 500;">{tagline}</p>
        </div>

        <!-- Hero Image -->
        <div style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.12); margin-bottom: 2rem; background: #0f121d;">
          <img src="/images/events/{slug}.jpg" alt="{title}" style="width: 100%; height: auto; max-height: 420px; object-fit: cover; display: block;" onerror="this.onerror=null; this.src='/images/shaanrahman.jpg';" />
        </div>

        <!-- Description Card -->
        <div class="modal-rules-section" style="margin-bottom: 1.75rem;">
          <h3 style="font-family: var(--font-heading); color: #fff; margin-bottom: 0.75rem;">Event Overview</h3>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1rem;">{desc}</p>
        </div>

        <!-- Prize Pool Card -->
        <div class="modal-prize-card" style="margin-bottom: 1.75rem;">
          <span class="modal-prize-label">TOTAL PRIZE POOL</span>
          <div class="modal-prize-amount">🏆 {prize}</div>
        </div>

        <!-- Info Grid -->
        <div class="modal-info-grid" style="margin-bottom: 1.75rem;">
          <div class="info-grid-item">
            <span class="info-item-label">Date</span>
            <span class="info-item-val">{date}</span>
          </div>
          <div class="info-grid-item">
            <span class="info-item-label">Registration Fee</span>
            <span class="info-item-val">{fee}</span>
          </div>
          <div class="info-grid-item">
            <span class="info-item-label">Team Size</span>
            <span class="info-item-val">{team_size}</span>
          </div>
          <div class="info-grid-item">
            <span class="info-item-label">Format / Rounds</span>
            <span class="info-item-val">{rounds}</span>
          </div>
        </div>

        <!-- Rules & Guidelines -->
        <div class="modal-rules-section" style="margin-bottom: 1.75rem;">
          <h3 class="modal-rules-title" style="font-size: 1.1rem; margin-bottom: 1rem;">Rules & Guidelines</h3>
          <ul class="modal-rules-list">
            {rules_html}
          </ul>
        </div>

        <!-- FAQ Section -->
        <div class="modal-rules-section" style="margin-bottom: 1.75rem;">
          <h3 class="modal-rules-title" style="font-size: 1.1rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            {faqs_html}
          </div>
        </div>

        <!-- Contact Details -->
        <div class="modal-contacts-section" style="margin-bottom: 2.25rem;">
          <h3 class="modal-contacts-title" style="font-size: 1.1rem; margin-bottom: 1rem;">Event Contacts & Coordinators</h3>
          <div class="modal-contacts-grid">
            {contacts_html}
          </div>
        </div>

        <!-- REGISTER NOW BUTTON (Step 4 Requirement) -->
        <!-- TODO: paste Google Form link here -->
        <div style="text-align: center;">
          <a href="#" class="btn-primary modal-register-btn" data-register-link="PENDING" style="display: inline-flex; width: 100%; justify-content: center; padding: 1rem 2rem; font-size: 1.05rem; text-decoration: none;">
            <span>Register Now</span> ↗
          </a>
        </div>

      </div>
    </main>

    <script type="module" src="/src/navigation.ts"></script>
  </body>
</html>
'''

count = 0
for ev in events_data:
    rules_html = ''.join([f'<li>{r}</li>' for r in ev['rules']])
    faqs_html = ''.join([
        f'<div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 0.85rem 1rem; border-radius: var(--radius-sm);"><strong style="color: #fff; font-size: 0.95rem;">Q: {f["q"]}</strong><p style="color: var(--text-secondary); margin-top: 0.35rem; font-size: 0.88rem;">A: {f["a"]}</p></div>'
        for f in ev['faqs']
    ])
    contacts_html = ''.join([
        f'<div class="contact-card"><div class="contact-name">{c["name"]}</div>' +
        (f'<a href="tel:{c["phone"]}" class="contact-link contact-phone">📞 {c["phone"]}</a>' if c.get('phone') else '') +
        (f'<a href="mailto:{c["email"]}" class="contact-link contact-email">✉️ {c["email"]}</a>' if c.get('email') else '') +
        '</div>'
        for c in ev['contacts']
    ])

    content = html_template.format(
        title=ev['title'],
        category=ev['category'],
        tagline=ev['tagline'],
        desc=ev['desc'],
        prize=ev['prize'],
        date=ev['date'],
        fee=ev['fee'],
        team_size=ev['team_size'],
        rounds=ev['rounds'],
        slug=ev['slug'],
        rules_html=rules_html,
        faqs_html=faqs_html,
        contacts_html=contacts_html
    )

    filepath = os.path.join('events', f'{ev["slug"]}.html')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    count += 1

print(f'Successfully generated {count} static HTML event files in /events!')
