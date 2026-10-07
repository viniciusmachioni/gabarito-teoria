/* Questões de múltipla escolha dentro das páginas do roadmap.
 *
 * Cada página traz as suas questões num <script type="application/json" class="qz-pagina-dados">
 * (gerado pelo build a partir de _montagem/roadmap/quiz/<slug>.mjs). São as MESMAS questões
 * do Questionário rápido e usam o mesmo histórico (localStorage "gabarito-teoria-quiz", pelo id
 * da questão): responder aqui conta lá, e vice-versa.
 *
 * As alternativas são embaralhadas a cada rodada, então decorar a letra não ajuda.
 */
(function () {
  var KEY_QUIZ = 'gabarito-teoria-quiz';
  var LETRAS = ['A', 'B', 'C', 'D', 'E'];
  var raiz = document.querySelector('[data-qz-pagina]');
  if (!raiz) return;
  var fonte = raiz.querySelector('.qz-pagina-dados');
  var lista = raiz.querySelector('.qz-pagina-lista');
  var placar = raiz.querySelector('.qz-pagina-placar');
  var bRodada = raiz.querySelector('[data-acao="rodada"]');
  if (!fonte || !lista) return;

  var dados;
  try { dados = JSON.parse(fonte.textContent); } catch (e) { return; }

  function carrega() {
    try { var raw = localStorage.getItem(KEY_QUIZ); return raw ? JSON.parse(raw) : {}; }
    catch (e) { return {}; }
  }
  // relê antes de gravar: o Questionário rápido pode ter mudado o histórico em outra aba
  function registra(id, certo) {
    var hist = carrega();
    var h = hist[id] || { t: 0, a: 0 };
    hist[id] = { r: certo ? 'certo' : 'errado', t: h.t + 1, a: h.a + (certo ? 1 : 0), em: new Date().toISOString() };
    try { localStorage.setItem(KEY_QUIZ, JSON.stringify(hist)); } catch (e) {}
  }

  var rodada = {};   // id -> índice ORIGINAL escolhido
  var ordem = {};    // id -> permutação das alternativas nesta rodada

  function embaralha(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function permDe(item) {
    if (!ordem[item.id]) ordem[item.id] = embaralha(item.o.map(function (_, j) { return j; }));
    return ordem[item.id];
  }

  function rotuloHist(h) {
    if (!h) return '';
    var txt = h.r === 'certo' ? 'acertou da última vez' : 'errou da última vez';
    return '<span class="qz-hist ' + (h.r === 'certo' ? 'ok' : 'nok') + '">' + txt + ' &middot; ' + h.a + '/' + h.t + '</span>';
  }

  function atualizaPlacar() {
    var ids = Object.keys(rodada);
    var certas = dados.filter(function (d) { return rodada[d.id] === d.c; }).length;
    placar.innerHTML = ids.length
      ? 'nesta rodada: <b>' + certas + '</b> / ' + ids.length + ' certas &middot; ' + dados.length + ' questões'
      : dados.length + ' questões';
  }

  function marca(card, item, escolhida) {
    var perm = permDe(item);
    var bs = card.querySelectorAll('.qz-opt');
    var letraCerta = '';
    for (var k = 0; k < bs.length; k++) {
      var orig = perm[k];
      bs[k].disabled = true;
      if (orig === item.c) { bs[k].classList.add('is-right'); letraCerta = LETRAS[k]; }
      else if (orig === escolhida) bs[k].classList.add('is-wrong');
    }
    var w = card.querySelector('.qz-why');
    w.innerHTML = '<strong>' + (escolhida === item.c ? 'Isso.' : 'A certa era a ' + letraCerta + '.') + '</strong> ' + item.e;
    w.hidden = false;
  }

  function cartao(item, n, hist) {
    var card = document.createElement('div');
    card.className = 'qz-card';
    card.innerHTML =
      '<div class="qz-tag"><span class="n">' + String(n).padStart(2, '0') + '</span><span>' + item.t + '</span>' +
      rotuloHist(hist[item.id]) + '</div>' +
      '<p class="qz-q">' + item.q + '</p><div class="qz-opts"></div><div class="qz-why" aria-live="polite" hidden></div>';
    var opts = card.querySelector('.qz-opts');
    permDe(item).forEach(function (orig, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'qz-opt';
      b.innerHTML = '<span class="k">' + LETRAS[k] + '</span><span>' + item.o[orig] + '</span>';
      b.addEventListener('click', function () {
        if (rodada[item.id] !== undefined) return;
        rodada[item.id] = orig;
        registra(item.id, orig === item.c);
        marca(card, item, orig);
        atualizaPlacar();
      });
      opts.appendChild(b);
    });
    if (rodada[item.id] !== undefined) marca(card, item, rodada[item.id]);
    return card;
  }

  function render() {
    var hist = carrega();
    lista.innerHTML = '';
    dados.forEach(function (d, i) { lista.appendChild(cartao(d, i + 1, hist)); });
    atualizaPlacar();
  }

  if (bRodada) {
    bRodada.addEventListener('click', function () {
      rodada = {};
      ordem = {};
      render();
      raiz.scrollIntoView({ block: 'start' });
    });
  }

  render();
})();
