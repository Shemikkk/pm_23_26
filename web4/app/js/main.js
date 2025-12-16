// Custom JS for the resume page (web4)
// Bootstrap's JS (bootstrap.bundle.min.js) is loaded before this file.

console.log('Web4 resume page loaded');

document.addEventListener('DOMContentLoaded', function () {
  // 1) Full name injection (no HTML insertion)
  const FULL_NAME = 'Your Full Name';
  const nameEl = document.getElementById('personName');
  if (nameEl) nameEl.textContent = FULL_NAME;

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
  const skillsData = [
    { label: 'Adobe Photoshop', value: 90 },
    { label: 'Adobe Illustrator', value: 85 },
    { label: 'Microsoft Word', value: 80 },
    { label: 'Microsoft PowerPoint', value: 80 },
    { label: 'HTML 5 / CSS 3', value: 75 }
  ];

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

  renderSkills(skillsData);
});
