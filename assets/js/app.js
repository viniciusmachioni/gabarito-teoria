/* O Gabarito da Teoria — comportamento compartilhado por todas as páginas.
 *
 * Progresso dos tópicos e das leituras fica no localStorage do navegador.
 * A chave dos tópicos é a MESMA da versão de arquivo único
 * ("gabarito-teoria-progresso") e os ids dos checkboxes foram mantidos,
 * então o progresso antigo continua valendo onde o navegador compartilha o
 * armazenamento entre arquivos locais (Chrome/Edge). Pra qualquer outro caso
 * existe o backup em texto na capa.
 */
(function () {
  var KEY = 'gabarito-teoria-progresso';
  var KEY_LEITURAS = 'gabarito-teoria-leituras';

  function load(k) {
    try { var raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : {}; }
    catch (e) { return {}; }
  }
  function save(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  var prog = load(KEY);
  var lidas = load(KEY_LEITURAS);

  /* ---------- Tópicos (checklist) ---------- */
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.checklist input[type="checkbox"]'));
  boxes.forEach(function (el) {
    if (prog[el.id]) el.checked = true;
    el.addEventListener('change', function () {
      if (el.checked) prog[el.id] = true; else delete prog[el.id];
      save(KEY, prog);
      atualizaPagina();
    });
  });

  /* ---------- Leituras embutidas ---------- */
  var leituras = Array.prototype.slice.call(document.querySelectorAll('details.leitura[data-id]'));
  leituras.forEach(function (d) {
    var id = d.getAttribute('data-id');
    var btn = d.querySelector('.leitura-foot button');
    function pinta() {
      var ok = !!lidas[id];
      d.classList.toggle('is-lida', ok);
      if (btn) {
        btn.setAttribute('aria-pressed', ok ? 'true' : 'false');
        btn.textContent = ok ? 'Leitura concluída' : 'Marcar como lida';
      }
    }
    if (btn) {
      btn.addEventListener('click', function () {
        if (lidas[id]) delete lidas[id]; else lidas[id] = true;
        save(KEY_LEITURAS, lidas);
        pinta();
        atualizaPagina();
      });
    }
    pinta();
  });

  function atualizaPagina() {
    var feitos = boxes.filter(function (b) { return b.checked; }).length;
    document.querySelectorAll('[data-prog-pagina]').forEach(function (el) {
      el.textContent = boxes.length ? feitos + ' / ' + boxes.length + ' tópicos' : '';
    });
    var nLidas = leituras.filter(function (d) { return lidas[d.getAttribute('data-id')]; }).length;
    document.querySelectorAll('[data-leituras-pagina]').forEach(function (el) {
      el.textContent = leituras.length ? nLidas + ' de ' + leituras.length + ' leituras concluídas nesta página' : '';
    });
    atualizaCapa();
  }

  /* ---------- Capa: progresso por seção ---------- */
  function atualizaCapa() {
    var linhas = document.querySelectorAll('tr[data-prefix]');
    if (!linhas.length) return;
    var total = 0, feitos = 0;
    linhas.forEach(function (tr) {
      var prefix = tr.getAttribute('data-prefix');
      var n = parseInt(tr.getAttribute('data-total'), 10) || 0;
      var f = 0;
      for (var i = 1; i <= n; i++) if (prog[prefix + i]) f++;
      total += n; feitos += f;
      var cel = tr.querySelector('.p');
      if (cel) {
        var pct = n ? Math.round((f / n) * 100) : 0;
        cel.innerHTML = '<span class="mini"><i style="width:' + pct + '%"></i></span>' + f + '/' + n;
      }
    });
    var pct = total ? Math.round((feitos / total) * 100) : 0;
    var label = document.getElementById('progress-label');
    var fill = document.getElementById('progress-fill');
    var stat = document.getElementById('stat-total');
    if (label) label.textContent = feitos + ' / ' + total + ' tópicos marcados';
    if (fill) fill.style.width = pct + '%';
    if (stat) stat.textContent = total;
    var nl = document.getElementById('stat-leituras-lidas');
    if (nl) nl.textContent = Object.keys(lidas).length;
  }

  /* ---------- Backup em texto ---------- */
  var txt = document.getElementById('backup-txt');
  var msg = document.getElementById('backup-msg');
  function aviso(t) { if (msg) msg.textContent = t; }
  var bExp = document.getElementById('backup-exportar');
  var bImp = document.getElementById('backup-importar');
  var bBaixar = document.getElementById('backup-baixar');
  function pacote() {
    return JSON.stringify({ versao: 2, geradoEm: new Date().toISOString(), progresso: load(KEY), leituras: load(KEY_LEITURAS) });
  }
  if (bExp && txt) {
    bExp.addEventListener('click', function () {
      txt.value = pacote();
      txt.select();
      var copiou = false;
      try { copiou = document.execCommand('copy'); } catch (e) {}
      aviso(copiou ? 'Copiado. Cole num lugar seguro (uma nota, um e-mail pra você).' : 'Texto gerado — copie manualmente.');
    });
  }
  if (bBaixar) {
    bBaixar.addEventListener('click', function () {
      try {
        var blob = new Blob([pacote()], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'gabarito-da-teoria-progresso.json';
        document.body.appendChild(a); a.click(); a.remove();
        aviso('Arquivo gerado.');
      } catch (e) { aviso('Seu navegador bloqueou o download — use "Gerar texto".'); }
    });
  }
  if (bImp && txt) {
    bImp.addEventListener('click', function () {
      var dados;
      try { dados = JSON.parse(txt.value); } catch (e) { aviso('Esse texto não é um backup válido.'); return; }
      // aceita tanto o pacote novo quanto o objeto cru da versão antiga
      var p = dados && dados.progresso ? dados.progresso : dados;
      var l = dados && dados.leituras ? dados.leituras : {};
      if (!p || typeof p !== 'object') { aviso('Esse texto não é um backup válido.'); return; }
      var atual = load(KEY), atualL = load(KEY_LEITURAS);
      Object.keys(p).forEach(function (k) { if (p[k]) atual[k] = true; });
      Object.keys(l).forEach(function (k) { if (l[k]) atualL[k] = true; });
      save(KEY, atual); save(KEY_LEITURAS, atualL);
      prog = atual; lidas = atualL;
      atualizaCapa();
      aviso('Importado e mesclado com o que já havia neste navegador.');
    });
  }

  /* ---------- Âncora pra dentro de <details> fechado ---------- */
  function abrirAlvo(hash) {
    if (!hash || hash.length < 2) return;
    var alvo;
    try { alvo = document.querySelector(hash); } catch (e) { return; }
    if (!alvo) return;
    var d = alvo.tagName === 'DETAILS' ? alvo : alvo.closest('details');
    while (d) { d.open = true; d = d.parentElement ? d.parentElement.closest('details') : null; }
    alvo.scrollIntoView({ block: 'start' });
  }
  window.addEventListener('hashchange', function () { abrirAlvo(location.hash); });
  if (location.hash) abrirAlvo(location.hash);

  atualizaPagina();
})();
