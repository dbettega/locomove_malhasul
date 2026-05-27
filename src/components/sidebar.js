const NAV_ITEMS = [
  { id: 'dashboard',     icon: '◈',  label: 'Dashboard',       group: 'principal', protected: true },
  { id: 'eventos',       icon: '📅', label: 'Eventos',          group: 'gestão',    protected: true },
  { id: 'inscricoes',    icon: '👥', label: 'Inscrições',       group: 'gestão',    protected: true },
  { id: 'participantes', icon: '🗂️', label: 'Participantes',    group: 'gestão',    protected: true },
  { id: 'cadastro',      icon: '✍️', label: 'Cadastro Público', group: 'público',   protected: false },
];

export function createSidebar(onNavigate, onLogout) {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';

  // Logo
  const logo = document.createElement('div');
  logo.className = 'sidebar-logo';
  logo.innerHTML = `
    <div class="sidebar-logo-mark">
      <div class="logo-icon">🚂</div>
      <div>
        <div class="logo-text">LOCOMOVE</div>
        <div class="logo-sub">Rumo Malha Sul</div>
      </div>
    </div>
  `;

  // Nav
  const nav = document.createElement('nav');
  nav.className = 'sidebar-nav';

  let lastGroup = '';
  NAV_ITEMS.forEach(item => {
    if (item.group !== lastGroup) {
      const label = document.createElement('div');
      label.className = 'nav-label';
      label.textContent = item.group;
      nav.appendChild(label);
      lastGroup = item.group;
    }

    const btn = document.createElement('button');
    btn.className = 'nav-item';
    btn.dataset.page = item.id;
    btn.innerHTML = `
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
      ${item.protected ? '' : '<span style="font-size:0.6rem;color:var(--green);margin-left:auto;background:var(--green-dim);padding:2px 6px;border-radius:99px">público</span>'}
    `;
    btn.addEventListener('click', () => {
      setActive(item.id);
      onNavigate(item.id);
      closeMobile();
    });
    nav.appendChild(btn);
  });

  // Footer
  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';
  footer.innerHTML = `
    <div class="sidebar-user" id="sidebar-user-info">
      <div class="avatar">RMS</div>
      <div class="user-info">
        <div class="user-name">Rumo Malha Sul</div>
        <div class="user-role">Administrador</div>
      </div>
    </div>
    <button id="btn-logout" class="nav-item" style="margin-top:4px;color:var(--red);width:100%">
      <span class="nav-icon">⏻</span>
      <span>Sair</span>
    </button>
  `;

  sidebar.appendChild(logo);
  sidebar.appendChild(nav);
  sidebar.appendChild(footer);

  // Logout
  footer.querySelector('#btn-logout').addEventListener('click', () => {
    onLogout?.();
  });

  // Mobile overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebar-overlay';
  overlay.addEventListener('click', closeMobile);

  function setActive(pageId) {
    nav.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageId);
    });
  }

  function showProtected(show) {
    // Mostra/esconde itens protegidos e botão de logout
    nav.querySelectorAll('.nav-item').forEach(btn => {
      const item = NAV_ITEMS.find(n => n.id === btn.dataset.page);
      if (item?.protected) btn.style.display = show ? '' : 'none';
    });
    footer.style.display = show ? '' : 'none';
  }

  function openMobile() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  return { sidebar, overlay, setActive, openMobile, closeMobile, showProtected };
}
