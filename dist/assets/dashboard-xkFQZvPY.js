import{i as w,j as D,h as m,s as u,t as M,g as T}from"./api-CXJPJYgE.js";import{t as z}from"./index-BB6bMmLW.js";function q(){const s=document.createElement("div");return s.className="page",s.id="page-dashboard",s.innerHTML=`
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
      ${L()}
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
  `,h(s),s.querySelector("#dash-refresh").addEventListener("click",()=>h(s)),s}function L(){return["Eventos Ativos","Total Inscrições","Taxa Confirmação","Eventos este mês"].map((t,e)=>`
    <div class="stat-card ${["green","blue","amber","purple"][e]}">
      <span class="stat-icon">${["📅","👥","✅","🚂"][e]}</span>
      <div class="stat-value" style="opacity:0.3">—</div>
      <div class="stat-label">${t}</div>
    </div>
  `).join("")}async function h(s){try{let t;try{t=await w(),t=t.data||t}catch{const e=await D();t=S(e.data||[])}E(s,t),I(s,t),k(s,t),j(s,t),H(s,t),N(s,t)}catch(t){z("Erro ao carregar dashboard: "+t.message,"error")}}function S(s){const t=new Date,e=t.getMonth(),i=t.getFullYear(),n=s.filter(r=>{var o;return((o=r.Status)==null?void 0:o.toLowerCase())==="ativo"}).length,a=s.reduce((r,o)=>r+(Number(o.Inscritos)||0),0),v=s.reduce((r,o)=>r+(Number(o.Confirmados)||0),0),d=a>0?Math.round(v/a*100):0,c=s.filter(r=>{const o=new Date(r.Data);return o.getMonth()===e&&o.getFullYear()===i}).length,l=[];for(let r=5;r>=0;r--){const o=new Date(i,e-r,1),b=o.toLocaleDateString("pt-BR",{month:"short"}),x=s.filter($=>{const f=new Date($.Data);return f.getMonth()===o.getMonth()&&f.getFullYear()===o.getFullYear()}).length;l.push({mes:b,count:x})}const p={};s.forEach(r=>{const o=r.Status||"Indefinido";p[o]=(p[o]||0)+1});const g=[...s].sort((r,o)=>(Number(o.Inscritos)||0)-(Number(r.Inscritos)||0)).slice(0,5),y=s.filter(r=>new Date(r.Data)>=t).sort((r,o)=>new Date(r.Data)-new Date(o.Data)).slice(0,5);return{ativos:n,totalInscricoes:a,taxa:d,mesAtual:c,meses:l,statusDist:p,top:g,proximos:y,atividade:[]}}function E(s,t){var n,a,v,d,c,l,p;const e=s.querySelector("#dash-stats"),i=(a=(n=t.taxa)!=null?n:t.taxaConfirmacao)!=null?a:0;e.innerHTML=`
    <div class="stat-card green">
      <span class="stat-icon">📅</span>
      <div class="stat-value">${m((v=t.ativos)!=null?v:0)}</div>
      <div class="stat-label">Eventos Ativos</div>
      <span class="stat-delta neutral">total de ${m((c=(d=t.totalEventos)!=null?d:t.ativos)!=null?c:0)}</span>
    </div>
    <div class="stat-card blue">
      <span class="stat-icon">👥</span>
      <div class="stat-value">${m((l=t.totalInscricoes)!=null?l:0)}</div>
      <div class="stat-label">Total Inscrições</div>
      <span class="stat-delta up">↑ engajamento</span>
    </div>
    <div class="stat-card amber">
      <span class="stat-icon">✅</span>
      <div class="stat-value">${i}%</div>
      <div class="stat-label">Taxa Confirmação</div>
      <span class="stat-delta ${i>=70?"up":"neutral"}">${i>=70?"↑ meta atingida":"em progresso"}</span>
    </div>
    <div class="stat-card purple">
      <span class="stat-icon">🚂</span>
      <div class="stat-value">${m((p=t.mesAtual)!=null?p:0)}</div>
      <div class="stat-label">Eventos este Mês</div>
      <span class="stat-delta neutral">mês atual</span>
    </div>
  `}function I(s,t){const e=s.querySelector("#chart-bars"),i=t.meses||[];if(!i.length){e.innerHTML='<div class="empty-state"><span class="empty-icon">📊</span></div>';return}const n=Math.max(...i.map(a=>a.count),1);e.style.alignItems="flex-end",e.style.gap="8px",e.style.height="120px",e.style.display="flex",e.innerHTML=i.map((a,v)=>{const d=Math.round(a.count/n*100),c=v===i.length-1;return`
      <div class="bar-col">
        <div style="font-size:0.7rem;color:var(--text-2);font-weight:600;margin-bottom:4px">${a.count||""}</div>
        <div class="bar ${c?"green":"blue"}" style="height:${Math.max(d,4)}%;width:100%"></div>
        <div class="bar-label">${a.mes}</div>
      </div>
    `}).join("")}function k(s,t){const e=s.querySelector("#dash-progress"),i=t.statusDist||{},n=Object.entries(i);if(!n.length){e.innerHTML='<div class="empty-state"><span class="empty-sub">Sem dados</span></div>';return}const a=n.reduce((d,[,c])=>d+c,0),v=["#3ecf5c","#4a9eff","#f5a623","#a78bfa","#ff5a5a"];e.innerHTML=n.map(([d,c],l)=>{const p=Math.round(c/a*100);return`
      <div class="progress-item">
        <div class="progress-header">
          <span class="progress-name">${d}</span>
          <span class="progress-pct">${c} (${p}%)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${p}%;background:${v[l%v.length]}"></div>
        </div>
      </div>
    `}).join("")}function j(s,t){const e=s.querySelector("#dash-proximos"),i=t.proximos||[];if(!i.length){e.innerHTML='<div class="empty-state"><span class="empty-sub">Nenhum evento futuro</span></div>';return}e.innerHTML=i.map(n=>`
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="background:var(--surface-2);border-radius:8px;padding:8px 10px;text-align:center;min-width:44px;flex-shrink:0">
        <div style="font-family:var(--font-display);font-size:1rem;font-weight:800;color:var(--green);line-height:1">
          ${new Date(n.Data).getDate()||"—"}
        </div>
        <div style="font-size:0.6rem;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em">
          ${n.Data?new Date(n.Data).toLocaleDateString("pt-BR",{month:"short"}):""}
        </div>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:0.85rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${n.Nome||n.Titulo||"Evento"}</div>
        <div style="font-size:0.73rem;color:var(--text-3);margin-top:2px">${n.Local||"—"} · ${n.Inscritos||0} inscritos</div>
      </div>
      ${u(n.Status)}
    </div>
  `).join("")}function H(s,t){const e=s.querySelector("#dash-activity"),i=t.atividade||[];if(!i.length){e.innerHTML=`
      <div class="activity-item">
        <div class="activity-dot" style="background:var(--green)"></div>
        <div class="activity-text">
          <div class="activity-main">Sistema iniciado</div>
          <div class="activity-sub">Dashboard carregado com sucesso</div>
        </div>
        <div class="activity-time">agora</div>
      </div>
    `;return}const n={inscricao:"#3ecf5c",evento:"#4a9eff",cancelamento:"#ff5a5a"};e.innerHTML=i.map(a=>`
    <div class="activity-item">
      <div class="activity-dot" style="background:${n[a.tipo]||"#6b7fa3"}"></div>
      <div class="activity-text">
        <div class="activity-main">${a.descricao||"—"}</div>
        <div class="activity-sub">${a.detalhe||""}</div>
      </div>
      <div class="activity-time">${a.tempo||""}</div>
    </div>
  `).join("")}function N(s,t){const e=s.querySelector("#dash-top-table"),i=t.top||[];if(!i.length){e.innerHTML='<div class="empty-state"><span class="empty-icon">📋</span><p class="empty-title">Sem dados ainda</p><p class="empty-sub">Crie eventos para ver o ranking</p></div>';return}const n=Math.max(...i.map(a=>Number(a.Inscritos)||0),1);e.innerHTML=`
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
          ${i.map((a,v)=>{const d=Number(a.Inscritos)||0,c=Number(a.Vagas)||n,l=Math.round(d/Math.max(c,1)*100);return`
              <tr>
                <td style="color:var(--text-3);font-size:0.8rem">${v+1}</td>
                <td>${M(a.Nome||a.Titulo||"—",32)}</td>
                <td style="font-size:0.82rem">${T(a.Data)}</td>
                <td style="font-size:0.82rem;color:var(--text-3)">${a.Local||"—"}</td>
                <td>${u(a.Status)}</td>
                <td style="font-family:var(--font-display);font-weight:700">${m(d)}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="progress-track" style="width:80px;flex-shrink:0">
                      <div class="progress-fill" style="width:${Math.min(l,100)}%;background:${l>=80?"#ff5a5a":l>=50?"#f5a623":"#3ecf5c"}"></div>
                    </div>
                    <span style="font-size:0.75rem;color:var(--text-2)">${l}%</span>
                  </div>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `}export{q as renderDashboard};
