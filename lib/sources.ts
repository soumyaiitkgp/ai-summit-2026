export interface RSSSource {
  id: string
  name: string
  url: string
  region: 'india' | 'global' | 'official'
  logo: string
  filterStrict: boolean // true = must match AI+India keywords; false = any AI/tech content
}

export const RSS_SOURCES: RSSSource[] = [
  // Global AI
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    region: 'global',
    logo: '/logos/techcrunch.svg',
    filterStrict: true,
  },
  {
    id: 'theverge-ai',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    region: 'global',
    logo: '/logos/theverge.svg',
    filterStrict: true,
  },
  {
    id: 'wired-ai',
    name: 'Wired',
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    region: 'global',
    logo: '/logos/wired.svg',
    filterStrict: true,
  },
  {
    id: 'mit-tech-review',
    name: 'MIT Tech Review',
    url: 'https://www.technologyreview.com/feed/',
    region: 'global',
    logo: '/logos/mit.svg',
    filterStrict: true,
  },
  {
    id: 'venturebeat-ai',
    name: 'VentureBeat',
    url: 'https://venturebeat.com/category/ai/feed/',
    region: 'global',
    logo: '/logos/venturebeat.svg',
    filterStrict: true,
  },
  {
    id: 'arstechnica',
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    region: 'global',
    logo: '/logos/ars.svg',
    filterStrict: true,
  },
  // India Tech
  {
    id: 'the-hindu-tech',
    name: 'The Hindu',
    url: 'https://www.thehindu.com/sci-tech/technology/feeder/default.rss',
    region: 'india',
    logo: '/logos/thehindu.svg',
    filterStrict: false,
  },
  {
    id: 'inc42',
    name: 'Inc42',
    url: 'https://inc42.com/feed/',
    region: 'india',
    logo: '/logos/inc42.svg',
    filterStrict: false,
  },
  {
    id: 'yourstory',
    name: 'YourStory',
    url: 'https://yourstory.com/feed',
    region: 'india',
    logo: '/logos/yourstory.svg',
    filterStrict: false,
  },
  {
    id: 'et-tech',
    name: 'Economic Times',
    url: 'https://economictimes.indiatimes.com/tech/rss.cms',
    region: 'india',
    logo: '/logos/et.svg',
    filterStrict: false,
  },
  {
    id: 'gadgets360',
    name: 'Gadgets360',
    url: 'https://feeds.feedburner.com/gadgets360-latest',
    region: 'india',
    logo: '/logos/gadgets360.svg',
    filterStrict: false,
  },
  {
    id: 'livemint-tech',
    name: 'LiveMint',
    url: 'https://www.livemint.com/rss/technology',
    region: 'india',
    logo: '/logos/livemint.svg',
    filterStrict: false,
  },
  {
    id: 'bs-tech',
    name: 'Business Standard',
    url: 'https://www.business-standard.com/rss/technology-10.rss',
    region: 'india',
    logo: '/logos/bs.svg',
    filterStrict: false,
  },
  {
    id: 'analytics-india',
    name: 'Analytics India',
    url: 'https://analyticsindiamag.com/feed/',
    region: 'india',
    logo: '/logos/aim.svg',
    filterStrict: false,
  },
  {
    id: 'hindustan-times-tech',
    name: 'Hindustan Times',
    url: 'https://www.hindustantimes.com/feeds/rss/technology/rssfeed.xml',
    region: 'india',
    logo: '/logos/ht.svg',
    filterStrict: false,
  },
  // Official
  {
    id: 'pib',
    name: 'PIB India',
    url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3',
    region: 'official',
    logo: '/logos/pib.svg',
    filterStrict: false,
  },
]

// Primary keywords — always include if matched anywhere
export const PRIMARY_KEYWORDS = [
  'AI Summit',
  'AISummitDelhi',
  'AI Summit Delhi',
  'AISummit2026',
  'AI Summit 2026',
  'MeitY',
  'NASSCOM',
  'Digital India AI',
  'India AI Mission',
  'Niti Aayog AI',
]

// AI topic keywords — used for strict-filter sources (must also match India keywords)
export const AI_KEYWORDS = [
  'artificial intelligence',
  'machine learning',
  'generative AI',
  'large language model',
  'LLM',
  'ChatGPT',
  'OpenAI',
  'Google AI',
  'Google DeepMind',
  'Microsoft AI',
  'Anthropic',
  'AI regulation',
  'AI policy',
  'AI governance',
  'foundation model',
]

// India context keywords — used for global sources to ensure India relevance
export const INDIA_KEYWORDS = [
  'India',
  'Indian',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Bengaluru',
  'New Delhi',
  'Asia',
  'South Asia',
  'NASSCOM',
  'MeitY',
  'Infosys',
  'TCS',
  'Wipro',
  'Reliance',
]
