/* Questionário de múltipla escolha. Os dados vêm de quiz-dados.js
 * (window.QZ_DADOS) — arquivo JS, e não JSON, porque fetch() não funciona
 * quando a página é aberta direto do disco (file://).
 *
 * - As alternativas são embaralhadas a cada rodada: decorar a letra não ajuda.
 * - O histórico de cada questão (última resposta, tentativas, acertos) fica no
 *   localStorage em "gabarito-teoria-quiz", pelo id que o build gera, e entra no
 *   backup da capa.
 * - Modos: todas, só as nunca respondidas, só as que você errou da última vez.
 */
(function () {
  var KEY_QUIZ = 'gabarito-teoria-quiz';
  var dados = window.QZ_DADOS || [];
  var lista = document.getElementById('qz-lista');
  var placar = document.getElementById('qz-score');
  var filtros = document.getElementById('qz-filtros');
  if (!lista || !placar || !filtros) return;

  function carrega() {
    try { var raw = localStorage.getItem(KEY_QUIZ); return raw ? JSON.parse(raw) : {}; }
    catch (e) { return {}; }
  }
  function salva() {
    try { localStorage.setItem(KEY_QUIZ, JSON.stringify(hist)); } catch (e) {}
  }

  var LETRAS = ['A', 'B', 'C', 'D', 'E'];
  var hist = carrega();       // id -> { r: 'certo' | 'errado', t: tentativas, a: acertos, em: ISO }
  var rodada = {};            // id -> índice ORIGINAL escolhido nesta rodada
  var ordemOpcoes = {};       // id -> permutação das alternativas nesta rodada
  var ordemQuestoes = null;   // null = ordem do guia; senão, índices embaralhados
  var temaAtivo = '*';
  var modo = 'todas';

  function embaralha(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function permDe(item) {
    if (!ordemOpcoes[item.id]) ordemOpcoes[item.id] = embaralha(item.o.map(function (_, j) { return j; }));
    return ordemOpcoes[item.id];
  }

  document.querySelectorAll('[data-qz-total]').forEach(function (el) { el.textContent = dados.length; });

  /* ---------- Barra de modos e ações (criada aqui, acima dos temas) ---------- */
  var modos = document.createElement('div');
  modos.className = 'qz-bar qz-modos';
  modos.setAttribute('role', 'group');
  modos.setAttribute('aria-label', 'Modo do questionário');
  filtros.parentNode.insertBefore(modos, filtros);
  filtros.setAttribute('role', 'group');
  filtros.setAttribute('aria-label', 'Filtrar por tema');

  function botao(attr, valor, rotulo, ativo) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute(attr, valor);
    if (ativo !== undefined) b.setAttribute('aria-pressed', ativo ? 'true' : 'false');
    b.innerHTML = rotulo;
    return b;
  }
  var MODOS = [
    { m: 'todas', t: 'Todas' },
    { m: 'novas', t: 'Nunca respondidas' },
    { m: 'revisar', t: 'Para revisar' },
  ];
  MODOS.forEach(function (x) { modos.appendChild(botao('data-modo', x.m, x.t, x.m === modo)); });
  var bEmbaralhar = botao('data-acao', 'embaralhar', 'Embaralhar questões', false);
  var bRodada = botao('data-acao', 'rodada', 'Nova rodada');
  var bZerar = botao('data-acao', 'zerar', 'Zerar histórico');
  [bEmbaralhar, bRodada, bZerar].forEach(function (b) { b.classList.add('qz-acao'); modos.appendChild(b); });
  bEmbaralhar.classList.add('qz-sep'); // empurra as ações pra direita, separadas dos modos

  // filtros de tema gerados a partir dos próprios dados: nenhum tema fica sem botão
  var temas = [];
  dados.forEach(function (d) {
    if (!temas.some(function (t) { return t.s === d.s; })) temas.push({ s: d.s, t: d.t });
  });
  filtros.insertBefore(botao('data-t', '*', 'Tudo', true), placar);
  var botoesTema = {};
  temas.forEach(function (t) {
    var b = botao('data-t', t.s, t.t, false);
    botoesTema[t.s] = { b: b, t: t.t };
    filtros.insertBefore(b, placar);
  });

  /* ---------- Contagens ---------- */
  function entraNoModo(item) {
    var h = hist[item.id];
    if (modo === 'novas') return !h;
    if (modo === 'revisar') return !!h && h.r === 'errado';
    return true;
  }
  function visiveis() {
    var idx = ordemQuestoes || dados.map(function (_, i) { return i; });
    return idx.filter(function (i) {
      var d = dados[i];
      return (temaAtivo === '*' || d.s === temaAtivo) && entraNoModo(d);
    });
  }
  function atualizaContagens() {
    // o número em cada tema respeita o modo: em "Para revisar", mostra quantas há pra revisar ali
    temas.forEach(function (t) {
      var n = dados.filter(function (d) { return d.s === t.s && entraNoModo(d); }).length;
      var bt = botoesTema[t.s];
      bt.b.innerHTML = bt.t + ' &middot; ' + n;
      bt.b.classList.toggle('is-vazio', n === 0);
    });
  }
  function atualizaPlacar() {
    var ids = Object.keys(rodada);
    var certas = ids.filter(function (id) {
      var d = porId[id];
      return d && rodada[id] === d.c;
    }).length;
    var respondidasHist = dados.filter(function (d) { return hist[d.id]; }).length;
    var revisar = dados.filter(function (d) { return hist[d.id] && hist[d.id].r === 'errado'; }).length;
    placar.innerHTML =
      (ids.length ? 'rodada: <b>' + certas + '</b> / ' + ids.length + ' certas &middot; ' : '') +
      'histórico: ' + respondidasHist + ' de ' + dados.length + ' &middot; ' +
      '<span class="qz-rev">' + revisar + ' pra revisar</span>';
  }
  var porId = {};
  dados.forEach(function (d) { porId[d.id] = d; });

  /* ---------- Cartões ---------- */
  function rotuloHist(h) {
    if (!h) return '';
    var txt = h.r === 'certo' ? 'acertou da última vez' : 'errou da última vez';
    return '<span class="qz-hist ' + (h.r === 'certo' ? 'ok' : 'nok') + '">' + txt + ' &middot; ' + h.a + '/' + h.t + '</span>';
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

  function cartao(item, n) {
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
        var certo = orig === item.c;
        var h = hist[item.id] || { t: 0, a: 0 };
        hist[item.id] = { r: certo ? 'certo' : 'errado', t: h.t + 1, a: h.a + (certo ? 1 : 0), em: new Date().toISOString() };
        salva();
        marca(card, item, orig);
        // o cartão continua na tela mesmo que saia do modo atual (ex.: acertou em "Para revisar");
        // ele só some na próxima troca de filtro ou rodada, pra dar tempo de ler a explicação
        atualizaPlacar();
      });
      opts.appendChild(b);
    });
    if (rodada[item.id] !== undefined) marca(card, item, rodada[item.id]);
    return card;
  }

  function vazio() {
    if (modo === 'revisar') return 'Nada pra revisar' + (temaAtivo === '*' ? '' : ' neste tema') + ': nenhuma questão errada da última vez.';
    if (modo === 'novas') return 'Você já respondeu todas' + (temaAtivo === '*' ? '' : ' deste tema') + '. Use "Para revisar" ou "Todas".';
    return 'Nenhuma questão neste tema.';
  }

  function render() {
    lista.innerHTML = '';
    var vis = visiveis();
    vis.forEach(function (i, k) { lista.appendChild(cartao(dados[i], k + 1)); });
    if (!vis.length) lista.innerHTML = '<p class="qz-empty">' + vazio() + '</p>';
    atualizaContagens();
    atualizaPlacar();
  }

  /* ---------- Eventos ---------- */
  filtros.addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-t]');
    if (!b) return;
    temaAtivo = b.getAttribute('data-t');
    filtros.querySelectorAll('button[data-t]').forEach(function (o) {
      o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
    });
    render();
  });

  modos.addEventListener('click', function (ev) {
    var b = ev.target.closest('button');
    if (!b) return;
    var m = b.getAttribute('data-modo');
    if (m) {
      modo = m;
      modos.querySelectorAll('button[data-modo]').forEach(function (o) {
        o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
      });
      // mudar de modo começa uma rodada limpa: em "Para revisar", a questão volta sem resposta
      rodada = {};
      render();
      return;
    }
    var acao = b.getAttribute('data-acao');
    if (acao === 'embaralhar') {
      var ligado = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', ligado ? 'true' : 'false');
      ordemQuestoes = ligado ? embaralha(dados.map(function (_, i) { return i; })) : null;
      render();
    } else if (acao === 'rodada') {
      rodada = {};
      ordemOpcoes = {};
      if (ordemQuestoes) ordemQuestoes = embaralha(ordemQuestoes);
      render();
      window.scrollTo({ top: lista.getBoundingClientRect().top + window.scrollY - 120 });
    } else if (acao === 'zerar') {
      if (!window.confirm('Apagar o histórico do questionário neste navegador? Tópicos e leituras não são afetados.')) return;
      hist = {};
      salva();
      rodada = {};
      render();
    }
  });

  render();
})();
