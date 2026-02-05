const DB_KEY = 'portfolioDB.v1';
const SESSION_KEY = 'portfolioSession.v1';

const DEFAULT_PORTFOLIO = {
  name: 'Alex Morgan',
  role: 'Full Stack Developer',
  about:
    'I build performant web applications with a strong focus on UX, maintainability, and measurable business impact.',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'UI Design'],
  contact: 'Email: alex@example.com | LinkedIn: linkedin.com/in/alexmorgan',
  projects: [
    {
      title: 'Analytics Dashboard',
      description: 'Interactive KPI dashboard with role-based access and real-time charts.',
    },
    {
      title: 'E-commerce Platform',
      description: 'Scalable storefront with payment integration and custom CMS.',
    },
    {
      title: 'Mobile Banking UI',
      description: 'Accessible and responsive banking experience optimized for trust and clarity.',
    },
    {
      title: 'Recruitment Portal',
      description: 'Applicant tracking system with workflow automation and reporting.',
    },
  ],
};

const DEFAULT_DB = {
  users: [
    {
      username: 'admin',
      password: 'admin123',
    },
  ],
  portfolio: DEFAULT_PORTFOLIO,
};

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const initial = cloneData(DEFAULT_DB);
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users?.length ? parsed.users : cloneData(DEFAULT_DB.users),
      portfolio: { ...cloneData(DEFAULT_PORTFOLIO), ...parsed.portfolio },
    };
  } catch {
    const initial = cloneData(DEFAULT_DB);
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getPortfolioData() {
  return cloneData(loadDB().portfolio);
}

function savePortfolioData(portfolio) {
  const db = loadDB();
  db.portfolio = portfolio;
  saveDB(db);
}

function resetPortfolioData() {
  const db = loadDB();
  db.portfolio = cloneData(DEFAULT_PORTFOLIO);
  saveDB(db);
}

function authenticate(username, password) {
  const db = loadDB();
  const matchedUser = db.users.find(
    (user) => user.username === username && user.password === password,
  );

  if (!matchedUser) {
    return false;
  }

  localStorage.setItem(SESSION_KEY, username);
  return true;
}

function isAuthenticated() {
  return Boolean(localStorage.getItem(SESSION_KEY));
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function getCurrentUser() {
  return localStorage.getItem(SESSION_KEY);
}

function updateAdminCredentials(currentPassword, newUsername, newPassword) {
  const db = loadDB();
  const currentUsername = getCurrentUser();

  if (!currentUsername) {
    return { ok: false, message: 'No active session.' };
  }

  const user = db.users.find((item) => item.username === currentUsername);
  if (!user || user.password !== currentPassword) {
    return { ok: false, message: 'Current password is incorrect.' };
  }

  user.username = newUsername;
  user.password = newPassword;

  saveDB(db);
  localStorage.setItem(SESSION_KEY, newUsername);
  return { ok: true, message: 'Credentials updated successfully.' };
}

window.PortfolioDB = {
  DEFAULT_PORTFOLIO,
  loadDB,
  getPortfolioData,
  savePortfolioData,
  resetPortfolioData,
  authenticate,
  isAuthenticated,
  logout,
  getCurrentUser,
  updateAdminCredentials,
};
