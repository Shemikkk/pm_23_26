// Custom JS for the resume page (web3)
// Bootstrap's JS (bootstrap.bundle.min.js) is loaded before this file.

console.log('Web3 resume page loaded');

document.addEventListener('DOMContentLoaded', function () {
  const toggleButtons = document.querySelectorAll('[data-bs-toggle="collapse"][data-bs-target]');

  function updateIcon(button, isShown) {
    const icon = button.querySelector('i');
    if (!icon) return;

    icon.classList.toggle('fa-chevron-up', isShown);
    icon.classList.toggle('fa-chevron-down', !isShown);
  }

  toggleButtons.forEach((button) => {
    const targetSelector = button.getAttribute('data-bs-target');
    if (!targetSelector) return;

    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;

    const isShown = targetEl.classList.contains('show');
    updateIcon(button, isShown);

    targetEl.addEventListener('shown.bs.collapse', () => updateIcon(button, true));
    targetEl.addEventListener('hidden.bs.collapse', () => updateIcon(button, false));
  });
});
