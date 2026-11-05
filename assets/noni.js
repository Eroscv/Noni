/* Noni — comportamento do tema (sem dependências) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var CUR = document.body.dataset.currency || 'BRL';
  var brl = function (c) { return (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: CUR }); };
  var money = function (c) { return c > 0 ? brl(c) : 'Preço a definir'; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var imgSize = function (u, w) { if (!u) return ''; return u + (u.indexOf('?') > -1 ? '&' : '?') + 'width=' + w; };

  /* ---------- Toast ---------- */
  function toast(t) {
    var el = $('#toast'); if (!el) return;
    el.textContent = t; el.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }

  /* ---------- Gavetas, busca, lightbox ---------- */
  var lastFocus = null;
  function openDrawer(sel) {
    var d = $(sel); if (!d) return;
    lastFocus = document.activeElement;
    d.classList.add('open'); d.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { var b = d.querySelector('button[data-close]'); if (b) b.focus(); }, 50);
  }
  function closeMega() { var m = $('#mega'), b = $('#shopBtn'); if (m) m.classList.remove('open'); if (b) b.setAttribute('aria-expanded', 'false'); }
  function closeAll() {
    $$('.drawer.open').forEach(function (d) { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); });
    var s = $('#search'), l = $('#lb'); if (s) s.classList.remove('open'); if (l) l.classList.remove('open');
    closeMega(); document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('.drawer').forEach(function (d) {
    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]') || e.target.closest('[data-closeall]') || e.target.closest('.mnav a')) closeAll();
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  var burger = $('#burgerBtn'); if (burger) burger.onclick = function () { openDrawer('#mnav'); };

  /* ---------- Tema claro/escuro ---------- */
  var themeBtn = $('#themeBtn');
  function setTheme(t, save) {
    document.documentElement.setAttribute('data-theme', t);
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Mudar para versão clara' : 'Mudar para versão escura');
    var ico = $('#themeIco');
    if (ico) ico.innerHTML = t === 'dark' ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' : '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>';
    if (save) store.set('noni-theme', t);
  }
  setTheme(store.get('noni-theme', 'light'));
  if (themeBtn) themeBtn.onclick = function () { setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); };

  /* ---------- Mega menu ---------- */
  var shopBtn = $('#shopBtn'), mega = $('#mega'), top = $('#top');
  if (shopBtn && mega) {
    shopBtn.onclick = function () { var o = !mega.classList.contains('open'); mega.classList.toggle('open', o); shopBtn.setAttribute('aria-expanded', o); };
    shopBtn.addEventListener('mouseenter', function () { if (matchMedia('(hover:hover)').matches) { mega.classList.add('open'); shopBtn.setAttribute('aria-expanded', 'true'); } });
    if (top) top.addEventListener('mouseleave', closeMega);
    mega.addEventListener('click', function (e) { if (e.target.closest('a')) closeMega(); });
  }

  /* ---------- Sacola (AJAX) ---------- */
  var cart = null;
  var FREE = top ? (Number(top.dataset.free) || 0) : 0;
  function syncCounts() {
    var n = cart ? cart.item_count : 0;
    var c = $('#cartCount'); if (c) { c.textContent = n; c.dataset.n = n; }
    var f = $('#favCount'); if (f) { f.textContent = favs.length; f.dataset.n = favs.length; }
  }
  function renderCart() {
    if (!cart) return;
    var n = cart.item_count, t = cart.total_price;
    var cn = $('#cartN'); if (cn) cn.textContent = n;
    syncCounts();
    var ship = $('#shipBox');
    if (ship) {
      if (n && FREE > 0 && t > 0) {
        var left = Math.max(0, FREE - t);
        ship.innerHTML = '<div>' + (left ? 'Faltam <b>' + brl(left) + '</b> para o frete grátis' : '<b>Você ganhou frete grátis</b>') + '</div><div class="meter"><i style="width:' + Math.min(100, t / FREE * 100) + '%"></i></div>';
      } else ship.innerHTML = '';
    }
    var lines = $('#cartLines');
    if (lines) {
      lines.innerHTML = n ? cart.items.map(function (it) {
        var meta = it.product_has_only_default_variant ? '' : esc(it.variant_title);
        return '<div class="line"><a href="' + esc(it.url) + '">' + (it.image ? '<img src="' + esc(imgSize(it.image, 168)) + '" alt="" loading="lazy">' : '<span></span>') + '</a><div>' +
          '<div style="display:flex;justify-content:space-between;gap:10px"><a class="nm" href="' + esc(it.url) + '">' + esc(it.product_title) + '</a><span class="price">' + money(it.final_line_price) + '</span></div>' +
          (meta ? '<div class="meta">' + meta + '</div>' : '') +
          '<div><span class="qty"><button type="button" data-dec="' + esc(it.key) + '" data-q="' + it.quantity + '" aria-label="Diminuir">−</button><span>' + it.quantity + '</span><button type="button" data-inc="' + esc(it.key) + '" data-q="' + it.quantity + '" aria-label="Aumentar">+</button></span><button type="button" class="rm" data-rm="' + esc(it.key) + '">Remover</button></div></div></div>';
      }).join('') : '<div class="empty"><span class="serif" style="font-size:30px;color:var(--ink)">Sua sacola está vazia</span><span>Comece pelas novidades da Coleção 01.</span><a class="btn" href="/collections/novidades" data-closeall>Ver novidades</a></div>';
    }
    var foot = $('#cartFoot');
    if (foot) foot.innerHTML = n ? '<div class="tot"><span>Subtotal</span><span>' + money(t) + '</span></div><div style="font-size:12px;color:var(--steel)">Frete calculado no checkout</div><a class="btn" href="/checkout">Finalizar compra</a><button type="button" class="btn ghost" data-close>Continuar comprando</button>' : '';
  }
  function loadCart() {
    return fetch('/cart.js', { headers: { Accept: 'application/json' } }).then(function (r) { return r.json(); }).then(function (c) { cart = c; renderCart(); return c; }).catch(function () {});
  }
  function changeLine(key, q) {
    return fetch('/cart/change.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ id: key, quantity: q }) })
      .then(function (r) { return r.json(); }).then(function (c) { if (c.items) { cart = c; renderCart(); } else if (c.description) toast(c.description); });
  }
  function addToCart(id, qty) {
    return fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items: [{ id: id, quantity: qty || 1 }] }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) { toast(res.j.description || res.j.message || 'Não foi possível adicionar.'); return false; }
        return loadCart().then(function () { openDrawer('#cart'); return true; });
      }).catch(function () { toast('Não foi possível adicionar.'); return false; });
  }
  var cartEl = $('#cart');
  if (cartEl) cartEl.addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('[data-inc]'))) changeLine(b.dataset.inc, +b.dataset.q + 1);
    else if ((b = e.target.closest('[data-dec]'))) changeLine(b.dataset.dec, +b.dataset.q - 1);
    else if ((b = e.target.closest('[data-rm]'))) changeLine(b.dataset.rm, 0);
  });
  var cartBtn = $('#cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || document.body.classList.contains('template-cart')) return;
    e.preventDefault(); loadCart().then(function () { openDrawer('#cart'); });
  });

  /* ---------- Favoritos ---------- */
  var favs = store.get('noni-favs', []);
  var favCache = {};
  function isFav(h) { return favs.indexOf(h) > -1; }
  function paintFavs() { $$('[data-fav]').forEach(function (b) { b.setAttribute('aria-pressed', isFav(b.dataset.fav)); }); syncCounts(); }
  function toggleFav(h) {
    favs = isFav(h) ? favs.filter(function (x) { return x !== h; }) : favs.concat([h]);
    store.set('noni-favs', favs); paintFavs();
    toast(isFav(h) ? 'Salvo nos favoritos' : 'Removido dos favoritos');
    if ($('#favs').classList.contains('open')) renderFavs();
  }
  function renderFavs() {
    var box = $('#favList'); if (!box) return;
    if (!favs.length) { box.innerHTML = '<div class="empty"><span class="serif" style="font-size:28px;color:var(--ink)">Nenhuma peça salva</span><span>Toque no coração de qualquer produto para guardar aqui.</span></div>'; return; }
    box.innerHTML = '<p class="label" style="color:var(--steel)">Carregando…</p>';
    Promise.all(favs.map(function (h) {
      if (favCache[h]) return favCache[h];
      return (favCache[h] = fetch('/products/' + encodeURIComponent(h) + '.js').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }));
    })).then(function (ps) {
      box.innerHTML = ps.map(function (p, i) {
        if (!p) return '';
        return '<div class="line"><a href="' + esc(p.url) + '">' + (p.featured_image ? '<img src="' + esc(imgSize(p.featured_image, 168)) + '" alt="" loading="lazy">' : '<span></span>') + '</a><div><div style="display:flex;justify-content:space-between;gap:10px"><a class="nm" href="' + esc(p.url) + '">' + esc(p.title) + '</a><span class="price">' + money(p.price) + '</span></div><div><button type="button" class="rm" data-unfav="' + esc(favs[i]) + '" style="margin-left:0">Remover</button></div></div></div>';
      }).join('');
    });
  }
  var favBtn = $('#favBtn'); if (favBtn) favBtn.onclick = function () { renderFavs(); openDrawer('#favs'); };
  var favsEl = $('#favs'); if (favsEl) favsEl.addEventListener('click', function (e) { var u = e.target.closest('[data-unfav]'); if (u) toggleFav(u.dataset.unfav); });

  /* ---------- Cards de produto ---------- */
  function cardVars(el) { if (!el._v) { try { el._v = JSON.parse($('[data-vars]', el).textContent); } catch (e) { el._v = []; } } return el._v; }
  function refreshQuick(el) {
    var vars = cardVars(el), c = el.dataset.color;
    $$('[data-quick]', el).forEach(function (b) {
      var v = vars.filter(function (x) { return x.s === b.dataset.quick && (!x.c || x.c === c); })[0];
      b.disabled = !v || !v.a;
    });
  }
  $$('[data-card]').forEach(refreshQuick);
  document.addEventListener('click', function (e) {
    var card = e.target.closest('[data-card]');
    var sw = e.target.closest('[data-sw]');
    if (sw && card) {
      e.preventDefault();
      var c = sw.dataset.sw, v = cardVars(card).filter(function (x) { return x.c === c; })[0];
      card.dataset.color = c;
      $$('[data-sw]', card).forEach(function (b) { b.setAttribute('aria-pressed', b === sw); });
      var cl = $('[data-cl]', card); if (cl) cl.textContent = c;
      if (v) {
        var a = $('.pic img.a', card); if (a && v.img) { a.removeAttribute('srcset'); a.src = v.img; }
        $$('a.pic, a.nm', card).forEach(function (l) { l.href = l.href.split('?')[0] + '?variant=' + v.id; });
        var pr = $('.price', card); if (pr) pr.innerHTML = v.p > 0 ? brl(v.p) : '<span class="tbd">Preço a definir</span>';
      }
      refreshQuick(card); return;
    }
    var q = e.target.closest('[data-quick]');
    if (q && card) {
      e.preventDefault();
      var c2 = card.dataset.color;
      var v2 = cardVars(card).filter(function (x) { return x.s === q.dataset.quick && (!x.c || x.c === c2); })[0];
      if (!v2 || !v2.a) { toast('Tamanho indisponível'); return; }
      addToCart(v2.id, 1); return;
    }
    var f = e.target.closest('[data-fav]');
    if (f) { e.preventDefault(); toggleFav(f.dataset.fav); }
  });

  /* ---------- Busca ---------- */
  var searchEl = $('#search'), qInput = $('#q'), qres = $('#qres'), st;
  function runSearch() {
    var q = qInput.value.trim();
    if (!q) { qres.innerHTML = '<p class="label" style="color:var(--steel);margin:0">Digite para buscar</p>'; return; }
    fetch('/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=8')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var ps = (j.resources && j.resources.results && j.resources.results.products) || [];
        qres.innerHTML = '<p class="label" style="color:var(--steel);margin:0 0 18px">' + ps.length + ' resultado' + (ps.length === 1 ? '' : 's') + '</p>' +
          (ps.length ? '<div class="grid">' + ps.map(function (p) {
            var pr = parseFloat(p.price) || 0;
            return '<article class="card"><div class="pw"><a class="pic" href="' + esc(p.url) + '">' + (p.image ? '<img class="a" loading="lazy" src="' + esc(imgSize(p.image, 500)) + '" alt="">' : '') + '</a></div><div class="info"><div><a class="nm" href="' + esc(p.url) + '">' + esc(p.title) + '</a></div><div class="price">' + (pr > 0 ? brl(Math.round(pr * 100)) : '<span class="tbd">Preço a definir</span>') + '</div></div></article>';
          }).join('') + '</div>' : '<p class="serif" style="font-size:28px">Nada com “' + esc(q) + '”. Tente “legging” ou “preto”.</p>');
      }).catch(function () { qres.innerHTML = ''; });
  }
  var sBtn = $('#searchBtn');
  if (sBtn && searchEl) {
    sBtn.onclick = function () { searchEl.classList.add('open'); document.body.style.overflow = 'hidden'; qInput.value = ''; runSearch(); setTimeout(function () { qInput.focus(); }, 40); };
    $('#closeSearch').onclick = closeAll;
    qInput.addEventListener('input', function () { clearTimeout(st); st = setTimeout(runSearch, 220); });
    qres.addEventListener('click', function (e) { if (e.target.closest('a')) closeAll(); });
  }

  /* ---------- Lightbox ---------- */
  var lb = $('#lb');
  if (lb) { $('#lbClose').onclick = closeAll; lb.onclick = function (e) { if (e.target.id === 'lb') closeAll(); }; }

  /* ---------- Produto ---------- */
  function initPdp() {
    var root = $('[data-pdp]'); if (!root) return;
    var variants = []; try { variants = JSON.parse($('#pdpVariants').textContent); } catch (e) {}
    var images = []; try { images = JSON.parse($('#pdpImages').textContent); } catch (e) {}
    var opts = $$('.opt', root), idInput = $('#pdpVariantId'), addBtn = $('#addBtn'), hint = $('#pdpHint');
    var sel = [];
    opts.forEach(function (o) { var on = $('button[aria-pressed="true"]', o); sel[+o.dataset.option] = on ? on.dataset.value : null; });
    function vopt(v, i) { return v['option' + (i + 1)]; }
    function match(v, s) { for (var i = 0; i < s.length; i++) { if (s[i] != null && vopt(v, i) !== s[i]) return false; } return true; }
    function find(s) { return variants.filter(function (v) { return match(v, s); })[0]; }
    function paintOptions() {
      opts.forEach(function (o) {
        var oi = +o.dataset.option;
        $$('button', o).forEach(function (b) {
          var probe = sel.slice(); probe[oi] = b.dataset.value;
          var ok = variants.some(function (v) { return v.available && match(v, probe); });
          b.setAttribute('aria-pressed', sel[oi] === b.dataset.value);
          b.disabled = !ok && sel[oi] !== b.dataset.value;
        });
        var lab = $('[data-opt-label]', o); if (lab) lab.textContent = sel[oi] || '';
      });
    }
    function update(userChange) {
      var v = find(sel);
      paintOptions();
      if (!v) { if (hint) { hint.textContent = 'Combinação indisponível.'; hint.className = 'hint err'; } if (addBtn) addBtn.disabled = true; return; }
      idInput.value = v.id;
      var pr = $('#pdpPrice');
      if (pr) pr.innerHTML = v.price > 0 ? (v.compare_at_price > v.price ? '<s>' + brl(v.compare_at_price) + '</s> ' : '') + brl(v.price) : '<span class="tbd">Preço a definir</span>';
      if (addBtn) { addBtn.disabled = !v.available; addBtn.textContent = v.available ? 'Adicionar à sacola' : 'Esgotado'; }
      if (hint) { hint.textContent = v.available ? '' : 'Esta combinação está esgotada.'; hint.className = 'hint' + (v.available ? '' : ' err'); }
      if (userChange) { try { history.replaceState(null, '', location.pathname + '?variant=' + v.id); } catch (e) {} }
      if (userChange && v.featured_image && images.length) {
        for (var i = 0; i < images.length; i++) { if (images[i].id === v.featured_image.id) { show(i); break; } }
      }
    }
    opts.forEach(function (o) {
      o.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b || b.disabled) return;
        sel[+o.dataset.option] = b.dataset.value;
        // se a combinação ficou inexistente, ajusta as outras opções para uma variante disponível
        if (!find(sel)) { var alt = variants.filter(function (v) { return v.available && vopt(v, +o.dataset.option) === b.dataset.value; })[0]; if (alt) sel = sel.map(function (_, i) { return vopt(alt, i); }); }
        update(true);
      });
    });
    var form = $('#pdpForm');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault(); if (addBtn.disabled) return;
      addBtn.disabled = true; addToCart(+idInput.value, 1).then(function () { addBtn.disabled = false; });
    });

    /* galeria */
    var gi = 0, main = $('#mainImg'), gal = $('#gal');
    function show(i) {
      if (!images.length) return;
      gi = (i + images.length) % images.length;
      main.src = images[gi].src; main.alt = images[gi].alt;
      var idx = $('#gIdx'); if (idx) idx.textContent = (gi + 1) + ' / ' + images.length;
      $$('.thumbs button', gal).forEach(function (b, k) { b.setAttribute('aria-pressed', k === gi); });
    }
    if (gal && main) {
      gal.addEventListener('click', function (e) {
        var t = e.target.closest('[data-i]'); if (t) { show(+t.dataset.i); return; }
        var s = e.target.closest('[data-step]'); if (s) { show(gi + +s.dataset.step); return; }
        if (e.target === main && lb) { $('#lbImg').src = main.src; $('#lbImg').alt = main.alt; lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
      });
      gal.addEventListener('mouseover', function (e) { var t = e.target.closest('[data-i]'); if (t && matchMedia('(hover:hover)').matches) show(+t.dataset.i); });
      var sx = null;
      main.parentElement.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
      main.parentElement.addEventListener('touchend', function (e) { if (sx == null) return; var d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) show(gi + (d < 0 ? 1 : -1)); sx = null; });
    }
    var cur = find(sel);
    if (cur && cur.featured_image && images.length) { for (var i = 0; i < images.length; i++) { if (images[i].id === cur.featured_image.id) { show(i); break; } } }
    paintOptions();
  }

  /* ---------- Home ---------- */
  function initHome() {
    var sp = $('#split');
    if (sp) {
      var imgs = $$('.pic2 img', sp), ls = $$('[data-pic]', sp);
      var on = function (i) { imgs.forEach(function (x, k) { x.classList.toggle('on', k == i); }); ls.forEach(function (x, k) { x.classList.toggle('on', k == i); }); };
      ls.forEach(function (a) { a.addEventListener('mouseenter', function () { on(a.dataset.pic); }); a.addEventListener('focus', function () { on(a.dataset.pic); }); });
    }
    var v = $('#vid'), b = $('#vidBtn');
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) $$('video').forEach(function (x) { x.removeAttribute('autoplay'); x.pause(); });
    if (v && b) {
      var sync = function () {
        var paused = v.paused; b.setAttribute('aria-label', paused ? 'Tocar vídeo' : 'Pausar vídeo');
        var ico = $('#vidIco'); if (ico) ico.innerHTML = paused ? '<path d="M8 5l11 7-11 7z"/>' : '<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>';
      };
      v.addEventListener('play', sync); v.addEventListener('pause', sync);
      b.onclick = function () { if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); };
      sync();
    }
  }

  /* ---------- Coleção: ordenar ---------- */
  var sortForm = $('[data-sort-form]');
  if (sortForm) { var sel2 = $('select', sortForm); sel2.addEventListener('change', function () { sortForm.submit(); }); }

  paintFavs(); initPdp(); initHome(); loadCart();
})();
