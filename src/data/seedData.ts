import { Article, Category, SiteSettings, MediaAsset } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-usa',
    name: 'USA News',
    slug: 'news',
    description: 'National coverage, major civic developments, and critical updates across all fifty states.',
    color: '#0A192F',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-trending',
    name: 'Trending',
    slug: 'trending',
    description: 'The stories, debates, and moments capturing America’s digital attention right now.',
    color: '#DC2626',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-viral',
    name: 'Viral',
    slug: 'viral',
    description: 'Wild internet phenomena, feel-good local heroes, and viral sensations sweeping feeds.',
    color: '#F97316',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-tech',
    name: 'Technology',
    slug: 'technology',
    description: 'AI breakthroughs, Silicon Valley innovations, cybersecurity, and digital lifestyle.',
    color: '#2563EB',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-business',
    name: 'Business',
    slug: 'business',
    description: 'American markets, inflation updates, consumer trends, startups, and economic shifts.',
    color: '#059669',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-entertainment',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Hollywood buzz, music charts, streaming must-watches, and celebrity culture.',
    color: '#7C3AED',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-sports',
    name: 'Sports',
    slug: 'sports',
    description: 'NFL, NBA, MLB, college athletics, and headline-making sports spectacles.',
    color: '#D97706',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-lifestyle',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Travel gems, food trends, wellness discoveries, and modern American culture.',
    color: '#0D9488',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-interesting',
    name: 'Interesting Stories',
    slug: 'interesting',
    description: 'Curious histories, scientific oddities, and fascinating discoveries across the nation.',
    color: '#4B5563',
    created_at: '2026-01-01T00:00:00Z',
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  site_name: 'The USA Wire',
  tagline: "America's Trending Stories, All in One Place.",
  logo_text: 'THE USA WIRE',
  contact_email: 'contact@theusawire.com',
  footer_text: 'The USA Wire is an independent modern digital news and trending media platform covering stories, viral phenomena, and conversations taking place across the United States. Content aggregated with full source attribution.',
  breaking_ticker_enabled: true,
  breaking_ticker_text: 'BREAKING: Federal Reserve Signals Major Shift in Monetary Guidance Ahead of Economic Summit',
  breaking_ticker_article_slug: 'federal-reserve-signals-major-shift-economic-guidance',
  homepage_featured_article_id: 'art-01',
  social_facebook: 'https://facebook.com/theusawire',
  social_x: 'https://x.com/theusawire',
  social_instagram: 'https://instagram.com/theusawire',
  social_youtube: 'https://youtube.com/@theusawire',
  n8n_api_key: 'usawire_live_sec_88492049129034',
  seo_default_title: "The USA Wire | America's Trending Stories, All in One Place",
  seo_default_description: 'Stay ahead with The USA Wire. Real-time coverage of breaking news, viral moments, technology innovations, sports, business, and what America is talking about right now.',
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-01',
    title: 'Historic $85B American High-Speed Rail Corridor Breaks Ground Linking Las Vegas and Southern California',
    slug: 'historic-american-high-speed-rail-corridor-breaks-ground-las-vegas-california',
    subtitle: 'The fully electric passenger railway aims to transport 11 million passengers annually while slashing highway congestion.',
    content: `Construction officially commenced this morning on what engineers are calling America’s first true high-speed electric passenger rail project in modern history, connecting the greater Las Vegas metropolitan corridor with Southern California’s bustling transit network.

Federal transportation officials, regional governors, and trade union leaders gathered in the Mojave Desert to commemorate the groundbreaking ceremony. The project, funded through a combination of public-private bonds and nationwide infrastructure grants, is projected to run high-speed bullet trains reaching speeds exceeding 186 miles per hour.

### Transforming Desert Travel

For decades, Interstate 15 between the Los Angeles basin and Las Vegas has suffered legendary weekend bottlenecks, turning a four-hour excursion into grueling eight-hour gridlocks on peak holiday weekends.

"This is not just a railroad; it is a declaration that America can still construct world-class infrastructure that competes with the fastest systems in Europe and Asia," declared the project lead engineer during the opening keynote.

### Key Project Milestones:
* **Total Route Distance:** 218 miles of dedicated, fully electrified zero-emission tracks.
* **Travel Time:** Less than 2 hours and 10 minutes between endpoints.
* **Job Creation:** Over 35,000 union construction and ongoing operational jobs.
* **Environmental Impact:** Estimated reduction of 400,000 tons of carbon dioxide each year.

The system will feature state-of-the-art onboard Wi-Fi lounges, quiet work cabins, and automated luggage handling. Test runs on the first 50-mile northern segment are slated to commence within 30 months, marking a defining milestone for American rail revival.`,
    featured_image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-usa',
    category_name: 'USA News',
    author_name: 'Marcus Vance',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    source_name: 'Western Transportation Authority',
    source_url: 'https://example.com/press-releases/brightline-west-groundbreaking',
    status: 'published',
    featured: true,
    trending: true,
    breaking: false,
    trend_score: 96,
    trending_rank: 1,
    views: 142850,
    reading_time: 4,
    seo_title: 'Historic High-Speed Rail Corridor Breaks Ground | The USA Wire',
    meta_description: 'America breaks ground on an $85B electric high-speed rail corridor connecting Southern California and Las Vegas.',
    tags: ['Infrastructure', 'High-Speed Rail', 'Nevada', 'California', 'Transit'],
    published_at: '2026-09-20T14:30:00Z',
    updated_at: '2026-09-20T16:45:00Z',
    created_at: '2026-09-20T12:00:00Z',
  },
  {
    id: 'art-02',
    title: 'Federal Reserve Signals Major Shift in Monetary Guidance Ahead of Autumn Economic Summit',
    slug: 'federal-reserve-signals-major-shift-economic-guidance',
    subtitle: 'Central bank officials hint at revised interest rate pathways as manufacturing indicators and consumer confidence post surprising gains.',
    content: `In a morning briefing from Washington D.C., monetary policymakers released new forward guidance suggesting an unexpected pivot in benchmark rate strategies, sending Wall Street futures soaring across major tech and retail sectors.

Federal Reserve representatives noted that cooling services inflation alongside robust job creation across domestic manufacturing hubs has created room for flexible adjustments.

### What It Means for Everyday Americans

Mortgage rates on 30-year fixed loans immediately responded in early trading, dipping below key thresholds and re-igniting interest among first-time homebuyers who had been sidelined through previous quarters.

Financial analysts noted that small business credit lines and auto financing terms could see corresponding relief over the coming quarters as regional lenders adapt to the Federal Reserve’s updated balance sheet pacing.

"The central bank is balancing cooling labor market pressures against a strong consumer economy," said senior financial economist Laura Chen. "This is one of the most consequential policy communications of the decade."`,
    featured_image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-business',
    category_name: 'Business',
    author_name: 'Eleanor Sterling',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    source_name: 'Federal Reserve Communications & Bloomberg',
    source_url: 'https://example.com/fed-guidance-update',
    status: 'published',
    featured: false,
    trending: true,
    breaking: true,
    trend_score: 94,
    trending_rank: 2,
    views: 98400,
    reading_time: 3,
    seo_title: 'Federal Reserve Policy Shift Signals Market Rally | The USA Wire',
    meta_description: 'Federal Reserve signals crucial interest rate shift in newly released economic guidance.',
    tags: ['Economy', 'Federal Reserve', 'Mortgages', 'Inflation', 'Markets'],
    published_at: '2026-09-21T08:15:00Z',
    updated_at: '2026-09-21T08:45:00Z',
    created_at: '2026-09-21T07:30:00Z',
  },
  {
    id: 'art-03',
    title: 'Ohio Baker’s 35-Second Sourdough Hack Becomes TikTok Sensation, Drawing 3-Mile Line Outside Smalltown Shop',
    slug: 'ohio-baker-sourdough-hack-viral-tiktok-three-mile-line',
    subtitle: 'A grandmother’s 80-year-old starter paired with an ingenious cold-ferment technique has turned Canton, Ohio into America’s newest culinary pilgrimage.',
    content: `When 26-year-old bakery apprentice Clara Morales uploaded a 35-second behind-the-scenes clip of her bakery’s golden, blistered sourdough pulling apart with a cloud of steam, she never imagined it would amass 74 million views in 72 hours.

By 5:00 AM on Saturday morning, an estimated 2,400 food enthusiasts from seven neighboring states had formed a line that wrapped around four city blocks and spilled down the main boulevard of Canton, Ohio.

### The Secret in the Ferment

The family bakery, which has operated quietly for over three decades, uses a starter that Morales’s great-grandmother originally cultivated in 1946. Morales combined the heirloom starter with a slow-chill cold ferment that produces a glass-like crisp crust and an impossibly airy crumb.

Local hotels reported 100% occupancy for the weekend, while nearby coffee shops and diners saw their busiest sales day in five years.

"We ran out of flour twice on Friday afternoon," Morales laughed as flour dusted her apron. "Neighbors from three doors down came over with their own commercial mixers to help us keep up with the town's excitement."`,
    featured_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-viral',
    category_name: 'Viral',
    author_name: 'Jordan Brooks',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    source_name: 'Akron Beacon Journal & Social Feeds',
    source_url: 'https://example.com/canton-viral-bakery',
    status: 'published',
    featured: false,
    trending: true,
    breaking: false,
    trend_score: 91,
    trending_rank: 3,
    views: 87300,
    reading_time: 3,
    seo_title: 'Ohio Sourdough Hack Goes Viral with 3-Mile Lines | The USA Wire',
    meta_description: 'How a 35-second baking video turned a quiet Ohio bakery into America’s hottest culinary phenomenon.',
    tags: ['Viral', 'TikTok', 'Food', 'Culture', 'Ohio'],
    published_at: '2026-09-20T18:00:00Z',
    updated_at: '2026-09-20T19:20:00Z',
    created_at: '2026-09-20T17:10:00Z',
  },
  {
    id: 'art-04',
    title: 'Breakthrough American Silicon Architecture Cuts AI Data Center Power Usage by 42%',
    slug: 'breakthrough-american-silicon-architecture-cuts-ai-power-usage',
    subtitle: 'Austin and San Jose engineers unveil photonic micro-processors designed to solve America’s burgeoning power grid bottleneck.',
    content: `As artificial intelligence models grow exponentially in complexity, American energy grids have faced unprecedented load demands from massive computing centers sprawling across Virginia, Texas, and Oregon.

Today, a consortium of US microelectronics researchers announced verified benchmark results for a novel photonic interconnect architecture that uses light waves instead of copper traces to transmit data between neural accelerator units.

The outcome: a staggering 42% reduction in net electrical consumption and a 65% drop in operational heat emission.

### Relieving The Energy Grid

Energy analysts had previously warned that US data centers could consume as much electricity as entire medium-sized states by 2030 without radical hardware efficiencies.

"This is the generational breakthrough the semiconductor sector was praying for," noted Dr. Arvind Patel, lead fellow at the Austin Micro-Foundry Institute. "By replacing resistive copper with micro-lasers on the chip substrate, we don’t just save power—we accelerate computational latency tenfold."

Commercial mass production is planned in newly expanded fabs across central Ohio and Arizona starting early next year.`,
    featured_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-tech',
    category_name: 'Technology',
    author_name: 'Devon Walker',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    source_name: 'Semiconductor Industry Digest',
    source_url: 'https://example.com/photonic-chip-benchmark',
    status: 'published',
    featured: false,
    trending: true,
    breaking: false,
    trend_score: 89,
    trending_rank: 4,
    views: 76500,
    reading_time: 4,
    seo_title: 'Photonic Chip Architecture Slashes AI Energy Draw | The USA Wire',
    meta_description: 'US engineers unveil photonic semiconductor architecture reducing data center energy drain by 42 percent.',
    tags: ['Tech', 'AI', 'Silicon', 'Energy', 'Semiconductors'],
    published_at: '2026-09-20T11:00:00Z',
    updated_at: '2026-09-20T14:10:00Z',
    created_at: '2026-09-20T09:30:00Z',
  },
  {
    id: 'art-05',
    title: 'Rookie Quarterback Pulls Off 21-Point Fourth Quarter Miracle in Thrilling NFL Season Opener',
    slug: 'rookie-quarterback-21-point-fourth-quarter-miracle-nfl-opener',
    subtitle: 'Under the stadium lights, 22-year-old starter delivers three touchdown strikes in six minutes, etching his name into football lore.',
    content: `Down 27 to 6 with just under eight minutes remaining in the final quarter, silence had overtaken the 72,000 fans packed into the stands. Most analysts on the broadcast booth had already penciled in a blowout defeat for the home franchise.

Then, rookie signal-caller Caleb Rhodes stepped onto the turf and orchestrated one of the most electrifying comebacks in professional sports history.

### The Six-Minute Avalanche

Rhodes began the march with an audacious 64-yard bomb down the right sideline into double coverage. Two plays later, a quick slant secured the first score. After a daring surprise onside kick recovery by the special teams unit, Rhodes scrambled 18 yards on 4th-and-long before firing a laser into the back corner of the end zone.

With 19 seconds on the clock and no timeouts, Rhodes checked out of the planned draw play at the line of scrimmage, noticing an overloaded safety blitz, and floated a picture-perfect pass over the outstretched fingers of the cornerback.

The stadium erupted in a roar that was picked up on local geological sensors two miles away.

"You dream about moments like this when you’re throwing passes in your backyard at eight years old," Rhodes told reporters while hoisting the game ball. "My teammates believed in me even when the scoreboard looked impossible."`,
    featured_image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-sports',
    category_name: 'Sports',
    author_name: 'Trevor Matthews',
    author_avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    source_name: 'National Football Wire',
    source_url: 'https://example.com/rhodes-comeback-miracle',
    status: 'published',
    featured: false,
    trending: true,
    breaking: false,
    trend_score: 87,
    trending_rank: 5,
    views: 68900,
    reading_time: 3,
    seo_title: 'Rookie QB Delivers Historic 4th Quarter Comeback | The USA Wire',
    meta_description: 'Caleb Rhodes engineers 21-point comeback in final six minutes of stunning NFL game.',
    tags: ['NFL', 'Sports', 'Football', 'Highlights', 'Comeback'],
    published_at: '2026-09-20T22:30:00Z',
    updated_at: '2026-09-21T01:10:00Z',
    created_at: '2026-09-20T21:00:00Z',
  },
  {
    id: 'art-06',
    title: 'The Great American Eclipse Festival: Over 250,000 Gather Across Texas Hill Country for Celestial Spectacle',
    slug: 'great-american-eclipse-festival-texas-hill-country-gathering',
    subtitle: 'Campgrounds, music stages, and telescopes blanket the limestone valleys as travelers from all 50 states watch totality in awe.',
    content: `From Kerrville to Fredericksburg, the normally quiet wildflower hills of central Texas transformed into a temporary metropolis of astronomy buffs, families, and road-trippers united by a shared glimpse of the cosmos.

When the moon completely eclipsed the sun for four minutes and fourteen seconds, a reverent silence descended over the hills, broken only by the chirping of crickets tricked into thinking twilight had arrived.

### An Unprecedented Tourism Surge

Local chamber of commerce officials reported that the influx pumped an estimated $140 million into regional small businesses, from roadside barbecue joints to bed-and-breakfast ranches.

"We have welcomed guests from Alaska, Maine, Tokyo, and London," said local rancher Hank MacIntyre, who converted 300 acres of pasture into a solar observation campground. "It reminded everyone how beautiful it is to look up together at something bigger than our daily routines."`,
    featured_image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-trending',
    category_name: 'Trending',
    author_name: 'Chloe Bennett',
    author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    source_name: 'Austin Chronicle & Texas Tourism Board',
    source_url: 'https://example.com/texas-eclipse-recap',
    status: 'published',
    featured: false,
    trending: true,
    breaking: false,
    trend_score: 84,
    trending_rank: 6,
    views: 62400,
    reading_time: 3,
    seo_title: '250,000 Gather for Texas Hill Country Eclipse Festival | The USA Wire',
    meta_description: 'Thousands gather across Texas Hill Country for breathtaking total solar eclipse celebration.',
    tags: ['Eclipse', 'Texas', 'Travel', 'Science', 'Astronomy'],
    published_at: '2026-09-19T17:00:00Z',
    updated_at: '2026-09-19T20:15:00Z',
    created_at: '2026-09-19T15:00:00Z',
  },
  {
    id: 'art-07',
    title: 'Surprise Indie Film Shot on $300K Budget Crosses $100 Million at Box Office, Stunning Hollywood Studios',
    slug: 'surprise-indie-film-budget-crosses-hundred-million-box-office',
    subtitle: 'Word-of-mouth acclaim and passionate letterboxd fans propel original sci-fi mystery past studio franchise tentpoles.',
    content: `In an era dominated by comic book sequels and nine-figure corporate budgets, an original independent sci-fi thriller shot over 18 days in rural Oregon has achieved what studio executives deemed mathematically impossible.

Titled 'Signal on the Ridge', the film was created by a husband-and-wife directing duo who financed production using savings and local community arts grants.

### How Word-of-Mouth Conquered The Multiplex

Without television advertisements, the film relied purely on organic audience reactions, viral scene dissections on YouTube, and an astonishing 98% audience rating across major aggregate review sites.

Independent theater owners across the Midwest and South reported adding extra midnight screenings to meet ticket demand after first-weekend crowds doubled in size.

"Audiences are hungry for stories where they genuinely don’t know what will happen in the next five minutes," noted veteran film critic Roger Diaz. "This proves that authentic storytelling still reigns supreme in American cinema."`,
    featured_image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-entertainment',
    category_name: 'Entertainment',
    author_name: 'Samantha Reyes',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    source_name: 'The Hollywood Reporter & Box Office Mojo',
    source_url: 'https://example.com/indie-box-office-phenomenon',
    status: 'published',
    featured: false,
    trending: false,
    breaking: false,
    trend_score: 79,
    views: 54100,
    reading_time: 4,
    seo_title: 'Indie Film Hits $100M Box Office Surprise | The USA Wire',
    meta_description: 'An original $300,000 independent film surpasses $100M at the American box office through viral acclaim.',
    tags: ['Movies', 'Hollywood', 'Cinema', 'Entertainment', 'IndieFilm'],
    published_at: '2026-09-19T13:45:00Z',
    updated_at: '2026-09-19T15:00:00Z',
    created_at: '2026-09-19T12:00:00Z',
  },
  {
    id: 'art-08',
    title: 'The Great American Return to "Third Places": How Neighborhood Book Cafes Are Reshaping Social Life',
    slug: 'great-american-return-third-places-neighborhood-book-cafes',
    subtitle: 'From Chicago to Nashville, Gen Z and Millennials are leaving digital screens behind to build physical community spaces.',
    content: `Sociologists have long discussed the concept of the "third place"—that essential environment distinct from home and work where community thrives, friendships form, and serendipitous conversation occurs.

Over the past two years, more than 800 independent bookstores with community cafes, late-night tea lounges, and craft social clubs have opened their doors in towns across the country.

### Rejecting The Loneliness Epidemic

Public health surveys have increasingly focused on the psychological toll of remote work and endless algorithm-driven feeds. In response, young Americans are actively seeking out spaces that ban laptops after 6:00 PM and feature board game nights, live acoustic music, and shared reading circles.

"People don't want another Slack channel or Zoom happy hour," says Maya Jenkins, co-founder of a bustling community book haven in Milwaukee. "They want the tactile warmth of paper, the smell of fresh espresso, and the chance to strike up a conversation with someone they’ve never met."`,
    featured_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-lifestyle',
    category_name: 'Lifestyle',
    author_name: 'Jordan Brooks',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    source_name: 'American Sociological Review & Urban Living',
    source_url: 'https://example.com/third-places-revival',
    status: 'published',
    featured: false,
    trending: false,
    breaking: false,
    trend_score: 72,
    views: 48900,
    reading_time: 4,
    seo_title: 'Return to Third Places Reshaping Social Life | The USA Wire',
    meta_description: 'How independent book cafes and community lounges are countering loneliness across American cities.',
    tags: ['Lifestyle', 'Community', 'Coffee', 'Culture', 'Books'],
    published_at: '2026-09-18T16:20:00Z',
    updated_at: '2026-09-18T18:00:00Z',
    created_at: '2026-09-18T14:00:00Z',
  },
  {
    id: 'art-09',
    title: 'Deep-Sea Archeologists Uncover Pristine 1880s Steamship Wreckage Off North Carolina’s Outer Banks',
    slug: 'deep-sea-archeologists-uncover-pristine-steamship-outer-banks',
    subtitle: 'Advanced sonar mapping reveals gold pocket watches, intact stained-glass skylights, and wooden cabin bulkheads preserved in the Atlantic depths.',
    content: `Sitting 700 feet beneath the turbulent surface of the Graveyard of the Atlantic, marine historians have located the remarkably intact remains of the 'SS Carolina Star', a luxury passenger coastal steamer that vanished in a ferocious hurricane in October 1888.

Using robotic submersibles equipped with 8K stereoscopic imaging, researchers were stunned to find the vessel resting upright on the sandy seafloor with its ornate brass bell and wheelhouse largely unscathed by 138 years of tidal currents.

### Preserved by Cold Currents

Oceanographers explained that low oxygen levels and constant 38-degree deep water currents prevented wood-boring worms from destroying the ship's intricate mahogany furniture and structural bulkheads.

The expedition team plans to map the entire debris field using photogrammetry to create a public 3D virtual museum accessible to students and maritime enthusiasts worldwide.`,
    featured_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-interesting',
    category_name: 'Interesting Stories',
    author_name: 'Chloe Bennett',
    author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    source_name: 'National Maritime Historical Society',
    source_url: 'https://example.com/carolina-star-discovery',
    status: 'published',
    featured: false,
    trending: false,
    breaking: false,
    trend_score: 75,
    views: 43200,
    reading_time: 3,
    seo_title: '1880s Steamship Wreck Discovered Off Outer Banks | The USA Wire',
    meta_description: 'Deep sea explorers discover pristine 19th century steamship wreckage off the coast of North Carolina.',
    tags: ['History', 'Ocean', 'Archeology', 'North Carolina', 'Discovery'],
    published_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-18T11:45:00Z',
    created_at: '2026-09-18T09:00:00Z',
  },
  {
    id: 'art-10',
    title: 'Manufacturing Renaissance: $40B Electric Vehicle Battery Megasites Near Completion Across Georgia and Kentucky',
    slug: 'manufacturing-renaissance-battery-megasites-georgia-kentucky',
    subtitle: 'The "Battery Belt" is generating tens of thousands of skilled jobs and revitalizing former industrial corridors.',
    content: `Along interstate corridors stretching from central Kentucky down through rural Georgia, steel frames have given way to state-of-the-art cleanroom manufacturing campuses that span hundreds of acres.

Known colloquially as the American "Battery Belt", these multi-billion-dollar investments by domestic and international automakers are preparing to ramp commercial production of next-generation solid-state and lithium-iron-phosphate battery cells.

### Community Revival and Apprenticeships

Local vocational colleges have established direct pipelines, offering tuition-free technical credentials for high school graduates to enter robotics maintenance, chemical quality assurance, and automated assembly.

"Ten years ago, young people left this county the day they finished school," remarked county commissioner James Rutledge. "Today, we have families moving in from across the country to take high-paying technical careers."`,
    featured_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-business',
    category_name: 'Business',
    author_name: 'Eleanor Sterling',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    source_name: 'US Department of Energy & Regional Economic Councils',
    source_url: 'https://example.com/battery-belt-progress',
    status: 'published',
    featured: false,
    trending: false,
    breaking: false,
    trend_score: 78,
    views: 39500,
    reading_time: 4,
    seo_title: 'Battery Belt Megasites Spark American Manufacturing Revival | The USA Wire',
    meta_description: 'How $40 billion in clean battery plants are transforming economic corridors across the American South.',
    tags: ['Manufacturing', 'Business', 'CleanTech', 'Jobs', 'Economy'],
    published_at: '2026-09-17T15:30:00Z',
    updated_at: '2026-09-17T18:00:00Z',
    created_at: '2026-09-17T13:00:00Z',
  },
  {
    id: 'art-11',
    title: 'National Parks Service Announces Smart Wildlife Corridors to Protect Migrating Elk and Pronghorn',
    slug: 'national-parks-announces-smart-wildlife-corridors-elk-pronghorn',
    subtitle: 'Overhead wildlife bridges and infrared sensor-activated speed limit zones cut highway collisions by 88% in Western states.',
    content: `For centuries, massive herds of Rocky Mountain elk, mule deer, and swift pronghorn have traversed historic migratory pathways stretching from Yellowstone to the Red Desert.

Today, federal wildlife administrators and state transportation departments celebrated the completion of the largest network of interconnected wildlife overpasses in the United States.

Landscaped with native sagebrush and natural sound-buffering earthen berms, these expansive bridges allow animals to cross six-lane interstate freeways without ever interacting with traffic.

"We have seen entire nursery herds with week-old fawns using the overpass within 48 hours of completion," shared lead wildlife biologist Dr. Hannah Sorenson. "It proves that we can expand modern transportation without severing the natural rhythms of our wildest landscapes."`,
    featured_image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-usa',
    category_name: 'USA News',
    author_name: 'Marcus Vance',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    source_name: 'US Department of the Interior',
    source_url: 'https://example.com/wildlife-corridors-milestone',
    status: 'published',
    featured: false,
    trending: false,
    breaking: false,
    trend_score: 70,
    views: 32800,
    reading_time: 3,
    seo_title: 'Wildlife Overpasses Cut Western Highway Collisions | The USA Wire',
    meta_description: 'Smart wildlife corridors in Wyoming and Montana reduce animal-vehicle strikes by 88 percent.',
    tags: ['Wildlife', 'Conservation', 'NationalParks', 'West', 'Nature'],
    published_at: '2026-09-17T11:00:00Z',
    updated_at: '2026-09-17T13:15:00Z',
    created_at: '2026-09-17T09:30:00Z',
  },
  {
    id: 'art-12',
    title: 'WNBA Finals Viewership Smashes All-Time Records with 5.8 Million Average Live Audience',
    slug: 'wnba-finals-viewership-smashes-all-time-records',
    subtitle: 'Unprecedented fan engagement, sold-out arenas, and dazzling clutch shotmaking usher in a golden era for women’s basketball.',
    content: `Game 5 of the championship series delivered a heart-pounding overtime buzzer-beater before a thunderous crowd of 19,000 in Minneapolis, crowning a historic sports season that redefined basketball viewership metrics.

Nielsen ratings confirmed an average of 5.8 million television and streaming viewers tuned into the final contest, marking an astounding 210% surge over previous franchise records.

Merchandise sales across the league spiked by triple digits, while sneaker endorsements and youth camp enrollments reached record highs in basketball hotbeds from coast to coast.

"The talent level across this league has always been elite, and now the entire world is watching and recognizing it," declared the Finals MVP during the trophy ceremony.`,
    featured_image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80',
    category_id: 'cat-sports',
    category_name: 'Sports',
    author_name: 'Trevor Matthews',
    author_avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    source_name: 'WNBA Media Bureau & Nielsen',
    source_url: 'https://example.com/wnba-finals-ratings',
    status: 'published',
    featured: false,
    trending: false,
    breaking: false,
    trend_score: 76,
    views: 51200,
    reading_time: 3,
    seo_title: 'WNBA Finals Ratings Hit Historic Highs | The USA Wire',
    meta_description: 'Record-setting viewership and sold-out crowds highlight a transformative championship series for women’s basketball.',
    tags: ['WNBA', 'Basketball', 'Sports', 'Ratings', 'Culture'],
    published_at: '2026-09-16T21:40:00Z',
    updated_at: '2026-09-17T00:10:00Z',
    created_at: '2026-09-16T20:00:00Z',
  }
];

export const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: 'med-01',
    name: 'high-speed-rail-modern.jpg',
    url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80',
    size: '1.8 MB',
    type: 'image/jpeg',
    uploaded_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'med-02',
    name: 'us-capitol-monetary.jpg',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80',
    size: '2.1 MB',
    type: 'image/jpeg',
    uploaded_at: '2026-09-20T11:00:00Z',
  },
  {
    id: 'med-03',
    name: 'sourdough-bakery-craft.jpg',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
    size: '1.4 MB',
    type: 'image/jpeg',
    uploaded_at: '2026-09-20T12:00:00Z',
  },
  {
    id: 'med-04',
    name: 'microchip-photonic-circuit.jpg',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    size: '2.4 MB',
    type: 'image/jpeg',
    uploaded_at: '2026-09-20T13:00:00Z',
  },
  {
    id: 'med-05',
    name: 'american-football-stadium.jpg',
    url: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1600&q=80',
    size: '2.2 MB',
    type: 'image/jpeg',
    uploaded_at: '2026-09-20T14:00:00Z',
  },
  {
    id: 'med-06',
    name: 'celestial-solar-eclipse.jpg',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    size: '1.9 MB',
    type: 'image/jpeg',
    uploaded_at: '2026-09-20T15:00:00Z',
  },
  {
    id: 'med-07',
    name: 'cinema-auditorium-indie.jpg',
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    size: '1.7 MB',
    type: 'image/jpeg',
    uploaded_at: '2026-09-20T16:00:00Z',
  },
  {
    id: 'med-08',
    name: 'community-book-cafe.jpg',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
    size: '1.6 MB',
    type: 'image/jpeg',
    uploaded_at: '2026-09-20T17:00:00Z',
  }
];
