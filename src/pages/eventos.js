import { getEventos, criarEvento, editarEvento, deletarEvento, getInscricoes } from '../services/api.js';
import { fmtDate, statusBadge, trunc } from '../utils/format.js';
import { toast } from '../utils/toast.js';
import { createModal } from '../components/modal.js';

let eventosCache = [];

export function renderEventos() {
  const page = document.createElement('div');
  page.className = 'page';
  page.id = 'page-eventos';

  page.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-heading">Gestão de Eventos</h1>
        <p class="page-sub">Crie, edite e acompanhe eventos</p>
      </div>
      <button class="btn btn-primary" id="btn-novo-evento">
        ＋ Novo Evento
      </button>
    </div>

    <!-- Filter bar -->
    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="search-input" id="search-eventos" type="text" placeholder="Buscar evento...">
      </div>
      <select class="form-select" id="filter-status" style="max-width:160px">
        <option value="">Todos os status</option>
        <option value="ativo">Ativo</option>
        <option value="encerrado">Encerrado</option>
        <option value="rascunho">Rascunho</option>
        <option value="cancelado">Cancelado</option>
      </select>
      <button class="btn btn-ghost btn-sm" id="btn-refresh-eventos">🔄 Atualizar</button>
    </div>

    <!-- Table -->
    <div id="eventos-table-wrap">
      <div class="empty-state">
        <span class="spinner"></span>
        <p class="empty-title" style="margin-top:16px">Carregando eventos...</p>
      </div>
    </div>
  `;

  // Events
  page.querySelector('#btn-novo-evento').addEventListener('click', () => openEventoModal(page));
  page.querySelector('#btn-refresh-eventos').addEventListener('click', () => loadEventos(page));
  page.querySelector('#search-eventos').addEventListener('input', () => filterTable(page));
  page.querySelector('#filter-status').addEventListener('change', () => filterTable(page));

  loadEventos(page);
  return page;
}

async function loadEventos(page) {
  const wrap = page.querySelector('#eventos-table-wrap');
  wrap.innerHTML = `<div class="empty-state"><span class="spinner"></span><p class="empty-title" style="margin-top:16px">Carregando...</p></div>`;

  try {
    const res = await getEventos();
    eventosCache = res.data || [];
    renderTable(page, eventosCache);
  } catch (err) {
    wrap.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">⚠️</span>
        <p class="empty-title">Falha ao carregar</p>
        <p class="empty-sub">${err.message}</p>
        <button class="btn btn-ghost btn-sm" style="margin-top:16px" onclick="this.closest('[id]').dispatchEvent(new Event('retry'))">Tentar novamente</button>
      </div>
    `;
    toast(err.message, 'error');
  }
}

function getFiltered(page) {
  const search = page.querySelector('#search-eventos')?.value?.toLowerCase() || '';
  const status = page.querySelector('#filter-status')?.value?.toLowerCase() || '';
  return eventosCache.filter(e => {
    const nome = (e.Nome || e.Titulo || '').toLowerCase();
    const local = (e.Local || '').toLowerCase();
    const matchSearch = !search || nome.includes(search) || local.includes(search);
    const matchStatus = !status || (e.Status || '').toLowerCase() === status;
    return matchSearch && matchStatus;
  });
}

function filterTable(page) {
  renderTable(page, getFiltered(page));
}

function renderTable(page, eventos) {
  const wrap = page.querySelector('#eventos-table-wrap');

  if (!eventos.length) {
    wrap.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📅</span>
        <p class="empty-title">Nenhum evento encontrado</p>
        <p class="empty-sub">Crie o primeiro evento clicando em "+ Novo Evento"</p>
      </div>
    `;
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table id="eventos-table">
        <thead>
          <tr>
            <th>Evento</th>
            <th>Data</th>
            <th>Local</th>
            <th>Vagas</th>
            <th>Inscritos</th>
            <th>Status</th>
            <th style="text-align:right">Ações</th>
          </tr>
        </thead>
        <tbody id="eventos-tbody"></tbody>
      </table>
    </div>
    <div style="padding:12px 16px;font-size:0.75rem;color:var(--text-3);border-top:1px solid var(--border)">
      ${eventos.length} evento${eventos.length !== 1 ? 's' : ''} encontrado${eventos.length !== 1 ? 's' : ''}
    </div>
  `;

  const tbody = wrap.querySelector('#eventos-tbody');
  eventos.forEach(evento => {
    const tr = buildEventoRow(evento, page);
    tbody.appendChild(tr);
  });
}

function buildEventoRow(evento, page) {
  const tr = document.createElement('tr');

  const vagas    = Number(evento.Vagas)    || 0;
  const inscritos = Number(evento.Inscritos) || 0;
  const ocupPct  = vagas > 0 ? Math.round((inscritos / vagas) * 100) : 0;
  const ocupColor = ocupPct >= 90 ? '#ff5a5a' : ocupPct >= 70 ? '#f5a623' : '#3ecf5c';

  tr.innerHTML = `
    <td>
      <div style="font-weight:600">${trunc(evento.Nome || evento.Titulo || '—', 36)}</div>
      <div style="font-size:0.73rem;color:var(--text-3);margin-top:2px">${trunc(evento.Descricao || '', 48)}</div>
    </td>
    <td style="white-space:nowrap">${fmtDate(evento.Data)}</td>
    <td style="color:var(--text-2)">${evento.Local || '—'}</td>
    <td>${vagas > 0 ? vagas : '—'}</td>
    <td>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-family:var(--font-display);font-weight:700">${inscritos}</span>
        ${vagas > 0 ? `
          <div class="progress-track" style="width:50px;flex-shrink:0">
            <div class="progress-fill" style="width:${Math.min(ocupPct,100)}%;background:${ocupColor}"></div>
          </div>
        ` : ''}
      </div>
    </td>
    <td>${statusBadge(evento.Status)}</td>
    <td>
      <div class="action-row" style="justify-content:flex-end">
        <button class="btn-icon" title="Ver inscrições" data-action="inscricoes">👥</button>
        <button class="btn-icon" title="Editar" data-action="editar">✏️</button>
        <button class="btn-icon" title="Excluir" data-action="deletar" style="color:var(--red)">🗑️</button>
      </div>
    </td>
  `;

  tr.querySelector('[data-action="editar"]').addEventListener('click', () => openEventoModal(page, evento));
  tr.querySelector('[data-action="deletar"]').addEventListener('click', () => confirmarDeletar(evento, page));
  tr.querySelector('[data-action="inscricoes"]').addEventListener('click', () => verInscricoes(evento));

  return tr;
}

/* ---- Modal: Criar / Editar Evento ---- */
function openEventoModal(page, evento = null) {
  const editing = !!evento;

  const form = document.createElement('div');
  form.innerHTML = `
    <div class="form-grid">
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Nome do Evento *</label>
        <input class="form-input" id="ev-nome" type="text" placeholder="Ex: Workshop de Segurança Ferroviária" value="${evento?.Nome || evento?.Titulo || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Data *</label>
        <input class="form-input" id="ev-data" type="date" value="${evento?.Data || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Horário</label>
        <input class="form-input" id="ev-hora" type="time" value="${evento?.Hora || ''}">
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Local</label>
        <input class="form-input" id="ev-local" type="text" placeholder="Ex: PML Santa Maria — Sala A" value="${evento?.Local || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Vagas</label>
        <input class="form-input" id="ev-vagas" type="number" min="1" placeholder="Ex: 50" value="${evento?.Vagas || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="ev-status">
          <option value="rascunho" ${!evento || evento.Status?.toLowerCase() === 'rascunho' ? 'selected' : ''}>Rascunho</option>
          <option value="ativo" ${evento?.Status?.toLowerCase() === 'ativo' ? 'selected' : ''}>Ativo</option>
          <option value="encerrado" ${evento?.Status?.toLowerCase() === 'encerrado' ? 'selected' : ''}>Encerrado</option>
          <option value="cancelado" ${evento?.Status?.toLowerCase() === 'cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Responsável</label>
        <input class="form-input" id="ev-responsavel" type="text" placeholder="Nome do responsável" value="${evento?.Responsavel || ''}">
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" id="ev-descricao" placeholder="Detalhes sobre o evento...">${evento?.Descricao || ''}</textarea>
      </div>
    </div>
  `;

  const modal = createModal(
    editing ? 'Editar Evento' : 'Novo Evento',
    form,
    {
      confirmLabel: editing ? 'Salvar alterações' : 'Criar Evento',
      onConfirm: async () => {
        const nome = form.querySelector('#ev-nome').value.trim();
        const data = form.querySelector('#ev-data').value;
        if (!nome || !data) {
          toast('Preencha nome e data do evento', 'error');
          throw new Error('validação');
        }

        const payload = {
          ...(editing ? { id: evento.ID || evento.id } : {}),
          nome,
          data,
          hora:        form.querySelector('#ev-hora').value,
          local:       form.querySelector('#ev-local').value.trim(),
          vagas:       Number(form.querySelector('#ev-vagas').value) || 0,
          status:      form.querySelector('#ev-status').value,
          responsavel: form.querySelector('#ev-responsavel').value.trim(),
          descricao:   form.querySelector('#ev-descricao').value.trim(),
        };

        if (editing) {
          await editarEvento(payload);
        } else {
          await criarEvento(payload);
        }

        toast(editing ? 'Evento atualizado!' : 'Evento criado!', 'success');
        await loadEventos(page);
      }
    }
  );

  document.body.appendChild(modal.el);
  modal.open();

  // Focus first field
  setTimeout(() => form.querySelector('#ev-nome')?.focus(), 200);
}

/* ---- Confirmar Delete ---- */
function confirmarDeletar(evento, page) {
  const body = document.createElement('div');
  body.innerHTML = `
    <p style="color:var(--text-2);line-height:1.6">
      Tem certeza que deseja excluir o evento 
      <strong style="color:var(--text)">"${evento.Nome || evento.Titulo || 'este evento'}"</strong>?
    </p>
    <p style="font-size:0.82rem;color:var(--red);margin-top:12px;padding:10px;background:rgba(255,90,90,0.08);border-radius:8px;border:1px solid rgba(255,90,90,0.2)">
      ⚠️ Esta ação é irreversível e removerá todas as inscrições vinculadas.
    </p>
  `;

  const modal = createModal('Excluir Evento', body, {
    confirmLabel: 'Excluir',
    danger: true,
    onConfirm: async () => {
      await deletarEvento(evento.ID || evento.id);
      toast('Evento excluído', 'success');
      await loadEventos(page);
    }
  });

  document.body.appendChild(modal.el);
  modal.open();
}

/* ---- Ver Inscrições de um Evento ---- */
async function verInscricoes(evento) {
  const body = document.createElement('div');
  body.innerHTML = `<div style="text-align:center;padding:20px"><span class="spinner"></span></div>`;

  const modal = createModal(
    `Inscrições — ${trunc(evento.Nome || evento.Titulo || 'Evento', 30)}`,
    body,
    { showFooter: false }
  );

  document.body.appendChild(modal.el);
  modal.open();

  try {
    const res = await getInscricoes(evento.ID || evento.id);
    const inscritos = res.data || [];

    if (!inscritos.length) {
      body.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">👥</span>
          <p class="empty-title">Nenhuma inscrição</p>
          <p class="empty-sub">Este evento ainda não tem inscrições</p>
        </div>
      `;
      return;
    }

    body.innerHTML = `
      <div style="margin-bottom:12px;font-size:0.8rem;color:var(--text-2)">
        ${inscritos.length} inscrito${inscritos.length !== 1 ? 's' : ''}
      </div>
      <div class="table-wrap" style="max-height:400px;overflow-y:auto">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            ${inscritos.map(i => `
              <tr>
                <td>${i.Nome || '—'}</td>
                <td style="font-size:0.8rem;color:var(--text-3)">${i.Matricula || '—'}</td>
                <td>${statusBadge(i.Status)}</td>
                <td style="font-size:0.8rem">${fmtDate(i.DataInscricao)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    body.innerHTML = `<div class="empty-state"><span class="empty-icon">⚠️</span><p class="empty-title">${err.message}</p></div>`;
    toast(err.message, 'error');
  }
}
