const STORAGE_KEY = 'portfolioData.v1';

const DEFAULT_DATA = {
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

function getPortfolioData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return structuredClone(DEFAULT_DATA);
  }

  try {
    return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function savePortfolioData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetPortfolioData() {
  localStorage.removeItem(STORAGE_KEY);
}

function renderFrontPanel() {
  const heroSection = document.getElementById('hero-section');
  if (!heroSection) {
    return;
  }

  const data = getPortfolioData();

  heroSection.innerHTML = `<h2>${data.name}</h2><p>${data.role}</p>`;
  document.getElementById('about-text').textContent = data.about;
  document.getElementById('contact-text').textContent = data.contact;

  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = '';
  data.skills.forEach((skill) => {
    const item = document.createElement('li');
    item.textContent = skill;
    skillsList.appendChild(item);
  });

  const projectsGrid = document.getElementById('projects-grid');
  projectsGrid.innerHTML = '';
  data.projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `<h3>${project.title}</h3><p>${project.description}</p>`;
    projectsGrid.appendChild(card);
  });
}

window.PortfolioStore = {
  DEFAULT_DATA,
  getPortfolioData,
  savePortfolioData,
  resetPortfolioData,
};

renderFrontPanel();
