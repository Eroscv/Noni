# Noni — Protótipo HTML (base para as seções Liquid)

Este protótipo é HTML/CSS/JS puro (sem framework, sem build), pensado para ser **traduzido página por página em seções/snippets Liquid** quando a loja Shopify existir — não é o entregável final, é a etapa "acertar o layout antes de portar pro tema".

## Melhorias visuais e de UX possíveis (lista, checada contra a skill de frontend design + ui-ux-pro-max)

Levantamento de ganhos no site inteiro, separado por quanto depende de material que ainda não chegou. Passei pelas duas skills — frontend design (crítica de estilo/composição) e ui-ux-pro-max (base de 119 diretrizes de UX/acessibilidade) — pra não ficar só na opinião.

**Feitas nesta rodada (achados reais, não só estética):**
- ~~Ícones reais em vez de glifo Unicode~~ — 6 ícones de linha em SVG inline (`currentColor`, sem depender de fonte do SO): menu, coração, usuário, sacola, fechar, balão de conversa.
- ~~Swatch de cor sem nome pra leitor de tela~~ — a consulta na base de UX apontou "ARIA Labels: interactive elements need accessible names, severidade alta". Os botões de cor tinham só `data-nome-cor` (não lido por leitor de tela) — cada um ganhou `aria-label="Cor Preto"` etc.
- ~~Ícone decorativo sendo lido 2x pelo leitor de tela~~ — os 7 SVGs agora levam `aria-hidden="true" focusable="false"`, já que o botão em volta já tem `aria-label`.

**Confirmado que já estava certo (a base de UX validou, não é só impressão minha):**
- Quick add não depende só de `:hover` — tem fallback de toque (`@media (hover:none)`), que é exatamente o padrão recomendado ("Hover vs Tap: don't rely only on hover for important actions").
- Todo bloco de foto usa `aspect-ratio` fixo — reserva espaço antes de carregar, evita o "Content Jumping" que a base marca como severidade alta.
- Breadcrumb só aparece em página com 3+ níveis (a home não tem, o carrinho não tem) — bate com a diretriz "breadcrumbs: use for sites with 3+ levels, don't use on flat pages".
- **A escolha de grayscale estrito + zero-radius não é o padrão que a base de produto sugere pra e-commerce** (ela indica "Vibrant & Block-based, brand primary + success green" como default) — segui o brief da própria cliente (documentos da Adanola) em vez do genérico da ferramenta, de propósito.

**Feitas nesta rodada:**
- ~~Foco de teclado mais claro~~ — anel preto de 2px (`:focus-visible`, só aparece navegando por teclado, não a cada clique de mouse), vira branco nos botões de fundo preto (CTA principal, quick add, botões flutuantes) senão o anel some contra o fundo. Testado via Tab de verdade, não só olhando.
- ~~Hover nos links~~ — menu principal e menu mobile ganharam sublinhado/opacidade ao passar o mouse; links de texto dentro de parágrafo (ex. "ver a tabela") ganharam um padrão único no CSS (sublinhado cinza sempre visível, escurece no hover) em vez de estilo inline espalhado por página — removi os 2 estilos inline redundantes que existiam.
- ~~Ícone do WhatsApp de verdade~~ — o botão flutuante usava um balão de chat genérico; trocado pelo glifo reconhecível do WhatsApp (telefone dentro do balão), ainda em preto/branco pra combinar com o grayscale do site, não o verde da marca.
- ~~Ícone do Instagram no rodapé~~ — o link "Instagram" era só texto; ganhou o ícone (câmera em quadrado arredondado) antes do texto.
- ~~Filtros/ordenar na coleção~~ — a barra "Filtrar por cor" fixa virou um botão "Filtros e ordenar" (ícone de sliders) que abre um painel lateral: ordenação por radio (Destaques/Mais recentes/Preço ↑/Preço ↓, comportamento nativo do browser, sem JS) + cor por botão independente (pode marcar mais de uma cor — diferente do swatch da PDP, que é 1 cor por vez). Fecha pelo X, clicando fora, ou Esc; "Limpar filtros" reseta os dois. Só em `colecao.html` por enquanto — se fizer sentido em `conjuntos.html` também, é pra pedir.
- ~~Logo vetorizada no header/rodapé~~ — recebida em 22/09 (3 PDFs). Extraí o monograma como SVG (`pdftocairo`, path vetorial de verdade, não rastreado à mão) e apliquei no header (ícone sozinho, compacto) e no rodapé (ícone + "NONI", replicando o lockup original). Ver `marca/`.

**Dá pra fazer agora, sem esperar nada da cliente:**
- **Feedback visual no quick add.** Hoje o botão "Adicionar rápido" não muda nada quando clicado — sem essa reação, dá pra clicar 2x achando que não funcionou. Um texto rápido tipo "Adicionado ✓" por 1-2s já resolve, mesmo sem carrinho real por trás.

**Melhor esperar o material da cliente (senão fica decoração vazia):**
- **Hero e cards com foto de verdade** — o maior salto visual do site inteiro é trocar os blocos de cor sólida pelas fotos do ensaio (28/09). Até lá, qualquer enfeite a mais nos placeholders é maquiagem em cima do problema errado. Quando as fotos entrarem (viram `<img>` de verdade), não esquecer alt text descritivo — hoje não existe o problema porque são `<div>` de cor, não imagem.
- **Galeria da PDP com miniaturas/indicadores** de foto (a Adanola usa setas ‹ › no carrossel) — só faz sentido com mais de 1 foto real por produto.
- **Tiles de "Conjuntos" com colagem de produtos** em vez de bloco de cor — mesma dependência de foto.
- **Paleta e tipografia de marca** — hoje uso Inter e os 4 HEX da planilha porque é o que existe; se a Simone trouxer fonte/paleta própria da marca, isso muda o token system inteiro (`estilo.css`, seção `:root`).

**Só quando a loja Shopify existir (não dá pra fazer num protótipo estático):**
- **Loading state no carrinho real** — hoje o "quick add" não é uma chamada de verdade; quando virar AJAX de Shopify, precisa de feedback de carregamento (`aria-busy`, sem piscar em ações instantâneas) pra não parecer travado.

## Como abrir

Precisa servir os arquivos por HTTP (não abrir o `.html` direto por `file://`, senão o CSS/JS relativo não carrega):

```bash
cd html && python3 -m http.server 4173
```

Depois abrir `http://localhost:4173/index.html`.

## O que existe

| Arquivo | Página | Baseado em |
|---|---|---|
| `index.html` | Home — hero, grade "Novidades" (8 produtos reais da Coleção 1), 4 conjuntos por cor | `navegacao/arquitetura-navegacao.md` |
| `colecao.html` | Listagem de categoria (exemplo: Tops, 5 produtos) — filtro por cor, grid com quick add | Padrão observado no benchmark (`benchmark/ficha-benchmark-adanola.md`) |
| `produto.html` | PDP (exemplo: Legging — o produto que junta 3 cores) — galeria, swatches, tamanho, accordions, "Complete o look" | Idem, + `catalogo/coleção-1-catalogo.xlsx` |
| `sobre.html` | Página de entrada para quem nunca comprou — o que é a coleção, 3 fatos rápidos, como navegar, antes de comprar | Item explícito do briefing ("página de entrada"); a Adanola não tem essa página separada (usa popup de desconto — ver ficha de benchmark), então esta é uma escolha própria da Noni, não uma cópia |
| `guia-de-tamanhos.html` | Tabela de medidas por tamanho (PP–G) + como medir — estrutura pronta, números pendentes | Referenciado a partir da PDP, como o briefing pede |
| `carrinho.html` | Sacola com 2 itens de exemplo, stepper de quantidade, remover item, resumo com subtotal | Fecha o loop do quick add/"ver o valor final" dentro do próprio site da Noni |
| `conjuntos.html` | As 4 coleções de conjuntos (Branco/Preto/Esmeralda/Mascavo) em uma página só, cada uma com suas peças reais | `navegacao/arquitetura-navegacao.md` — o link "Conjuntos" do menu (antes quebrado, apontava pra a listagem de Tops) agora leva aqui |
| `acessorios.html` | Linha separada da Coleção 1 — 6 produtos (garrafa, 2 modelos de boné em Tactel/Tecido + 2 variantes exclusivas em Veludo cotelê, home fragrance), estoque real de 143 unidades | `catalogo/acessorios-catalogo.xlsx` (planilha recebida em 22/09) |
| `trocas-e-devolucoes.html` | Estrutura da política (prazo, como solicitar, condição da peça, reembolso) — cada seção com o que falta decidir, não regra inventada | Link do rodapé, antes `#` |
| `politica-de-privacidade.html` | Estrutura de uma política de privacidade de e-commerce brasileiro (LGPD) — texto legal real ainda não escrito, isso não é trabalho pra IA assinar sem revisão jurídica | Link do rodapé, antes `#` |
| `termos-de-uso.html` | Mesma lógica — estrutura pronta, texto legal pendente de revisão jurídica | Link do rodapé, antes `#` |
| `assets/estilo.css` | Design tokens e componentes (grayscale estrito, zero border-radius, tipografia) | `prompt-reproducao-design.md` + `design (1).md` |
| `assets/app.js` | Interações mínimas (accordion, seleção de cor/tamanho, menu mobile, stepper de quantidade) — só para o protótipo ficar navegável | — |

## Botões flutuantes (WhatsApp + sacola)

Em todas as páginas, canto inferior direito: WhatsApp (quadrado preto, não bolha verde — de propósito, ver nota de design abaixo) e sacola com contador de itens. WhatsApp aponta pra `#` porque o telefone da marca ainda não existe (ver `acessos/mapa-de-acessos.md`) — assim que houver número, vira `https://wa.me/55...`.

## Notas de design (autocrítica, pra próxima rodada)

Passei o protótipo pela skill de frontend design antes desta rodada e ajustei o que estava genérico demais:
- Tirei o "eyebrow" (rótulo pequeno acima do H1 do hero) — não é um padrão confirmado na Adanola de verdade (ver benchmark), era só decoração de template.
- Tirei a seta "→" solta no fim de "Ver produto" — outro tique comum de UI gerada, sem função real aqui.
- "NOVIDADES — COLEÇÃO 1" virou "Novidades da Coleção 1" — evita o padrão "PALAVRA — fragmento" que não carrega informação de verdade.
- O que ficou de propósito, mesmo aparecendo em listas de "coisas genéricas": zero border-radius e grayscale estrito (é o que o brief da própria cliente pede, confirmado contra o site real da Adanola — não é o default que eu escolheria sem essa referência); o preto `#111111` da paleta não é um "quase-preto" de IA, é a cor real "Preto" da Legenda de Cores da Noni.
- Os "3 fatos" (10 modelos / 4 cores / PP–G) na página Sobre usam número grande + label pequeno — a skill avisa que é o tratamento-padrão a evitar sem motivo, mas aqui é literalmente a resposta mais rápida a "o que essa loja vende", que é o próprio objetivo da página (não é decoração).
- Botão de WhatsApp flutuante em quadrado preto, não em bolha verde redonda (o padrão de mercado): segue o zero-radius do resto do site e o grayscale estrito — decisão deliberada, não esquecimento, ainda mais tendo confirmado no benchmark que o próprio widget de chat da Adanola é preto, não colorido.

## Fluxo de navegação entre as páginas do protótipo

```
index.html ──┬── colecao.html?tipo=... ──── produto.html ──┬── guia-de-tamanhos.html
             ├── conjuntos.html#cor ─────────────────────────┘
             ├── acessorios.html
             └── sobre.html

Todas as páginas ──┬── carrinho.html (ícone da sacola + botão flutuante)
                    ├── trocas-e-devolucoes.html (rodapé)
                    ├── politica-de-privacidade.html (rodapé)
                    └── termos-de-uso.html (rodapé)
```

11 páginas ao todo. Ícone de sacola e botão flutuante (header + canto da tela, todas as páginas) → `carrinho.html`. Rodapé (todas as páginas) → `sobre.html`, `guia-de-tamanhos.html`, `trocas-e-devolucoes.html`, `politica-de-privacidade.html`, `termos-de-uso.html`.

## O que é placeholder (marcado no próprio HTML, não escondido)

- Todas as fotos de produto: bloco sólido nas 4 cores reais da coleção (`--cor-branco/preto/esmeralda/mascavo`, os HEX exatos da aba Legenda de Cores), com a etiqueta "Foto pendente" visível — troca pela foto real assim que o ensaio de 28/09 entregar o material.
- Preço: texto "Preço a definir" em vez de qualquer valor — não fabricar preço.
- Avaliações: nota indicando que o Judge.me entra no dia 1, em vez de simular estrelas/contagem.
- Texto do anúncio no topo, frete, trocas, telefone de WhatsApp, endereço: marcados `[...]` ou "a definir" — todos dependem de decisão ou dado que ainda não chegou (ver `README.md` da raiz e `acessos/mapa-de-acessos.md`).
- Acessórios: preço, peso/dimensão de envio e foto também pendentes — mesmo critério da Coleção 1, mas aqui a quantidade em estoque já é real (não é uma pré-venda).

## Mapa de conversão para Liquid (quando a loja existir)

| Bloco HTML | Vira em Liquid |
|---|---|
| `.topbar` | `sections/announcement-bar.liquid` |
| `.header` (mobile + desktop nav) | `sections/header.liquid`, menu vindo do Menu principal criado no admin (ver `navegacao/arquitetura-navegacao.md`) |
| `.hero` (2 painéis) | `sections/hero.liquid` com 2 blocos de imagem (`image_picker`), um por breakpoint — cumpre o pedido de "hero dedicado desktop/mobile" |
| `.grid-produtos` + `.card` | `snippets/product-card.liquid`, repetido num `sections/featured-collection.liquid` ou na collection template |
| `.quick-add` | Vira um mini-formulário `product-form` (Ajax add to cart) dentro do snippet do card |
| `colecao.html` inteiro | `templates/collection.json` + `sections/main-collection.liquid`, com o filtro de cor usando os metafields/tags de cor já definidos na aba Produtos-pai do catálogo |
| `.filtros-drawer` (painel "Filtros e ordenar") | O filtro de Shopify nativo (`{% paginate %}` + `collection.filters`, Search & Discovery) — a ordenação por radio já bate 1:1 com `collection.sort_options`; o filtro de cor por botão independente vira um filtro nativo de "Cor" se a tag/metafield estiver marcada como filtro no admin |
| `.pdp` (galeria + `.pdp-compra`) | `templates/product.json` + `sections/main-product.liquid`; swatches de cor e grade de tamanho viram o variant picker nativo do Shopify (`{{ product.options_with_values }}`) |
| `.accordion` | `snippets/accordion.liquid`, conteúdo vindo de metafields de produto (Detalhes/Composição) quando a descrição chegar |
| `.footer` | `sections/footer.liquid` |
| `sobre.html` | `templates/page.about.json` (página de conteúdo simples) |
| `guia-de-tamanhos.html` | `templates/page.size-guide.json`, ou modal reutilizável se a Simone preferir abrir por cima da PDP em vez de navegar pra outra página |
| `carrinho.html` | `sections/main-cart-items.liquid` + `sections/main-cart-footer.liquid` (ou o cart drawer padrão do tema, se a loja usar drawer em vez de página) |
| `.qtd-stepper` | Vira o input de quantidade nativo do formulário de carrinho do Shopify (`{% form 'cart' %}`) |
| `conjuntos.html` (cada `.conjunto-bloco`) | Vira 4 coleções manuais no Shopify (uma por cor), listadas numa única `templates/page.sets.json` com `{% for %}` sobre as coleções, ou 4 seções fixas se a Simone preferir curadoria manual em vez de coleção automática |
| `trocas-e-devolucoes.html`, `politica-de-privacidade.html`, `termos-de-uso.html` | Páginas de conteúdo padrão (`templates/page.json`) — o Shopify já tem um bloco de políticas prontas em Configurações › Políticas, que gera essas páginas automaticamente uma vez que o texto legal existir |
| `.flutuantes` | `sections/floating-buttons.liquid` ou snippet incluído no `theme.liquid`, fora do `{{ content_for_layout }}` para aparecer em toda página |
| `acessorios.html` | Coleção "Acessórios" separada da Coleção 1 (`templates/collection.acessorios.json`) — Home Fragrance fica em Tipo de produto "Casa e bem-estar", os outros em "Acessórios", puxados a partir de `catalogo/acessorios-catalogo.xlsx` |
| `.logo-mark` (header + rodapé) | Vira o logo do tema em `settings_schema.json` (`image_picker` para o SVG/PNG da marca) referenciado em `sections/header.liquid` e `sections/footer.liquid` — o SVG já está pronto em `marca/logo-monograma.svg`, é só subir como asset do tema |

## Próximo passo real

Isso não fica pronto sozinho: falta decidir com a Simone se a proposta de "conjunto por cor" (home e PDP) é a curadoria que ela quer, e o texto do anúncio/CTAs precisa de copy da marca — o resto (estrutura, grid, componentes) já está validável em pré-visualização.
