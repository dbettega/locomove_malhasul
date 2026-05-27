import './styles/global.css';
import { registerSW } from './services/sw-register.js';
import { renderPublico } from './pages/publico.js';
import { renderLogin } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderEventos } from './pages/eventos.js';
import { renderInscricoes } from './pages/inscricoes.js';
import { renderParticipantes } from './pages/participantes.js';
import { isAuthenticated, clearToken } from './security/auth.js';
import { createSidebar } from './components/sidebar.js';

const app = document.getElementById('app');
let publicoEl = null;
let adminWrap = null;
let sidebarCtrl = null;
const pageCache = {};

// ── Style additions
const extraStyle = document.createElement('style');
extraStyle.textContent = `
  .tela-pub { min-height: 100vh; }
  @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(extraStyle);

// ── Bootstrap
function init() {
  // Check if already admin and hash says admin
  const hash = location.hash.replace('#', '');
  if (isAuthenticated() && hash && hash !== 'pub') {
    showAdmin(hash || 'dashboard');
  } else {
    showPublico();
  }
}

// ── Public view
function showPublico() {
  // Remove admin shell if exists
  if (adminWrap) { adminWrap.remove(); adminWrap = null; sidebarCtrl = null; }
  if (!publicoEl) {
    publicoEl = renderPublico(() => {
      if (isAuthenticated()) {
        showAdmin('dashboard');
      } else {
        showLoginModal('dashboard');
      }
    });
    app.appendChild(publicoEl);
  }
  publicoEl.style.display = 'block';
  history.replaceState(null, '', '#pub');
}

// ── Login modal
function showLoginModal(redirectTo) {
  const loginEl = renderLogin((target) => {
    if (target === 'pub') {
      loginEl.remove();
      return;
    }
    loginEl.remove();
    showAdmin(redirectTo || 'dashboard');
  });
  document.body.appendChild(loginEl);
}

// ── Admin shell
const PAGE_BUILDERS = {
  dashboard: () => import('./pages/dashboard.js').then(m => m.renderDashboard()),
  eventos: () => import('./pages/eventos.js').then(m => m.renderEventos()),
  inscricoes: () => import('./pages/inscricoes.js').then(m => m.renderInscricoes()),
  participantes: () => import('./pages/participantes.js').then(m => m.renderParticipantes()),
};

const TITLES = { dashboard:'Dashboard', eventos:'Gestão de Eventos', inscricoes:'Inscrições', participantes:'Participantes' };

async function showAdmin(pageId = 'dashboard') {
  if (!isAuthenticated()) { showLoginModal(pageId); return; }

  // Hide public
  if (publicoEl) publicoEl.style.display = 'none';

  // Build admin shell if needed
  if (!adminWrap) buildAdminShell();

  // Navigate
  await navigateAdmin(pageId);
}

function buildAdminShell() {
  adminWrap = document.createElement('div');
  adminWrap.id = 'admin-wrap';
  adminWrap.style.display = 'flex';
  adminWrap.style.minHeight = '100vh';

  const { sidebar, overlay, setActive, openMobile, closeMobile, showProtected } =
    createSidebar(navigateAdmin, logout);
  sidebarCtrl = { setActive, showProtected, openMobile };

  const mainWrap = document.createElement('div');
  mainWrap.className = 'main-wrap';

  const topbar = document.createElement('header');
  topbar.className = 'topbar';
  topbar.innerHTML = `
    <button class="menu-btn" id="menu-toggle">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
    <span class="topbar-title" id="topbar-title">Dashboard</span>
    <div class="topbar-actions">
      <button class="btn btn-ghost btn-sm" id="btn-site-pub" title="Ver site público">🌐 Site</button>
      <div id="session-timer" style="font-size:0.72rem;color:var(--text-3);background:var(--surface-2);border:1px solid var(--border);border-radius:99px;padding:4px 10px;display:none"></div>
    </div>
  `;

  const content = document.createElement('main');
  content.id = 'admin-content';
  content.style.flex = '1';

  mainWrap.appendChild(topbar);
  mainWrap.appendChild(content);
  adminWrap.appendChild(sidebar);
  adminWrap.appendChild(overlay);
  adminWrap.appendChild(mainWrap);
  app.appendChild(adminWrap);

  topbar.querySelector('#menu-toggle').addEventListener('click', openMobile);
  topbar.querySelector('#btn-site-pub').addEventListener('click', () => {
    if (publicoEl) publicoEl.style.display = 'block';
    adminWrap.style.display = 'none';
    history.replaceState(null, '', '#pub');
  });

  updateTimer();
  setInterval(updateTimer, 60000);
  window.addEventListener('locomove:logout', logout);
}

async function navigateAdmin(pageId) {
  if (!isAuthenticated()) { logout(); return; }

  const content = document.getElementById('admin-content');
  if (!content) return;

  content.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  if (!pageCache[pageId]) {
    try {
      const builder = PAGE_BUILDERS[pageId];
      if (!builder) return;
      const el = await builder();
      pageCache[pageId] = el;
      content.appendChild(el);
    } catch(e) { console.error(e); return; }
  }

  pageCache[pageId].classList.add('active');
  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = TITLES[pageId] || pageId;
  sidebarCtrl?.setActive(pageId);
  history.replaceState(null, '', '#' + pageId);
  updateTimer();
}

function logout() {
  clearToken();
  Object.keys(pageCache).forEach(k => delete pageCache[k]);
  if (adminWrap) { adminWrap.remove(); adminWrap = null; sidebarCtrl = null; }
  showPublico();
}

function updateTimer() {
  const el = document.getElementById('session-timer');
  if (!el) return;
  if (!isAuthenticated()) { el.style.display = 'none'; return; }
  try {
    const raw = sessionStorage.getItem('lm_token');
    if (!raw) return;
    const { expires } = JSON.parse(raw);
    const mins = Math.max(0, Math.floor((expires - Date.now()) / 60000));
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    el.style.display = 'block';
    el.textContent = `⏱ ${hrs}h${rem.toString().padStart(2,'0')}m`;
    el.style.color = mins < 30 ? 'var(--amber)' : 'var(--text-3)';
  } catch { el.style.display = 'none'; }
}

init();
registerSW();
