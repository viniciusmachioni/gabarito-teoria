# Plano de montagem — O Gabarito da Teoria

Tudo o que é publicado (`index.html`, `paginas/`, `assets/css/estilo.css`, `assets/js/quiz-dados.js`)
é **gerado** por `node _montagem/build.mjs` a partir das fontes em `_montagem/`. Não edite os gerados à mão —
rode o build depois de qualquer mudança nas fontes.

## Fontes

| Fonte | Vira |
|---|---|
| `_montagem/original/gabarito-da-teoria.html` | CSS base, seções s1–s14, prática, quiz (42 questões), histórias STAR |
| `_montagem/estilo-extra.css` | anexado ao CSS base |
| `_montagem/leituras/<slug>.html` | resumos embutidos: cada `<article data-href>` entra no recurso de mesmo link da página `<slug>`. Quando não existe recurso com aquele link na página (caso do B7), o build cria uma seção "Leituras resumidas" no fim — e aí o `<article>` precisa também de `data-title` |
| `_montagem/novos/<slug>.html` | páginas dos blocos B10–B19, no mesmo markup das seções originais |
| `_montagem/quiz-novos.mjs` | questões novas anexadas às 42 originais |
| `_montagem/roadmap/<slug>.html` | páginas do roadmap da mentoria (R0–R7), grupo `roadmap`, registradas no topo de `PAGINAS` |
| `_montagem/roadmap/quiz/<slug>.mjs` | questões do roadmap, um arquivo por página, lidas em ordem alfabética e postas **na frente** das 42 originais |

## Roadmap da mentoria (05/10/2026)

Fonte: `Roadmap Vinicius Machioni _ Front-End Developer.pdf` (First Trial, Whimsical da Mundo Dev). Seis frentes técnicas
com 4 itens cada + ativação do LinkedIn. Virou um grupo próprio, **antes do núcleo**, pra ser o foco sem apagar nada:

| Página | Conteúdo | Checkbox |
|---|---|---|
| R0 `r00-mapa` | matriz dos 24 itens × Gabarita × Ally AI (usado/parcial/lacuna), placar, 8 histórias prontas, ordem sugerida pra fechar lacunas | — |
| R1 `r01-ai-frontend` | streaming, tool calling, structured outputs, Generative UI, UX de IA | `w25` |
| R2 `r02-design-systems` | tokens, variantes, Storybook, Figma, regressão visual, a11y automatizada, WCAG | `w26` |
| R3 `r03-arquitetura-frontend` | monorepo, microfrontends, rendering/cache no Next, Web Vitals | `w27` |
| R4 `r04-ai-fullstack` | Next + Node, auth/upload/filas, LLM + Postgres (pgvector/RAG), testes de fluxo de IA | `w28` |
| R5 `r05-cloud-aws` | Next na AWS, CI/CD, observabilidade, ambientes/secrets/CDN | `w29` |
| R6 `r06-proximo-nivel` | MCP, padrões de AI UX, frontend distribuído, multi-cloud | `w30` |
| R7 `r07-linkedin` | headline, "Sobre", rede, calendário de posts, candidaturas | `w31` |

Cada R1–R6 tem, além do formato normal (tópicos, leituras resumidas, munição, perguntas), um bloco **"No seu código"**
(`.evid`) com status por projeto e arquivo/linha, e um bloco **"O que falta construir"** (`.gap`). A evidência foi
levantada lendo o código do `gabarita` (no produto, Certeon) e do `ally-ai` **só em modo leitura** — nada foi alterado
nos dois. Os status do R0 e das páginas foram conciliados pela mesma régua: "usado" só quando cobre o que o item do
roadmap pede. Se o código dos projetos mudar, os números de linha citados podem ficar velhos.

A capa ganhou uma caixa "Foco atual" (`#roadmap`) com o progresso de cada página do roadmap (`assets/js/app.js` preenche
`.foco-lista li[data-prefix]` sem somar de novo no total).

## Status da montagem anterior (15/09/2026)

- 27/27 páginas geradas · 168 tópicos · **123 leituras resumidas embutidas** · 91 perguntas abertas com gabarito · **102 de múltipla escolha**
- **Todos os 24 blocos de conteúdo têm resumo em português na própria página** — núcleo (5 semanas), B1–B9 e B10–B19.
  Nenhum link externo precisa ser aberto pra estudar; o original fica a um clique pra quando quiser o detalhe
- Núcleo (5 semanas): JS/React, Next.js/Tailwind, PostgreSQL, Concorrência, Segurança
- 9 blocos bônus originais (B1–B9) migrados do arquivo único, com leituras resumidas escritas em 15/09/2026
- 10 blocos novos (B10–B19) cobrindo lacunas de sênior front-end/SWE pro Brasil e exterior: testes, acessibilidade,
  CSS moderno, performance de navegador, front-end system design, React avançado, design de APIs,
  produção/observabilidade, senioridade/comportamental, processo seletivo — também com leituras resumidas
- Quiz com **6 questões por bloco novo** (antes eram 3), em 22 temas filtráveis
- Capa com 4 trilhas por vaga (Front-end BR/exterior, SWE BR/exterior), índice com progresso por seção e backup de
  progresso (texto/arquivo)
- Verificação automática no build: ids de checkbox únicos e sequenciais, JSON do quiz válido, sem link interno quebrado

## Verificação feita (15/09/2026, depois de fechar as leituras e o quiz)

Checagem estrutural sobre o gerado, com **0 problemas**:

- tags balanceadas (`section`/`details`/`div`/`ul`/`ol`/`article`/`table`) em `index.html` e em todas as `paginas/*.html`
- 168 ids de checkbox **e** 123 `data-id` de leitura, todos únicos no site inteiro (progresso e leituras lidas usam
  uma chave só de `localStorage` — id repetido marcaria dois lugares de uma vez)
- toda leitura tem o rodapé com link pro original e o botão "marcar como lida" (123 leituras / 123 rodapés)
- classes usadas dentro das leituras (`.tldr`, `.tbl`, `.leitura-body h5`, `.r-tag`/`t-full`/`t-part`/`t-ref`) todas
  definidas no CSS
- nenhum link interno (`paginas/*.html`) ou âncora de `index.html` apontando pra alvo inexistente
- `assets/js/quiz-dados.js` parseia; as 102 questões têm `t`, `s`, `q`, `o`, `c`, `e`, e todo `c` dentro do range de `o`
- nenhum resquício das contagens antigas ("42 questões", "25 leituras") em lugar nenhum

## O que falta

1. **Nunca foi revisado visualmente num navegador por um humano.** É a única pendência real, e depende de você.
   Abrir `index.html`, navegar pelas trilhas, testar o quiz com os **22 filtros de tema** (cabem com `flex-wrap`, mas
   vale conferir em tela estreita), abrir e fechar várias leituras seguidas numa página longa (B9 e B7 são as maiores),
   testar dark mode do SO, e testar exportar/importar backup de progresso.
2. **Tópicos técnicos que ficaram de fora**, se quiser cobrir depois: gerenciamento de estado com lib própria
   (Zustand/Redux — hoje o assunto aparece de passagem na Semana 1 e no B15), monorepo e build tooling (Turborepo,
   Nx, Vite/Turbopack por dentro), i18n/l10n. Nenhum tinha sido pedido explicitamente — é sugestão, não pendência.

## Notas pra continuar em outra conta/sessão do Claude

- **Commits: sem `gh`, sem linha de co-autoria do Claude.** Só `git commit` + `git push` direto pro
  `origin` (`github.com/viniciusmachioni/gabarito-teoria`, branch `main`). `gh` nem está instalado nesta máquina.
- O site inteiro (`index.html`, `paginas/`, `assets/css/estilo.css`, `assets/js/quiz-dados.js`) é **gerado** —
  nunca editar esses arquivos direto, sempre editar a fonte em `_montagem/` e rodar `node _montagem/build.mjs`.
- Pra escrever uma leitura nova: crie/edite `_montagem/leituras/<slug>.html` com `<article data-href="...">`,
  usando `03-postgresql.html` como referência de nível (um `<p class="tldr">`, seções por `<h5>`, tabela em
  `<div class="tbl">`, e uma frase de entrevista no fim quando fizer sentido). O build casa pelo `data-href`
  automaticamente e avisa se algum `<article>` não encontrar recurso correspondente.
