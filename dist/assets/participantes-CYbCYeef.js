import{a as b,t as x,g as C}from"./api-CXJPJYgE.js";import{t as S}from"./index-BB6bMmLW.js";let d=[];function P(){const t=document.createElement("div");return t.className="page",t.id="page-participantes",t.innerHTML=`
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
        ${["PP","P","M","G","GG","XGG"].map(e=>`<option value="${e}">${e}</option>`).join("")}
      </select>
      <select class="form-select" id="filter-camiseta" style="max-width:150px">
        <option value="">Camiseta (todos)</option>
        ${["PP","P","M","G","GG","XGG"].map(e=>`<option value="${e}">${e}</option>`).join("")}
      </select>
    </div>

    <!-- Stats rápidos -->
    <div id="part-stats" style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap"></div>

    <div id="part-table-wrap">
      <div class="empty-state"><span class="spinner"></span><p class="empty-title" style="margin-top:16px">Carregando...</p></div>
    </div>
  `,m(t),t.querySelector("#btn-refresh-part").addEventListener("click",()=>m(t)),t.querySelector("#search-part").addEventListener("input",()=>p(t)),t.querySelector("#filter-calcao").addEventListener("change",()=>p(t)),t.querySelector("#filter-camiseta").addEventListener("change",()=>p(t)),t}async function m(t){const e=t.querySelector("#part-table-wrap");e.innerHTML='<div class="empty-state"><span class="spinner"></span><p class="empty-title" style="margin-top:16px">Carregando...</p></div>';try{d=(await b("getParticipantes",null)).data||[],$(t,d),v(t,d)}catch(r){e.innerHTML=`<div class="empty-state"><span class="empty-icon">⚠️</span><p class="empty-title">${r.message}</p></div>`,S(r.message,"error")}}function $(t,e){const r=t.querySelector("#part-stats"),s=e.length,o={};e.forEach(a=>{const i=a.Camiseta||"—";o[i]=(o[i]||0)+1});const l=Object.entries(o).sort((a,i)=>i[1]-a[1])[0],n={};e.forEach(a=>{const i=a.Setor||"—";n[i]=(n[i]||0)+1});const c=Object.entries(n).sort((a,i)=>i[1]-a[1])[0];r.innerHTML=`
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;display:flex;align-items:center;gap:10px">
      <span style="font-size:20px">👤</span>
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:800">${s}</div>
        <div style="font-size:0.72rem;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em">Participantes</div>
      </div>
    </div>
    ${l?`
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;display:flex;align-items:center;gap:10px">
      <span style="font-size:20px">👕</span>
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:800">${l[0]}</div>
        <div style="font-size:0.72rem;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em">Camiseta + pedida</div>
      </div>
    </div>`:""}
    ${c?`
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;display:flex;align-items:center;gap:10px">
      <span style="font-size:20px">🏢</span>
      <div>
        <div style="font-family:var(--font-display);font-size:1rem;font-weight:800">${x(c[0],16)}</div>
        <div style="font-size:0.72rem;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em">Setor + ativo</div>
      </div>
    </div>`:""}
  `}function w(t){var o,l,n,c;const e=((l=(o=t.querySelector("#search-part"))==null?void 0:o.value)==null?void 0:l.toLowerCase())||"",r=((n=t.querySelector("#filter-calcao"))==null?void 0:n.value)||"",s=((c=t.querySelector("#filter-camiseta"))==null?void 0:c.value)||"";return d.filter(a=>{const i=String(a.CS||"").toLowerCase(),f=(a.Nome||"").toLowerCase(),u=(a.Setor||"").toLowerCase(),y=!e||i.includes(e)||f.includes(e)||u.includes(e),h=!r||a.Calcao===r,g=!s||a.Camiseta===s;return y&&h&&g})}function p(t){v(t,w(t))}function v(t,e){const r=t.querySelector("#part-table-wrap");if(!e.length){r.innerHTML=`
      <div class="empty-state">
        <span class="empty-icon">🗂️</span>
        <p class="empty-title">Nenhum participante encontrado</p>
        <p class="empty-sub">Os cadastros do formulário público aparecerão aqui</p>
      </div>
    `;return}r.innerHTML=`
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
          ${e.map(s=>`
            <tr>
              <td style="font-family:monospace;font-size:0.85rem;color:var(--green)">${s.CS||"—"}</td>
              <td style="font-weight:500">${s.Nome||"—"}</td>
              <td style="font-size:0.82rem;color:var(--text-2)">${s.Setor||"—"}</td>
              <td>
                <span class="badge badge-blue">${s.Calcao||"—"}</span>
              </td>
              <td>
                <span class="badge badge-purple">${s.Camiseta||"—"}</span>
              </td>
              <td style="font-size:0.82rem;color:var(--text-3)">${s.Telefone||"—"}</td>
              <td style="font-size:0.78rem;color:var(--text-3)">${C(s.CriadoEm)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    <div style="padding:12px 16px;font-size:0.75rem;color:var(--text-3);border-top:1px solid var(--border)">
      ${e.length} participante${e.length!==1?"s":""}
    </div>
  `}export{P as renderParticipantes};
