/* Questionário de múltipla escolha. Os dados vêm de quiz-dados.js
 * (window.QZ_DADOS) — arquivo JS, e não JSON, porque fetch() não funciona
 * quando a página é aberta direto do disco (file://). */
(function () {
  var dados = window.QZ_DADOS || [];
  var lista = document.getElementById('qz-lista');
  var placar = document.getElementById('qz-score');
  var filtros = document.getElementById('qz-filtros');
  if (!lista || !placar || !filtros) return;

  var LETRAS = ['A', 'B', 'C', 'D', 'E'];
  var respondidas = {};
  var acertos = 0;
  var temaAtivo = '*';

  document.querySelectorAll('[data-qz-total]').forEach(function (el) { el.textContent = dados.length; });

  // filtros gerados a partir dos próprios dados: nenhum tema fica sem botão
  var temas = [];
  dados.forEach(function (d) {
    if (!temas.some(function (t) { return t.s === d.s; })) temas.push({ s: d.s, t: d.t });
  });
  function botao(s, t, ativo) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('data-t', s);
    b.setAttribute('aria-pressed', ativo ? 'true' : 'false');
    b.innerHTML = t;
    return b;
  }
  filtros.insertBefore(botao('*', 'Tudo', true), placar);
  temas.forEach(function (t) {
    var n = dados.filter(function (d) { return d.s === t.s; }).length;
    filtros.insertBefore(botao(t.s, t.t + ' · ' + n, false), placar);
  });

  function atualizaPlacar() {
    var n = Object.keys(respondidas).length;
    if (!n) { placar.innerHTML = '0 de ' + dados.length + ' respondidas'; return; }
    placar.innerHTML = '<b>' + acertos + '</b> / ' + n + ' certas &middot; ' + n + ' de ' + dados.length + ' respondidas';
  }

  function marca(card, item, j) {
    var bs = card.querySelectorAll('.qz-opt');
    for (var k = 0; k < bs.length; k++) {
      bs[k].disabled = true;
      if (k === item.c) bs[k].classList.add('is-right');
      else if (k === j) bs[k].classList.add('is-wrong');
    }
    var w = card.querySelector('.qz-why');
    w.innerHTML = '<strong>' + (j === item.c ? 'Isso.' : 'A certa era a ' + LETRAS[item.c] + '.') + '</strong> ' + item.e;
    w.hidden = false;
  }

  function cartao(item, i) {
    var card = document.createElement('div');
    card.className = 'qz-card';
    card.innerHTML =
      '<div class="qz-tag"><span class="n">' + String(i + 1).padStart(2, '0') + '</span><span>' + item.t + '</span></div>' +
      '<p class="qz-q">' + item.q + '</p><div class="qz-opts"></div><div class="qz-why" hidden></div>';
    var opts = card.querySelector('.qz-opts');
    item.o.forEach(function (texto, j) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'qz-opt';
      b.innerHTML = '<span class="k">' + LETRAS[j] + '</span><span>' + texto + '</span>';
      b.addEventListener('click', function () {
        if (respondidas[i] !== undefined) return;
        respondidas[i] = j;
        if (j === item.c) acertos++;
        marca(card, item, j);
        atualizaPlacar();
      });
      opts.appendChild(b);
    });
    if (respondidas[i] !== undefined) marca(card, item, respondidas[i]);
    return card;
  }

  function render() {
    lista.innerHTML = '';
    var algum = false;
    dados.forEach(function (item, i) {
      if (temaAtivo !== '*' && item.s !== temaAtivo) return;
      algum = true;
      lista.appendChild(cartao(item, i));
    });
    if (!algum) lista.innerHTML = '<p class="qz-empty">Nenhuma questão neste tema.</p>';
  }

  filtros.addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-t]');
    if (!b) return;
    temaAtivo = b.getAttribute('data-t');
    filtros.querySelectorAll('button[data-t]').forEach(function (o) {
      o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
    });
    render();
  });

  render();
  atualizaPlacar();
})();
