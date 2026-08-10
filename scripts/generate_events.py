import os

events_data = [
    {
        'slug': 'robo-soccer',
        'title': 'Robo Soccer',
        'category': 'Robotics',
        'tagline': 'High-stakes autonomous & RC bot soccer battle',
        'desc': 'Build autonomous or remote-controlled bots to compete in a high-stakes soccer tournament. Test your engineering skills, bot mobility, and strategic goal scoring against top rival teams.',
        'prize': '₹25,000',
        'date': '15 Sept 2026',
        'fee': '₹300',
        'team_size': '3-5 Members',
        'rounds': '2 Rounds (Group Stage + Knockout Finale)',
        'round_details': [
            {'title': 'Round 1: Group Stage League', 'desc': 'Matches consist of two halves of 4 minutes each. Teams are scored based on goal differential and total wins.'},
            {'title': 'Round 2: Sudden Death Knockout', 'desc': 'The top 4 teams advance to high-stakes knockout semifinals and final match to claim the championship.'}
        ],
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
        'title': 'Code Relay',
        'category': 'Coding',
        'tagline': 'Speed coding relay challenge under pressure',
        'desc': 'Speed coding relay challenge where teams write modular code under pressure. Teammates swap seats at timed intervals to complete complex algorithm challenges without verbal communication mid-relay.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2-4 Members',
        'rounds': '3 Rounds (Sprint, Modular Relay, Speed Fix)',
        'round_details': [
            {'title': 'Round 1: Speed Sprint', 'desc': 'Rapid algorithm challenge testing individual code speed.'},
            {'title': 'Round 2: Blind Modular Relay', 'desc': 'Teammates rotate seats every 15 minutes to continue building on their partner\'s live codebase without talking.'}
        ],
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
        'title': 'Reverse Coding',
        'category': 'Coding',
        'tagline': 'Analyze binary outputs to reverse-engineer source algorithms',
        'desc': 'Analyze compiled binary behaviors, sample input-output pairs, and reverse engineer the underlying algorithms. Test your logical deduction, black-box analysis, and programming speed.',
        'prize': '₹10,000',
        'date': '16 Sept 2026',
        'fee': '₹150',
        'team_size': 'Individual / Duo',
        'rounds': '2 Rounds (Prelims + Final Challenge)',
        'round_details': [
            {'title': 'Round 1: Pattern Recognition', 'desc': 'Decode basic input-output transformations within 45 minutes.'},
            {'title': 'Round 2: Black-Box Algorithm Reconstruction', 'desc': 'Reconstruct complex obfuscated binary logic within 90 minutes.'}
        ],
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
        'title': 'Battle of the Bands',
        'category': 'Music',
        'tagline': 'Flagship live musical showdown for college bands',
        'desc': 'Flagship live musical showdown featuring top college rock, metal, indie, and fusion bands. Compete on the main stage with full professional sound setups, lighting, and energetic audience vibes.',
        'prize': '₹40,000',
        'date': '16 Sept 2026',
        'fee': '₹600',
        'team_size': '3-8 Members',
        'rounds': '1 Main Stage Performance (15 Mins Slot)',
        'round_details': [
            {'title': 'Main Stage Showdown', 'desc': 'Live performance slot featuring 15 minutes of non-stop energy, judge evaluation, and audience applause.'}
        ],
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
        'title': 'Acapella',
        'category': 'Music',
        'tagline': 'Pure unassisted vocal harmony competition',
        'desc': 'Vocal harmony competition showcasing pure unassisted choral arrangements. Blend beatboxing, vocal basslines, and rich harmonies without any instrumental backing.',
        'prize': '₹20,000',
        'date': '15 Sept 2026',
        'fee': '₹400',
        'team_size': '4-12 Members',
        'rounds': '1 Stage Performance (8 Mins)',
        'round_details': [
            {'title': 'Choral Harmony Showcase', 'desc': '8-minute vocal performance evaluated on pitch, rhythm, dynamics, and arrangement complexity.'}
        ],
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
        'title': 'CAD Design',
        'category': 'Design',
        'tagline': '3D parametric modeling and structural design challenge',
        'desc': '3D parametric modeling challenge testing precision, speed, and structural integrity. Render technical engineering components and assemblies based on complex specification blueprints.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': 'Individual',
        'rounds': '2 Rounds (Part Modeling + Assembly)',
        'round_details': [
            {'title': 'Round 1: Precision Part Modeling', 'desc': 'Create 3D parametric components from 2D draft blueprints within 60 minutes.'},
            {'title': 'Round 2: Mechanical Assembly Sprint', 'desc': 'Assemble multi-part systems and render motion simulations within 90 minutes.'}
        ],
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
        'title': 'Spark Tank',
        'category': 'Entrepreneurship',
        'tagline': 'Pitch startup innovations to top venture mentors',
        'desc': 'Pitch startup innovations, business models, and working prototypes to seasoned venture capital mentors and angel investors. Prove market viability, unit economics, and scalability.',
        'prize': '₹30,000',
        'date': '16 Sept 2026',
        'fee': '₹400',
        'team_size': '2-4 Members',
        'rounds': '2 Rounds (Elevator Pitch + Deep Dive Q&A)',
        'round_details': [
            {'title': 'Round 1: 3-Minute Elevator Pitch', 'desc': 'Present high-level value proposition and market problem statement to preliminary judges.'},
            {'title': 'Round 2: Boardroom VC Pitch', 'desc': 'Full 10-slide deck presentation followed by intense investor Q&A.'}
        ],
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
        'title': 'Chamber of Secrets',
        'category': 'Gaming',
        'tagline': 'Cryptographic puzzle & campus mystery adventure',
        'desc': 'Mystery puzzle solving and cryptographic riddle challenge across campus. Unravel hidden cyphers, physical clues, and logic locks to unlock the ultimate chamber.',
        'prize': '₹12,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2-3 Members',
        'rounds': '3 Timed Secret Stages',
        'round_details': [
            {'title': 'Stage 1: Cryptic Ciphers', 'desc': 'Solve digital riddles to unlock physical checkpoint coordinates.'},
            {'title': 'Stage 2: Physical Locks', 'desc': 'Manipulate mechanical locks and hidden artifacts across campus.'}
        ],
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
        'title': 'Escape Room',
        'category': 'Gaming',
        'tagline': 'Immersive logic puzzle escape challenge',
        'desc': 'Immersive escape room filled with physical mechanisms, logic puzzles, encoded ciphers, and hidden keys. Escape within the 30-minute countdown clock.',
        'prize': '₹15,000',
        'date': '16 Sept 2026',
        'fee': '₹250',
        'team_size': '2-4 Members',
        'rounds': '1 Timed Room Run (30 Mins)',
        'round_details': [
            {'title': '30-Minute Live Escape', 'desc': 'Navigate locked boxes, UV light clues, and mechanical switches to find the key.'}
        ],
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
        'title': 'Drone Obstacle',
        'category': 'Robotics',
        'tagline': 'Navigate FPV drones through tight air courses',
        'desc': 'Navigate FPV drones through tight obstacle courses, precision hoops, slalom poles, and elevation jumps. Show off pilot skill, speed, and aerial control.',
        'prize': '₹30,000',
        'date': '16 Sept 2026',
        'fee': '₹500',
        'team_size': '1-3 Members',
        'rounds': '2 Rounds (Time Trial + Obstacle Final)',
        'round_details': [
            {'title': 'Round 1: Speed Time Trial', 'desc': 'Single lap speed trial through open slalom gates.'},
            {'title': 'Round 2: Precision Obstacle Course', 'desc': 'Complete complex 3D hoops, tunnel dives, and tight landing pads.'}
        ],
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
        'title': 'Best Manager',
        'category': 'Management',
        'tagline': 'Comprehensive leadership crisis management test',
        'desc': 'Comprehensive leadership test assessing crisis management, strategic pivot planning, high-pressure press conferences, and stress handling across multi-stage corporate simulations.',
        'prize': '₹25,000',
        'date': '15-16 Sept 2026',
        'fee': '₹350',
        'team_size': 'Individual',
        'rounds': '5 Intensive Stages over 2 Days',
        'round_details': [
            {'title': 'Stage 1-2: Psychometric & Corporate Stress Test', 'desc': 'Written analytical evaluations under strict time limits.'},
            {'title': 'Stage 3-5: Press Conference & Crisis Simulation', 'desc': 'Handle hostile media questions and present turnarounds.'}
        ],
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
        'title': 'Street Dance Battle',
        'category': 'Dance',
        'tagline': 'High-energy 1v1 and 2v2 street dance duels',
        'desc': 'High-energy street dance battle featuring hip-hop, popping, locking, krump, and breaking duels. Face off in 1v1 cipher battles judged live by professional street dancers.',
        'prize': '₹30,000',
        'date': '15 Sept 2026',
        'fee': '₹400',
        'team_size': '1-2 Members',
        'rounds': 'Cypher Qualifier + Knockout Battles',
        'round_details': [
            {'title': 'Cypher Round', 'desc': 'Open cypher evaluation where judges select top 16 dancers.'},
            {'title': '1v1 Battle Bracket', 'desc': 'Head-to-head duels with live DJ track selection.'}
        ],
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
        'title': 'Theme Dance',
        'category': 'Dance',
        'tagline': 'Choreographed group dance with futuristic themes',
        'desc': 'Choreographed group dance competition centering around futuristic storytelling themes. Combine synchronized formations, theatrical props, and high-impact choreography.',
        'prize': '₹45,000',
        'date': '16 Sept 2026',
        'fee': '₹700',
        'team_size': '6-16 Members',
        'rounds': '1 Main Stage Showcase (10 Mins)',
        'round_details': [
            {'title': 'Main Stage Production', 'desc': '10-minute theatrical dance production with lighting and prop integration.'}
        ],
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
        'title': 'Non Theme Dance',
        'category': 'Dance',
        'tagline': 'Freeform group dance showcasing versatile rhythms',
        'desc': 'Freeform group dance showcasing versatile choreography, energetic execution, and synchronized group dynamics without thematic constraints.',
        'prize': '₹35,000',
        'date': '16 Sept 2026',
        'fee': '₹600',
        'team_size': '6-16 Members',
        'rounds': '1 Stage Showcase (8 Mins)',
        'round_details': [
            {'title': 'High Energy Dance Showcase', 'desc': '8-minute fusion dance showcase focusing on sync and rhythm.'}
        ],
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
        'title': 'Street Play (Nukkad Natak)',
        'category': 'Drama',
        'tagline': 'Loud dramatic street theater for social impact',
        'desc': 'Social awareness street play (Nukkad Natak) bringing loud, energetic, and dramatic street theater to campus. Deliver powerful social messages using dholak, choruses, and rhythm.',
        'prize': '₹30,000',
        'date': '15 Sept 2026',
        'fee': '₹500',
        'team_size': '8-20 Members',
        'rounds': '1 Open-Air Circle Performance (12 Mins)',
        'round_details': [
            {'title': 'Open Arena Nukkad Performance', 'desc': '12-minute acoustic street play in a 360-degree audience circle.'}
        ],
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
        'title': 'Argo Royale',
        'category': 'Gaming',
        'tagline': 'Tactical esports battle royale tournament',
        'desc': 'Tactical esports tournament featuring intense battle royale action and squad play. Compete in custom lobby matches across classic maps to claim the winner title.',
        'prize': '₹20,000',
        'date': '15 Sept 2026',
        'fee': '₹300',
        'team_size': 'Squad (4 Players)',
        'rounds': '3 Custom Lobby Matches (Point System)',
        'round_details': [
            {'title': 'Matches 1-3: Custom Lobby Battles', 'desc': '3 tactical matches on Erangel and Miramar maps evaluated on placement and kill points.'}
        ],
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
        'title': 'RC Car Challenge',
        'category': 'Robotics',
        'tagline': 'Off-road remote control car racing challenge',
        'desc': 'Off-road remote control car racing through rugged terrain, sharp chicanes, steep inclines, and mud traps. Test chassis durability, acceleration, and cornering precision.',
        'prize': '₹20,000',
        'date': '16 Sept 2026',
        'fee': '₹300',
        'team_size': '2-4 Members',
        'rounds': '2 Rounds (Qualifying Lap + Track Final)',
        'round_details': [
            {'title': 'Round 1: Qualifying Time Trial', 'desc': 'Single lap speed trial to establish grid positions.'},
            {'title': 'Round 2: Off-Road Sprint Final', 'desc': '3-lap endurance sprint across obstacle-heavy terrain.'}
        ],
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
        'title': 'Byte and Board',
        'category': 'Electronics',
        'tagline': 'Hardware micro-controller circuit hackathon',
        'desc': 'Hardware assembly and micro-controller circuit building hackathon. Design embedded systems, interface sensors, write firmware, and solve real-world hardware automation tasks.',
        'prize': '₹18,000',
        'date': '15 Sept 2026',
        'fee': '₹250',
        'team_size': '2-3 Members',
        'rounds': '1 Hardware Sprint (6 Hours)',
        'round_details': [
            {'title': '6-Hour Embedded Hackathon', 'desc': 'Design circuit schematics, assemble hardware components, and flash working firmware.'}
        ],
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
        'title': 'Smart City',
        'category': 'Innovation',
        'tagline': 'Model sustainable urban IoT & green energy grids',
        'desc': 'Model sustainable urban infrastructure using IoT sensors, renewable energy grids, smart traffic management, and AI waste optimization. Present scale models and software dashboards.',
        'prize': '₹25,000',
        'date': '16 Sept 2026',
        'fee': '₹350',
        'team_size': '2-4 Members',
        'rounds': 'Physical Model Presentation + Deck Pitch',
        'round_details': [
            {'title': 'Urban Expo Exhibition', 'desc': 'Display physical scale models and live sensor dashboards to visiting judges.'}
        ],
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
        'title': 'Eco Forge',
        'category': 'Innovation',
        'tagline': 'Green product engineering from recycled materials',
        'desc': 'Sustainable green product engineering challenge using upcycled waste materials. Engineer functional consumer or industrial prototypes from discarded electronic and plastic scrap.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2-4 Members',
        'rounds': 'Prototype Build & Life-Cycle Assessment Pitch',
        'round_details': [
            {'title': 'Upcycling Build Sprint', 'desc': 'Construct physical prototypes from raw scrap material within 4 hours.'}
        ],
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
        'title': 'Enigma CTF',
        'category': 'Cybersecurity',
        'tagline': 'Capture-The-Flag cybersecurity hacking challenge',
        'desc': 'Cybersecurity capture-the-flag (CTF) testing vulnerability exploitation, web hacking, reverse engineering, binary exploitation, and digital forensics.',
        'prize': '₹20,000',
        'date': '16 Sept 2026',
        'fee': '₹250',
        'team_size': '1-3 Members',
        'rounds': 'Jeopardy Style CTF (5 Hours)',
        'round_details': [
            {'title': '5-Hour CTF Battle', 'desc': 'Jeopardy CTF format with real-time live scoreboard.'}
        ],
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
        'title': 'Finance Pitch',
        'category': 'Management',
        'tagline': 'Corporate financial modeling & stock valuation',
        'desc': 'Corporate financial modeling, portfolio risk analysis, M&A valuation, and stock pitch presentation before senior investment banking judges.',
        'prize': '₹18,000',
        'date': '15 Sept 2026',
        'fee': '₹250',
        'team_size': '2 Members',
        'rounds': '2 Rounds (Financial Valuation + Pitch Deck)',
        'round_details': [
            {'title': 'Round 1: DCF Valuation Model', 'desc': 'Submit Excel model for assigned target firm.'},
            {'title': 'Round 2: Stock Pitch', 'desc': 'Present BUY/SELL recommendation to investment committee.'}
        ],
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
        'title': 'Marketing Challenge',
        'category': 'Management',
        'tagline': 'Brand positioning & guerilla ad campaign sprint',
        'desc': 'Brand positioning, guerilla ad campaign design, viral social media reels creation, and crisis PR management sprint for a mystery product.',
        'prize': '₹20,000',
        'date': '16 Sept 2026',
        'fee': '₹300',
        'team_size': '2-4 Members',
        'rounds': '2 Rounds (Campaign Reel + Strategy Deck)',
        'round_details': [
            {'title': 'Round 1: 60-Second Campaign Reel', 'desc': 'Shoot and edit a viral advertisement reel within 3 hours.'},
            {'title': 'Round 2: Go-To-Market Pitch', 'desc': 'Present brand strategy deck to marketing directors.'}
        ],
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
        'title': 'Human Resource Simulation',
        'category': 'Management',
        'tagline': 'Corporate HR crisis negotiation & organizational scaling',
        'desc': 'Corporate HR simulation resolving high-stakes union disputes, executive retention crises, workplace ethics investigations, and organizational restructuring.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2 Members',
        'rounds': '2 Rounds (Crisis Roleplay + HR Policy Pitch)',
        'round_details': [
            {'title': 'Live Negotiation Simulation', 'desc': 'Roleplay crisis negotiation with dispute actors.'}
        ],
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
        'title': 'Case Craft',
        'category': 'Management',
        'tagline': 'Real-world business strategy case consulting',
        'desc': 'Real-world business case study analysis and management consulting deck presentation. Tackle complex operational bottlenecks and present actionable turnarounds.',
        'prize': '₹18,000',
        'date': '16 Sept 2026',
        'fee': '₹250',
        'team_size': '2-3 Members',
        'rounds': 'Executive Deck Submission & Boardroom Pitch',
        'round_details': [
            {'title': 'Boardroom Strategy Presentation', 'desc': 'Present 8-slide turnaround deck to senior consultants.'}
        ],
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
        'title': 'How I Met Your Killer',
        'category': 'Gaming',
        'tagline': 'Murder mystery forensic crime scene investigation',
        'desc': 'Murder mystery investigation analyzing crime scenes, forensic physical evidence, suspect alibis, and hidden motives. Cross-examine suspects to unmask the killer.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2-4 Members',
        'rounds': '3 Investigation Phases',
        'round_details': [
            {'title': 'Crime Scene Inspection', 'desc': 'Examine physical evidence markers across mock crime scene.'},
            {'title': 'Suspect Interrogation', 'desc': 'Interrogate live actors to catch contradictions in alibis.'}
        ],
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
        'title': 'The Chase',
        'category': 'Gaming',
        'tagline': 'Campus-wide GPS treasure hunt & speed checkpoints',
        'desc': 'Campus-wide high-speed treasure hunt with real-time GPS clues, physical challenges, and speed checkpoints. Race against rival teams to claim the ultimate trophy.',
        'prize': '₹15,000',
        'date': '16 Sept 2026',
        'fee': '₹200',
        'team_size': '2-4 Members',
        'rounds': 'Non-stop Campus Race',
        'round_details': [
            {'title': 'Non-Stop Campus Sprint', 'desc': 'Solve sequential GPS clues to reach 8 physical checkpoints.'}
        ],
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
        'title': 'Pixel Perspective',
        'category': 'Media',
        'tagline': 'Digital photography exploring architecture & form',
        'desc': 'Digital photography challenge focusing on architectural aesthetics, light interaction, macro perspective, and visual storytelling across campus and urban settings.',
        'prize': '₹22,000',
        'date': '15-16 Sept 2026',
        'fee': '₹300',
        'team_size': '2 Members',
        'rounds': '2 Rounds (Online Submission + On-the-Spot Capture)',
        'round_details': [
            {'title': 'Round 1: Exploration Shot (Online)', 'desc': 'Submit one photograph on theme "The Forgotten Corners" or "Framing the Sky".'},
            {'title': 'Round 2: On-the-Spot Capture (Offline)', 'desc': '2-hour sprint on campus following a surprise theme.'}
        ],
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
        'title': 'Frames Unboxed',
        'category': 'Media',
        'tagline': 'Short filmmaking & cinematic storytelling contest',
        'desc': 'Short filmmaking contest highlighting cinematic storytelling, screenplay execution, direction, color grading, and sound design under tight theme constraints.',
        'prize': '₹25,000',
        'date': '16 Sept 2026',
        'fee': '₹350',
        'team_size': '2-5 Members',
        'rounds': 'Film Screening & Jury Q&A',
        'round_details': [
            {'title': 'Auditorium Screening', 'desc': 'Screening of shortlisted 5-minute films followed by jury critique.'}
        ],
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
        'title': 'Archicraft',
        'category': 'Design',
        'tagline': 'Architectural structure prototyping challenge',
        'desc': 'Architectural structure prototyping using minimalist building materials, popsicle sticks, balsa wood, and geometric physics. Test load capacity and design aesthetics.',
        'prize': '₹18,000',
        'date': '15 Sept 2026',
        'fee': '₹250',
        'team_size': '2-3 Members',
        'rounds': 'Build Phase + Structural Destruction Load Test',
        'round_details': [
            {'title': 'Build Sprint', 'desc': 'Construct balsa wood truss structure within 3 hours.'},
            {'title': 'Destruction Load Testing', 'desc': 'Progressively load weights until structural collapse to calculate efficiency ratio.'}
        ],
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
        'title': 'Pattern Play',
        'category': 'Design',
        'tagline': 'UI/UX wireframing & design system sprint',
        'desc': 'UI/UX wireframing and design-system creation sprint for web and mobile platforms. Redesign complex user flows for accessibility, beauty, and delight.',
        'prize': '₹15,000',
        'date': '16 Sept 2026',
        'fee': '₹200',
        'team_size': '1-2 Members',
        'rounds': 'Figma Design Sprint (4 Hours)',
        'round_details': [
            {'title': 'Figma Design Challenge', 'desc': 'Design high-fidelity UI wireframes for a surprise mobile app prompt.'}
        ],
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
        'title': 'Switch and Scene',
        'category': 'Drama',
        'tagline': 'Improv acting duel with dynamic character swaps',
        'desc': 'Improv acting duel where performers switch characters, accents, emotions, and genres dynamically mid-scene upon judge buzzer signals.',
        'prize': '₹15,000',
        'date': '15 Sept 2026',
        'fee': '₹200',
        'team_size': '2 Members',
        'rounds': 'Qualifiers + Sudden Death Improv Final',
        'round_details': [
            {'title': 'Instant Improv Stage', 'desc': 'React to random genre buzzer switches mid-performance.'}
        ],
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
        'title': 'The Nexus',
        'category': 'Innovation',
        'tagline': 'Cross-disciplinary flagship innovation summit',
        'desc': "The flagship event of Magnovite '26. The Nexus brings together visionaries, developers, designers, and strategists to build groundbreaking multi-disciplinary solutions combining tech, art, and business.",
        'prize': '₹50,000',
        'date': '15-16 Sept 2026',
        'fee': '₹500',
        'team_size': '2-4 Members',
        'rounds': '24-Hour Hackathon & Grand Stage Jury Pitch',
        'round_details': [
            {'title': 'Phase 1: 24-Hour Hackathon Sprint', 'desc': 'Build a working software/hardware prototype with overnight mentor support.'},
            {'title': 'Phase 2: Grand Stage Pitch', 'desc': '7-minute live demo and presentation to VC judges.'}
        ],
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
        'title': 'Severance Cup',
        'category': 'Literary',
        'tagline': 'Inter-college parliamentary debate championship',
        'desc': 'Inter-college debate championship on tech ethics, AI policy, digital governance, and societal dilemmas using Asian Parliamentary debate format.',
        'prize': '₹20,000',
        'date': '16 Sept 2026',
        'fee': '₹300',
        'team_size': '2 Members',
        'rounds': '3 Preliminary Rounds + Final Debate',
        'round_details': [
            {'title': '3 Debate Rounds', 'desc': 'Asian Parliamentary motions released 15 minutes prior to debate start.'}
        ],
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

image_map = {
    'robo-soccer': '/images/events/robosoccer.jpg',
    'code-relay': '/images/events/coderelay.jpg',
    'reverse-coding': '/images/events/reversecoding.jpg',
    'battle-of-the-bands': '/images/events/battleofbands.jpg',
    'acapella': '/images/events/acapella.jpg',
    'cad-design': '/images/events/cad.jpg',
    'spark-tank': '/images/events/sparktank.jpg',
    'chamber-of-secrets': '/images/events/chamberofsecrets.jpg',
    'escape-room': '/images/events/escaperoom.jpg',
    'drone-obstacle': '/images/events/drone.jpg',
    'best-manager': '/images/events/bestmanager.avif',
    'street-dance-battle': '/images/events/streetdancebattle.JPG',
    'theme-dance': '/images/events/themedance.jpg',
    'non-theme-dance': '/images/events/nontheme.jpg',
    'street-play': '/images/events/streetplay.jpg',
    'argo-royale': '/images/events/argoroyale.png',
    'rc-car-challenge': '/images/events/rccarchallenge.jpg',
    'byte-and-board': '/images/events/byteandboard.jpg',
    'smart-city': '/images/events/smartcity.jpg',
    'eco-forge': '/images/events/ecoforge.jpg',
    'enigma': '/images/events/enigma.jpg',
    'finance-pitch': '/images/events/finance.jpg',
    'marketing-challenge': '/images/events/marketing.jpg',
    'human-resource': '/images/events/humanresource.jpg',
    'case-craft': '/images/events/casecraft.jpg',
    'how-i-met-your-killer': '/images/events/howimeturkiller.jpg',
    'the-chase': '/images/events/chase.jpg',
    'pixel-perspective': '/images/events/pixelperspective.jpg',
    'frames-unboxed': '/images/events/framesunboxed.jpg',
    'archicraft': '/images/events/archicraft.jpg',
    'pattern-play': '/images/events/patternplay.jpg',
    'switch-and-scene': '/images/events/switchandscene.jpg',
    'the-nexus': '/images/events/thenexus.jpg',
    'severance-cup': '/images/events/SEVERANCE CUP.jpg'
}

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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="stylesheet" href="/src/style.css" />
    <style>
      @media (max-width: 900px) {{
        .event-layout-grid {{
          grid-template-columns: 1fr !important;
        }}
        .event-sidebar-sticky {{
          position: static !important;
        }}
      }}
    </style>
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
    <main class="events-section container" style="padding-top: 6.5rem; padding-bottom: 6rem;">
      <div style="max-width: 1140px; margin: 0 auto;">
        
        <!-- Clean Navigation Back Link -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem;">
          <a href="/events.html" class="btn-primary" style="display: inline-flex; width: auto; padding: 0.55rem 1.25rem; font-size: 0.85rem; text-decoration: none; border-radius: 999px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);">
            ← Back to Events
          </a>
          <span class="card-badge" style="font-size: 0.8rem; padding: 0.4rem 0.95rem; letter-spacing: 0.12em; background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(124, 58, 237, 0.08)); border: 1px solid rgba(99, 102, 241, 0.3); color: #a78bfa; text-transform: uppercase;">{category}</span>
        </div>

        <!-- Clean Bold Title & Tagline -->
        <div style="margin-bottom: 2rem;">
          <h1 class="page-title" style="font-size: clamp(2.4rem, 5.5vw, 4rem); font-weight: 900; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 0.6rem;">{title}</h1>
          <p style="font-size: 1.2rem; color: #a78bfa; font-weight: 500; line-height: 1.4; max-width: 800px; margin: 0;">{tagline}</p>
        </div>

        <!-- Showcase Hero Image (Prominent position below Title Header) -->
        <div style="border-radius: 20px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.12); margin-bottom: 2.5rem; background: #0f121d; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7); position: relative;">
          <img src="{image_src}" alt="{title}" style="width: 100%; height: auto; max-height: 480px; object-fit: cover; display: block;" onerror="this.onerror=null; this.src='/images/shaanrahman.jpg';" />
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 70%, rgba(6, 8, 14, 0.75) 100%); pointer-events: none;"></div>
        </div>

        <!-- 2-Column Content Layout -->
        <div class="event-layout-grid" style="display: grid; grid-template-columns: 1fr 360px; gap: 2.25rem; align-items: start;">
          
          <!-- Left Column: Story & Rules -->
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            
            <!-- Overview Card -->
            <div class="modal-rules-section" style="background: rgba(14, 18, 28, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 20px; padding: 2rem 2.25rem; margin: 0;">
              <h2 style="font-family: var(--font-heading); font-size: 1.35rem; color: #fff; margin-bottom: 0.85rem;">Event Overview</h2>
              <p style="color: var(--text-secondary); line-height: 1.75; font-size: 1.02rem; margin: 0;">{desc}</p>
            </div>

            <!-- Round Structure -->
            <div class="modal-rules-section" style="background: rgba(14, 18, 28, 0.75); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 20px; padding: 2rem 2.25rem; margin: 0;">
              <h3 class="modal-rules-title" style="font-size: 1.2rem; margin-bottom: 1.25rem; color: #fff;">Round Structure</h3>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                {rounds_html}
              </div>
            </div>

            <!-- Rules & Guidelines -->
            <div class="modal-rules-section" style="background: rgba(14, 18, 28, 0.75); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 20px; padding: 2rem 2.25rem; margin: 0;">
              <h3 class="modal-rules-title" style="font-size: 1.2rem; margin-bottom: 1.25rem; color: #fff;">Rules & Guidelines</h3>
              <ul class="modal-rules-list">
                {rules_html}
              </ul>
            </div>

            <!-- Frequently Asked Questions -->
            <div class="modal-rules-section" style="background: rgba(14, 18, 28, 0.75); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 20px; padding: 2rem 2.25rem; margin: 0;">
              <h3 class="modal-rules-title" style="font-size: 1.2rem; margin-bottom: 1.25rem; color: #fff;">Frequently Asked Questions</h3>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                {faqs_html}
              </div>
            </div>

          </div>

          <!-- Right Column: Sidebar Metrics & CTA -->
          <div class="event-sidebar-sticky" style="display: flex; flex-direction: column; gap: 1.5rem; position: sticky; top: 6rem;">
            
            <!-- Prize Pool Card -->
            <div class="modal-prize-card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(124, 58, 237, 0.06) 100%); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 18px; padding: 1.5rem 1.75rem; margin: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.15);">
              <span class="modal-prize-label" style="font-size: 0.78rem; letter-spacing: 0.15em; color: #a78bfa; font-weight: 800; text-transform: uppercase;">TOTAL PRIZE POOL</span>
              <div class="modal-prize-amount" style="font-family: var(--font-heading); font-size: 2.4rem; font-weight: 900; color: #ffffff; text-shadow: 0 0 16px rgba(99, 102, 241, 0.4);">{prize}</div>
            </div>

            <!-- Key Info Metrics -->
            <div style="background: rgba(14, 18, 28, 0.75); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 18px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.15rem;">
              <div>
                <span style="color: var(--text-muted); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 0.2rem;">Date</span>
                <span style="color: #fff; font-size: 1.02rem; font-weight: 600;">{date}</span>
              </div>
              <div>
                <span style="color: var(--text-muted); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 0.2rem;">Registration Fee</span>
                <span style="color: #fff; font-size: 1.02rem; font-weight: 600;">{fee}</span>
              </div>
              <div>
                <span style="color: var(--text-muted); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 0.2rem;">Team Size</span>
                <span style="color: #fff; font-size: 1.02rem; font-weight: 600;">{team_size}</span>
              </div>
              <div>
                <span style="color: var(--text-muted); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 0.2rem;">Format / Rounds</span>
                <span style="color: #fff; font-size: 1.02rem; font-weight: 600;">{rounds}</span>
              </div>
            </div>

            <!-- Event Coordinators -->
            <div style="background: rgba(14, 18, 28, 0.75); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 18px; padding: 1.5rem;">
              <h3 style="font-size: 1.05rem; color: #fff; margin-bottom: 1rem; font-family: var(--font-heading);">Event Coordinators</h3>
              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                {contacts_html}
              </div>
            </div>

            <!-- SINGLE PRIMARY REGISTER BUTTON -->
            <!-- TODO: paste Google Form link here -->
            <a href="#" class="btn-primary modal-register-btn" data-register-link="PENDING" style="display: inline-flex; width: 100%; justify-content: center; padding: 1.1rem; font-size: 1.05rem; text-decoration: none; border-radius: 999px; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.35); background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
              <span>Register Now</span> ↗
            </a>

          </div>

        </div>

      </div>
    </main>

    <script type="module" src="/src/navigation.ts"></script>
  </body>
</html>
'''

count = 0
for ev in events_data:
    image_src = image_map.get(ev['slug'], f"/images/events/{ev['slug']}.jpg")

    rules_html = ''.join([f'<li>{r}</li>' for r in ev['rules']])
    
    rounds_html = ''
    if ev.get('round_details'):
        rounds_html = ''.join([
            f'<div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.07); padding: 1.1rem 1.25rem; border-radius: 14px;"><strong style="color: #a78bfa; font-size: 1rem; display: block; margin-bottom: 0.35rem;">{rd["title"]}</strong><p style="color: #cfcfcf; font-size: 0.88rem; margin: 0; line-height: 1.5;">{rd["desc"]}</p></div>'
            for rd in ev['round_details']
        ])
    else:
        rounds_html = f'<div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.07); padding: 1.1rem 1.25rem; border-radius: 14px;"><strong style="color: #a78bfa; font-size: 1rem; display: block; margin-bottom: 0.35rem;">Event Structure</strong><p style="color: #cfcfcf; font-size: 0.88rem; margin: 0;">{ev["rounds"]}</p></div>'

    faqs_html = ''.join([
        f'<div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 1rem 1.25rem; border-radius: 12px;"><strong style="color: #fff; font-size: 0.95rem;">Q: {f["q"]}</strong><p style="color: var(--text-secondary); margin-top: 0.35rem; font-size: 0.88rem; margin-bottom: 0;">A: {f["a"]}</p></div>'
        for f in ev['faqs']
    ])
    
    contacts_html = ''.join([
        f'<div class="contact-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem 1.25rem;"><div class="contact-name" style="font-weight: 700; color: #fff; margin-bottom: 0.35rem;">{c["name"]}</div>' +
        (f'<a href="tel:{c["phone"]}" class="contact-link contact-phone">Phone: {c["phone"]}</a><br/>' if c.get('phone') else '') +
        (f'<a href="mailto:{c["email"]}" class="contact-link contact-email">Email: {c["email"]}</a>' if c.get('email') else '') +
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
        image_src=image_src,
        rules_html=rules_html,
        rounds_html=rounds_html,
        faqs_html=faqs_html,
        contacts_html=contacts_html
    )

    filepath = os.path.join('events', f'{ev["slug"]}.html')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    count += 1

print(f'Successfully re-generated {count} editorial 2-column static HTML event files in /events!')
