/**
 * Create a reusable modal.
 * Usage:
 *   const m = createModal('Título', bodyEl, { onConfirm, confirmLabel, showFooter });
 *   document.body.appendChild(m.el);
 *   m.open();
 */
export function createModal(title, bodyEl, {
  onConfirm = null,
  onCancel  = null,
  confirmLabel = 'Salvar',
  cancelLabel  = 'Cancelar',
  showFooter   = true,
  danger       = false,
} = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  // Header
  const header = document.createElement('div');
  header.className = 'modal-header';

  const titleEl = document.createElement('h3');
  titleEl.className = 'modal-title';
  titleEl.textContent = title;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.innerHTML = '×';
  closeBtn.addEventListener('click', () => close());

  header.appendChild(titleEl);
  header.appendChild(closeBtn);

  // Body
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.appendChild(bodyEl);

  modal.appendChild(header);
  modal.appendChild(body);

  // Footer
  if (showFooter) {
    const footer = document.createElement('div');
    footer.className = 'modal-footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-ghost';
    cancelBtn.textContent = cancelLabel;
    cancelBtn.addEventListener('click', () => {
      onCancel?.();
      close();
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.className = `btn ${danger ? 'btn-danger' : 'btn-primary'}`;
    confirmBtn.textContent = confirmLabel;
    confirmBtn.addEventListener('click', async () => {
      if (onConfirm) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `<span class="spinner"></span> Aguarde`;
        try {
          await onConfirm();
          close();
        } catch (e) {
          confirmBtn.disabled = false;
          confirmBtn.textContent = confirmLabel;
        }
      } else {
        close();
      }
    });

    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    modal.appendChild(footer);
  }

  overlay.appendChild(modal);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // ESC key
  const onKey = (e) => { if (e.key === 'Escape') close(); };

  function open() {
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => overlay.classList.add('open'));
  }

  function close() {
    overlay.classList.remove('open');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => overlay.remove(), 400);
  }

  function setTitle(t) { titleEl.textContent = t; }
  function setLoading(loading) {
    const btn = modal.querySelector('.btn-primary, .btn-danger');
    if (!btn) return;
    btn.disabled = loading;
    btn.innerHTML = loading ? `<span class="spinner"></span> Aguarde` : confirmLabel;
  }

  return { el: overlay, open, close, setTitle, setLoading };
}
