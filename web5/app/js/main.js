// Custom JS for the resume page (web5)
// Bootstrap's JS (bootstrap.bundle.min.js) is loaded before this file.

console.log('Web5 resume page loaded');

document.addEventListener('DOMContentLoaded', function () {
  // Load data.json via Fetch API
  async function loadData() {
    try {
      const res = await fetch('data.json', { cache: 'no-store' });
      console.log('Fetch response:', res);
      if (!res.ok) throw new Error('Failed to load data.json');
      return await res.json();
    } catch (err) {
      console.error(err);
      const status = document.getElementById('appStatus');
      if (status) status.textContent = 'Unable to load data.json';
      return null;
    }
  }

  function renderName(person) {
    const nameEl = document.getElementById('personName');
    if (!nameEl || !person) return;
    const first = person.firstName || '';
    const last = person.lastName || '';
    nameEl.textContent = `${first} ${last}`.trim();
  }

  // 2) Section toggles with Bootstrap Collapse API and arrow rotation
  const toggleButtons = document.querySelectorAll('.js-section-toggle[data-bs-target]');
  toggleButtons.forEach((btn) => {
    const targetSelector = btn.getAttribute('data-bs-target');
    const targetEl = targetSelector ? document.querySelector(targetSelector) : null;
    if (!targetEl) return;

    const collapse = window.bootstrap
      ? window.bootstrap.Collapse.getOrCreateInstance(targetEl, { toggle: false })
      : null;

    const icon = btn.querySelector('i');

    // Initialize arrow orientation based on current visibility
    const opened = targetEl.classList.contains('show');
    if (icon) icon.classList.toggle('fa-rotate-180', !opened);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!collapse) return;
      collapse.toggle();
    });

    targetEl.addEventListener('shown.bs.collapse', () => {
      if (icon) icon.classList.remove('fa-rotate-180');
    });
    targetEl.addEventListener('hidden.bs.collapse', () => {
      if (icon) icon.classList.add('fa-rotate-180');
    });
  });

  // 3) Skills data array + dynamic rendering
  // Render skills from data.json
  let skillsData = [];

  function renderSkills(items) {
    const container = document.getElementById('dynamicSkills');
    if (!container) return;

    container.innerHTML = '';

    const frag = document.createDocumentFragment();
    items.forEach(({ label, value }) => {
      const col = document.createElement('div');
      col.className = 'col-sm-4';
      col.innerHTML = `
        <div class="resume-skill-label text-uppercase mb-1">${label}</div>
        <div class="progress">
          <div class="progress-bar" style="width: ${Number(value) || 0}%"></div>
        </div>
      `;
      frag.appendChild(col);
    });

    container.appendChild(frag);
  }

  loadData().then((data) => {
    console.log('Loaded data:', data);
    if (!data) return;
    renderName(data.person);
    skillsData = Array.isArray(data.skills) ? data.skills : [];
    renderSkills(skillsData);
  });
});
