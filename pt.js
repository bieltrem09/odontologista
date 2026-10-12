/* Transição entre páginas em "escada" (ideia do Page Transition, 21st.dev).
   Saída: colunas sobem e cobrem a tela → navega.
   Entrada: a página nasce coberta (classe pt-enter posta no <head>) e as colunas descem. */
(() => {
  'use strict';
  const html = document.documentElement;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // entrada
  if (html.classList.contains('pt-enter')) {
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.add('pt-go')));
    setTimeout(() => html.classList.remove('pt-enter', 'pt-go'), 1200);
  }

  // saída: links marcados com data-page (outra página do site)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-page]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.pathname === location.pathname) return;   // mesma página: deixa a âncora agir
    e.preventDefault();
    e.stopPropagation();
    if (reduced()) { location.href = url.href; return; }
    try { sessionStorage.setItem('pt', '1'); } catch (_) {}
    html.classList.add('pt-leave');
    setTimeout(() => { location.href = url.href; }, 720);
  }, true);

  // voltar pelo navegador (bfcache) não pode deixar a tela coberta
  addEventListener('pageshow', ev => { if (ev.persisted) html.classList.remove('pt-leave', 'pt-enter', 'pt-go'); });
})();
