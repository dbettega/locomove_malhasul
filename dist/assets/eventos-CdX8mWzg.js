import{j as w,f as S,b as L,t as v,g as f,s as g,e as $,k as C}from"./api-CXJPJYgE.js";import{t as n}from"./index-BB6bMmLW.js";import{c as b}from"./modal-S6JZ9QlU.js";let y=[];function z(){const e=document.createElement("div");return e.className="page",e.id="page-eventos",e.innerHTML=`
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
  `,e.querySelector("#btn-novo-evento").addEventListener("click",()=>x(e)),e.querySelector("#btn-refresh-eventos").addEventListener("click",()=>m(e)),e.querySelector("#search-eventos").addEventListener("input",()=>h(e)),e.querySelector("#filter-status").addEventListener("change",()=>h(e)),m(e),e}async function m(e){const t=e.querySelector("#eventos-table-wrap");t.innerHTML='<div class="empty-state"><span class="spinner"></span><p class="empty-title" style="margin-top:16px">Carregando...</p></div>';try{y=(await w()).data||[],E(e,y)}catch(s){t.innerHTML=`
      <div class="empty-state">
        <span class="empty-icon">⚠️</span>
        <p class="empty-title">Falha ao carregar</p>
        <p class="empty-sub">${s.message}</p>
        <button class="btn btn-ghost btn-sm" style="margin-top:16px" onclick="this.closest('[id]').dispatchEvent(new Event('retry'))">Tentar novamente</button>
      </div>
    `,n(s.message,"error")}}function T(e){var a,o,r,l;const t=((o=(a=e.querySelector("#search-eventos"))==null?void 0:a.value)==null?void 0:o.toLowerCase())||"",s=((l=(r=e.querySelector("#filter-status"))==null?void 0:r.value)==null?void 0:l.toLowerCase())||"";return y.filter(i=>{const d=(i.Nome||i.Titulo||"").toLowerCase(),c=(i.Local||"").toLowerCase(),p=!t||d.includes(t)||c.includes(t),u=!s||(i.Status||"").toLowerCase()===s;return p&&u})}function h(e){E(e,T(e))}function E(e,t){const s=e.querySelector("#eventos-table-wrap");if(!t.length){s.innerHTML=`
      <div class="empty-state">
        <span class="empty-icon">📅</span>
        <p class="empty-title">Nenhum evento encontrado</p>
        <p class="empty-sub">Crie o primeiro evento clicando em "+ Novo Evento"</p>
      </div>
    `;return}s.innerHTML=`
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
      ${t.length} evento${t.length!==1?"s":""} encontrado${t.length!==1?"s":""}
    </div>
  `;const a=s.querySelector("#eventos-tbody");t.forEach(o=>{const r=q(o,e);a.appendChild(r)})}function q(e,t){const s=document.createElement("tr"),a=Number(e.Vagas)||0,o=Number(e.Inscritos)||0,r=a>0?Math.round(o/a*100):0,l=r>=90?"#ff5a5a":r>=70?"#f5a623":"#3ecf5c";return s.innerHTML=`
    <td>
      <div style="font-weight:600">${v(e.Nome||e.Titulo||"—",36)}</div>
      <div style="font-size:0.73rem;color:var(--text-3);margin-top:2px">${v(e.Descricao||"",48)}</div>
    </td>
    <td style="white-space:nowrap">${f(e.Data)}</td>
    <td style="color:var(--text-2)">${e.Local||"—"}</td>
    <td>${a>0?a:"—"}</td>
    <td>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-family:var(--font-display);font-weight:700">${o}</span>
        ${a>0?`
          <div class="progress-track" style="width:50px;flex-shrink:0">
            <div class="progress-fill" style="width:${Math.min(r,100)}%;background:${l}"></div>
          </div>
        `:""}
      </div>
    </td>
    <td>${g(e.Status)}</td>
    <td>
      <div class="action-row" style="justify-content:flex-end">
        <button class="btn-icon" title="Ver inscrições" data-action="inscricoes">👥</button>
        <button class="btn-icon" title="Editar" data-action="editar">✏️</button>
        <button class="btn-icon" title="Excluir" data-action="deletar" style="color:var(--red)">🗑️</button>
      </div>
    </td>
  `,s.querySelector('[data-action="editar"]').addEventListener("click",()=>x(t,e)),s.querySelector('[data-action="deletar"]').addEventListener("click",()=>M(e,t)),s.querySelector('[data-action="inscricoes"]').addEventListener("click",()=>N(e)),s}function x(e,t=null){var r,l,i,d;const s=!!t,a=document.createElement("div");a.innerHTML=`
    <div class="form-grid">
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Nome do Evento *</label>
        <input class="form-input" id="ev-nome" type="text" placeholder="Ex: Workshop de Segurança Ferroviária" value="${(t==null?void 0:t.Nome)||(t==null?void 0:t.Titulo)||""}">
      </div>
      <div class="form-group">
        <label class="form-label">Data *</label>
        <input class="form-input" id="ev-data" type="date" value="${(t==null?void 0:t.Data)||""}">
      </div>
      <div class="form-group">
        <label class="form-label">Horário</label>
        <input class="form-input" id="ev-hora" type="time" value="${(t==null?void 0:t.Hora)||""}">
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Local</label>
        <input class="form-input" id="ev-local" type="text" placeholder="Ex: PML Santa Maria — Sala A" value="${(t==null?void 0:t.Local)||""}">
      </div>
      <div class="form-group">
        <label class="form-label">Vagas</label>
        <input class="form-input" id="ev-vagas" type="number" min="1" placeholder="Ex: 50" value="${(t==null?void 0:t.Vagas)||""}">
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="ev-status">
          <option value="rascunho" ${!t||((r=t.Status)==null?void 0:r.toLowerCase())==="rascunho"?"selected":""}>Rascunho</option>
          <option value="ativo" ${((l=t==null?void 0:t.Status)==null?void 0:l.toLowerCase())==="ativo"?"selected":""}>Ativo</option>
          <option value="encerrado" ${((i=t==null?void 0:t.Status)==null?void 0:i.toLowerCase())==="encerrado"?"selected":""}>Encerrado</option>
          <option value="cancelado" ${((d=t==null?void 0:t.Status)==null?void 0:d.toLowerCase())==="cancelado"?"selected":""}>Cancelado</option>
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Responsável</label>
        <input class="form-input" id="ev-responsavel" type="text" placeholder="Nome do responsável" value="${(t==null?void 0:t.Responsavel)||""}">
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" id="ev-descricao" placeholder="Detalhes sobre o evento...">${(t==null?void 0:t.Descricao)||""}</textarea>
      </div>
    </div>
  `;const o=b(s?"Editar Evento":"Novo Evento",a,{confirmLabel:s?"Salvar alterações":"Criar Evento",onConfirm:async()=>{const c=a.querySelector("#ev-nome").value.trim(),p=a.querySelector("#ev-data").value;if(!c||!p)throw n("Preencha nome e data do evento","error"),new Error("validação");const u={...s?{id:t.ID||t.id}:{},nome:c,data:p,hora:a.querySelector("#ev-hora").value,local:a.querySelector("#ev-local").value.trim(),vagas:Number(a.querySelector("#ev-vagas").value)||0,status:a.querySelector("#ev-status").value,responsavel:a.querySelector("#ev-responsavel").value.trim(),descricao:a.querySelector("#ev-descricao").value.trim()};s?await S(u):await L(u),n(s?"Evento atualizado!":"Evento criado!","success"),await m(e)}});document.body.appendChild(o.el),o.open(),setTimeout(()=>{var c;return(c=a.querySelector("#ev-nome"))==null?void 0:c.focus()},200)}function M(e,t){const s=document.createElement("div");s.innerHTML=`
    <p style="color:var(--text-2);line-height:1.6">
      Tem certeza que deseja excluir o evento 
      <strong style="color:var(--text)">"${e.Nome||e.Titulo||"este evento"}"</strong>?
    </p>
    <p style="font-size:0.82rem;color:var(--red);margin-top:12px;padding:10px;background:rgba(255,90,90,0.08);border-radius:8px;border:1px solid rgba(255,90,90,0.2)">
      ⚠️ Esta ação é irreversível e removerá todas as inscrições vinculadas.
    </p>
  `;const a=b("Excluir Evento",s,{confirmLabel:"Excluir",danger:!0,onConfirm:async()=>{await $(e.ID||e.id),n("Evento excluído","success"),await m(t)}});document.body.appendChild(a.el),a.open()}async function N(e){const t=document.createElement("div");t.innerHTML='<div style="text-align:center;padding:20px"><span class="spinner"></span></div>';const s=b(`Inscrições — ${v(e.Nome||e.Titulo||"Evento",30)}`,t,{showFooter:!1});document.body.appendChild(s.el),s.open();try{const o=(await C(e.ID||e.id)).data||[];if(!o.length){t.innerHTML=`
        <div class="empty-state">
          <span class="empty-icon">👥</span>
          <p class="empty-title">Nenhuma inscrição</p>
          <p class="empty-sub">Este evento ainda não tem inscrições</p>
        </div>
      `;return}t.innerHTML=`
      <div style="margin-bottom:12px;font-size:0.8rem;color:var(--text-2)">
        ${o.length} inscrito${o.length!==1?"s":""}
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
            ${o.map(r=>`
              <tr>
                <td>${r.Nome||"—"}</td>
                <td style="font-size:0.8rem;color:var(--text-3)">${r.Matricula||"—"}</td>
                <td>${g(r.Status)}</td>
                <td style="font-size:0.8rem">${f(r.DataInscricao)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `}catch(a){t.innerHTML=`<div class="empty-state"><span class="empty-icon">⚠️</span><p class="empty-title">${a.message}</p></div>`,n(a.message,"error")}}export{z as renderEventos};
