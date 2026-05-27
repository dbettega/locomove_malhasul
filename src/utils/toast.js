let container = null;

function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration ms
 */
export function toast(message, type = 'info', duration = 3500) {
  const c = getContainer();
  const el = document.createElement('div');
  el.className = `toast ${type}`;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const colors = { success: '#3ecf5c', error: '#ff5a5a', info: '#4a9eff' };

  el.innerHTML = `
    <span style="color:${colors[type]};font-weight:700;font-size:16px">${icons[type]}</span>
    <span>${message}</span>
  `;

  c.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    el.style.transition = '0.3s ease';
    setTimeout(() => el.remove(), 300);
  }, duration);
}
