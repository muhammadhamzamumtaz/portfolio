import { getPortfolioData } from './database.js';

function renderFrontPanel() {
  const heroName = document.getElementById('hero-name');
  if (!heroName) {
    return;
  }

  const data = getPortfolioData();

  heroName.textContent = data.name;
  document.getElementById('hero-role').textContent = data.role;
  document.getElementById('about-text').textContent = data.about;
  document.getElementById('contact-text').textContent = data.contact;

  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = '';
  data.skills.forEach((skill) => {
    const item = document.createElement('li');
    item.textContent = skill;
    skillsList.appendChild(item);
  });

  const servicesList = document.getElementById('services-list');
  servicesList.innerHTML = '';
  data.services.forEach((service) => {
    const item = document.createElement('li');
    item.textContent = service;
    servicesList.appendChild(item);
  });

  const projectsGrid = document.getElementById('projects-grid');
  projectsGrid.innerHTML = '';
  data.projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `<h3>${project.title}</h3><p>${project.description}</p>`;
    projectsGrid.appendChild(card);
  });

  const testimonialsGrid = document.getElementById('testimonials-grid');
  testimonialsGrid.innerHTML = '';
  data.testimonials.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `<h3>${item.author}</h3><p>${item.text}</p>`;
    testimonialsGrid.appendChild(card);
  });
}

renderFrontPanel();
