const adminForm = document.getElementById('admin-form');

if (adminForm) {
  const {
    DEFAULT_DATA,
    getPortfolioData,
    savePortfolioData,
    resetPortfolioData,
  } = window.PortfolioStore;

  const projectsEditorList = document.getElementById('projects-editor-list');
  const statusMessage = document.getElementById('status');

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

  document.getElementById('add-project').addEventListener('click', () => {
    buildProjectRow();
  });

  document.getElementById('reset-data').addEventListener('click', () => {
    resetPortfolioData();
    populateForm(DEFAULT_DATA);
    statusMessage.textContent = 'Data reset to defaults.';
  });

  adminForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = collectFormData();
    savePortfolioData(data);
    statusMessage.textContent = 'Changes saved successfully.';
  });

  populateForm(getPortfolioData());
}
