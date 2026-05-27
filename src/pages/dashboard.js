import { getDashboard, getEventos } from '../services/api.js';
import { fmtDate, fmtNum, statusBadge, trunc } from '../utils/format.js';
import { toast } from '../utils/toast.js';

export function renderDashboard() {
  const page = document.createElement('div');
  page.className = 'page';
  page.id = 'page-dashboard';

  page.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-heading">Dashboard</h1>
        <p class="page-sub">Visão geral de eventos e inscrições</p>
      </div>
      <div class="topbar-actions">
        <button class="btn btn-ghost btn-sm" id="dash-refresh">
          🔄 Atualizar
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="stats-grid" id="dash-stats">
      ${skeletonStats()}
    </div>

    <!-- Charts + Activity -->
    <div class="dashboard-grid">
      <!-- Eventos por mês -->
      <div class="card" id="dash-eventos-chart">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <div>
            <div style="font-family:var(--font-display);font-weight:700;font-size:0.95rem">Eventos por Mês</div>
            <div style="font-size:0.75rem;color:var(--text-3);margin-top:2px">Últimos 6 meses</div>
          </div>
        </div>
        <div id="chart-bars" class="chart-bars" style="height:120px">
          <div class="empty-state"><span class="spinner"></span></div>
        </div>
        <div id="chart-labels" style="display:flex;gap:6px;margin-top:8px"></div>
      </div>

      <!-- Inscrições por status -->
      <div class="card" id="dash-status-chart">
        <div style="font-family:var(--font-display);font-weight:700;font-size:0.95rem;margin-bottom:4px">Inscrições por Status</div>
        <div style="font-size:0.75rem;color:var(--text-3);margin-bottom:20px">Distribuição atual</div>
        <div id="dash-progress" class="progress-wrap"></div>
      </div>

      <!-- Próximos eventos -->
      <div class="card">
        <div style="font-family:var(--font-display);font-weight:700;font-size:0.95rem;margin-bottom:4px">Próximos Eventos</div>
        <div style="font-size:0.75rem;color:var(--text-3);margin-bottom:16px">Agenda</div>
        <div id="dash-proximos"></div>
      </div>

      <!-- Atividade recente -->
      <div class="card">
        <div style="font-family:var(--font-display);font-weight:700;font-size:0.95rem;margin-bottom:4px">Atividade Recente</div>
        <div style="font-size:0.75rem;color:var(--text-3);margin-bottom:16px">Últimas movimentações</div>
        <div id="dash-activity" class="activity-list"></div>
      </div>

      <!-- Top eventos -->
      <div class="card dashboard-wide">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div>
            <div style="font-family:var(--font-display);font-weight:700;font-size:0.95rem">Top Eventos por Inscrições</div>
            <div style="font-size:0.75rem;color:var(--text-3);margin-top:2px">Ranking de engajamento</div>
          </div>
        </div>
        <div id="dash-top-table"></div>
      </div>
    </div>
  `;

  // Load data on mount
  loadDashboard(page);

  page.querySelector('#dash-refresh').addEventListener('click', () => loadDashboard(page));

  return page;
}

function skeletonStats() {
  const items = ['Eventos Ativos', 'Total Inscrições', 'Taxa Confirmação', 'Eventos este mês'];
  return items.map((label, i) => `
    <div class="stat-card ${['green','blue','amber','purple'][i]}">
      <span class="stat-icon">${['📅','👥','✅','🚂'][i]}</span>
      <div class="stat-value" style="opacity:0.3">—</div>
      <div class="stat-label">${label}</div>
    </div>
  `).join('');
}

async function loadDashboard(page) {
  try {
    // Try API first, fallback to computed from eventos list
    let dash;
    try {
      dash = await getDashboard();
      dash = dash.data || dash;
    } catch {
      // Compute from getEventos
      const ev = await getEventos();
      dash = computeDashboard(ev.data || []);
    }

    renderStats(page, dash);
    renderChart(page, dash);
    renderProgress(page, dash);
    renderProximos(page, dash);
    renderActivity(page, dash);
    renderTopTable(page, dash);
  } catch (err) {
    toast('Erro ao carregar dashboard: ' + err.message, 'error');
  }
}

function computeDashboard(eventos) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();

  const ativos = eventos.filter(e => e.Status?.toLowerCase() === 'ativo').length;
  const totalInscricoes = eventos.reduce((s, e) => s + (Number(e.Inscritos) || 0), 0);
  const confirmados = eventos.reduce((s, e) => s + (Number(e.Confirmados) || 0), 0);
  const taxa = totalInscricoes > 0 ? Math.round((confirmados / totalInscricoes) * 100) : 0;
  const mesAtual = eventos.filter(e => {
    const d = new Date(e.Data);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  // Monthly buckets (last 6 months)
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(thisYear, thisMonth - i, 1);
    const mes = d.toLocaleDateString('pt-BR', { month: 'short' });
    const count = eventos.filter(e => {
      const ed = new Date(e.Data);
      return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
    }).length;
    meses.push({ mes, count });
  }

  // Status distribution
  const statusDist = {};
  eventos.forEach(e => {
    const s = e.Status || 'Indefinido';
    statusDist[s] = (statusDist[s] || 0) + 1;
  });

  // Top eventos
  const top = [...eventos]
    .sort((a, b) => (Number(b.Inscritos) || 0) - (Number(a.Inscritos) || 0))
    .slice(0, 5);

  // Próximos
  const proximos = eventos
    .filter(e => new Date(e.Data) >= now)
    .sort((a, b) => new Date(a.Data) - new Date(b.Data))
    .slice(0, 5);

  return {
    ativos, totalInscricoes, taxa, mesAtual,
    meses, statusDist, top, proximos,
    atividade: [],
  };
}

function renderStats(page, dash) {
  const grid = page.querySelector('#dash-stats');
  const taxa = dash.taxa ?? dash.taxaConfirmacao ?? 0;
  grid.innerHTML = `
    <div class="stat-card green">
      <span class="stat-icon">📅</span>
      <div class="stat-value">${fmtNum(dash.ativos ?? 0)}</div>
      <div class="stat-label">Eventos Ativos</div>
      <span class="stat-delta neutral">total de ${fmtNum(dash.totalEventos ?? dash.ativos ?? 0)}</span>
    </div>
    <div class="stat-card blue">
      <span class="stat-icon">👥</span>
      <div class="stat-value">${fmtNum(dash.totalInscricoes ?? 0)}</div>
      <div class="stat-label">Total Inscrições</div>
      <span class="stat-delta up">↑ engajamento</span>
    </div>
    <div class="stat-card amber">
      <span class="stat-icon">✅</span>
      <div class="stat-value">${taxa}%</div>
      <div class="stat-label">Taxa Confirmação</div>
      <span class="stat-delta ${taxa >= 70 ? 'up' : 'neutral'}">${taxa >= 70 ? '↑ meta atingida' : 'em progresso'}</span>
    </div>
    <div class="stat-card purple">
      <span class="stat-icon">🚂</span>
      <div class="stat-value">${fmtNum(dash.mesAtual ?? 0)}</div>
      <div class="stat-label">Eventos este Mês</div>
      <span class="stat-delta neutral">mês atual</span>
    </div>
  `;
}

function renderChart(page, dash) {
  const barsEl = page.querySelector('#chart-bars');
  const meses = dash.meses || [];
  if (!meses.length) { barsEl.innerHTML = '<div class="empty-state"><span class="empty-icon">📊</span></div>'; return; }

  const max = Math.max(...meses.map(m => m.count), 1);

  barsEl.style.alignItems = 'flex-end';
  barsEl.style.gap = '8px';
  barsEl.style.height = '120px';
  barsEl.style.display = 'flex';

  barsEl.innerHTML = meses.map((m, i) => {
    const pct = Math.round((m.count / max) * 100);
    const isLast = i === meses.length - 1;
    return `
      <div class="bar-col">
        <div style="font-size:0.7rem;color:var(--text-2);font-weight:600;margin-bottom:4px">${m.count || ''}</div>
        <div class="bar ${isLast ? 'green' : 'blue'}" style="height:${Math.max(pct, 4)}%;width:100%"></div>
        <div class="bar-label">${m.mes}</div>
      </div>
    `;
  }).join('');
}

function renderProgress(page, dash) {
  const el = page.querySelector('#dash-progress');
  const dist = dash.statusDist || {};
  const entries = Object.entries(dist);
  if (!entries.length) { el.innerHTML = '<div class="empty-state"><span class="empty-sub">Sem dados</span></div>'; return; }

  const total = entries.reduce((s, [, v]) => s + v, 0);
  const colors = ['#3ecf5c', '#4a9eff', '#f5a623', '#a78bfa', '#ff5a5a'];

  el.innerHTML = entries.map(([label, count], i) => {
    const pct = Math.round((count / total) * 100);
    return `
      <div class="progress-item">
        <div class="progress-header">
          <span class="progress-name">${label}</span>
          <span class="progress-pct">${count} (${pct}%)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%;background:${colors[i % colors.length]}"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderProximos(page, dash) {
  const el = page.querySelector('#dash-proximos');
  const proximos = dash.proximos || [];

  if (!proximos.length) {
    el.innerHTML = '<div class="empty-state"><span class="empty-sub">Nenhum evento futuro</span></div>';
    return;
  }

  el.innerHTML = proximos.map(e => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="background:var(--surface-2);border-radius:8px;padding:8px 10px;text-align:center;min-width:44px;flex-shrink:0">
        <div style="font-family:var(--font-display);font-size:1rem;font-weight:800;color:var(--green);line-height:1">
          ${new Date(e.Data).getDate() || '—'}
        </div>
        <div style="font-size:0.6rem;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em">
          ${e.Data ? new Date(e.Data).toLocaleDateString('pt-BR',{month:'short'}) : ''}
        </div>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:0.85rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.Nome || e.Titulo || 'Evento'}</div>
        <div style="font-size:0.73rem;color:var(--text-3);margin-top:2px">${e.Local || '—'} · ${e.Inscritos || 0} inscritos</div>
      </div>
      ${statusBadge(e.Status)}
    </div>
  `).join('');
}

function renderActivity(page, dash) {
  const el = page.querySelector('#dash-activity');
  const ativ = dash.atividade || [];

  if (!ativ.length) {
    el.innerHTML = `
      <div class="activity-item">
        <div class="activity-dot" style="background:var(--green)"></div>
        <div class="activity-text">
          <div class="activity-main">Sistema iniciado</div>
          <div class="activity-sub">Dashboard carregado com sucesso</div>
        </div>
        <div class="activity-time">agora</div>
      </div>
    `;
    return;
  }

  const dotColors = { inscricao: '#3ecf5c', evento: '#4a9eff', cancelamento: '#ff5a5a' };

  el.innerHTML = ativ.map(a => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${dotColors[a.tipo] || '#6b7fa3'}"></div>
      <div class="activity-text">
        <div class="activity-main">${a.descricao || '—'}</div>
        <div class="activity-sub">${a.detalhe || ''}</div>
      </div>
      <div class="activity-time">${a.tempo || ''}</div>
    </div>
  `).join('');
}

function renderTopTable(page, dash) {
  const el = page.querySelector('#dash-top-table');
  const top = dash.top || [];

  if (!top.length) {
    el.innerHTML = '<div class="empty-state"><span class="empty-icon">📋</span><p class="empty-title">Sem dados ainda</p><p class="empty-sub">Crie eventos para ver o ranking</p></div>';
    return;
  }

  const max = Math.max(...top.map(e => Number(e.Inscritos) || 0), 1);

  el.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Evento</th>
            <th>Data</th>
            <th>Local</th>
            <th>Status</th>
            <th>Inscritos</th>
            <th>Ocupação</th>
          </tr>
        </thead>
        <tbody>
          ${top.map((e, i) => {
            const inscritos = Number(e.Inscritos) || 0;
            const vagas = Number(e.Vagas) || max;
            const pct = Math.round((inscritos / Math.max(vagas, 1)) * 100);
            return `
              <tr>
                <td style="color:var(--text-3);font-size:0.8rem">${i + 1}</td>
                <td>${trunc(e.Nome || e.Titulo || '—', 32)}</td>
                <td style="font-size:0.82rem">${fmtDate(e.Data)}</td>
                <td style="font-size:0.82rem;color:var(--text-3)">${e.Local || '—'}</td>
                <td>${statusBadge(e.Status)}</td>
                <td style="font-family:var(--font-display);font-weight:700">${fmtNum(inscritos)}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="progress-track" style="width:80px;flex-shrink:0">
                      <div class="progress-fill" style="width:${Math.min(pct,100)}%;background:${pct>=80?'#ff5a5a':pct>=50?'#f5a623':'#3ecf5c'}"></div>
                    </div>
                    <span style="font-size:0.75rem;color:var(--text-2)">${pct}%</span>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}
