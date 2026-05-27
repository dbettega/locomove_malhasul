import { api } from '../services/api.js';
import { fmtDate, trunc } from '../utils/format.js';
import { toast } from '../utils/toast.js';

let cache = [];

export function renderParticipantes() {
  const page = document.createElement('div');
  page.className = 'page';
  page.id = 'page-participantes';

  page.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-heading">Participantes</h1>
        <p class="page-sub">Cadastros realizados via formulário público</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="btn-refresh-part">🔄 Atualizar</button>
    </div>

    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="search-input" id="search-part" type="text" placeholder="Buscar por CS, nome ou setor...">
      </div>
      <select class="form-select" id="filter-calcao" style="max-width:140px">
        <option value="">Calção (todos)</option>
        ${['PP','P','M','G','GG','XGG'].map(t => `<option value="${t}">${t}</option>`).join('')}
      </select>
      <select class="form-select" id="filter-camiseta" style="max-width:150px">
        <option value="">Camiseta (todos)</option>
        ${['PP','P','M','G','GG','XGG'].map(t => `<option value="${t}">${t}</option>`).join('')}
      </select>
    </div>

    <!-- Stats rápidos -->
    <div id="part-stats" style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap"></div>

    <div id="part-table-wrap">
      <div class="empty-state"><span class="spinner"></span><p class="empty-title" style="margin-top:16px">Carregando...</p></div>
    </div>
  `;

  loadParticipantes(page);

  page.querySelector('#btn-refresh-part').addEventListener('click', () => loadParticipantes(page));
  page.querySelector('#search-part').addEventListener('input', () => filterPart(page));
  page.querySelector('#filter-calcao').addEventListener('change', () => filterPart(page));
  page.querySelector('#filter-camiseta').addEventListener('change', () => filterPart(page));

  return page;
}

async function loadParticipantes(page) {
  const wrap = page.querySelector('#part-table-wrap');
  wrap.innerHTML = `<div class="empty-state"><span class="spinner"></span><p class="empty-title" style="margin-top:16px">Carregando...</p></div>`;

  try {
    const res = await api('getParticipantes', null);
    cache = res.data || [];
    renderStats(page, cache);
    renderTable(page, cache);
  } catch (err) {
    wrap.innerHTML = `<div class="empty-state"><span class="empty-icon">⚠️</span><p class="empty-title">${err.message}</p></div>`;
    toast(err.message, 'error');
  }
}

function renderStats(page, data) {
  const el = page.querySelector('#part-stats');
  const total = data.length;

  // Contagem por tamanho de camiseta
  const camMap = {};
  data.forEach(p => { const t = p.Camiseta || '—'; camMap[t] = (camMap[t]||0)+1; });
  const topCam = Object.entries(camMap).sort((a,b)=>b[1]-a[1])[0];

  // Contagem por setor
  const setMap = {};
  data.forEach(p => { const s = p.Setor||'—'; setMap[s]=(setMap[s]||0)+1; });
  const topSet = Object.entries(setMap).sort((a,b)=>b[1]-a[1])[0];

  el.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;display:flex;align-items:center;gap:10px">
      <span style="font-size:20px">👤</span>
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:800">${total}</div>
        <div style="font-size:0.72rem;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em">Participantes</div>
      </div>
    </div>
    ${topCam ? `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;display:flex;align-items:center;gap:10px">
      <span style="font-size:20px">👕</span>
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:800">${topCam[0]}</div>
        <div style="font-size:0.72rem;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em">Camiseta + pedida</div>
      </div>
    </div>` : ''}
    ${topSet ? `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;display:flex;align-items:center;gap:10px">
      <span style="font-size:20px">🏢</span>
      <div>
        <div style="font-family:var(--font-display);font-size:1rem;font-weight:800">${trunc(topSet[0],16)}</div>
        <div style="font-size:0.72rem;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em">Setor + ativo</div>
      </div>
    </div>` : ''}
  `;
}

function getFiltered(page) {
  const search   = page.querySelector('#search-part')?.value?.toLowerCase() || '';
  const calcao   = page.querySelector('#filter-calcao')?.value || '';
  const camiseta = page.querySelector('#filter-camiseta')?.value || '';

  return cache.filter(p => {
    const cs    = String(p.CS || '').toLowerCase();
    const nome  = (p.Nome || '').toLowerCase();
    const setor = (p.Setor || '').toLowerCase();
    const matchSearch   = !search   || cs.includes(search) || nome.includes(search) || setor.includes(search);
    const matchCalcao   = !calcao   || p.Calcao   === calcao;
    const matchCamiseta = !camiseta || p.Camiseta  === camiseta;
    return matchSearch && matchCalcao && matchCamiseta;
  });
}

function filterPart(page) {
  renderTable(page, getFiltered(page));
}

function renderTable(page, data) {
  const wrap = page.querySelector('#part-table-wrap');

  if (!data.length) {
    wrap.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🗂️</span>
        <p class="empty-title">Nenhum participante encontrado</p>
        <p class="empty-sub">Os cadastros do formulário público aparecerão aqui</p>
      </div>
    `;
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>CS</th>
            <th>Nome</th>
            <th>Setor</th>
            <th>Calção</th>
            <th>Camiseta</th>
            <th>Telefone</th>
            <th>Cadastrado em</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(p => `
            <tr>
              <td style="font-family:monospace;font-size:0.85rem;color:var(--green)">${p.CS || '—'}</td>
              <td style="font-weight:500">${p.Nome || '—'}</td>
              <td style="font-size:0.82rem;color:var(--text-2)">${p.Setor || '—'}</td>
              <td>
                <span class="badge badge-blue">${p.Calcao || '—'}</span>
              </td>
              <td>
                <span class="badge badge-purple">${p.Camiseta || '—'}</span>
              </td>
              <td style="font-size:0.82rem;color:var(--text-3)">${p.Telefone || '—'}</td>
              <td style="font-size:0.78rem;color:var(--text-3)">${fmtDate(p.CriadoEm)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div style="padding:12px 16px;font-size:0.75rem;color:var(--text-3);border-top:1px solid var(--border)">
      ${data.length} participante${data.length !== 1 ? 's' : ''}
    </div>
  `;
}
