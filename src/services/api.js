import { getToken, clearToken } from '../security/auth.js';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Central API client.
 * Rotas protegidas enviam o token no header Authorization.
 * Rotas públicas passam { auth: false }.
 */
export async function api(action, payload = null, { auth = true } = {}) {
  if (!API_URL) {
    throw new Error('API_URL não configurada. Verifique o arquivo .env');
  }

  const token = auth ? getToken() : null;
  if (auth && !token) {
    // Token expirado — força logout
    clearToken();
    window.dispatchEvent(new CustomEvent('locomove:logout'));
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const isPost = payload !== null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let url = API_URL;
  const config = { method: isPost ? 'POST' : 'GET', headers };

  if (isPost) {
    config.body = JSON.stringify({ action, token, ...payload });
  } else {
    url = `${API_URL}?action=${encodeURIComponent(action)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;
  }

  const response = await fetch(url, config);
  if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

  const data = await response.json();
  if (data.status === 'error') throw new Error(data.message || 'Erro na API');

  return data;
}

/* ── Rotas protegidas (admin) ── */
export const getEventos          = ()         => api('getEventos',          null);
export const getInscricoes       = (eventoId) => api('getInscricoes',       { eventoId });
export const getDashboard        = ()         => api('getDashboard',        null);
export const getTodasInscricoes  = ()         => api('getTodasInscricoes',  null);
export const getParticipantes    = ()         => api('getParticipantes',    null);

export const criarEvento         = (dados)    => api('criarEvento',         dados);
export const editarEvento        = (dados)    => api('editarEvento',        dados);
export const deletarEvento       = (id)       => api('deletarEvento',       { id });

export const criarInscricao      = (dados)    => api('criarInscricao',      dados);
export const cancelarInscricao   = (id)       => api('cancelarInscricao',   { id });

/* ── Rota pública ── */
export const cadastrarParticipante = (dados)  =>
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'cadastrarParticipante', ...dados }),
  }).then(r => r.json());
