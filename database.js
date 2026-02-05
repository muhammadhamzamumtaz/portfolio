const DB_KEY = 'portfolioDB.v2';

export const DEFAULT_PORTFOLIO = {
  name: 'Alex Morgan',
  role: 'Creative Full Stack Developer',
  about:
    'I design and build delightful digital products with performant frontends, clean APIs, and measurable outcomes.',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Figma'],
  contact: 'Email: alex@example.com | LinkedIn: linkedin.com/in/alexmorgan',
  projects: [
    {
      title: 'AI Analytics Hub',
      description: 'Executive dashboard with real-time metrics, alerts, and role-aware widgets.',
    },
    {
      title: 'Fintech Onboarding',
      description: 'Mobile-first customer onboarding flow with KYC automation and smart validation.',
    },
    {
      title: 'Creator Storefront',
      description: 'Content + commerce platform with subscriptions and custom merchandising tools.',
    },
    {
      title: 'Talent Match Engine',
      description: 'Matching portal that ranks candidates using configurable competency scoring.',
    },
  ],
};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const initial = { portfolio: clone(DEFAULT_PORTFOLIO) };
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  }

  const parsed = JSON.parse(raw);
  return {
    portfolio: { ...clone(DEFAULT_PORTFOLIO), ...parsed.portfolio },
  };
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function getPortfolioData() {
  return clone(loadDB().portfolio);
}

export function savePortfolioData(portfolio) {
  const db = loadDB();
  db.portfolio = portfolio;
  saveDB(db);
}

export function resetPortfolioData() {
  const db = loadDB();
  db.portfolio = clone(DEFAULT_PORTFOLIO);
  saveDB(db);
}
