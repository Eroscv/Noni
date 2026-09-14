// NONI — protótipo HTML. Interações mínimas só para o protótipo ficar navegável;
// em Liquid, size/color viram um variant picker de verdade (troca de imagem, preço, disponibilidade).

document.addEventListener('click', function (e) {
  // Accordion (Detalhes / Entrega e trocas)
  const accBtn = e.target.closest('.accordion-item > button');
  if (accBtn) {
    const item = accBtn.closest('.accordion-item');
    const aberto = item.getAttribute('data-aberto') === 'true';
    item.setAttribute('data-aberto', aberto ? 'false' : 'true');
    accBtn.setAttribute('aria-expanded', String(!aberto));
  }

  // Seleção de tamanho
  const tamBtn = e.target.closest('.tamanho-btn:not(:disabled)');
  if (tamBtn) {
    tamBtn.parentElement.querySelectorAll('.tamanho-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
    tamBtn.setAttribute('aria-pressed', 'true');
    const cta = document.querySelector('[data-cta-principal]');
    if (cta) cta.textContent = 'Adicionar à sacola';
    if (cta) cta.removeAttribute('aria-disabled');
  }

  // Seleção de cor (swatch)
  const swatchBtn = e.target.closest('.swatch');
  if (swatchBtn) {
    swatchBtn.parentElement.querySelectorAll('.swatch').forEach(b => b.setAttribute('aria-pressed', 'false'));
    swatchBtn.setAttribute('aria-pressed', 'true');
    const nomeCor = swatchBtn.getAttribute('data-nome-cor');
    const alvo = document.querySelector('[data-cor-selecionada]');
    if (alvo && nomeCor) alvo.textContent = nomeCor;
  }

  // Sacola: passo de quantidade (visual apenas — cálculo real vem do carrinho do Shopify)
  const stepperBtn = e.target.closest('.qtd-stepper button');
  if (stepperBtn) {
    const span = stepperBtn.parentElement.querySelector('span');
    let val = parseInt(span.textContent, 10) || 1;
    val = stepperBtn.textContent.trim() === '−' ? Math.max(1, val - 1) : val + 1;
    span.textContent = val;
  }

  // Sacola: remover item (some a linha do exemplo)
  const removerBtn = e.target.closest('.remover');
  if (removerBtn) {
    removerBtn.closest('.carrinho-item').remove();
  }

  // Menu mobile — abrir
  const menuBtn = e.target.closest('.menu-mobile-btn');
  if (menuBtn) {
    abrirFecharMenu(true);
  }

  // Menu mobile — fechar (botão X ou clique num link do próprio menu)
  const fecharBtn = e.target.closest('.fechar-menu:not(#fechar-filtros)');
  const linkDoMenu = e.target.closest('.nav-mobile a');
  if (fecharBtn || linkDoMenu) {
    abrirFecharMenu(false);
  }

  // Filtro de cor (independente por botão — pode marcar mais de uma cor, diferente do swatch da PDP)
  const filtroCor = e.target.closest('.filtro-cor');
  if (filtroCor) {
    const pressionado = filtroCor.getAttribute('aria-pressed') === 'true';
    filtroCor.setAttribute('aria-pressed', String(!pressionado));
  }

  // Painel de filtros e ordenar — abrir
  if (e.target.closest('#abrir-filtros')) {
    abrirFecharFiltros(true);
  }
  // Painel de filtros e ordenar — fechar (X, fundo escurecido, ou "Ver resultados")
  if (e.target.closest('#fechar-filtros') || e.target.closest('#filtros-backdrop') || e.target.closest('#aplicar-filtros')) {
    abrirFecharFiltros(false);
  }
  // Limpar filtros — volta pro estado inicial (Destaques + nenhuma cor marcada)
  if (e.target.closest('#limpar-filtros')) {
    const drawer = document.getElementById('filtros-drawer');
    if (drawer) {
      const primeiraOrdenacao = drawer.querySelector('input[name="ordenar"]');
      if (primeiraOrdenacao) primeiraOrdenacao.checked = true;
      drawer.querySelectorAll('.filtro-cor').forEach(b => b.setAttribute('aria-pressed', 'false'));
    }
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  if (document.body.classList.contains('menu-aberto')) abrirFecharMenu(false);
  if (document.body.classList.contains('filtros-abertos')) abrirFecharFiltros(false);
});

function abrirFecharMenu(abrir) {
  document.body.classList.toggle('menu-aberto', abrir);
  const btn = document.querySelector('.menu-mobile-btn');
  const nav = document.querySelector('.nav-mobile');
  if (btn) btn.setAttribute('aria-expanded', String(abrir));
  if (nav) nav.setAttribute('aria-hidden', String(!abrir));
}

function abrirFecharFiltros(abrir) {
  document.body.classList.toggle('filtros-abertos', abrir);
  const btn = document.getElementById('abrir-filtros');
  const drawer = document.getElementById('filtros-drawer');
  if (btn) btn.setAttribute('aria-expanded', String(abrir));
  if (drawer) drawer.setAttribute('aria-hidden', String(!abrir));
}
