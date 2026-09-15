# O Gabarito da Teoria

Guia de estudo para vagas de **Senior Front-end Engineer** e **Software Engineer**, no Brasil e no exterior.
Site 100% estático (HTML + CSS + JS): **sem back-end e sem banco**. O progresso fica só no `localStorage` do navegador, e há backup em texto/arquivo.

27 páginas · 168 tópicos · 25 leituras resumidas embutidas · 91 perguntas abertas com gabarito · 72 de múltipla escolha.
Cobre as 5 semanas de núcleo, 9 blocos bônus originais e 10 blocos novos de lacunas de sênior (testes, acessibilidade,
CSS moderno, performance de navegador, front-end system design, React avançado, design de APIs, produção/observabilidade,
comportamental e o processo seletivo aqui e fora).

## Como abrir

Abra `index.html` direto no navegador (duplo clique). Não precisa de servidor.

## Como editar

Nada em `index.html`, `paginas/`, `assets/css/estilo.css` ou `assets/js/quiz-dados.js` deve ser editado à mão —
são **gerados** por `node _montagem/build.mjs` a partir das fontes em `_montagem/`. Edite a fonte e rode o build de novo.
Detalhes de cada fonte estão em **[PLANO.md](PLANO.md)**.

## Estrutura

```
gabarito-da-teoria/
├─ index.html                  gerado: capa, trilhas por vaga, índice com progresso, backup
├─ paginas/                    gerado: uma página por semana/bloco + histórias, prática, quiz
├─ assets/
│  ├─ css/estilo.css           gerado: CSS original + _montagem/estilo-extra.css
│  ├─ js/app.js                progresso, leituras lidas, backup, âncoras
│  ├─ js/quiz.js               motor do questionário (filtros gerados dos dados)
│  ├─ js/quiz-dados.js         gerado: 42 questões originais + 30 novas
│  └─ img/icone.svg            ícone/favicon (folha de gabarito com selo)
└─ _montagem/                  fontes da montagem (não é publicado)
   ├─ original/gabarito-da-teoria.html   fonte do conteúdo original (núcleo + B1–B9)
   ├─ estilo-extra.css         CSS novo (topbar, leituras, pager, trilhas, backup)
   ├─ leituras/*.html          resumos das leituras embutidas por página
   ├─ novos/*.html             páginas dos blocos B10–B19
   ├─ quiz-novos.mjs           questões de múltipla escolha novas
   └─ build.mjs                script Node que gera index.html, paginas/ e os demais artefatos
```
