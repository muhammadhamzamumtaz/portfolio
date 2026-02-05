function renderFrontPanel() {
  const heroSection = document.getElementById('hero-section');
  if (!heroSection) {
    return;
  }

  const data = window.PortfolioDB.getPortfolioData();

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

renderFrontPanel();
