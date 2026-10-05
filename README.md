# O Gabarito da Teoria

Guia de estudo para vagas de **Senior Front-end Engineer** e **Software Engineer**, no Brasil e no exterior.
Site 100% estático (HTML + CSS + JS): **sem back-end e sem banco**. O progresso fica só no `localStorage` do navegador, e há backup em texto/arquivo.

36 páginas · 234 tópicos · 159 leituras resumidas embutidas · 144 perguntas abertas com gabarito · 142 de múltipla escolha.

**Foco atual: o roadmap da mentoria (R0–R8)**, que vem primeiro na capa, no índice e no quiz. O R0 é um mapa que cruza
os 24 itens do roadmap com o que já existe no **Gabarita** e no **Ally AI** (arquivo e linha), e cada página R1–R6 tem
um bloco "Onde você já aplicou" com o exemplo de cada pedido do roadmap nos dois projetos. O R7 cobre a ativação do LinkedIn, e o R8 é a prática: 5 exercícios de live coding e o system design de uma interface de chat com IA, com solução comentada.

Depois do roadmap, o guia continua igual: as 5 semanas de núcleo, 9 blocos bônus originais e 10 blocos novos de lacunas de sênior (testes, acessibilidade,
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
│  ├─ js/quiz.js               motor do questionário: alternativas embaralhadas, histórico por questão, modo "para revisar"
│  ├─ js/quiz-dados.js         gerado: 40 do roadmap + 42 originais + 60 novas
│  └─ img/icone.svg            ícone/favicon (folha de gabarito com selo)
└─ _montagem/                  fontes da montagem (não é publicado)
   ├─ original/gabarito-da-teoria.html   fonte do conteúdo original (núcleo + B1–B9)
   ├─ estilo-extra.css         CSS novo (topbar, leituras, pager, trilhas, backup)
   ├─ leituras/*.html          resumos das leituras embutidas por página (um arquivo por página)
   ├─ novos/*.html             páginas dos blocos B10–B19
   ├─ roadmap/*.html           páginas do roadmap da mentoria (R0–R8)
   ├─ roadmap/quiz/*.mjs       questões de múltipla escolha do roadmap (entram na frente das outras)
   ├─ quiz-novos.mjs           questões de múltipla escolha novas
   └─ build.mjs                script Node que gera index.html, paginas/ e os demais artefatos
```
