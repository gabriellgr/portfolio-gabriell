/* ── Portfolio Gabriell · script.js ── */

'use strict';

/* ─── 1. CUSTOM CURSOR ─── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let animFrame;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    animFrame = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Expand cursor on interactive elements
  const interactives = document.querySelectorAll('a, button, .work-card, .chip, .stat-item');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();

/* ─── 2. NAVBAR SCROLL EFFECT ─── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─── 3. HERO TITLE CLIP-PATH REVEAL ─── */
(function initHeroReveal() {
  // Suporta tanto o hero antigo (.reveal-word) quanto o novo (.ht-sans, .ht-serif)
  const words = document.querySelectorAll('.ht-sans, .ht-serif, .reveal-word');
  if (!words.length) return;

  setTimeout(() => {
    words.forEach((word) => {
      word.classList.add('revealed');
    });
  }, 150);
})();

/* ─── 4. SCROLL REVEAL (IntersectionObserver) ─── */
(function initScrollReveal() {
  const sections = document.querySelectorAll('.reveal-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.04, rootMargin: '0px 0px -40px 0px' }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* ─── 5. SKILL BARS ANIMATION ─── */
(function initSkillBars() {
  const skillRows = document.querySelectorAll('.skill-row');
  if (!skillRows.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillRows.forEach((row) => observer.observe(row));
})();

/* ─── 6. SMOOTH ANCHOR SCROLLING (fallback for older browsers) ─── */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ─── 7. WORK CARDS — KEYBOARD ACCESSIBILITY ─── */
(function initWorkCardKeys() {
  document.querySelectorAll('.work-card').forEach((card) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
})();

/* ─── 8. HERO SCROLL HINT — FADE ON SCROLL ─── */
(function initScrollHintFade() {
  const hint = document.querySelector('.hero-scroll-hint');
  if (!hint) return;

  window.addEventListener('scroll', () => {
    const opacity = Math.max(0, 1 - window.scrollY / 200);
    hint.style.opacity = opacity;
  }, { passive: true });
})();

/* ─── 9. STAT COUNTER ANIMATION ─── */
(function initStatCounters() {
  const stats = document.querySelectorAll('.stat-item');
  if (!stats.length) return;

  // Only animate numeric values
  const animateNumber = (el, target, suffix) => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const numEl = entry.target.querySelector('.stat-number');
        if (!numEl) return;

        const text = numEl.textContent.trim();
        // Match patterns like "4+", "3+", "2025", "Python"
        const match = text.match(/^(\d+)(\+?)$/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = match[2] || '';
          animateNumber(numEl, target, suffix);
        }

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  stats.forEach((stat) => observer.observe(stat));
})();

/* ─── 10. PAGE SNAP — rolagem por seção ─── */
(function initPageSnap() {

  const SNAP_SELECTORS = ['#hero', '#about', '#info-grid', '#work', '#stack', '#experience', '#contact'];
  const sections = SNAP_SELECTORS
    .map(s => document.querySelector(s))
    .filter(Boolean);

  if (sections.length < 2) return;

  let isAnimating = false;
  let lastSnapTime = 0;
  let touchStartY = 0;

  const DURATION = 700;   // Animação ligeiramente mais rápida
  const MIN_GAP = 800;   // Cooldown menor para ser mais fluido

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function snapTo(index) {
    const now = Date.now();
    if (isAnimating || now - lastSnapTime < MIN_GAP) return;
    if (index < 0 || index >= sections.length) return;

    isAnimating = true;
    lastSnapTime = now;

    const startY = window.scrollY;
    const targetY = sections[index].getBoundingClientRect().top + startY;
    const diff = targetY - startY;
    const t0 = performance.now();

    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (index === 0) {
        navbar.classList.add('navbar-light');
        navbar.classList.remove('scrolled');
      } else {
        navbar.classList.remove('navbar-light');
        navbar.classList.add('scrolled');
      }
    }

    function frame(now) {
      const progress = Math.min((now - t0) / DURATION, 1);
      window.scrollTo(0, startY + diff * ease(progress));
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        window.scrollTo(0, targetY);
        isAnimating = false;
      }
    }

    requestAnimationFrame(frame);
  }

  function nearest() {
    let idx = 0, min = Infinity;
    sections.forEach((s, i) => {
      const d = Math.abs(s.getBoundingClientRect().top);
      if (d < min) { min = d; idx = i; }
    });
    return idx;
  }

  /* ── Wheel (mouse / trackpad) — INSTANT TRIGGER ── */
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isAnimating || Date.now() - lastSnapTime < MIN_GAP) return;

    // Detecta movimento significativo imediatamente
    if (Math.abs(e.deltaY) > 20) {
      const dir = e.deltaY > 0 ? 1 : -1;
      snapTo(nearest() + dir);
    }
  }, { passive: false });

  /* ── Touch ── */
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const delta = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) < 50) return;
    snapTo(nearest() + (delta > 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener('load', () => snapTo(nearest()));

})();

/* ─── MODAL DE PROJETOS ─── */
(function initProjectModal() {

  /* Dados completos de cada projeto */
  const projects = {
    euronex: {
      number: '01',
      title: 'Euronex & ViaLux',
      tag: 'TravelTech',
      image: 'images/modal_euronex.png',
      description: 'Desenvolvimento de um funil de vendas 100% automatizado via WhatsApp. Um agente de IA qualificava o perfil de viagem do lead, identificava o destino desejado, orçamento e datas e encaminhava para o consultor ideal — eliminando o tempo de espera humano na triagem inicial.',
      results: [
        'Tempo de resposta reduzido de 4h para menos de 30 segundos',
        'Taxa de conversão de leads aumentada em 40% no 1º mês',
        'Operação 24/7 sem custo adicional de equipe'
      ],
      quote: '"O sistema transformou nosso processo comercial. Hoje atendemos 3x mais clientes com a mesma equipe, e o tempo de resposta virou um diferencial competitivo real."',
      cite: '— Diretor Comercial, Euronex Turismo'
    },
    canis: {
      number: '02',
      title: 'Canis e Catus',
      tag: 'VetTech',
      image: 'images/modal_canis.png',
      description: 'Criação de um ecossistema digital completo para gestão veterinária. Automatização de fichas de internamento em PDF assinadas digitalmente, notificações automáticas para tutores via WhatsApp e integração das agendas dos veterinários com o CRM SynexLab para gestão de consultas, histórico unificado dos pacientes e dashboard de acompanhamento clínico.',
      results: [
        'Economia de 3h+ por dia em processos administrativos manuais',
        'Fichas de internamento geradas em menos de 10 segundos',
        'Zero erros de documentação desde a implementação'
      ],
      quote: '"Finalmente temos tempo para focar no que realmente importa: o cuidado com os animais. Os processos burocráticos simplesmente deixaram de existir para nossa equipe."',
      cite: '— Dra. Responsável Técnica, Canis e Catus'
    },
    legaltech: {
      number: '03',
      title: 'LegalTech Previdenciária',
      tag: 'LegalTech · IA',
      image: 'images/modal_legaltech.png',
      description: 'Agente de IA especializado em direito previdenciário que conduz conversas estruturadas via WhatsApp para qualificar leads. O sistema identifica automaticamente elegibilidade para aposentadoria por idade, tempo de contribuição, invalidez e pensão por morte — filtrando apenas os casos viáveis para os advogados.',
      results: [
        'Qualificação de 200+ leads/mês de forma totalmente automatizada',
        'Redução de 70% no tempo dos advogados com triagem inicial',
        'ROI positivo em menos de 30 dias após implementação'
      ],
      quote: '"O agente qualifica mais leads em um único dia do que toda a nossa equipe conseguia em uma semana. É como ter um paralegal especializado disponível 24 horas."',
      cite: '— Sócio-Fundador, Escritório Previdenciário'
    },
    executive: {
      number: '04',
      title: 'Assistente Executivo de IA',
      tag: 'Produtividade · IA',
      image: 'images/modal_executive.png',
      description: 'Desenvolvimento de um assistente executivo baseado em IA generativa que atua como um segundo cérebro para tomada de decisões estratégicas. Integração com sistema de arquivos local, histórico de conversas persistente, gestão de projetos e contexto contínuo personalizado para o perfil do usuário.',
      results: [
        'Contexto histórico completo de todos os projetos em segundos',
        'Redução de 60% no tempo de planejamento estratégico',
        'Decisões mais rápidas com análise de riscos automatizada'
      ],
      quote: '"É como ter um sócio estratégico disponível 24/7 que nunca esquece nada e sempre propõe o próximo passo. Mudou completamente minha forma de trabalhar."',
      cite: '— CEO, Startup de Tecnologia'
    }
  };

  const overlay = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!overlay || !closeBtn) return;

  function openModal(key) {
    const p = projects[key];
    if (!p) return;

    /* Preenche os dados */
    document.getElementById('modal-number').textContent = p.number;
    document.getElementById('modal-title').textContent = p.title;
    document.getElementById('modal-tag').textContent = p.tag;
    document.getElementById('modal-desc').textContent = p.description;
    document.getElementById('modal-quote').textContent = p.quote;
    document.getElementById('modal-cite').textContent = p.cite;

    const ul = document.getElementById('modal-results');
    ul.innerHTML = '';
    p.results.forEach(r => {
      const li = document.createElement('li');
      li.textContent = r;
      ul.appendChild(li);
    });

    /* Abre com animação */
    overlay.removeAttribute('hidden');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add('modal-open'));
    });
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('modal-open');
    overlay.addEventListener('transitionend', function handler() {
      overlay.setAttribute('hidden', '');
      overlay.removeEventListener('transitionend', handler);
    });
    document.body.style.overflow = '';
  }

  /* Clique nos cards */
  document.querySelectorAll('.work-card[data-project]').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.project);
      }
    });
  });

  /* Fechar */
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeModal();
  });

})();

/* ─── INTERACTIVE STACK & TOOLS ─── */
(function initStackInteractivity() {
  const stackData = {
    python: {
      'skill-python': { name: 'Arquitetura Back-End', pct: 95 },
      'skill-automacao': { name: 'Scripting & Automação', pct: 90 },
      'skill-api': { name: 'Desenvolvimento de APIs', pct: 92 },
      'skill-gestao': { name: 'Otimização de Sistemas', pct: 85 }
    },
    supabase: {
      'skill-python': { name: 'Banco de Dados Real-time', pct: 85 },
      'skill-automacao': { name: 'Edge Functions', pct: 80 },
      'skill-api': { name: 'PostgREST / GraphQL', pct: 95 },
      'skill-gestao': { name: 'Segurança & RLS', pct: 90 }
    },
    vercel: {
      'skill-python': { name: 'Pipelines de Deploy', pct: 90 },
      'skill-automacao': { name: 'Arquitetura Serverless', pct: 85 },
      'skill-api': { name: 'Edge Runtime', pct: 80 },
      'skill-gestao': { name: 'Performance de Borda', pct: 95 }
    },
    nodejs: {
      'skill-python': { name: 'Motor de Execução', pct: 80 },
      'skill-automacao': { name: 'Fluxos Assíncronos', pct: 90 },
      'skill-api': { name: 'REST / Fastify', pct: 95 },
      'skill-gestao': { name: 'Microsserviços', pct: 75 }
    },
    n8n: {
      'skill-python': { name: 'Programação de Nodes', pct: 85 },
      'skill-automacao': { name: 'Design de Fluxos Complexos', pct: 98 },
      'skill-api': { name: 'Gestão de Webhooks', pct: 95 },
      'skill-gestao': { name: 'Tratamento de Erros', pct: 92 }
    },
    make: {
      'skill-python': { name: 'Lógica de Requisições HTTP', pct: 80 },
      'skill-automacao': { name: 'Automação Visual', pct: 98 },
      'skill-api': { name: 'Integrações de Apps', pct: 95 },
      'skill-gestao': { name: 'Mapeamento de Dados', pct: 90 }
    },
    whatsapp: {
      'skill-python': { name: 'Lógica de Fluxos', pct: 92 },
      'skill-automacao': { name: 'Automação de Chatbots', pct: 98 },
      'skill-api': { name: 'API Oficial da Meta', pct: 95 },
      'skill-gestao': { name: 'Escalabilidade de Chats', pct: 85 }
    },
    openai: {
      'skill-python': { name: 'Engenharia de Prompt', pct: 98 },
      'skill-automacao': { name: 'Agentes de LLM', pct: 95 },
      'skill-api': { name: 'Ajuste Fino de Modelos', pct: 85 },
      'skill-gestao': { name: 'Gestão de Contexto', pct: 92 }
    },
    nextjs: {
      'skill-python': { name: 'Renderização no Servidor', pct: 92 },
      'skill-automacao': { name: 'Geração de Site Estático', pct: 88 },
      'skill-api': { name: 'Rotas de API', pct: 95 },
      'skill-gestao': { name: 'SEO & Performance', pct: 90 }
    },
    postgresql: {
      'skill-python': { name: 'Consultas Complexas', pct: 90 },
      'skill-automacao': { name: 'Triggers & Procedimentos', pct: 85 },
      'skill-api': { name: 'Arquitetura de Dados', pct: 95 },
      'skill-gestao': { name: 'Modelagem Relacional', pct: 92 }
    },
    git: {
      'skill-python': { name: 'Controle de Versão', pct: 95 },
      'skill-automacao': { name: 'Fluxos de CI / CD', pct: 90 },
      'skill-api': { name: 'GitFlow / Trunk-based', pct: 85 },
      'skill-gestao': { name: 'Revisão de Código', pct: 92 }
    },
    canva: {
      'skill-python': { name: 'Identidade Visual', pct: 95 },
      'skill-automacao': { name: 'Prototipagem UI / UX', pct: 90 },
      'skill-api': { name: 'Composição de Layout', pct: 92 },
      'skill-gestao': { name: 'Consistência de Marca', pct: 85 }
    }
  };

  const chips = document.querySelectorAll('.chip[data-stack]');
  const skillRows = document.querySelectorAll('.skill-row');

  function updateSkills(stackKey) {
    const data = stackData[stackKey];
    if (!data) return;

    skillRows.forEach(row => {
      const id = row.id;
      const skillInfo = data[id];
      if (!skillInfo) return;
      
      const nameSpan = row.querySelector('.skill-name');
      const pctSpan = row.querySelector('.skill-pct');
      const fill = row.querySelector('.skill-fill');
      
      if (nameSpan) {
        nameSpan.style.opacity = '0';
        setTimeout(() => {
          nameSpan.textContent = skillInfo.name;
          nameSpan.style.opacity = '1';
        }, 300);
      }

      if (pctSpan) pctSpan.textContent = `${skillInfo.pct}%`;
      
      if (fill) {
        fill.style.setProperty('--target', `${skillInfo.pct}%`);
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = `${skillInfo.pct}%`;
        }, 10);
      }
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const stackKey = chip.getAttribute('data-stack');
      updateSkills(stackKey);
    });
  });

  updateSkills('python');
})();

/* ─── 11. DRAGGABLE HERO CAROUSEL ─── */
(function initDraggableCarousel() {
  const container = document.querySelector('.hero-fan');
  const cards = Array.from(document.querySelectorAll('.hero-fan .fan-card'));
  if (!container || cards.length === 0) return;

  const positions = ['pos-1', 'pos-2', 'pos-3', 'pos-4', 'pos-5'];
  
  // Set initial positional classes
  cards.forEach((card, i) => {
    card.classList.add(positions[i]);
  });

  let currentOffset = 0;
  let startX = 0;
  let isDragging = false;

  const updatePositions = () => {
    cards.forEach((card, i) => {
      positions.forEach(p => card.classList.remove(p));
      let newIndex = (i + currentOffset) % positions.length;
      if (newIndex < 0) newIndex += positions.length;
      card.classList.add(positions[newIndex]);
    });
  };

  const onStart = (e) => {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    container.style.cursor = 'grabbing';
  };

  const onEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = 'grab';

    const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        currentOffset++; // Swipe right
      } else {
        currentOffset--; // Swipe left
      }
      updatePositions();
    }
  };

  container.style.cursor = 'grab';
  container.addEventListener('mousedown', onStart);
  window.addEventListener('mouseup', onEnd);
  
  container.addEventListener('touchstart', onStart, {passive: true});
  window.addEventListener('touchend', onEnd);
})();
