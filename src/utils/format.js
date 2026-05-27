/** Format date string (ISO or DD/MM/YYYY) to pt-BR display */
export function fmtDate(value) {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (isNaN(d)) return value;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return value;
  }
}

/** Format number with pt-BR locale */
export function fmtNum(n) {
  if (n == null) return '0';
  return Number(n).toLocaleString('pt-BR');
}

/** Relative time (e.g. "há 2 horas") */
export function fmtRelTime(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'agora';
  if (mins < 60) return `há ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `há ${days}d`;
}

/** Truncate string */
export function trunc(str, max = 40) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

/** Status badge config */
export const STATUS_MAP = {
  ativo:      { label: 'Ativo',      cls: 'badge-green'  },
  encerrado:  { label: 'Encerrado',  cls: 'badge-grey'   },
  cancelado:  { label: 'Cancelado',  cls: 'badge-red'    },
  rascunho:   { label: 'Rascunho',   cls: 'badge-amber'  },
  confirmado: { label: 'Confirmado', cls: 'badge-green'  },
  pendente:   { label: 'Pendente',   cls: 'badge-amber'  },
  presente:   { label: 'Presente',   cls: 'badge-blue'   },
  ausente:    { label: 'Ausente',    cls: 'badge-red'    },
};

export function statusBadge(status) {
  const cfg = STATUS_MAP[status?.toLowerCase()] || { label: status || '—', cls: 'badge-grey' };
  return `<span class="badge ${cfg.cls}"><span class="dot"></span>${cfg.label}</span>`;
}
