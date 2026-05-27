import { getEventos, criarInscricao, cancelarInscricao } from '../services/api.js';
import { fmtDate, statusBadge, trunc } from '../utils/format.js';
import { toast } from '../utils/toast.js';
import { createModal } from '../components/modal.js';
import { api } from '../services/api.js';

let inscricoesCache = [];
let eventosOpts = [];

export function renderInscricoes() {
  const page = document.createElement('div');
  page.className = 'page';
  page.id = 'page-inscricoes';

  page.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-heading">Inscrições</h1>
        <p class="page-sub">Gerencie inscrições por evento</p>
      </div>
      <button class="btn btn-primary" id="btn-nova-inscricao">＋ Nova Inscrição</button>
    </div>

    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="search-input" id="search-inscricoes" type="text" placeholder="Buscar por nome ou matrícula...">
      </div>
      <select class="form-select" id="filter-evento-insc" style="max-width:220px">
        <option value="">Todos os eventos</option>
      </select>
      <select class="form-select" id="filter-status-insc" style="max-width:160px">
        <option value="">Todos os status</option>
        <option value="confirmado">Confirmado</option>
        <option value="pendente">Pendente</option>
        <option value="presente">Presente</option>
        <option value="ausente">Ausente</option>
        <option value="cancelado">Cancelado</option>
      </select>
      <button class="btn btn-ghost btn-sm" id="btn-refresh-insc">🔄</button>
    </div>

    <div id="inscricoes-table-wrap">
      <div class="empty-state"><span class="spinner"></span><p class="empty-title" style="margin-top:16px">Carregando...</p></div>
    </div>
  `;

  loadAll(page);

  page.querySelector('#btn-nova-inscricao').addEventListener('click', () => openInscricaoModal(page));
  page.querySelector('#btn-refresh-insc').addEventListener('click', () => loadAll(page));
  page.querySelector('#search-inscricoes').addEventListener('input', () => filterInsc(page));
  page.querySelector('#filter-evento-insc').addEventListener('change', () => filterInsc(page));
  page.querySelector('#filter-status-insc').addEventListener('change', () => filterInsc(page));

  return page;
}

async function loadAll(page) {
  const wrap = page.querySelector('#inscricoes-table-wrap');
  wrap.innerHTML = `<div class="empty-state"><span class="spinner"></span><p class="empty-title" style="margin-top:16px">Carregando...</p></div>`;

  try {
    // Load eventos for filter dropdown
    const evRes = await getEventos();
    eventosOpts = evRes.data || [];
    populateEventoFilter(page, eventosOpts);

    // Load all inscricoes
    const inRes = await api('getTodasInscricoes');
    inscricoesCache = inRes.data || [];
    renderInscTable(page, inscricoesCache);
  } catch (err) {
    wrap.innerHTML = `<div class="empty-state"><span class="empty-icon">⚠️</span><p class="empty-title">${err.message}</p></div>`;
    toast(err.message, 'error');
  }
}

function populateEventoFilter(page, eventos) {
  const sel = page.querySelector('#filter-evento-insc');
  const current = sel.value;
  sel.innerHTML = '<option value="">Todos os eventos</option>';
  eventos.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.ID || e.id || e.Nome || e.Titulo;
    opt.textContent = trunc(e.Nome || e.Titulo || '—', 32);
    sel.appendChild(opt);
  });
  sel.value = current;
}

function getFiltered(page) {
  const search = page.querySelector('#search-inscricoes')?.value?.toLowerCase() || '';
  const eventoId = page.querySelector('#filter-evento-insc')?.value || '';
  const status   = page.querySelector('#filter-status-insc')?.value?.toLowerCase() || '';

  return inscricoesCache.filter(i => {
    const nome = (i.Nome || '').toLowerCase();
    const mat  = (i.Matricula || '').toLowerCase();
    const matchSearch = !search || nome.includes(search) || mat.includes(search);
    const matchEvento = !eventoId || String(i.EventoId || i.Evento) === String(eventoId);
    const matchStatus = !status || (i.Status || '').toLowerCase() === status;
    return matchSearch && matchEvento && matchStatus;
  });
}

function filterInsc(page) {
  renderInscTable(page, getFiltered(page));
}

function renderInscTable(page, inscricoes) {
  const wrap = page.querySelector('#inscricoes-table-wrap');

  if (!inscricoes.length) {
    wrap.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">👥</span>
        <p class="empty-title">Nenhuma inscrição encontrada</p>
        <p class="empty-sub">Crie inscrições ou ajuste o filtro</p>
      </div>
    `;
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Participante</th>
            <th>Matrícula</th>
            <th>Evento</th>
            <th>Data Insc.</th>
            <th>Status</th>
            <th style="text-align:right">Ações</th>
          </tr>
        </thead>
        <tbody id="insc-tbody"></tbody>
      </table>
    </div>
    <div style="padding:12px 16px;font-size:0.75rem;color:var(--text-3);border-top:1px solid var(--border)">
      ${inscricoes.length} inscrição${inscricoes.length !== 1 ? 'ões' : ''}
    </div>
  `;

  const tbody = wrap.querySelector('#insc-tbody');
  inscricoes.forEach(insc => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span style="font-weight:500">${insc.Nome || '—'}</span></td>
      <td style="font-size:0.82rem;color:var(--text-3);font-family:monospace">${insc.Matricula || '—'}</td>
      <td style="font-size:0.82rem">${trunc(insc.EventoNome || insc.Evento || '—', 28)}</td>
      <td style="font-size:0.82rem">${fmtDate(insc.DataInscricao)}</td>
      <td>${statusBadge(insc.Status)}</td>
      <td>
        <div class="action-row" style="justify-content:flex-end">
          <button class="btn-icon" title="Cancelar inscrição" style="color:var(--red)" data-action="cancelar">✕</button>
        </div>
      </td>
    `;
    tr.querySelector('[data-action="cancelar"]').addEventListener('click', () =>
      confirmarCancelar(insc, page)
    );
    tbody.appendChild(tr);
  });
}

/* ---- Modal: Nova Inscrição ---- */
function openInscricaoModal(page) {
  const form = document.createElement('div');
  form.innerHTML = `
    <div class="form-group">
      <label class="form-label">Evento *</label>
      <select class="form-select" id="insc-evento">
        <option value="">Selecione um evento...</option>
        ${eventosOpts.filter(e => e.Status?.toLowerCase() === 'ativo').map(e => `
          <option value="${e.ID || e.id}">${trunc(e.Nome || e.Titulo || '—', 40)}</option>
        `).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Nome do Participante *</label>
      <input class="form-input" id="insc-nome" type="text" placeholder="Nome completo">
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Matrícula</label>
        <input class="form-input" id="insc-matricula" type="text" placeholder="Ex: 123456">
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="insc-status">
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">E-mail</label>
      <input class="form-input" id="insc-email" type="email" placeholder="email@rumomalhasul.com.br">
    </div>
    <div class="form-group">
      <label class="form-label">Observação</label>
      <textarea class="form-textarea" id="insc-obs" placeholder="Informações adicionais..." style="min-height:70px"></textarea>
    </div>
  `;

  const modal = createModal('Nova Inscrição', form, {
    confirmLabel: 'Inscrever',
    onConfirm: async () => {
      const eventoId = form.querySelector('#insc-evento').value;
      const nome     = form.querySelector('#insc-nome').value.trim();
      if (!eventoId || !nome) {
        toast('Selecione o evento e informe o nome', 'error');
        throw new Error('validação');
      }

      await criarInscricao({
        eventoId,
        nome,
        matricula: form.querySelector('#insc-matricula').value.trim(),
        status:    form.querySelector('#insc-status').value,
        email:     form.querySelector('#insc-email').value.trim(),
        obs:       form.querySelector('#insc-obs').value.trim(),
      });

      toast('Inscrição realizada!', 'success');
      await loadAll(page);
    }
  });

  document.body.appendChild(modal.el);
  modal.open();
  setTimeout(() => form.querySelector('#insc-nome')?.focus(), 200);
}

/* ---- Confirmar Cancelar ---- */
function confirmarCancelar(insc, page) {
  const body = document.createElement('div');
  body.innerHTML = `
    <p style="color:var(--text-2)">
      Cancelar a inscrição de <strong style="color:var(--text)">${insc.Nome || 'este participante'}</strong>?
    </p>
  `;

  const modal = createModal('Cancelar Inscrição', body, {
    confirmLabel: 'Cancelar Inscrição',
    danger: true,
    onConfirm: async () => {
      await cancelarInscricao(insc.ID || insc.id);
      toast('Inscrição cancelada', 'success');
      await loadAll(page);
    }
  });

  document.body.appendChild(modal.el);
  modal.open();
}
