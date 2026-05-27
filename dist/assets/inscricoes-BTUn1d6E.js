import{j as C,a as E,t as u,g as I,s as L,d as q,c as T}from"./api-CXJPJYgE.js";import{t as i}from"./index-BB6bMmLW.js";import{c as y}from"./modal-S6JZ9QlU.js";let d=[],p=[];function j(){const e=document.createElement("div");return e.className="page",e.id="page-inscricoes",e.innerHTML=`
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
  `,c(e),e.querySelector("#btn-nova-inscricao").addEventListener("click",()=>$(e)),e.querySelector("#btn-refresh-insc").addEventListener("click",()=>c(e)),e.querySelector("#search-inscricoes").addEventListener("input",()=>l(e)),e.querySelector("#filter-evento-insc").addEventListener("change",()=>l(e)),e.querySelector("#filter-status-insc").addEventListener("change",()=>l(e)),e}async function c(e){const t=e.querySelector("#inscricoes-table-wrap");t.innerHTML='<div class="empty-state"><span class="spinner"></span><p class="empty-title" style="margin-top:16px">Carregando...</p></div>';try{p=(await C()).data||[],M(e,p),d=(await E("getTodasInscricoes")).data||[],b(e,d)}catch(s){t.innerHTML=`<div class="empty-state"><span class="empty-icon">⚠️</span><p class="empty-title">${s.message}</p></div>`,i(s.message,"error")}}function M(e,t){const s=e.querySelector("#filter-evento-insc"),o=s.value;s.innerHTML='<option value="">Todos os eventos</option>',t.forEach(a=>{const n=document.createElement("option");n.value=a.ID||a.id||a.Nome||a.Titulo,n.textContent=u(a.Nome||a.Titulo||"—",32),s.appendChild(n)}),s.value=o}function N(e){var a,n,m,v,f;const t=((n=(a=e.querySelector("#search-inscricoes"))==null?void 0:a.value)==null?void 0:n.toLowerCase())||"",s=((m=e.querySelector("#filter-evento-insc"))==null?void 0:m.value)||"",o=((f=(v=e.querySelector("#filter-status-insc"))==null?void 0:v.value)==null?void 0:f.toLowerCase())||"";return d.filter(r=>{const h=(r.Nome||"").toLowerCase(),g=(r.Matricula||"").toLowerCase(),S=!t||h.includes(t)||g.includes(t),w=!s||String(r.EventoId||r.Evento)===String(s),x=!o||(r.Status||"").toLowerCase()===o;return S&&w&&x})}function l(e){b(e,N(e))}function b(e,t){const s=e.querySelector("#inscricoes-table-wrap");if(!t.length){s.innerHTML=`
      <div class="empty-state">
        <span class="empty-icon">👥</span>
        <p class="empty-title">Nenhuma inscrição encontrada</p>
        <p class="empty-sub">Crie inscrições ou ajuste o filtro</p>
      </div>
    `;return}s.innerHTML=`
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
      ${t.length} inscrição${t.length!==1?"ões":""}
    </div>
  `;const o=s.querySelector("#insc-tbody");t.forEach(a=>{const n=document.createElement("tr");n.innerHTML=`
      <td><span style="font-weight:500">${a.Nome||"—"}</span></td>
      <td style="font-size:0.82rem;color:var(--text-3);font-family:monospace">${a.Matricula||"—"}</td>
      <td style="font-size:0.82rem">${u(a.EventoNome||a.Evento||"—",28)}</td>
      <td style="font-size:0.82rem">${I(a.DataInscricao)}</td>
      <td>${L(a.Status)}</td>
      <td>
        <div class="action-row" style="justify-content:flex-end">
          <button class="btn-icon" title="Cancelar inscrição" style="color:var(--red)" data-action="cancelar">✕</button>
        </div>
      </td>
    `,n.querySelector('[data-action="cancelar"]').addEventListener("click",()=>H(a,e)),o.appendChild(n)})}function $(e){const t=document.createElement("div");t.innerHTML=`
    <div class="form-group">
      <label class="form-label">Evento *</label>
      <select class="form-select" id="insc-evento">
        <option value="">Selecione um evento...</option>
        ${p.filter(o=>{var a;return((a=o.Status)==null?void 0:a.toLowerCase())==="ativo"}).map(o=>`
          <option value="${o.ID||o.id}">${u(o.Nome||o.Titulo||"—",40)}</option>
        `).join("")}
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
  `;const s=y("Nova Inscrição",t,{confirmLabel:"Inscrever",onConfirm:async()=>{const o=t.querySelector("#insc-evento").value,a=t.querySelector("#insc-nome").value.trim();if(!o||!a)throw i("Selecione o evento e informe o nome","error"),new Error("validação");await q({eventoId:o,nome:a,matricula:t.querySelector("#insc-matricula").value.trim(),status:t.querySelector("#insc-status").value,email:t.querySelector("#insc-email").value.trim(),obs:t.querySelector("#insc-obs").value.trim()}),i("Inscrição realizada!","success"),await c(e)}});document.body.appendChild(s.el),s.open(),setTimeout(()=>{var o;return(o=t.querySelector("#insc-nome"))==null?void 0:o.focus()},200)}function H(e,t){const s=document.createElement("div");s.innerHTML=`
    <p style="color:var(--text-2)">
      Cancelar a inscrição de <strong style="color:var(--text)">${e.Nome||"este participante"}</strong>?
    </p>
  `;const o=y("Cancelar Inscrição",s,{confirmLabel:"Cancelar Inscrição",danger:!0,onConfirm:async()=>{await T(e.ID||e.id),i("Inscrição cancelada","success"),await c(t)}});document.body.appendChild(o.el),o.open()}export{j as renderInscricoes};
