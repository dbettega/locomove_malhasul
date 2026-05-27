// ── Auth Service ─────────────────────────────────────────────
// Token é armazenado em sessionStorage (expira ao fechar o browser)
// + verificação de expiração de 8h

const TOKEN_KEY = 'lm_token';
const TOKEN_TTL = 8 * 60 * 60 * 1000; // 8 horas em ms

export function saveToken(token) {
  const payload = {
    token,
    expires: Date.now() + TOKEN_TTL,
  };
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(payload));
}

export function getToken() {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (Date.now() > payload.expires) {
      clearToken();
      return null;
    }
    return payload.token;
  } catch {
    return null;
  }
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return getToken() !== null;
}

/** Retorna quantos minutos faltam para expirar */
export function expiresInMinutes() {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return 0;
    const payload = JSON.parse(raw);
    return Math.max(0, Math.floor((payload.expires - Date.now()) / 60000));
  } catch {
    return 0;
  }
}
