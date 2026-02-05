import { DEFAULT_PORTFOLIO, getPortfolioData, resetPortfolioData, savePortfolioData } from './database.js';
import {
  isAuthorizedAdmin,
  isFirebaseConfigured,
  listenForAuthChanges,
  logout,
  sendResetLink,
  signInWithGoogle,
} from './firebase-auth.js';

const authCard = document.getElementById('auth-card');
const adminCard = document.getElementById('admin-card');
const authStatus = document.getElementById('auth-status');
const adminForm = document.getElementById('admin-form');
const projectsEditorList = document.getElementById('projects-editor-list');
const statusMessage = document.getElementById('status');

function showAdminView() {
  authCard.classList.add('hidden');
  adminCard.classList.remove('hidden');
}

function showAuthView() {
  adminCard.classList.add('hidden');
  authCard.classList.remove('hidden');
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

if (!isFirebaseConfigured()) {
  authStatus.textContent = 'Firebase is not configured. Update firebase-auth.js with your project credentials.';
}

listenForAuthChanges((user) => {
  if (isAuthorizedAdmin(user)) {
    showAdminView();
    populateForm(getPortfolioData());
  } else {
    showAuthView();
    if (user) {
      authStatus.textContent = 'Signed in account is not allowed for admin access.';
    }
  }
});

document.getElementById('google-signin').addEventListener('click', async () => {
  try {
    authStatus.textContent = 'Signing in...';
    await signInWithGoogle();
    authStatus.textContent = 'Google sign-in successful.';
  } catch (error) {
    authStatus.textContent = `Sign-in failed: ${error.message}`;
  }
});

document.getElementById('logout').addEventListener('click', async () => {
  await logout();
  authStatus.textContent = 'Logged out.';
  showAuthView();
});

document.getElementById('forgot-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('reset-email').value.trim();

  try {
    await sendResetLink(email);
    authStatus.textContent = 'Password reset link sent. Check your Gmail inbox.';
  } catch (error) {
    authStatus.textContent = `Could not send reset link: ${error.message}`;
  }
});

document.getElementById('add-project').addEventListener('click', () => {
  buildProjectRow();
});

document.getElementById('reset-data').addEventListener('click', () => {
  resetPortfolioData();
  populateForm(DEFAULT_PORTFOLIO);
  statusMessage.textContent = 'Portfolio data reset to defaults.';
});

adminForm.addEventListener('submit', (event) => {
  event.preventDefault();
  savePortfolioData(collectFormData());
  statusMessage.textContent = 'Portfolio changes saved successfully.';
});
