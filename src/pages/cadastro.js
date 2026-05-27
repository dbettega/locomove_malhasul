import { toast } from '../utils/toast.js';

const API_URL = import.meta.env.VITE_API_URL;

const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

const SETORES = [
  'Engenharia',
  'Manutenção',
  'Operações',
  'Segurança do Trabalho',
  'Planejamento',
  'Logística',
  'TI',
  'RH',
  'Financeiro',
  'Suprimentos',
  'Qualidade',
  'Outros',
];

export function renderCadastro() {
  const page = document.createElement('div');
  page.className = 'page';
  page.id = 'page-cadastro';

  page.innerHTML = `
    <!-- Hero público -->
    <div style="
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 32px;
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    ">
      <div style="
        width: 52px; height: 52px;
        background: var(--green);
        border-radius: 14px;
        display: flex; align-items: center; justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
        box-shadow: var(--shadow-green);
      ">🏃</div>
      <div style="flex:1">
        <h1 style="font-family:var(--font-display);font-size:1.4rem;font-weight:800;margin-bottom:4px">
          Cadastro de Participantes
        </h1>
        <p style="font-size:0.875rem;color:var(--text-2)">
          Preencha seus dados para participar dos eventos LOCOMOVE · Rumo Malha Sul
        </p>
      </div>
      <div style="
        background: var(--green-dim);
        border: 1px solid var(--border-hover);
        border-radius: var(--radius-sm);
        padding: 8px 14px;
        font-size: 0.75rem;
        color: var(--green);
        font-weight: 600;
        white-space: nowrap;
      ">✓ Acesso público</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px">

      <!-- Formulário -->
      <div style="grid-column:1/-1">
        <div class="card" id="cadastro-card">
          <h3 style="font-family:var(--font-display);font-size:1rem;font-weight:700;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border)">
            Dados do Participante
          </h3>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">CS (Número Funcional) *</label>
              <input class="form-input" id="cad-cs" type="text" placeholder="Ex: 294705"
                inputmode="numeric" maxlength="10">
              <span id="cs-feedback" style="font-size:0.73rem;color:var(--text-3);margin-top:4px;display:block"></span>
            </div>

            <div class="form-group">
              <label class="form-label">Nome Completo *</label>
              <input class="form-input" id="cad-nome" type="text" placeholder="Seu nome completo">
            </div>

            <div class="form-group" style="grid-column:1/-1">
              <label class="form-label">Setor / Gerência *</label>
              <select class="form-select" id="cad-setor">
                <option value="">Selecione seu setor...</option>
                ${SETORES.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Separador -->
          <div style="margin:20px 0;padding-top:20px;border-top:1px solid var(--border)">
            <h3 style="font-family:var(--font-display);font-size:0.95rem;font-weight:700;margin-bottom:4px">
              Uniformes
            </h3>
            <p style="font-size:0.78rem;color:var(--text-3);margin-bottom:20px">
              Informe seus tamanhos para recebimento de kit
            </p>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Tamanho do Calção *</label>
                <div id="size-calcao" style="display:flex;gap:8px;flex-wrap:wrap">
                  ${TAMANHOS.map(t => sizePill(t, 'calcao')).join('')}
                </div>
                <input type="hidden" id="cad-calcao">
              </div>

              <div class="form-group">
                <label class="form-label">Tamanho da Camiseta *</label>
                <div id="size-camiseta" style="display:flex;gap:8px;flex-wrap:wrap">
                  ${TAMANHOS.map(t => sizePill(t, 'camiseta')).join('')}
                </div>
                <input type="hidden" id="cad-camiseta">
              </div>
            </div>
          </div>

          <!-- Telefone opcional -->
          <div class="form-group">
            <label class="form-label">Telefone <span style="color:var(--text-3);font-weight:400;text-transform:none">(opcional)</span></label>
            <input class="form-input" id="cad-telefone" type="tel" placeholder="(55) 99999-9999" maxlength="15">
          </div>

          <!-- Submit -->
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end">
            <button id="btn-cadastrar" class="btn btn-primary" style="padding:12px 28px;font-size:0.95rem">
              ✓ Confirmar Cadastro
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Sucesso (hidden) -->
    <div id="cadastro-sucesso" style="display:none;max-width:500px;margin:0 auto;text-align:center;padding:60px 20px;animation:fadeSlide 0.4s ease">
      <div style="
        width:72px;height:72px;
        background:var(--green-dim);
        border:2px solid var(--green);
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:32px;
        margin:0 auto 20px;
      ">✓</div>
      <h2 style="font-family:var(--font-display);font-size:1.4rem;font-weight:800;margin-bottom:8px">
        Cadastro realizado!
      </h2>
      <p style="color:var(--text-2);font-size:0.9rem;margin-bottom:6px" id="sucesso-nome"></p>
      <p style="color:var(--text-3);font-size:0.82rem;margin-bottom:28px">
        Seus dados foram registrados com sucesso.
      </p>
      <button id="btn-novo-cadastro" class="btn btn-ghost">
        + Cadastrar outro participante
      </button>
    </div>
  `;

  // Size pill selection
  setupSizePills(page, 'calcao',   '#cad-calcao');
  setupSizePills(page, 'camiseta', '#cad-camiseta');

  // Phone mask
  const telInput = page.querySelector('#cad-telefone');
  telInput.addEventListener('input', () => {
    let v = telInput.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6)       v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2)  v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0)  v = `(${v}`;
    telInput.value = v;
  });

  // CS feedback
  const csInput = page.querySelector('#cad-cs');
  csInput.addEventListener('input', () => {
    const v = csInput.value.replace(/\D/g, '');
    csInput.value = v;
  });

  // Submit
  page.querySelector('#btn-cadastrar').addEventListener('click', () => submitCadastro(page));

  // Novo cadastro
  page.querySelector('#btn-novo-cadastro').addEventListener('click', () => {
    page.querySelector('#cadastro-sucesso').style.display = 'none';
    page.querySelector('#cadastro-card').style.display = 'block';
    resetForm(page);
  });

  return page;
}

function sizePill(tamanho, grupo) {
  return `
    <button type="button" class="size-pill" data-grupo="${grupo}" data-size="${tamanho}" style="
      padding: 7px 14px;
      border-radius: 8px;
      border: 1.5px solid var(--border);
      background: var(--surface-2);
      color: var(--text-2);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: var(--font-body);
    ">${tamanho}</button>
  `;
}

function setupSizePills(page, grupo, hiddenId) {
  const container = page.querySelector(`#size-${grupo}`);
  const hidden    = page.querySelector(hiddenId);

  container.querySelectorAll('.size-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.size-pill').forEach(b => {
        b.style.background    = 'var(--surface-2)';
        b.style.borderColor   = 'var(--border)';
        b.style.color         = 'var(--text-2)';
      });
      btn.style.background  = 'var(--green)';
      btn.style.borderColor = 'var(--green)';
      btn.style.color       = '#0a1628';
      hidden.value = btn.dataset.size;
    });
  });
}

async function submitCadastro(page) {
  const cs       = page.querySelector('#cad-cs').value.trim();
  const nome     = page.querySelector('#cad-nome').value.trim();
  const setor    = page.querySelector('#cad-setor').value;
  const calcao   = page.querySelector('#cad-calcao').value;
  const camiseta = page.querySelector('#cad-camiseta').value;
  const telefone = page.querySelector('#cad-telefone').value.trim();

  // Validação
  const erros = [];
  if (!cs)       erros.push('CS (número funcional)');
  if (!nome)     erros.push('Nome completo');
  if (!setor)    erros.push('Setor');
  if (!calcao)   erros.push('Tamanho do calção');
  if (!camiseta) erros.push('Tamanho da camiseta');

  if (erros.length) {
    toast(`Preencha: ${erros.join(', ')}`, 'error', 4000);
    return;
  }

  const btn = page.querySelector('#btn-cadastrar');
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Enviando...`;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:    'cadastrarParticipante',
        cs, nome, setor, calcao, camiseta, telefone,
      }),
    });

    const data = await res.json();

    if (data.status === 'ok') {
      page.querySelector('#cadastro-card').style.display = 'none';
      const sucesso = page.querySelector('#cadastro-sucesso');
      sucesso.style.display = 'block';
      page.querySelector('#sucesso-nome').textContent =
        `CS ${cs} — ${nome} · ${setor}`;
      toast('Cadastro realizado com sucesso!', 'success');
    } else {
      toast(data.message || 'Erro ao cadastrar', 'error');
    }
  } catch (err) {
    toast('Erro ao conectar com o servidor', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '✓ Confirmar Cadastro';
  }
}

function resetForm(page) {
  page.querySelector('#cad-cs').value       = '';
  page.querySelector('#cad-nome').value     = '';
  page.querySelector('#cad-setor').value    = '';
  page.querySelector('#cad-calcao').value   = '';
  page.querySelector('#cad-camiseta').value = '';
  page.querySelector('#cad-telefone').value = '';

  // Reset size pills
  page.querySelectorAll('.size-pill').forEach(b => {
    b.style.background  = 'var(--surface-2)';
    b.style.borderColor = 'var(--border)';
    b.style.color       = 'var(--text-2)';
  });
}
