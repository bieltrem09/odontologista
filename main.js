/* =========================================================
   OdontoClinic — interações e movimento
   Sem dependências. Princípio: movimento calmo, só transform/opacity,
   e prefers-reduced-motion leva tudo direto ao estado final.
   ========================================================= */
(() => {
  'use strict';

  // ---------- Configuração da clínica ----------
  const WA_NUMBER = '5511900000000'; // FICTÍCIO — trocar pelo número real (DDI+DDD+número)
  const WA_DEFAULT = 'Olá! Vim pelo site e gostaria de agendar uma avaliação.';

  const TREATMENTS = [
    { name: 'Limpeza e prevenção', line: 'O cuidado que evita quase todo o resto.', img: 'assets/t-limpeza.webp', pos: '58%',
      what: 'Remoção de placa e tártaro, polimento e orientação de higiene.', who: 'Todas as idades, a cada 6 meses.', how: 'Consulta tranquila, sem dor, com explicação de cada etapa.', dur: '[40–60 min]' },
    { name: 'Clareamento', line: 'Dentes mais claros, com segurança e sem sensibilidade exagerada.', img: 'assets/t-clareamento.webp', pos: '50%',
      what: 'Clareamento supervisionado no consultório e/ou em casa com moldeiras.', who: 'Quem quer um sorriso mais claro e tem dentes e gengiva saudáveis.', how: 'Avaliação, proteção da gengiva e sessões com acompanhamento.', dur: '[2–4 semanas]' },
    { name: 'Lentes de contato dental', line: 'Forma, cor e harmonia planejadas para o seu rosto.', img: 'assets/t-lentes.webp', pos: '62%',
      what: 'Lâminas finas de cerâmica coladas na frente dos dentes.', who: 'Quem deseja corrigir forma, cor ou pequenos espaços.', how: 'Planejamento digital, prova do sorriso e cimentação.', dur: '[2–4 consultas]' },
    { name: 'Implantes', line: 'Um dente novo, firme e com aparência natural.', img: 'assets/t-implantes.webp', pos: '50%',
      what: 'Pino de titânio que substitui a raiz e recebe uma coroa.', who: 'Quem perdeu um ou mais dentes.', how: 'Exames, planejamento 3D, instalação e, após a cicatrização, a coroa.', dur: '[3–6 meses]' },
    { name: 'Ortodontia e alinhadores', line: 'Dentes alinhados com aparelho fixo ou transparente.', img: 'assets/t-ortodontia.webp', pos: '50%',
      what: 'Correção da posição dos dentes e da mordida.', who: 'Crianças, adolescentes e adultos.', how: 'Documentação, plano de movimentação e consultas de acompanhamento.', dur: '[12–24 meses]' },
    { name: 'Odontopediatria', line: 'A primeira experiência no dentista tem que ser boa.', img: 'assets/t-odontopediatria.webp', pos: '30%',
      what: 'Cuidado odontológico especializado para crianças.', who: 'Bebês, crianças e adolescentes.', how: 'Ambiente lúdico, linguagem simples e muita paciência.', dur: '[30–45 min]' },
    { name: 'Tratamento de canal', line: 'Alívio da dor, salvando o seu dente.', img: 'assets/t-canal.webp', pos: '22%',
      what: 'Limpeza e selamento da parte interna do dente.', who: 'Quem tem inflamação ou infecção na polpa do dente.', how: 'Anestesia, tratamento com instrumentos de precisão e restauração.', dur: '[1–3 sessões]' },
    { name: 'Ambiente acolhedor', line: 'Um consultório calmo, claro e pensado para você relaxar.', img: 'assets/t-ambiente.webp', pos: '45%',
      what: 'Estrutura moderna, iluminação natural e equipamentos atualizados.', who: 'Todos os pacientes — principalmente quem tem receio de dentista.', how: 'Atendimento sem pressa, com cada etapa explicada antes de começar.', dur: '[Agende uma visita]' },
  ];

  const ANNOTS = {
    personalizado: [['Plano sob medida', 'Feito para você'], ['Encaixe personalizado', 'Acabamento natural']],
    confiavel:     [['Materiais certificados', 'Procedência garantida'], ['Acompanhamento', 'Revisões periódicas']],
    confortavel:   [['Anestesia sem dor', 'Ambiente calmo'], ['Sem pressa', 'Cada etapa explicada']],
    preciso:       [['Precisão digital', 'Tratamento avançado'], ['Planejamento 3D', 'Escaneamento intraoral']],
    seguro:        [['Biossegurança', 'Esterilização rigorosa'], ['Protocolos', 'Normas do CFO e da Anvisa']],
  };

  const GALLERY = [
    { tab: 'Lentes', slug: 'lentes', cap: 'Lentes de contato dental · 3 consultas' },
    { tab: 'Clareamento', slug: 'clareamento', cap: 'Clareamento supervisionado · 3 semanas' },
    { tab: 'Implantes', slug: 'implantes', cap: 'Implante unitário · 4 meses' },
    { tab: 'Ortodontia', slug: 'ortodontia', cap: 'Alinhadores transparentes · 14 meses' },
  ];

  // ---------- Utilidades ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  const mqReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => mqReduced.matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const waLink = msg => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg || WA_DEFAULT)}`;

  function tween(dur, onUpdate, ease = easeOutCubic) {
    let raf, cancelled = false;
    const p = new Promise(res => {
      const t0 = performance.now();
      const step = now => {
        if (cancelled) return res(false);
        const t = clamp((now - t0) / dur);
        onUpdate(ease(t));
        if (t < 1) raf = requestAnimationFrame(step); else res(true);
      };
      raf = requestAnimationFrame(step);
    });
    p.cancel = () => { cancelled = true; cancelAnimationFrame(raf); };
    return p;
  }

  mqReduced.addEventListener?.('change', () => html.classList.toggle('reduced', reduced()));

  // Imagens que falham (placeholders) somem e deixam o fundo em gradiente
  // (fotos com data-fallback tentam a imagem reserva antes)
  document.addEventListener('error', e => {
    const img = e.target;
    if (img.tagName !== 'IMG') return;
    if (img.dataset.fallback && img.src !== img.dataset.fallback) { img.src = img.dataset.fallback; return; }
    img.classList.add('is-broken');
  }, true);

  // ---------- WhatsApp em todos os CTAs ----------
  $$('[data-wa]').forEach(a => {
    a.href = waLink(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  const yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     Scroll suave (inércia no mouse/trackpad) + âncoras com easing
     ========================================================= */
  const scroller = (() => {
    let y = scrollY, target = scrollY, raf = null, anchorTween = null, locked = false;
    const max = () => document.documentElement.scrollHeight - innerHeight;

    const loop = () => {
      y += (target - y) * 0.1;
      if (Math.abs(target - y) < 0.4) { y = target; raf = null; }
      else raf = requestAnimationFrame(loop);
      window.scrollTo(0, y);
    };

    const enabled = () => finePointer && !reduced() && !locked;

    addEventListener('wheel', e => {
      if (!enabled() || e.ctrlKey || e.defaultPrevented) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.target.closest?.('dialog, [data-native-scroll]')) return;
      e.preventDefault();
      anchorTween?.cancel(); anchorTween = null;
      if (!raf) { y = scrollY; target = scrollY; }
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1;
      target = clamp(target + e.deltaY * unit, 0, max());
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: false });

    // teclado, barra de rolagem, toque: sincroniza o alvo
    addEventListener('scroll', () => { if (!raf && !anchorTween) { y = target = scrollY; } }, { passive: true });

    function to(dest, { focus } = {}) {
      const top = typeof dest === 'number' ? dest : dest.getBoundingClientRect().top + scrollY - (dest.id === 'topo' ? scrollY : 76);
      const end = clamp(top, 0, max());
      if (reduced()) { window.scrollTo(0, end); }
      else {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        anchorTween?.cancel();
        const start = scrollY, dist = end - start;
        const dur = clamp(500 + Math.abs(dist) * 0.25, 600, 1400);
        anchorTween = tween(dur, t => window.scrollTo(0, start + dist * t), easeInOutCubic);
        anchorTween.then(() => { anchorTween = null; y = target = scrollY; });
      }
      if (focus && dest.focus) {
        if (!dest.hasAttribute('tabindex')) dest.setAttribute('tabindex', '-1');
        dest.focus({ preventScroll: true });
      }
    }
    return { to, lock(v) { locked = v; } };
  })();

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    scroller.to(el, { focus: true });
    history.pushState(null, '', '#' + id);
  });

  /* =========================================================
     Reveals ao entrar na tela
     ========================================================= */
  // índices de stagger
  $$('[data-stagger]').forEach(g => $$('[data-reveal]', g).forEach((el, i) => { if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', i); }));
  $$('[data-split]').forEach(s => $$('.line', s).forEach((l, i) => l.style.setProperty('--li', i)));
  $$('.chip').forEach((c, i) => c.style.setProperty('--i', i));
  $$('.menu__links a').forEach((a, i) => a.style.setProperty('--i', i));

  // linhas desenhadas: comprimento normalizado
  $$('.annot-line path, [data-draw] path').forEach(p => { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1'; });
  $$('.annot-line path, [data-draw] path').forEach(p => p.style.removeProperty('stroke-dashoffset'));

  const revealTargets = $$('[data-reveal], [data-split]:not(.hero__title), [data-draw], [data-carousel], [data-count]');
  const onReveal = el => {
    el.classList.add('is-in');
    if (el.hasAttribute('data-count')) countUp(el);
  };
  if ('IntersectionObserver' in window && !reduced()) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { onReveal(en.target); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-in'));
  }

  // ---------- Contagem animada ----------
  function countUp(el) {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const suf = el.dataset.suffix || '';
    const fmt = v => v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (reduced()) { el.textContent = fmt(end); return; }
    el.textContent = fmt(0);
    tween(1200, t => { el.textContent = fmt(end * t); }, easeOutCubic);
  }

  /* =========================================================
     Intro → hero
     ========================================================= */
  const intro = $('.intro');
  const heroTitle = $('.hero__title');
  const t0 = performance.now();

  async function start() {
    let seen = false;
    try { seen = sessionStorage.getItem('intro-seen') === '1'; sessionStorage.setItem('intro-seen', '1'); } catch (_) {}

    if (reduced()) { intro?.remove(); ready(); return; }
    if (seen) { intro?.classList.add('is-skipped'); await wait(40); ready(); return; }

    // espera as fontes (com teto) e um tempo mínimo para o traço do dente
    await Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(900)]);
    await wait(Math.max(0, 1250 - (performance.now() - t0)));
    intro.classList.add('is-out');
    await wait(260);
    ready();
    setTimeout(() => intro.remove(), 1000);
  }

  function ready() {
    html.classList.add('is-ready');
    heroTitle.classList.add('is-in');
    if (reduced()) {
      $$('.annot-line').forEach(l => l.classList.add('is-drawn'));
      $$('.annot').forEach(a => a.classList.add('is-in'));
      return;
    }
    // linhas de anotação se desenham uma após a outra
    const lines = $$('.annot-line'), notes = $$('.annot');
    lines.forEach((l, i) => setTimeout(() => {
      l.classList.add('is-drawn');
      setTimeout(() => notes[i]?.classList.add('is-in'), 520);
    }, 1350 + i * 750));
  }

  /* =========================================================
     Hero: chips trocam as anotações
     ========================================================= */
  const annotEls = $$('[data-annot]');
  const lineEls = $$('[data-annot-line]');
  let swapTimer;
  $$('[data-chip]').forEach(chip => chip.addEventListener('click', () => {
    if (chip.classList.contains('is-active')) return;
    $$('[data-chip]').forEach(c => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', c === chip); });
    const data = ANNOTS[chip.dataset.chip];
    clearTimeout(swapTimer);
    annotEls.forEach(a => a.classList.add('is-swapping'));
    swapTimer = setTimeout(() => {
      annotEls.forEach((a, i) => {
        $('.annot__t', a).textContent = data[i][0];
        $('.annot__s', a).textContent = data[i][1];
        a.classList.remove('is-swapping');
      });
    }, reduced() ? 0 : 320);
    if (!reduced()) {
      lineEls.forEach((l, i) => {
        l.classList.remove('is-drawn');
        void l.getBoundingClientRect();
        setTimeout(() => l.classList.add('is-drawn'), 60 + i * 140);
      });
      tilt.kick(chip.offsetLeft > 100 ? -2.5 : 2.5);
    }
  }));

  /* =========================================================
     Hero: implante reage ao mouse (mola)
     ========================================================= */
  const tilt = (() => {
    const el = $('[data-tilt]');
    const card = $('[data-hero-card]');
    const MAX = 6;
    let rx = 0, ry = 0, vx = 0, vy = 0, tx = 0, ty = 0, raf = null;
    const K = 0.045, DAMP = 0.84;
    const step = () => {
      vx = (vx + (tx - rx) * K) * DAMP;
      vy = (vy + (ty - ry) * K) * DAMP;
      rx += vx; ry += vy;
      el.style.setProperty('--rx', rx.toFixed(3) + 'deg');
      el.style.setProperty('--ry', ry.toFixed(3) + 'deg');
      if (Math.abs(tx - rx) + Math.abs(ty - ry) + Math.abs(vx) + Math.abs(vy) > 0.01) raf = requestAnimationFrame(step);
      else raf = null;
    };
    const run = () => { if (!raf) raf = requestAnimationFrame(step); };
    if (el && card && finePointer) {
      card.addEventListener('pointermove', e => {
        if (reduced() || innerWidth < 1024) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        ty = px * MAX * 2 * .9;   // rotateY
        tx = -py * MAX * 2 * .7;  // rotateX
        tx = clamp(tx, -MAX, MAX); ty = clamp(ty, -MAX, MAX);
        run();
      });
      card.addEventListener('pointerleave', () => { tx = 0; ty = 0; run(); }); // volta em mola
    }
    return { kick(v) { if (!el || reduced()) return; vy += v; run(); } };
  })();

  /* =========================================================
     Loop de scroll: header, progresso, hero, jornada, scrollspy
     ========================================================= */
  const header = $('[data-header]');
  const progress = $('.progress span');
  const heroCard = $('[data-hero-card]');
  const waFloat = $('.wa-float');
  const journey = $('[data-journey]');
  const journeyBg = $('.journey__bg');
  const steps = $('.steps');
  const rail = $('[data-rail]');
  const stepEls = $$('.step');
  const nav = $('.nav');
  const navLinks = $$('.nav a');
  const indicator = $('.nav__indicator');
  const sections = navLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  let current = null, ticking = false;

  function moveIndicator(a) {
    if (!a) { nav.classList.remove('has-current'); return; }
    indicator.style.setProperty('--x', a.offsetLeft + 'px');
    indicator.style.setProperty('--w', a.offsetWidth + 'px');
  }

  function update() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    const docH = document.documentElement.scrollHeight - vh;
    progress.style.setProperty('--p', docH > 0 ? (y / docH).toFixed(4) : 0);
    header.classList.toggle('is-scrolled', y > 40);

    const heroH = heroCard.offsetHeight;
    if (!reduced()) heroCard.style.setProperty('--hp', clamp(y / heroH).toFixed(4));
    waFloat.classList.toggle('is-visible', y > heroH * .7);

    if (!reduced()) {
      const jr = journey.getBoundingClientRect();
      journeyBg.style.setProperty('--jp', clamp((vh - jr.top) / (vh * .75)).toFixed(4));

      const sr = steps.getBoundingClientRect();
      const vertical = innerWidth <= 640;
      const rp = clamp((vh * .8 - sr.top) / (sr.height + vh * .2));
      rail.parentElement.style.setProperty('--rp', rp.toFixed(4));
      rail.style.setProperty('--rp', rp.toFixed(4));
      stepEls.forEach(s => {
        const r = s.getBoundingClientRect();
        const pos = vertical ? (r.top - sr.top) / sr.height : (r.left - sr.left) / sr.width;
        s.classList.toggle('is-lit', rp > pos + .02);
      });
    } else stepEls.forEach(s => s.classList.add('is-lit'));

    // scrollspy
    let found = null;
    for (const sec of sections) {
      const r = sec.getBoundingClientRect();
      if (r.top < vh * .4 && r.bottom > vh * .4) found = sec;
    }
    if (found !== current) {
      current = found;
      navLinks.forEach(a => a.classList.toggle('is-current', found && a.getAttribute('href') === '#' + found.id));
      const link = navLinks.find(a => a.classList.contains('is-current'));
      nav.classList.toggle('has-current', !!link);
      if (!nav.matches(':hover')) moveIndicator(link);
    }
  }
  const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate);

  navLinks.forEach(a => a.addEventListener('mouseenter', () => moveIndicator(a)));
  nav.addEventListener('mouseleave', () => moveIndicator(navLinks.find(a => a.classList.contains('is-current'))));

  /* =========================================================
     Menu mobile
     ========================================================= */
  const burger = $('.burger');
  const menu = $('#menu');
  menu.hidden = false;
  function openMenu() {
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    html.style.overflow = 'hidden';
    scroller.lock(true);
    setTimeout(() => $('.menu__links a')?.focus({ preventScroll: true }), 300);
  }
  function closeMenu() {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    html.style.overflow = '';
    scroller.lock(false);
  }
  burger.addEventListener('click', () => (menu.classList.contains('is-open') ? closeMenu() : openMenu()));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); burger.focus(); } });

  /* =========================================================
     Marquee pausável
     ========================================================= */
  const marquee = $('[data-marquee]');
  const mToggle = $('[data-marquee-toggle]');
  mToggle?.addEventListener('click', () => {
    const paused = marquee.classList.toggle('is-paused');
    mToggle.setAttribute('aria-label', paused ? 'Retomar faixa' : 'Pausar faixa');
    $('use', mToggle).setAttribute('href', paused ? '#i-play' : '#i-pause');
  });

  /* =========================================================
     Carrossel de tratamentos
     ========================================================= */
  const track = $('[data-car-track]');
  const carousel = $('[data-carousel]');
  const pad = n => String(n).padStart(2, '0');
  TREATMENTS.forEach((t, i) => {
    const li = document.createElement('li');
    li.style.setProperty('--i', i);
    li.setAttribute('aria-roledescription', 'slide');
    li.setAttribute('aria-label', `${i + 1} de ${TREATMENTS.length}`);
    li.innerHTML = `
      <button type="button" class="tcard" data-index="${i}" aria-haspopup="dialog">
        <img src="${t.img}" alt="" width="1024" height="572" style="object-position:${t.pos} 50%" loading="lazy" decoding="async" draggable="false">
        <span class="tcard__body">
          <span>
            <span class="tcard__name">${t.name}</span>
            <span class="tcard__desc"><span>${t.line}</span></span>
          </span>
          <span class="tcard__arrow" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span>
        </span>
      </button>`;
    track.appendChild(li);
  });
  $('[data-car-total]').textContent = pad(TREATMENTS.length);
  const curEl = $('[data-car-cur]');
  const prevBtn = $('[data-car-prev]');
  const nextBtn = $('[data-car-next]');
  const stepW = () => { const li = track.children[0]; return li ? li.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 16) : 300; };
  const carIndex = () => Math.round(track.scrollLeft / stepW());
  function carUpdate() {
    const i = carIndex();
    curEl.textContent = pad(Math.min(TREATMENTS.length, i + 1));
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  }
  const carGo = dir => track.scrollBy({ left: dir * stepW(), behavior: reduced() ? 'auto' : 'smooth' });
  prevBtn.addEventListener('click', () => carGo(-1));
  nextBtn.addEventListener('click', () => carGo(1));
  track.addEventListener('scroll', () => requestAnimationFrame(carUpdate), { passive: true });
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); carGo(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); carGo(-1); }
  });
  carUpdate();

  // arrastar com o mouse (o toque usa o swipe nativo + scroll-snap)
  let drag = null, dragged = false;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, id: e.pointerId };
    dragged = false;
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!dragged && Math.abs(dx) > 6) { dragged = true; track.classList.add('is-dragging'); }
    if (dragged) track.scrollLeft = drag.left - dx;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    drag = null;
    if (dragged) {
      // solta e deixa o snap assentar suavemente no card mais próximo
      const target = carIndex() * stepW();
      track.classList.remove('is-dragging');
      track.scrollTo({ left: target, behavior: reduced() ? 'auto' : 'smooth' });
      setTimeout(() => { dragged = false; }, 0);
    }
  });
  track.addEventListener('click', e => {
    if (dragged) { e.preventDefault(); e.stopPropagation(); return; }
    const card = e.target.closest('.tcard');
    if (card) openModal(+card.dataset.index, card);
  }, true);

  /* =========================================================
     Modal do tratamento — a foto do card "voa" até o modal
     (View Transitions API; fallback com animação CSS)
     ========================================================= */
  const dialog = $('[data-modal]');
  const mImg = $('[data-m-img]');
  let openerCard = null;

  async function openModal(i, card) {
    const t = TREATMENTS[i];
    openerCard = card;
    $('[data-m-title]').textContent = t.name;
    $('[data-m-what]').textContent = t.what;
    $('[data-m-who]').textContent = t.who;
    $('[data-m-how]').textContent = t.how;
    $('[data-m-dur]').textContent = t.dur;
    const cta = $('[data-m-cta]');
    cta.href = waLink(`Olá! Gostaria de agendar uma avaliação para ${t.name}.`);
    cta.target = '_blank'; cta.rel = 'noopener';
    mImg.classList.remove('is-broken');
    mImg.alt = `Ilustração do tratamento: ${t.name}`;
    mImg.src = t.img;

    const cardImg = $('img', card);
    const show = () => { dialog.showModal(); html.classList.add('modal-open'); scroller.lock(true); };
    const canVT = document.startViewTransition && !reduced() && !cardImg.classList.contains('is-broken');
    if (!canVT) { show(); return; }
    try { await mImg.decode(); } catch (_) { show(); return; }
    cardImg.style.viewTransitionName = 'treat-img';
    dialog.classList.add('no-anim');
    const vt = document.startViewTransition(() => {
      cardImg.style.viewTransitionName = '';
      mImg.style.viewTransitionName = 'treat-img';
      show();
    });
    vt.finished.finally(() => { mImg.style.viewTransitionName = ''; dialog.classList.remove('no-anim'); });
  }

  function closeModal() {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    const done = () => {
      dialog.close();
      dialog.classList.remove('is-closing');
      html.classList.remove('modal-open');
      scroller.lock(false);
    };
    const cardImg = openerCard && $('img', openerCard);
    const r = openerCard?.getBoundingClientRect();
    const cardVisible = r && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
    if (document.startViewTransition && !reduced() && cardImg && cardVisible && !cardImg.classList.contains('is-broken') && !mImg.classList.contains('is-broken')) {
      mImg.style.viewTransitionName = 'treat-img';
      dialog.classList.add('no-anim');
      const vt = document.startViewTransition(() => {
        mImg.style.viewTransitionName = '';
        cardImg.style.viewTransitionName = 'treat-img';
        done();
      });
      vt.finished.finally(() => { cardImg.style.viewTransitionName = ''; dialog.classList.remove('no-anim'); });
    } else if (!reduced()) {
      dialog.classList.add('is-closing');
      dialog.addEventListener('animationend', done, { once: true });
    } else done();
  }
  dialog.addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) closeModal(); });
  $('[data-modal-close]').addEventListener('click', closeModal);

  /* =========================================================
     Antes / depois
     ========================================================= */
  const ba = $('[data-ba]');
  const range = $('.ba__range', ba);
  const baReveal = $('[data-ba-reveal]', ba);
  const baRevealIn = $('[data-ba-reveal-in]', ba);
  const baHandle = $('[data-ba-handle]', ba);
  let baTween = null, baHinted = false, pos = 50, dragging = false, baW = 0;

  // aplica a posição direto nos elementos (sem variável CSS)
  function setPos(v) {
    pos = clamp(v, 0, 100);
    baReveal.style.transform = `translate3d(${pos}%, 0, 0)`;
    baRevealIn.style.transform = `translate3d(${-pos}%, 0, 0)`;
    baHandle.style.transform = `translate3d(${(pos / 100) * (baW || ba.offsetWidth)}px, 0, 0)`;
    range.value = Math.round(pos);
    range.setAttribute('aria-valuetext', `${Math.round(pos)}%`);
    ba.classList.toggle('hide-l', pos < 14);
    ba.classList.toggle('hide-r', pos > 86);
  }
  const measure = () => { baW = ba.offsetWidth; setPos(pos); };
  addEventListener('resize', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(ba);
  const posFromX = x => { const r = ba.getBoundingClientRect(); return ((x - r.left) / r.width) * 100; };
  const startDrag = x => { baTween?.cancel(); dragging = true; baW = ba.offsetWidth; ba.classList.add('is-active', 'was-used'); setPos(posFromX(x)); };
  const moveDrag = x => { if (dragging) setPos(posFromX(x)); };
  const endDrag = () => { dragging = false; ba.classList.remove('is-active'); };

  if (window.PointerEvent) {
    let pid = null;
    ba.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pid = e.pointerId;
      try { ba.setPointerCapture(pid); } catch (_) {}
      startDrag(e.clientX);
    });
    ba.addEventListener('pointermove', e => { if (e.pointerId === pid) moveDrag(e.clientX); });
    const up = e => { if (e.pointerId === pid) { pid = null; endDrag(); } };
    ba.addEventListener('pointerup', up);
    ba.addEventListener('pointercancel', up);
    ba.addEventListener('lostpointercapture', up);
  } else {
    // iPhones antigos (sem Pointer Events)
    ba.addEventListener('touchstart', e => startDrag(e.touches[0].clientX), { passive: true });
    ba.addEventListener('touchmove', e => moveDrag(e.touches[0].clientX), { passive: true });
    ba.addEventListener('touchend', endDrag);
    ba.addEventListener('mousedown', e => { startDrag(e.clientX); const mm = ev => moveDrag(ev.clientX); const mu = () => { endDrag(); removeEventListener('mousemove', mm); removeEventListener('mouseup', mu); }; addEventListener('mousemove', mm); addEventListener('mouseup', mu); });
  }
  ba.addEventListener('dragstart', e => e.preventDefault());
  // teclado: o input range (invisível) recebe o foco
  range.addEventListener('input', () => { baTween?.cancel(); ba.classList.add('was-used'); setPos(+range.value); });
  range.addEventListener('focus', () => ba.classList.add('is-focus'));
  range.addEventListener('blur', () => ba.classList.remove('is-focus'));
  ba.addEventListener('click', () => { if (!matchMedia('(pointer: coarse)').matches) range.focus({ preventScroll: true }); });
  measure();

  function animatePos(to, dur = 700) {
    baTween?.cancel();
    if (reduced()) { setPos(to); return Promise.resolve(true); }
    const from = pos;
    baTween = tween(dur, t => setPos(from + (to - from) * t), easeInOutCubic);
    return baTween;
  }
  // dica de interação: o divisor "respira" uma vez ao aparecer + pré-carrega as fotos das abas
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(async ([en]) => {
      if (!en.isIntersecting || baHinted) return;
      baHinted = true; io.disconnect();
      GALLERY.forEach(g => ['antes', 'depois'].forEach(s => { new Image().src = `assets/ba-${g.slug}-${s}.webp`; }));
      if (reduced()) return;
      await wait(900);
      if (dragging || ba.classList.contains('was-used')) return;
      if (await animatePos(64, 900)) if (await animatePos(38, 1000)) animatePos(50, 800);
    }, { threshold: .5 });
    io.observe(ba);
  }

  const tabs = $$('[role="tab"]');
  const ink = $('.tabs__ink');
  const cap = $('[data-ba-cap]');
  function moveInk(btn) { ink.style.setProperty('--x', btn.offsetLeft + 'px'); ink.style.setProperty('--w', btn.offsetWidth + 'px'); }
  function selectTab(i, focus) {
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i); t.tabIndex = j === i ? 0 : -1; });
    if (focus) tabs[i].focus();
    moveInk(tabs[i]);
    const g = GALLERY[i];
    ba.classList.add('is-swapping'); cap.classList.add('is-swapping');
    setTimeout(() => {
      cap.textContent = g.cap;
      const before = $('[data-ba-img-before]'), after = $('[data-ba-img-after]');
      [before, after].forEach(img => img.classList.remove('is-broken'));
      before.src = `assets/ba-${g.slug}-antes.webp`;
      after.src = `assets/ba-${g.slug}-depois.webp`;
      before.alt = `Antes — ${g.tab.toLowerCase()}`;
      after.alt = `Depois — ${g.tab.toLowerCase()}`;
      ba.classList.remove('is-swapping'); cap.classList.remove('is-swapping');
    }, reduced() ? 0 : 320);
    animatePos(50, 600);
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(i));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') selectTab((i + 1) % tabs.length, true);
      if (e.key === 'ArrowLeft') selectTab((i - 1 + tabs.length) % tabs.length, true);
    });
  });
  const placeInk = () => moveInk(tabs.find(t => t.getAttribute('aria-selected') === 'true'));
  addEventListener('resize', placeInk);
  document.fonts?.ready.then(placeInk); placeInk();

  /* =========================================================
     Depoimentos — faixa contínua (adaptado do "Testimonials 13", 21st.dev)
     ========================================================= */
  const face = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=faces&w=160&h=160&q=70`;
  const TESTIMONIALS = [
    { name: 'Ana Souza', treat: 'Lentes de contato dental', img: 'photo-1494790108377-be9c29b29330',
      text: 'Eu tinha vergonha de sorrir em foto. A Dra. Helena planejou tudo comigo e o resultado ficou natural, do jeitinho que eu queria.' },
    { name: 'Rafael Lima', treat: 'Implante', img: 'photo-1507003211169-0a1dd7228f2d',
      text: 'Tinha pavor de implante e saí tranquilo. Explicaram cada etapa antes de começar e não senti dor nenhuma.' },
    { name: 'Juliana Costa', treat: 'Clareamento', img: 'photo-1438761681033-6461ffad8d80',
      text: 'Clareamento sem sensibilidade e com acompanhamento de perto. Atendimento pontual e muito carinhoso.' },
    { name: 'Marcos Oliveira', treat: 'Tratamento de canal', img: 'photo-1500648767791-00dcc994a43e',
      text: 'Cheguei com dor e fui atendido no mesmo dia. Canal feito com calma, sem aquele medo que eu tinha.' },
    { name: 'Patrícia Fernandes', treat: 'Odontopediatria', img: 'photo-1544005313-94ddf0286df2',
      text: 'Meu filho saiu da consulta pedindo para voltar. A Dra. Camila tem uma paciência incrível com criança.' },
    { name: 'Bruno Carvalho', treat: 'Alinhadores', img: 'photo-1506794778202-cad84cf45f1d',
      text: 'Os alinhadores mudaram meu sorriso sem ninguém perceber que eu estava usando. Recomendo de olhos fechados.' },
  ];
  const stars = '<svg><use href="#i-star"/></svg>'.repeat(5);
  const initials = n => n.split(' ').map(w => w[0]).slice(0, 2).join('');
  const tmItem = (t, i) => `
    <li class="tm-col">
      <figure class="tm-card">
        <figcaption class="tm-who">
          <span class="av av--lg"><b>${initials(t.name)}</b><img src="${face(t.img)}" alt="" width="48" height="48" loading="lazy" decoding="async"></span>
          <span><strong>${t.name}</strong><small>${t.treat}</small></span>
          <span class="tm-stars" aria-label="Nota 5 de 5">${stars}</span>
        </figcaption>
        <blockquote>“${t.text}”</blockquote>
      </figure>
      <div class="tm-tile" aria-hidden="true"><svg><use href="#i-tooth"/></svg><span>${t.treat}</span></div>
    </li>`;
  const tmTrack = $('[data-tm-track]');
  if (tmTrack) {
    const list = TESTIMONIALS.map(tmItem).join('');
    tmTrack.innerHTML = `<ul class="tm-list">${list}</ul><ul class="tm-list" aria-hidden="true">${list}</ul>`;
    const tm = $('[data-tm]');
    const tmToggle = $('[data-tm-toggle]');
    tmToggle?.addEventListener('click', () => {
      const paused = tm.classList.toggle('is-paused');
      tmToggle.setAttribute('aria-label', paused ? 'Retomar depoimentos' : 'Pausar depoimentos');
      $('use', tmToggle).setAttribute('href', paused ? '#i-play' : '#i-pause');
    });
  }

  /* =========================================================
     FAQ (acordeão)
     ========================================================= */
  $$('.acc__item').forEach((item, i) => {
    const btn = $('button', item);
    const panel = $('.acc__panel', item);
    panel.id = 'faq-' + i;
    panel.setAttribute('role', 'region');
    btn.id = 'faq-b-' + i;
    panel.setAttribute('aria-labelledby', btn.id);
    btn.setAttribute('aria-controls', panel.id);
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open);
    });
  });

  /* =========================================================
     Formulário
     ========================================================= */
  const form = $('[data-form]');
  const tel = $('#f-tel');
  tel.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 11);
    let v = d;
    if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    tel.value = v;
  });
  const rules = {
    nome: v => v.trim().length >= 2 || 'Informe seu nome.',
    tel: v => v.replace(/\D/g, '').length >= 10 || 'Informe um telefone com DDD.',
    trat: v => !!v || 'Escolha um tratamento.',
  };
  let tried = false;
  function validate() {
    let firstBad = null;
    for (const [name, rule] of Object.entries(rules)) {
      const el = form.elements[name];
      const r = rule(el.value);
      const field = el.closest('.field');
      const err = $('.field__err', field);
      const bad = r !== true;
      field.classList.toggle('has-error', bad);
      el.setAttribute('aria-invalid', bad);
      err.textContent = bad ? r : '';
      if (bad && !firstBad) firstBad = el;
    }
    const lg = form.elements.lgpd;
    const lgField = lg.closest('.field');
    lgField.classList.toggle('has-error', !lg.checked);
    $('.field__err', lgField).textContent = lg.checked ? '' : 'É preciso concordar para entrarmos em contato.';
    if (!lg.checked && !firstBad) firstBad = lg;
    return firstBad;
  }
  form.addEventListener('input', () => { if (tried) validate(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    tried = true;
    const bad = validate();
    const ok = $('.form__ok', form);
    if (bad) {
      bad.focus();
      if (!reduced()) { form.classList.remove('is-shake'); void form.offsetWidth; form.classList.add('is-shake'); }
      ok.textContent = '';
      return;
    }
    const f = form.elements;
    const msg = `Olá! Meu nome é ${f.nome.value.trim()}. Gostaria de agendar: ${f.trat.value}. Melhor período: ${f.periodo.value}. Telefone: ${f.tel.value}.`;
    ok.textContent = 'Pedido pronto! Abrindo o WhatsApp para confirmar o horário…';
    window.open(waLink(msg), '_blank', 'noopener');
  });

  /* =========================================================
     Mapa (lazy)
     ========================================================= */
  const map = $('[data-map]');
  function loadMap() {
    if (!map || $('iframe', map)) return;
    const f = document.createElement('iframe');
    f.title = 'Mapa com a localização da clínica';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('[ENDEREÇO COMPLETO DA CLÍNICA]') + '&output=embed';
    f.addEventListener('load', () => { f.classList.add('is-loaded'); $('[data-map-load]', map)?.remove(); });
    map.appendChild(f);
  }
  $('[data-map-load]')?.addEventListener('click', loadMap);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { loadMap(); io.disconnect(); } }, { rootMargin: '300px' });
    map && io.observe(map);
  }

  // ---------- Go ----------
  update();
  start();
})();
