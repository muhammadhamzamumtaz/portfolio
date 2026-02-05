const loginCard = document.getElementById('login-card');
const adminCard = document.getElementById('admin-card');
const loginForm = document.getElementById('login-form');
const loginStatus = document.getElementById('login-status');
const adminForm = document.getElementById('admin-form');
const credentialsForm = document.getElementById('credentials-form');
const statusMessage = document.getElementById('status');
const projectsEditorList = document.getElementById('projects-editor-list');

function showAdminView() {
  loginCard.classList.add('hidden');
  adminCard.classList.remove('hidden');
}

function showLoginView() {
  adminCard.classList.add('hidden');
  loginCard.classList.remove('hidden');
}

function buildProjectRow(project = { title: '', description: '' }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'editor-item';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Project title';
  titleInput.value = project.title;

  const descInput = document.createElement('input');
  descInput.type = 'text';
  descInput.placeholder = 'Project description';
  descInput.value = project.description;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'button danger';
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => wrapper.remove());

  wrapper.append(titleInput, descInput, removeBtn);
  projectsEditorList.appendChild(wrapper);
}

function populateForm(data) {
  document.getElementById('name').value = data.name;
  document.getElementById('role').value = data.role;
  document.getElementById('about').value = data.about;
  document.getElementById('skills').value = data.skills.join(', ');
  document.getElementById('contact').value = data.contact;

  projectsEditorList.innerHTML = '';
  data.projects.forEach((project) => buildProjectRow(project));

  const currentUser = window.PortfolioDB.getCurrentUser();
  document.getElementById('new-username').value = currentUser || '';
}

function collectFormData() {
  const projectRows = [...projectsEditorList.querySelectorAll('.editor-item')];
  const projects = projectRows
    .map((row) => {
      const [titleInput, descInput] = row.querySelectorAll('input');
      return {
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
      };
    })
    .filter((project) => project.title && project.description);

  return {
    name: document.getElementById('name').value.trim(),
    role: document.getElementById('role').value.trim(),
    about: document.getElementById('about').value.trim(),
    skills: document
      .getElementById('skills')
      .value.split(',')
      .map((skill) => skill.trim())
      .filter(Boolean),
    contact: document.getElementById('contact').value.trim(),
    projects,
  };
}

if (loginForm && adminForm) {
  if (window.PortfolioDB.isAuthenticated()) {
    showAdminView();
    populateForm(window.PortfolioDB.getPortfolioData());
  } else {
    showLoginView();
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    const ok = window.PortfolioDB.authenticate(username, password);
    if (!ok) {
      loginStatus.textContent = 'Invalid username or password.';
      return;
    }

    loginStatus.textContent = '';
    showAdminView();
    populateForm(window.PortfolioDB.getPortfolioData());
  });

  document.getElementById('logout').addEventListener('click', () => {
    window.PortfolioDB.logout();
    statusMessage.textContent = '';
    showLoginView();
  });

  document.getElementById('add-project').addEventListener('click', () => {
    buildProjectRow();
  });

  document.getElementById('reset-data').addEventListener('click', () => {
    window.PortfolioDB.resetPortfolioData();
    populateForm(window.PortfolioDB.DEFAULT_PORTFOLIO);
    statusMessage.textContent = 'Portfolio data reset to defaults.';
  });

  adminForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = collectFormData();
    window.PortfolioDB.savePortfolioData(data);
    statusMessage.textContent = 'Portfolio changes saved successfully.';
  });

  credentialsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newUsername = document.getElementById('new-username').value.trim();
    const newPassword = document.getElementById('new-password').value;

    if (!newUsername || !newPassword) {
      statusMessage.textContent = 'New username and password are required.';
      return;
    }

    const result = window.PortfolioDB.updateAdminCredentials(
      currentPassword,
      newUsername,
      newPassword,
    );

    statusMessage.textContent = result.message;
    if (result.ok) {
      credentialsForm.reset();
      document.getElementById('new-username').value = window.PortfolioDB.getCurrentUser();
    }
  });
}
