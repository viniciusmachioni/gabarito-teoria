// Gera o site publicado (index.html, paginas/, assets/css/estilo.css,
// assets/js/quiz-dados.js) a partir das fontes em _montagem/.
// Uso: node _montagem/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MONT = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(MONT, '..');
const ler = (p) => fs.readFileSync(p, 'utf8');
const existe = (p) => fs.existsSync(p);
function grava(rel, conteudo) {
  const p = path.join(RAIZ, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, conteudo);
}
const avisos = [];
const avisa = (m) => avisos.push(m);
const semTags = (s) => s.replace(/<[^>]+>/g, '');

/* ------------------------------------------------------------------ */
/* Registro das páginas, na ordem de leitura                          */
/* ------------------------------------------------------------------ */
const GRUPOS = {
  roadmap: 'Roadmap da mentoria · First Trial · foco atual',
  nucleo: 'Núcleo · 5 semanas',
  bonus: 'Bônus · material de consulta',
  novos: 'Lacunas de sênior · Brasil e exterior',
  pratica: 'Prática',
};

// As páginas do roadmap vêm primeiro: são o foco atual. O resto do guia continua igual logo depois.
const PAGINAS = [
  { slug: 'r00-mapa', fonte: 'roadmap', num: 'R0', grupo: 'roadmap', titulo: 'Mapa: roadmap × Gabarita e Ally AI', foco: 'Mapa do roadmap &mdash; cada item, o que você já fez no Gabarita e no Ally AI, e o que falta', tempo: '~30min' },
  { slug: 'r01-ai-frontend', fonte: 'roadmap', num: 'R1', grupo: 'roadmap', titulo: 'AI-Powered Frontend', foco: 'AI-Powered Frontend &mdash; streaming, tool calling, structured outputs, Generative UI', tempo: '~8h' },
  { slug: 'r02-design-systems', fonte: 'roadmap', num: 'R2', grupo: 'roadmap', titulo: 'Design Systems & Design Engineering', foco: 'Design Systems &amp; Design Engineering &mdash; tokens, variantes, Storybook, Figma, regressão visual', tempo: '~8h' },
  { slug: 'r03-arquitetura-frontend', fonte: 'roadmap', num: 'R3', grupo: 'roadmap', titulo: 'Frontend Architecture', foco: 'Frontend Architecture &mdash; monorepo, microfrontends, rendering/caching no Next.js, Web Vitals', tempo: '~8h' },
  { slug: 'r04-ai-fullstack', fonte: 'roadmap', num: 'R4', grupo: 'roadmap', titulo: 'AI + Full Stack Integration', foco: 'AI + Full Stack &mdash; Next.js com Node/.NET, auth, upload, filas, LLM + PostgreSQL, testes de fluxo de IA', tempo: '~8h' },
  { slug: 'r05-cloud-aws', fonte: 'roadmap', num: 'R5', grupo: 'roadmap', titulo: 'Cloud & Delivery na AWS', foco: 'Cloud &amp; Delivery &mdash; Next.js na AWS, CI/CD, observabilidade, ambientes, secrets e CDN', tempo: '~8h' },
  { slug: 'r06-proximo-nivel', fonte: 'roadmap', num: 'R6', grupo: 'roadmap', titulo: 'Aprofundamento: MCP, AI UX, multi-cloud', foco: 'Próximo nível &mdash; MCP, padrões de AI UX, frontend distribuído e multi-cloud', tempo: '~6h' },
  { slug: 'r07-linkedin', fonte: 'roadmap', num: 'R7', grupo: 'roadmap', titulo: 'Ativação LinkedIn estratégica', foco: 'Ativação LinkedIn &mdash; headline, rede internacional, posts técnicos e candidaturas', tempo: 'contínuo' },
  { slug: 'r08-pratica', fonte: 'roadmap', num: 'R8', grupo: 'roadmap', titulo: 'Prática: live coding e system design de IA', foco: 'Prática &mdash; 12 exercícios de live coding (streaming, Playwright, CI, MCP, pgvector, Storybook, Server Components, toast) e o system design de uma interface de chat com IA, com solução comentada', tempo: '~16h' },
  { slug: '01-javascript-react', fonte: 's1', num: '01', grupo: 'nucleo', titulo: 'JavaScript & React', foco: 'JavaScript &amp; React &mdash; os modelos mentais por trás dos seus hooks', tempo: '~8h' },
  { slug: '02-nextjs-tailwind', fonte: 's2', num: '02', grupo: 'nucleo', titulo: 'Next.js & Tailwind', foco: 'Next.js (renderização, cache, edge) &amp; a filosofia do Tailwind', tempo: '~8h' },
  { slug: '03-postgresql', fonte: 's3', num: '03', grupo: 'nucleo', titulo: 'PostgreSQL', foco: 'PostgreSQL &mdash; MVCC, índices, pooling e por que não é MySQL', tempo: '~10h' },
  { slug: '04-concorrencia', fonte: 's4', num: '04', grupo: 'nucleo', titulo: 'Concorrência', foco: 'Concorrência: SO, event loop, filas e tempo real', tempo: '~10h' },
  { slug: '05-seguranca-historia', fonte: 's5', num: '05', grupo: 'nucleo', titulo: 'Segurança & a história do projeto', foco: 'Segurança, performance &amp; como contar a história do projeto', tempo: '~8h' },
  { slug: 'b01-system-design', fonte: 's6', num: 'B1', grupo: 'bonus', titulo: 'System design', foco: 'System design &mdash; escala, cache, CAP', tempo: '~6h' },
  { slug: 'b02-ia-agentes', fonte: 's7', num: 'B2', grupo: 'bonus', titulo: 'IA, agentes & harnesses', foco: 'IA, agentes de código &amp; harnesses', tempo: '~5h' },
  { slug: 'b03-arquitetura-patterns', fonte: 's8', num: 'B3', grupo: 'bonus', titulo: 'Arquitetura & design patterns', foco: 'Arquitetura &amp; design patterns', tempo: '~6h' },
  { slug: 'b04-typescript', fonte: 's9', num: 'B4', grupo: 'bonus', titulo: 'TypeScript de verdade', foco: 'TypeScript de verdade &mdash; generics, narrowing, tipos derivados', tempo: '~5h' },
  { slug: 'b05-http-redes', fonte: 's10', num: 'B5', grupo: 'bonus', titulo: 'HTTP & redes', foco: 'HTTP, redes &amp; como a web funciona', tempo: '~5h' },
  { slug: 'b06-oauth', fonte: 's11', num: 'B6', grupo: 'bonus', titulo: 'OAuth & autenticação federada', foco: 'Autenticação federada &amp; OAuth', tempo: '~4h' },
  { slug: 'b07-fundamentos', fonte: 's12', num: 'B7', grupo: 'bonus', titulo: 'Fundamentos soltos', foco: 'Fundamentos soltos (Big-O, Docker, Git, SOLID...)', tempo: '~5h' },
  { slug: 'b08-algoritmos', fonte: 's13', num: 'B8', grupo: 'bonus', titulo: 'Algoritmos & LeetCode', foco: 'Algoritmos, estruturas de dados &amp; LeetCode', tempo: '~8h+' },
  { slug: 'b09-arquiteturas', fonte: 's14', num: 'B9', grupo: 'bonus', titulo: 'Arquiteturas de software', foco: 'Arquiteturas de software: catálogo, contextos e a escolha', tempo: '~10h' },
  { slug: 'b10-testes', fonte: 'novo', num: 'B10', grupo: 'novos', titulo: 'Testes & qualidade', foco: 'Testes &amp; qualidade &mdash; Testing Library, Playwright, mocks e testes instáveis', tempo: '~6h' },
  { slug: 'b11-acessibilidade', fonte: 'novo', num: 'B11', grupo: 'novos', titulo: 'Acessibilidade & HTML semântico', foco: 'Acessibilidade &amp; HTML semântico &mdash; WCAG, ARIA, foco e leitor de tela', tempo: '~6h' },
  { slug: 'b12-css', fonte: 'novo', num: 'B12', grupo: 'novos', titulo: 'CSS moderno & layout', foco: 'CSS moderno &amp; layout &mdash; cascata, camadas, grid e container queries', tempo: '~6h' },
  { slug: 'b13-navegador-performance', fonte: 'novo', num: 'B13', grupo: 'novos', titulo: 'O navegador por dentro & performance', foco: 'O navegador por dentro &amp; performance de front-end', tempo: '~7h' },
  { slug: 'b14-frontend-system-design', fonte: 'novo', num: 'B14', grupo: 'novos', titulo: 'Front-end system design', foco: 'Front-end system design &mdash; a entrevista que só vaga de front tem', tempo: '~7h' },
  { slug: 'b15-react-estado', fonte: 'novo', num: 'B15', grupo: 'novos', titulo: 'React avançado & estado no cliente', foco: 'React avançado &amp; estado no cliente &mdash; React 19, server state, formulários', tempo: '~6h' },
  { slug: 'b16-apis', fonte: 'novo', num: 'B16', grupo: 'novos', titulo: 'Design de APIs', foco: 'Design de APIs &mdash; REST maduro, GraphQL, tRPC, BFF e webhooks', tempo: '~6h' },
  { slug: 'b17-producao', fonte: 'novo', num: 'B17', grupo: 'novos', titulo: 'Produção: observabilidade & CI/CD', foco: 'Produção &mdash; observabilidade, CI/CD, feature flags e incidentes', tempo: '~6h' },
  { slug: 'b18-senioridade', fonte: 'novo', num: 'B18', grupo: 'novos', titulo: 'Senioridade & comportamental', foco: 'Senioridade &mdash; liderança técnica, design docs e entrevista comportamental', tempo: '~5h' },
  { slug: 'b19-processo-seletivo', fonte: 'novo', num: 'B19', grupo: 'novos', titulo: 'O processo seletivo, aqui e lá fora', foco: 'O processo seletivo no Brasil e no exterior &mdash; currículo, inglês, negociação, contrato', tempo: '~5h' },
  { slug: 'historias', fonte: 'star', num: '&#9733;', grupo: 'pratica', titulo: 'Histórias do Gabarita', foco: 'Como contar a história do Gabarita numa entrevista (STAR)', tempo: '~2h' },
  { slug: 'pratica', fonte: 'pratica', num: '&#9733;', grupo: 'pratica', titulo: 'Onde se testar', foco: 'Onde se testar &mdash; plataformas de quiz, exercício e simulação', tempo: 'contínuo' },
  { slug: 'quiz', fonte: 'quiz', num: '&#9733;', grupo: 'pratica', titulo: 'Questionário rápido', foco: 'Questionário rápido &mdash; múltipla escolha com correção na hora', tempo: '~45min' },
];

// Trilhas por vaga: ordem sugerida de páginas pra cada alvo.
const TRILHAS = [
  {
    nome: 'Senior Front-end · Brasil',
    quem: 'produto, fintech, e-commerce, consultoria',
    passos: ['01-javascript-react', '02-nextjs-tailwind', 'b04-typescript', 'b15-react-estado', 'b12-css', 'b13-navegador-performance', 'b11-acessibilidade', 'b10-testes', '05-seguranca-historia', 'historias'],
    nota: 'O processo típico aqui é conversa técnica + live coding de componente ou take-home. Pesa mais profundidade em React, TypeScript e performance do que LeetCode.',
  },
  {
    nome: 'Senior Front-end · exterior',
    quem: 'remoto pra EUA/Europa, big tech, scale-ups',
    passos: ['b19-processo-seletivo', 'b08-algoritmos', 'b14-frontend-system-design', '01-javascript-react', 'b13-navegador-performance', 'b11-acessibilidade', 'b15-react-estado', 'b10-testes', 'b18-senioridade', 'quiz'],
    nota: 'Espere algoritmo cronometrado, front-end system design e uma rodada comportamental inteira em inglês. Acessibilidade é cobrada de verdade.',
  },
  {
    nome: 'Software Engineer · Brasil',
    quem: 'full-stack ou back-end, times de produto',
    passos: ['03-postgresql', '04-concorrencia', 'b16-apis', 'b03-arquitetura-patterns', 'b01-system-design', 'b17-producao', 'b09-arquiteturas', 'b06-oauth', 'b08-algoritmos', 'historias'],
    nota: 'Banco, concorrência e desenho de API são o centro. SQL costuma substituir a questão de algoritmo; system design aparece a partir de sênior.',
  },
  {
    nome: 'Software Engineer · exterior',
    quem: 'loops de big tech e startups remotas',
    passos: ['b19-processo-seletivo', 'b08-algoritmos', 'b01-system-design', 'b09-arquiteturas', '04-concorrencia', '03-postgresql', 'b17-producao', 'b18-senioridade', 'pratica', 'quiz'],
    nota: 'Duas rodadas de algoritmo, uma de system design e uma comportamental é o formato mais comum. O nível (L4/L5, senior/staff) é decidido nas duas últimas.',
  },
];

/* ------------------------------------------------------------------ */
/* Leitura do original                                                */
/* ------------------------------------------------------------------ */
const original = ler(path.join(MONT, 'original', 'gabarito-da-teoria.html'));

// CSS: o do original + os acréscimos da versão em diretório
const cssBase = original.match(/<style>\n?([\s\S]*?)<\/style>/)[1];
grava('assets/css/estilo.css', cssBase.trimEnd() + '\n' + ler(path.join(MONT, 'estilo-extra.css')));

// Blocos delimitados por <!-- ===== NOME ===== -->
const partes = original.split(/<!-- =+ (.+?) =+ -->/);
const blocos = [];
for (let i = 1; i < partes.length; i += 2) blocos.push({ nome: partes[i], corpo: partes[i + 1] });

function recorta(corpo, abertura) {
  const ini = corpo.search(abertura);
  if (ini < 0) return null;
  const tag = corpo.slice(ini).match(/^<(section|details)/)[1];
  const fim = corpo.lastIndexOf('</' + tag + '>');
  return corpo.slice(ini, fim + tag.length + 3);
}

function abreSecao(html) {
  let h = html.trim();
  if (!h.startsWith('<details')) return h;
  h = h.replace(/^<details class="week"( id="[^"]+")>/, '<section class="week"$1>').replace(/<\/details>$/, '</section>');
  return h.replace(/<summary>\s*([\s\S]*?)\s*<\/summary>/, (_, dentro) =>
    dentro.replace(/<span class="chevron">[\s\S]*?<\/span>/, ''));
}

const secoesOriginais = {};
for (const b of blocos) {
  const id = (b.corpo.match(/class="week" id="([^"]+)"/) || [])[1];
  if (id) secoesOriginais[id] = abreSecao(recorta(b.corpo, /<(section|details) class="week" id=/));
  else if (/STAR/.test(b.nome)) {
    secoesOriginais.star = recorta(b.corpo, /<section class="week"/).replace(/<section class="week"[^>]*>/, '<section class="week" id="historias">');
  }
}

// Questionário: 42 originais + novas
const quizOriginal = JSON.parse(original.match(/<script id="qz-dados" type="application\/json">([\s\S]*?)<\/script>/)[1]);
let quizNovos = [];
const arqQuizNovos = path.join(MONT, 'quiz-novos.mjs');
if (existe(arqQuizNovos)) quizNovos = (await import(pathToFileURL(arqQuizNovos).href)).default;
// Questões do roadmap: um arquivo por página em _montagem/roadmap/quiz/, e entram NA FRENTE
// (os filtros do quiz seguem a ordem de aparição, então os temas do roadmap ficam primeiro).
let quizRoadmap = [];
const quizPorPagina = {}; // slug da página do roadmap -> as questões dela (o arquivo tem o nome do slug)
const dirQuizRoadmap = path.join(MONT, 'roadmap', 'quiz');
if (existe(dirQuizRoadmap)) {
  for (const f of fs.readdirSync(dirQuizRoadmap).filter((f) => f.endsWith('.mjs')).sort()) {
    const qs = (await import(pathToFileURL(path.join(dirQuizRoadmap, f)).href)).default;
    quizPorPagina[f.replace(/\.mjs$/, '')] = qs;
    quizRoadmap = quizRoadmap.concat(qs);
  }
}
const MIN_QUIZ_PAGINA = 10, MAX_QUIZ_PAGINA = 12; // meta de questões fechadas por página do roadmap
const quiz = quizRoadmap.concat(quizOriginal, quizNovos);
// id estável por questão (tema + hash do enunciado): é a chave do histórico do quiz no localStorage.
// Editar o enunciado zera o histórico só daquela questão.
const hash = (str) => { let h = 5381; for (const ch of str) h = ((h * 33) ^ ch.codePointAt(0)) >>> 0; return h.toString(36); };
const idsQuiz = new Set();
// Qualidade: a alternativa certa não pode se entregar pelo tamanho. Regra dura: certa <= 1,1 x a maior errada.
const tamanho = (s) => semTags(s).replace(/&[a-z#0-9]+;/gi, 'x').length;
let certaMaisLonga = 0;
quiz.forEach((q, i) => {
  if (!q.t || !q.s || !q.q || !Array.isArray(q.o) || typeof q.c !== 'number' || !q.e || q.c >= q.o.length) { avisa('questão ' + (i + 1) + ' mal formada'); return; }
  q.id = q.s + '-' + hash(semTags(q.q));
  if (idsQuiz.has(q.id)) avisa('quiz: enunciado repetido em ' + q.s + ': ' + semTags(q.q).slice(0, 60));
  idsQuiz.add(q.id);
  const certa = tamanho(q.o[q.c]);
  const maiorErrada = Math.max(...q.o.filter((_, j) => j !== q.c).map(tamanho));
  if (certa > maiorErrada) certaMaisLonga++;
  if (certa > 1.1 * maiorErrada) avisa('quiz: a certa é bem mais longa que as erradas (' + certa + ' vs ' + maiorErrada + ') em ' + q.s + ': ' + semTags(q.q).slice(0, 60));
  if (/[^&](mdash|ndash|hellip|rarr|larr|middot);/.test(q.q + q.o.join('') + q.e)) avisa('quiz: entidade HTML quebrada em ' + q.s + ': ' + semTags(q.q).slice(0, 60));
});
const pctMaisLonga = Math.round((100 * certaMaisLonga) / quiz.length);
if (pctMaisLonga > 35) avisa('quiz: a certa é a mais longa em ' + pctMaisLonga + '% das questões (o esperado num quiz sem viés é ~25%)');
grava('assets/js/quiz-dados.js',
  '/* Gerado por _montagem/build.mjs — não editar à mão. */\nwindow.QZ_DADOS = [\n' +
  quiz.map((q) => JSON.stringify(q)).join(',\n') + '\n];\n');

/* ------------------------------------------------------------------ */
/* Leituras embutidas                                                 */
/* ------------------------------------------------------------------ */
const normaliza = (u) => u.replace(/&amp;/g, '&').replace(/\/+$/, '');
const idDe = (slug, href) => slug + '--' + normaliza(href).replace(/^https?:\/\/(www\.)?/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 70).toLowerCase();
const dominio = (href) => href.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];

function artigosDe(slug) {
  const p = path.join(MONT, 'leituras', slug + '.html');
  if (!existe(p)) return [];
  return [...ler(p).matchAll(/<article([^>]*)>([\s\S]*?)<\/article>/g)].map((m) => ({
    href: (m[1].match(/data-href="([^"]+)"/) || [])[1],
    titulo: (m[1].match(/data-title="([^"]+)"/) || [])[1] || '',
    corpo: m[2].trim(),
  }));
}

function blocoLeitura(slug, a) {
  return '<details class="leitura" data-id="' + idDe(slug, a.href) + '"><summary>Resumo aqui na página</summary>' +
    '<div class="leitura-body">\n' + a.corpo +
    '\n<div class="leitura-foot"><span>Resumo em português do recorte indicado &middot; original em <a href="' + a.href + '" target="_blank" rel="noopener">' + dominio(a.href) + '</a></span>' +
    '<button type="button" aria-pressed="false">Marcar como lida</button></div></div></details>';
}

function embuteLeituras(slug, html) {
  const artigos = artigosDe(slug);
  if (!artigos.length) return { html, n: 0 };
  const soltos = [];
  for (const a of artigos) {
    if (!a.href) { avisa(slug + ': <article> sem data-href'); continue; }
    const re = /<li><div class="r-title"><a href="([^"]+)"/g;
    let m, alvo = -1;
    while ((m = re.exec(html))) if (normaliza(m[1]) === normaliza(a.href)) { alvo = m.index; break; }
    if (alvo < 0) { soltos.push(a); continue; }
    const fim = html.indexOf('</li>', alvo);
    html = html.slice(0, fim) + blocoLeitura(slug, a) + html.slice(fim);
  }
  if (soltos.length) {
    const lista = '\n    <h3 class="sub">Leituras resumidas</h3>\n    <ul class="resources">\n' + soltos.map((a) => {
      if (!a.titulo) avisa(slug + ': leitura sem recurso correspondente e sem data-title: ' + a.href);
      return '      <li><div class="r-title"><a href="' + a.href + '" target="_blank" rel="noopener">' + (a.titulo || dominio(a.href)) + '</a></div><div class="r-src">' + dominio(a.href) + '</div>' + blocoLeitura(slug, a) + '</li>';
    }).join('\n') + '\n    </ul>\n';
    const fimSecao = html.lastIndexOf('</section>');
    html = html.slice(0, fimSecao) + lista + '  ' + html.slice(fimSecao);
  }
  const barra = '<p class="leituras-bar" data-leituras-pagina></p>\n    ';
  const primeiraLista = html.indexOf('<ul class="resources">');
  html = html.slice(0, primeiraLista) + barra + html.slice(primeiraLista);
  return { html, n: artigos.length };
}

/* ------------------------------------------------------------------ */
/* Montagem das páginas                                               */
/* ------------------------------------------------------------------ */
function conteudoDe(p) {
  if (p.fonte === 'novo' || p.fonte === 'roadmap') {
    const arq = path.join(MONT, p.fonte === 'novo' ? 'novos' : 'roadmap', p.slug + '.html');
    return existe(arq) ? ler(arq).trim() : null;
  }
  if (p.fonte === 'star') return secoesOriginais.star;
  if (p.fonte === 'quiz') {
    return secoesOriginais.quiz
      .replace(/<div class="qz-bar" id="qz-filtros">[\s\S]*?<\/div>/, '<div class="qz-bar" id="qz-filtros">\n        <span class="qz-score" id="qz-score"></span>\n      </div>')
      .replace(/42 quest/g, '<span data-qz-total>' + quiz.length + '</span> quest')
      .replace(/nada &eacute; salvo/, 'alternativas embaralhadas a cada rodada &middot; histórico salvo neste navegador')
      .replace(/(Filtre por tema pra revisar antes de uma entrevista espec&iacute;fica\.)/, '$1 O histórico guarda a última resposta de cada questão: <strong>Para revisar</strong> traz de volta só as que você errou, e <strong>Nova rodada</strong> limpa as respostas da tela e embaralha as alternativas de novo, então decorar a letra não adianta. O histórico entra no <a href="../index.html#backup">backup</a> da capa.');
  }
  return secoesOriginais[p.fonte] || null;
}

// <pre><code class="esc"> nas fontes: o código é escrito cru (com < > & de verdade) e escapado aqui.
// Evita escrever JSX e TypeScript inteiros com &lt; &gt; à mão.
const escapaCodigo = (html) => html.replace(/<pre><code class="esc">([\s\S]*?)<\/code><\/pre>/g, (_, c) =>
  '<pre><code>' + c.replace(/^\r?\n/, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>');

// Bloco de múltipla escolha no fim da página do roadmap. As questões vão como JSON na própria página
// (só as dela) e quiz-pagina.js monta os cartões; o histórico é o mesmo do Questionário rápido.
function blocoQuizPagina(html, qs) {
  const dados = JSON.stringify(qs.map((q) => ({ id: q.id, t: q.t, q: q.q, o: q.o, c: q.c, e: q.e })))
    .replace(/</g, '\\u003c');
  const bloco = '\n  <div class="qz-pagina" data-qz-pagina>\n' +
    '    <h3 class="sub">Múltipla escolha desta página</h3>\n' +
    '    <p class="qz-pagina-intro">' + qs.length + ' questões fechadas, com as alternativas embaralhadas a cada rodada. As respostas contam no <a href="quiz.html">Questionário rápido</a> (mesmo histórico). Tente sem reabrir a página.</p>\n' +
    '    <div class="qz-bar qz-pagina-barra"><span class="qz-score qz-pagina-placar" aria-live="polite"></span>' +
    '<button type="button" class="qz-acao" data-acao="rodada">Nova rodada</button></div>\n' +
    '    <div class="qz-pagina-lista"></div>\n' +
    '    <script type="application/json" class="qz-pagina-dados">' + dados + '</script>\n' +
    '  </div>\n';
  const fim = html.lastIndexOf('</section>');
  return html.slice(0, fim) + bloco + html.slice(fim);
}

const publicadas = [];
for (const p of PAGINAS) {
  const bruto = conteudoDe(p);
  const c = bruto && escapaCodigo(bruto);
  if (!c) { avisa('pendente: ' + p.slug + ' (' + p.fonte + ')'); continue; }
  let { html, n } = embuteLeituras(p.slug, c);
  let nQuiz = 0;
  if (p.fonte === 'roadmap') {
    const qs = quizPorPagina[p.slug] || [];
    nQuiz = qs.length;
    if (nQuiz < MIN_QUIZ_PAGINA || nQuiz > MAX_QUIZ_PAGINA) avisa(p.slug + ': ' + nQuiz + ' questões de múltipla escolha (meta: ' + MIN_QUIZ_PAGINA + ' a ' + MAX_QUIZ_PAGINA + ')');
    if (qs.length) html = blocoQuizPagina(html, qs);
  }
  const ids = [...html.matchAll(/<input type="checkbox" id="([^"]+)"/g)].map((m) => m[1]);
  const prefixos = [...new Set(ids.map((id) => id.replace(/\d+$/, '')))];
  if (prefixos.length > 1) avisa(p.slug + ': checkboxes com prefixos diferentes ' + prefixos.join(', '));
  ids.forEach((id, i) => { if (id !== prefixos[0] + (i + 1)) avisa(p.slug + ': id fora de sequência ' + id); });
  publicadas.push({ ...p, html, leituras: n, fechadas: nQuiz, prefixo: prefixos[0] || '', topicos: ids.length, perguntas: (html.match(/<details class="ans">/g) || []).length });
}

// ids únicos no site todo (o progresso é uma chave só)
const vistos = new Map();
for (const p of publicadas) for (const m of p.html.matchAll(/<input type="checkbox" id="([^"]+)"/g)) {
  if (vistos.has(m[1])) avisa('id de checkbox repetido: ' + m[1] + ' em ' + vistos.get(m[1]) + ' e ' + p.slug);
  vistos.set(m[1], p.slug);
}

const totais = {
  topicos: publicadas.reduce((s, p) => s + p.topicos, 0),
  leituras: publicadas.reduce((s, p) => s + p.leituras, 0),
  perguntas: publicadas.reduce((s, p) => s + p.perguntas, 0),
  fechadasRoadmap: publicadas.reduce((s, p) => s + (p.fechadas || 0), 0),
  blocos: publicadas.filter((p) => p.grupo !== 'pratica').length,
  roadmap: publicadas.filter((p) => p.grupo === 'roadmap').length,
};

const HOJE = new Date().toLocaleDateString('pt-BR');
const rodape = (prefixo) =>
  '<footer>\n    O Gabarito da Teoria &middot; ' + totais.blocos + ' blocos &middot; ' + totais.topicos + ' tópicos &middot; ' + totais.leituras + ' leituras resumidas &middot; ' +
  totais.perguntas + ' perguntas abertas com gabarito &middot; ' + quiz.length + ' de múltipla escolha<br>' +
  'progresso salvo só neste navegador &mdash; faça backup pela <a href="' + prefixo + 'index.html#backup">capa</a> &middot; montado em ' + HOJE + '\n  </footer>';

function cabeca(titulo, prefixo) {
  return '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + titulo + '</title>\n' +
    '<link rel="icon" href="' + prefixo + 'assets/img/icone.svg" type="image/svg+xml">\n' +
    '<link rel="stylesheet" href="' + prefixo + 'assets/css/estilo.css">\n</head>\n<body>\n';
}

publicadas.forEach((p, i) => {
  const ant = publicadas[i - 1], prox = publicadas[i + 1];
  const pager = '  <nav class="pager" aria-label="Navegação entre páginas">\n' +
    (ant ? '    <a class="prev" href="' + ant.slug + '.html"><div class="dir">&larr; anterior</div><div class="t">' + ant.titulo.replace(/&(?![a-z#0-9]+;)/g, '&amp;') + '</div></a>\n' : '') +
    (prox ? '    <a class="next" href="' + prox.slug + '.html"><div class="dir">próxima &rarr;</div><div class="t">' + prox.titulo.replace(/&(?![a-z#0-9]+;)/g, '&amp;') + '</div></a>\n' : '') +
    '  </nav>';
  const scripts = '<script src="../assets/js/app.js"></script>\n' +
    (p.fonte === 'quiz' ? '<script src="../assets/js/quiz-dados.js"></script>\n<script src="../assets/js/quiz.js"></script>\n' : '') +
    (p.fechadas ? '<script src="../assets/js/quiz-pagina.js"></script>\n' : '');
  const doc = cabeca(p.titulo.replace(/&(?![a-z#0-9]+;)/g, '&amp;') + ' · O Gabarito da Teoria', '../') +
    '<div class="wrap pagina">\n' +
    '  <header class="topbar">\n' +
    '    <a class="brand" href="../index.html"><img src="../assets/img/icone.svg" alt=""><span>O <em>Gabarito</em> da Teoria</span></a>\n' +
    '    <nav class="topbar-links">\n      <a href="../index.html#indice">índice</a>\n      <a href="../index.html#trilhas">trilhas</a>\n      <a href="quiz.html">quiz</a>\n' +
    '      <span class="topbar-prog" data-prog-pagina></span>\n    </nav>\n  </header>\n\n  ' +
    p.html + '\n\n' + pager + '\n\n  ' + rodape('../') + '\n</div>\n' + scripts + '</body>\n</html>\n';
  grava('paginas/' + p.slug + '.html', doc);
});

// remove páginas geradas antes e que saíram do registro
const dirPaginas = path.join(RAIZ, 'paginas');
for (const f of fs.readdirSync(dirPaginas)) {
  if (!publicadas.some((p) => p.slug + '.html' === f)) fs.unlinkSync(path.join(dirPaginas, f));
}

/* ------------------------------------------------------------------ */
/* Capa                                                               */
/* ------------------------------------------------------------------ */
const porSlug = Object.fromEntries(publicadas.map((p) => [p.slug, p]));
const esc = (s) => s.replace(/&(?![a-z#0-9]+;)/g, '&amp;');

const trilhas = TRILHAS.map((t) =>
  '      <div class="trilha">\n        <h4>' + esc(t.nome) + '</h4>\n        <div class="quem">' + t.quem + '</div>\n        <ol>\n' +
  t.passos.map((s) => {
    const p = porSlug[s];
    const reg = PAGINAS.find((x) => x.slug === s);
    if (!reg) { avisa('trilha aponta pra página inexistente: ' + s); return ''; }
    return '          <li>' + (p ? '<a href="paginas/' + s + '.html">' : '') + '<span class="wk-n">' + reg.num + '</span> ' + esc(reg.titulo) + (p ? '</a>' : ' <em>(em breve)</em>') + '</li>\n';
  }).join('') +
  '        </ol>\n        <p>' + t.nota + '</p>\n      </div>').join('\n');

const linhas = Object.keys(GRUPOS).map((g) => {
  const ps = publicadas.filter((p) => p.grupo === g);
  if (!ps.length) return '';
  return '      <tr class="grupo"><td colspan="4">' + GRUPOS[g] + (g === 'roadmap' ? ' <span class="tag-novo">comece aqui</span>' : '') + '</td></tr>\n' +
    ps.map((p) => {
      const attrs = p.topicos ? ' data-prefix="' + p.prefixo + '" data-total="' + p.topicos + '"' : '';
      return '      <tr' + attrs + '><td class="wk">' + p.num + '</td><td><a href="paginas/' + p.slug + '.html">' + p.foco + '</a>' +
        (p.leituras ? ' <span class="r-count">&middot; ' + p.leituras + ' leituras</span>' : '') + '</td><td>' + p.tempo + '</td><td class="p">' + (p.topicos ? '' : '&mdash;') + '</td></tr>';
    }).join('\n');
}).join('\n');

const primeira = publicadas[0];

// Caixa "foco atual" da capa: as páginas do roadmap, em ordem, com o progresso de cada uma.
const paginasRoadmap = publicadas.filter((p) => p.grupo === 'roadmap');
const focoRoadmap = !paginasRoadmap.length ? '' :
`  <section class="week foco" id="roadmap">
    <div class="week-head"><span class="week-num">R</span><h2 style="font-size:22px;">Foco atual: o roadmap da mentoria</h2></div>
    <div class="week-meta">First Trial &middot; Design Engineer / Frontend Engineer com foco em IA &middot; tudo o que já existia continua aqui embaixo</div>
    <p class="intro">O roadmap tem sete frentes. Cada página abaixo cobre uma delas com o mesmo formato do resto do guia &mdash; tópicos, leituras resumidas, munição de entrevista e perguntas &mdash; e acrescenta três coisas: <strong>onde você já fez aquilo no Gabarita e no Ally AI</strong>, com o arquivo exato; a <strong>resposta honesta</strong> (&ldquo;não usei em produção; faria assim, por isso&rdquo;) para o que você ainda não fez; e um bloco de <strong>múltipla escolha</strong> no fim, com correção na hora. Os dois projetos ficam como estão, só de exemplo. Comece pelo mapa: ele mostra num lugar só o que já é história pra contar e o que ainda é lacuna, e a prática (R8) tem os exercícios que cobrem as lacunas.</p>
    <ol class="foco-lista">
` + paginasRoadmap.map((p) => {
  const attrs = p.topicos ? ' data-prefix="' + p.prefixo + '" data-total="' + p.topicos + '"' : '';
  return '      <li' + attrs + '><a href="paginas/' + p.slug + '.html"><span class="wk-n">' + p.num + '</span> ' + esc(p.titulo) + '</a><span class="p">' + (p.topicos ? '' : '&mdash;') + '</span></li>';
}).join('\n') + `
    </ol>
  </section>`;

const capa = cabeca('O Gabarito da Teoria', '') +
`<div class="wrap">

  <div class="eyebrow"><span class="dot"></span>GUIA DE ESTUDO &middot; SENIOR FRONT-END &amp; SOFTWARE ENGINEER &middot; BRASIL E EXTERIOR &middot; CUSTO ZERO</div>
  <div class="hero-mark">
    <img src="assets/img/icone.svg" alt="">
    <h1 class="title">O <em>Gabarito</em> da Teoria</h1>
  </div>
  <p class="lede">Você já escreveu autenticação com invalidação de sessão, um scheduler SM-2, uma fila com retry e uma CSP com nonce por request. A parte que falta não é prática &mdash; é <strong>saber nomear e defender</strong> o que você já fez, e preencher os buracos ao redor. Este roteiro usa o próprio Gabarita como estudo de caso, e agora cobre o que uma vaga sênior cobra aqui e lá fora.</p>

  <div class="stats">
    <div class="stat"><div class="n">${totais.blocos}</div><div class="d">blocos: ${totais.roadmap} do roadmap da mentoria, 5 semanas de núcleo, 9 bônus e 10 lacunas de sênior</div></div>
    <div class="stat"><div class="n" id="stat-total">${totais.topicos}</div><div class="d">tópicos, a maioria ancorada no seu código</div></div>
    <div class="stat"><div class="n">${totais.leituras}</div><div class="d">leituras resumidas na própria página &middot; <span id="stat-leituras-lidas">0</span> lidas</div></div>
  </div>

  <div class="howto">
    <strong>Como usar:</strong> escolha uma <a href="#trilhas">trilha por vaga</a> ou siga o <a href="#indice">índice</a> na ordem. Cada página tem: os tópicos pra marcar, onde ler &mdash; com o <strong>recorte exato</strong> e, logo abaixo de cada link, um <strong>resumo em português pra ler ali mesmo</strong>, sem pular de site em site &mdash;, um quadro <strong>&ldquo;munição da sua entrevista&rdquo;</strong> e perguntas pra responder em voz alta antes de abrir o gabarito. Reconhecer a resposta ao ler é uma habilidade diferente de produzi-la sob pressão, e só a segunda é avaliada numa entrevista.<br><br>O progresso (tópicos e leituras) fica salvo <strong>só neste navegador</strong>. Pra levar pra outro computador, use o <a href="#backup">backup</a> no fim desta página.
    <div class="progress-box">
      <span id="progress-label">carregando&hellip;</span>
      <div class="progress-track"><div class="progress-fill" id="progress-fill"></div></div>
    </div>
  </div>

  <div class="scope-legend">
    <h4>Como ler as leituras</h4>
    <p style="margin:0 0 10px;font-size:13.5px;color:var(--ink-soft);font-family:'Source Serif 4',serif;">Nenhum link precisa ser lido de ponta a ponta &mdash; e alguns <em>não devem</em>. Cada recurso traz um selo dizendo o quanto ler e quanto tempo leva. O resumo embutido cobre exatamente esse recorte; o original fica a um clique pra quando você quiser o detalhe.</p>
    <ul>
      <li><span class="r-tag t-full">Ler inteiro</span> Texto curto o bastante pra uma sentada.</li>
      <li><span class="r-tag t-part">Ler trechos</span> Material longo do qual só uma parte interessa agora &mdash; o selo nomeia as seções.</li>
      <li><span class="r-tag t-ref">Consulta</span> Referência. Não é pra estudar: é pra saber que existe e voltar quando o problema aparecer.</li>
    </ul>
  </div>

${focoRoadmap}

  <section class="week" id="trilhas">
    <div class="week-head"><h2 style="font-size:22px;">Trilhas por vaga</h2></div>
    <div class="week-meta">a mesma base, ordens diferentes &middot; comece pela que descreve a próxima entrevista</div>
    <div class="trilha-grid">
${trilhas}
    </div>
  </section>

  <section class="week" id="indice">
    <div class="week-head"><h2 style="font-size:22px;">Índice</h2></div>
    <div class="week-meta">${publicadas.length} páginas &middot; o progresso de cada uma aparece à direita</div>
    <div class="table-scroll">
    <table class="overview">
      <thead><tr><th>Bloco</th><th>Foco</th><th>Tempo</th><th>Progresso</th></tr></thead>
      <tbody>
${linhas}
      </tbody>
    </table>
    </div>
    <div class="pager"><a class="next" href="paginas/${primeira.slug}.html"><div class="dir">começar &rarr;</div><div class="t">${esc(primeira.titulo)}</div></a></div>
  </section>

  <section class="week backup" id="backup">
    <div class="week-head"><h2 style="font-size:22px;">Backup do progresso</h2></div>
    <div class="week-meta">sem conta, sem servidor &middot; um texto que você guarda onde quiser</div>
    <p class="intro">O navegador guarda o que você marcou, mas limpar os dados do site, trocar de navegador ou de computador apaga tudo. Gere o texto (ou o arquivo), guarde numa nota ou mande pra você mesmo, e cole aqui no outro lado. Importar <strong>mescla</strong> com o que já existe &mdash; nunca desmarca nada.</p>
    <div class="btn-row">
      <button type="button" class="btn" id="backup-exportar">Gerar texto e copiar</button>
      <button type="button" class="btn" id="backup-baixar">Baixar arquivo</button>
      <button type="button" class="btn" id="backup-importar">Importar o texto colado</button>
    </div>
    <textarea id="backup-txt" spellcheck="false" placeholder="O backup aparece aqui. Para importar, cole o texto (ou o conteúdo do arquivo .json) e clique em importar."></textarea>
    <p class="msg" id="backup-msg" role="status"></p>
  </section>

  ${rodape('')}

</div>
<script src="assets/js/app.js"></script>
</body>
</html>
`;
grava('index.html', capa);

/* ------------------------------------------------------------------ */
console.log('páginas: ' + publicadas.length + '/' + PAGINAS.length +
  ' · tópicos: ' + totais.topicos + ' · leituras: ' + totais.leituras +
  ' · perguntas: ' + totais.perguntas + ' · quiz: ' + quiz.length + ' (' + totais.fechadasRoadmap + ' nas páginas do roadmap)' + ' (certa é a mais longa em ' + pctMaisLonga + '%)');
if (avisos.length) console.log('\navisos:\n- ' + avisos.join('\n- '));
