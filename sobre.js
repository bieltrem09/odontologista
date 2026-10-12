/* =========================================================
   OdontoClinic — página "Sobre nós"
   Stacking Cards, Bento Grid, Reading Text Reveal (ideias do 21st.dev)
   ========================================================= */
(() => {
  'use strict';
  const WA_NUMBER = '5511900000000'; // FICTÍCIO — o mesmo do main.js
  const WA_DEFAULT = 'Olá! Vim pela página Sobre nós e gostaria de agendar uma avaliação.';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // fotos que falham somem e deixam o fundo
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.classList.add('is-broken'); }, true);

  // WhatsApp e ano
  $$('[data-wa]').forEach(a => {
    a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(a.dataset.wa || WA_DEFAULT)}`;
    a.target = '_blank'; a.rel = 'noopener';
  });
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // índices de stagger
  $$('[data-stagger]').forEach(g => $$('[data-reveal]', g).forEach((el, i) => el.style.setProperty('--d', i)));
  $$('[data-split]').forEach(s => $$('.line', s).forEach((l, i) => l.style.setProperty('--li', i)));
  $$('.menu__links a').forEach((a, i) => a.style.setProperty('--i', i));

  // libera header e elementos do topo
  requestAnimationFrame(() => html.classList.add('is-ready'));

  // ---------- Contagem ----------
  function countUp(el) {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const suf = el.dataset.suffix || '';
    const fmt = v => v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: !('nogroup' in el.dataset) }) + suf;
    if (reduced()) { el.textContent = fmt(end); return; }
    const start = 'nogroup' in el.dataset ? Math.round(end * .97) : 0;   // 1997 conta a partir de ~1937
    const t0 = performance.now(), dur = 1400;
    const step = now => {
      const t = clamp((now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(start + (end - start) * e);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ---------- Revelar ao entrar na tela ----------
  const targets = $$('[data-reveal], [data-split], [data-count], .scard');
  if ('IntersectionObserver' in window && !reduced()) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      if (en.target.hasAttribute('data-count')) countUp(en.target);
      io.unobserve(en.target);
    }), { rootMargin: '0px 0px -10% 0px' });
    targets.forEach(el => io.observe(el));
  } else targets.forEach(el => el.classList.add('is-in'));

  // ---------- Reading Text Reveal ----------
  const readEl = $('[data-read]');
  let words = [];
  if (readEl) {
    const wrap = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(p)); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = p; f.appendChild(s);
        });
        n.replaceWith(f);
      } else if (n.nodeType === 1) wrap(n);
    });
    wrap(readEl);
    words = $$('.w', readEl);
  }

  // ---------- Header, progresso, leitura, cartões empilhados, parallax ----------
  const header = $('[data-header]');
  const progress = $('.progress span');
  const cards = $$('.scard');
  const para = $$('[data-parallax]');
  let ticking = false;

  function update() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    const docH = document.documentElement.scrollHeight - vh;
    progress.style.setProperty('--p', docH > 0 ? (y / docH).toFixed(4) : 0);
    header.classList.toggle('is-scrolled', y > 40);
    if (reduced()) return;

    if (readEl) {
      const r = readEl.getBoundingClientRect();
      const p = clamp((vh * .85 - r.top) / (r.height + vh * .45));
      words.forEach((w, i) => w.style.setProperty('--o', (.16 + clamp(p * (words.length + 4) - i, 0, 1) * .84).toFixed(3)));
    }

    // Stacking Cards: cada cartão encolhe e escurece um pouco quando o próximo passa por cima
    const sticky = cards[0] && getComputedStyle(cards[0]).position === 'sticky';
    cards.forEach((card, i) => {
      if (!sticky) { card.style.transform = ''; card.style.filter = ''; return; }
      let shrink = 0;
      for (let k = i + 1; k < cards.length; k++) {
        const top = cards[k].getBoundingClientRect().top;
        const stickyTop = parseFloat(getComputedStyle(cards[k]).top) || 0;
        const h = card.offsetHeight || 1;
        shrink += clamp(1 - (top - stickyTop) / h);
      }
      card.style.transform = `scale(${(1 - shrink * .05).toFixed(4)})`;
      card.style.filter = shrink > .01 ? `brightness(${(1 - shrink * .08).toFixed(3)})` : '';
    });

    // Parallax da colagem
    para.forEach(el => {
      const r = el.getBoundingClientRect();
      const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
      el.style.translate = `0 ${off.toFixed(1)}px`;
    });
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  update();

  // ---------- Spotlight nos blocos do bento ----------
  if (finePointer) {
    $$('.bcard, .scard').forEach(el => {
      const light = document.createElement('span');
      light.className = 'spot-light' + (el.classList.contains('bcard--img') || el.classList.contains('bcard--brand') ? ' spot-light--light' : '');
      el.classList.add('spot-host');
      el.appendChild(light);
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        light.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        light.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // ---------- Indicador do menu ----------
  const nav = $('.nav'), ind = $('.nav__indicator');
  const navLinks = $$('.nav a');
  const move = a => { if (!a) return; ind.style.setProperty('--x', a.offsetLeft + 'px'); ind.style.setProperty('--w', a.offsetWidth + 'px'); };
  const current = $('.nav a[aria-current="page"]');
  if (current) { nav.classList.add('has-current'); move(current); document.fonts?.ready.then(() => move(current)); }
  navLinks.forEach(a => a.addEventListener('mouseenter', () => move(a)));
  nav.addEventListener('mouseleave', () => move(current));

  // ---------- Menu mobile ----------
  const burger = $('.burger'), menu = $('#menu');
  menu.hidden = false;
  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    html.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // ---------- Âncoras internas com rolagem suave ----------
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-wa')) return;
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
  });
})();
