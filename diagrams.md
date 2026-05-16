# Portfolio Gabriell — Planejamento Técnico

## 📐 Arquitetura

**Tipo**: Single-Page Application (SPA) estática  
**Stack**: HTML5 + Vanilla CSS + Vanilla JavaScript  
**Runtime**: Node.js (serve estático via `http-server` ou `express`)  
**Deploy**: Vercel (static site)

```
portfolio-gabriell/
├── public/
│   ├── index.html        # Estrutura HTML principal (single-page)
│   ├── style.css         # Design system + layout + animações
│   └── script.js         # Cursor, scroll reveal, animações JS
├── server.js             # Servidor Node.js simples (express)
├── package.json
└── diagrams.md
```

## 🏃 Sprints de Desenvolvimento

### Sprint 1 — Fundação e Design System
- [x] Criar estrutura de pastas do projeto
- [x] Configurar `package.json` com `express`
- [x] Definir CSS variables (paleta, tipografia, grid)
- [x] Importar Google Fonts (Space Grotesk, DM Mono)
- [x] Grain texture via SVG inline (feTurbulence)
- [x] CSS Reset e scroll-behavior smooth

### Sprint 2 — Estrutura HTML e Navbar
- [x] Header fixo com logo, nav âncoras e CTA "→ Hire Me"
- [x] Scroll-aware navbar (backdrop-filter blur)
- [x] Cursor customizado (ponto azul com delay)

### Sprint 3 — Hero Section
- [x] Texto display gigante ("Founder. / Engineer. / Automator.")
- [x] Tagline em monospace
- [x] Badge circular rotacionado (CSS animation infinite)
- [x] Clip-path reveal animation (staggered por palavra)

### Sprint 4 — About, Work e Stack
- [x] About: 2 colunas assimétricas com números de impacto
- [x] Work: cards horizontais fullwidth com hover azul
- [x] Stack: chips com hover + barras de progresso animadas

### Sprint 5 — Experience, Contact e Polish
- [x] Experience: timeline editorial com linha vertical azul
- [x] Education: coluna paralela
- [x] Contact: CTA enorme "Let's build." + links
- [x] Footer minimalista
- [x] Scroll reveal (IntersectionObserver) em todas as seções
- [x] Responsividade mobile (breakpoint 768px)

## 🔗 Fluxo de Navegação

```
[Navbar] → [Hero] → [About] → [Work] → [Stack] → [Experience] → [Contact]
```

## 🎨 Design System

| Token | Valor |
|---|---|
| `--bg` | `#0A0A0A` |
| `--fg` | `#F5F5F0` |
| `--accent` | `#1400FF` |
| `--white` | `#FFFFFF` |
| `--subtle` | `#222222` |
| `--font-display` | Space Grotesk 700–900 |
| `--font-mono` | DM Mono 400 |
