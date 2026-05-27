# LOCOMOVE PWA v3

Sistema de gestão de eventos ferroviários — Rumo Malha Sul.

## Stack

- **Vite 5** — build tool
- **Vanilla JS modular** — sem framework, bundle mínimo
- **DOMPurify** — sanitização XSS
- **Google Apps Script** — backend/API via Google Sheets
- **PWA** — Service Worker + manifest instalável

## Estrutura

```
src/
  main.js              → entry point, roteador
  components/
    sidebar.js         → navegação lateral
    modal.js           → modal reutilizável
  pages/
    dashboard.js       → KPIs, gráficos, ranking
    eventos.js         → CRUD de eventos
    inscricoes.js      → gestão de inscrições
  services/
    api.js             → client HTTP para GAS
    sw-register.js     → registro do Service Worker
  security/
    sanitize.js        → DOMPurify wrapper
  styles/
    global.css         → design system completo
  utils/
    toast.js           → notificações
    format.js          → formatadores e helpers
public/
  sw.js                → Service Worker
  manifest.json        → PWA manifest
  offline.html         → fallback offline
```

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variável de ambiente

```bash
cp .env.example .env
```

Edite `.env`:

```env
VITE_API_URL=https://script.google.com/macros/s/SEU_SCRIPT_ID/exec
```

### 3. Rodar local

```bash
npm run dev
```

### 4. Build para produção

```bash
npm run build
```

### 5. Deploy no GitHub Pages

```bash
# Suba o conteúdo de dist/ para o branch gh-pages
# ou configure GitHub Actions
```

## API — Ações esperadas do GAS

O frontend envia `?action=xxx` (GET) ou `{ action, ...payload }` (POST).

| Ação               | Método | Descrição                     |
|--------------------|--------|-------------------------------|
| getEventos         | GET    | Lista todos os eventos        |
| getDashboard       | GET    | KPIs e dados agregados        |
| getInscricoes      | POST   | Inscrições de um evento       |
| getTodasInscricoes | GET    | Todas as inscrições           |
| criarEvento        | POST   | Cria novo evento              |
| editarEvento       | POST   | Edita evento existente        |
| deletarEvento      | POST   | Remove evento por ID          |
| criarInscricao     | POST   | Inscreve participante         |
| cancelarInscricao  | POST   | Cancela inscrição por ID      |

## Segurança

- CSP configurada no `index.html` (sem `unsafe-eval`)
- API URL via variável de ambiente (nunca hardcoded)
- DOMPurify em todos os inputs renderizados via innerHTML
- Sem PIN ou lógica administrativa no frontend
- Sem `mode: 'no-cors'`
