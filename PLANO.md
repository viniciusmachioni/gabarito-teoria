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
| `_montagem/roadmap/<slug>.html` | páginas do roadmap da mentoria (R0–R8), grupo `roadmap`, registradas no topo de `PAGINAS`. Código em `<pre><code class="esc">` é escrito cru (com `<`, `>`, `&`) e escapado pelo build |
| `_montagem/roadmap/quiz/<slug>.mjs` | questões do roadmap, **um arquivo por página (o nome do arquivo é o slug da página)**, lidas em ordem alfabética e postas **na frente** das 42 originais. As mesmas questões também vão embutidas no fim da própria página (ver abaixo). O build avisa se uma página R0–R8 ficar fora de 10–12 questões |

## Roadmap da mentoria (05/10/2026)

Fonte: `Roadmap Vinicius Machioni _ Front-End Developer.pdf` (First Trial, Whimsical da Mundo Dev). Seis frentes técnicas
com 4 itens cada + ativação do LinkedIn. Virou um grupo próprio, **antes do núcleo**, pra ser o foco sem apagar nada:

| Página | Conteúdo | Checkbox |
|---|---|---|
| R0 `r00-mapa` | cada um dos 24 itens → onde já foi aplicado no Gabarita e no Ally AI (aplicado / em parte / ainda não aplicado), resumo por frente, 8 histórias prontas, próximos passos | — |
| R1 `r01-ai-frontend` | streaming, tool calling, structured outputs, Generative UI, UX de IA | `w25` |
| R2 `r02-design-systems` | tokens, variantes, Storybook, Figma, regressão visual, a11y automatizada, WCAG | `w26` |
| R3 `r03-arquitetura-frontend` | monorepo, microfrontends, rendering/cache no Next, Web Vitals | `w27` |
| R4 `r04-ai-fullstack` | Next + Node, auth/upload/filas, LLM + Postgres (pgvector/RAG), testes de fluxo de IA | `w28` |
| R5 `r05-cloud-aws` | Next na AWS, CI/CD, observabilidade, ambientes/secrets/CDN | `w29` |
| R6 `r06-proximo-nivel` | MCP, padrões de AI UX, frontend distribuído, multi-cloud | `w30` |
| R7 `r07-linkedin` | headline, "Sobre", rede, calendário de posts, candidaturas | `w31` |

Cada R1–R6 tem, além do formato normal (tópicos, leituras resumidas, munição, perguntas), um bloco **"Onde você já
aplicou"** (`.evid`) que liga cada pedido do roadmap ao que já existe nos dois projetos, com arquivo/linha e trecho, e um
bloco **"Próximo passo do roadmap"** (`.gap`) com os itens ainda não aplicados. **O objetivo é exemplo, não auditoria:**
o texto descreve o que foi aplicado e não lista defeitos dos projetos. A evidência foi levantada lendo o código do
`gabarita` (no produto, Certeon) e do `ally-ai` **só em modo leitura** — nada foi alterado nos dois. Se o código dos
projetos mudar, os números de linha citados podem ficar velhos.

A capa ganhou uma caixa "Foco atual" (`#roadmap`) com o progresso de cada página do roadmap (`assets/js/app.js` preenche
`.foco-lista li[data-prefix]` sem somar de novo no total).

## Quiz sem viés e prática do roadmap (05/10/2026)

- **Todas as 142 questões de múltipla escolha foram reescritas** (roadmap, originais e B10–B19): as alternativas erradas
  viraram equívocos plausíveis, e a certa deixou de se entregar pelo tamanho. Antes, a certa era a mais longa em 127 das 142;
  agora em 15%. O build reprova (aviso) qualquer questão em que a certa passe de 1,1× a maior errada, e avisa se a
  proporção geral passar de 35%.
- **Motor do quiz** (`assets/js/quiz.js`): alternativas embaralhadas a cada rodada (o `c` das fontes não diz mais a posição na
  tela), histórico por questão em `localStorage` (`gabarito-teoria-quiz`, pelo `id` que o build gera de tema + hash do
  enunciado), modos Todas / Nunca respondidas / Para revisar, embaralhar questões, nova rodada e zerar histórico. O histórico
  entra no backup da capa (pacote `versao: 3`). Explicações (`e`) não podem citar a alternativa pela letra.
- **R8 `r08-pratica`** (checkbox `w32`): 5 exercícios de live coding (leitor SSE, `useChat`, `fetchWithRetry`, `<Button>` com
  cva, Generative UI com aprovação) e o caso de system design “interface de um assistente de IA” em RADIO, com 3 variações.
  Cada exercício: enunciado, o que o entrevistador observa, dicas (`details.dica`), solução (`details.sol`) e follow-ups
  (`details.ans`, que contam como perguntas abertas).
- **Decisão do usuário:** os “próximos passos do roadmap” listados no R0 e nas páginas R1–R6 **não** serão aplicados no
  Gabarita nem no Ally AI. Os dois projetos ficam como estão, só como fonte de exemplo.

## Revisão do roadmap e questões fechadas nas páginas (07/10/2026)

Executou o plano de `gabarito-teoria-revisao-roadmap-2026-10-05.md` (etapas 1 a 5) e acrescentou múltipla escolha às páginas.

- **Múltipla escolha dentro de cada página R0–R8** (10 a 12 por página, 100 no total, as mesmas do Questionário rápido). O build embute
  só as questões da página num `<script type="application/json" class="qz-pagina-dados">` e `assets/js/quiz-pagina.js` monta
  os cartões, com alternativas embaralhadas e o **mesmo histórico** do quiz rápido (`gabarito-teoria-quiz`, pelo `id` da questão).
  R0 (`rm-mapa`) e R8 (`rm-pratica`) ganharam tema próprio, e o quiz passou a ter 31 filtros de tema.
- **Correções técnicas (seção 3 do .md):** SSE do EX1 descarta evento cortado (testado com 64 cortes + conexão que cai); `send` do EX2
  devolve boolean e o form só limpa se o envio foi aceito; composição no servidor do Fowler (R3); MCP security apontando pra spec
  `2026-07-28` com State Handle Hijacking, Mix-Up e Localhost Redirect URI Impersonation (R6); limite de 2.000 dimensões de índice do
  pgvector, conferido no README oficial (R4); CloudFront suavizado e `revalidateTag(tag, 'max')` (R5).
- **Inconsistências (seção 4):** selos das histórias do R0 agora iguais aos da matriz; posts 5–8 do R7 nascem de conceitos e exercícios
  do R8 (não de mexer nos projetos), e "prova pública" pra headline de Design Engineer virou um repositório com os exercícios do R8;
  o "mercado da D04" do R5 saiu junto com o bloco de próximos passos. A numeração dos posts ficou só no calendário do R7.
- **"Próximo passo do roadmap" foi trocado por "Você já usou...?"** em R1–R6 (e por "Como cobrir sem mexer nos projetos" no R0), coerente
  com a decisão de não aplicar nada no Gabarita nem no Ally AI.
- **Etapa 3:** as 8 histórias do R0 em STAR (PT e EN); pitch de 60–90 s e 5 perguntas comportamentais no R7, com material real da
  `docs/DECISOES.md` do Gabarita (D24, D32, D36, D42). Onde não há caso documentado, a página diz e o caso é do usuário.
- **Etapa 4:** exercícios 6 a 12 no R8 (Playwright + axe, `ci.yml` + OIDC, servidor MCP, RAG com pgvector, stories com a11y e play,
  refatoração pra Server Component com `'use cache'`, toast a partir de um mock). Checkboxes `w32-8` a `w32-14`: continuam a
  sequência pra não mexer no progresso já salvo de `w32-6` e `w32-7` (system design). Todo o código TS compila com `tsc --strict`
  contra os pacotes reais, e os YAML/JSON foram parseados.
- **Etapa 5:** seção de movimento, foco e hover no R2 e o exercício 12; composição, documentação e responsivo no R2 (`w26-10` e `w26-11`).
- **Lacunas menores:** `ci.yml` comentado na leitura do R5; pergunta aberta de observabilidade de "uso"; Secrets Manager × SSM e i18n no R5;
  MCP Apps no R6 (`w30-10`); perguntas abertas novas em R1 (Generative UI), R2 (Storybook × Figma), R3 (refatoração e Web Vitals) e R4 (auth e upload).
- **Mobile:** nenhuma página tem mais rolagem horizontal em 390 px (antes R2 e R5 tinham, por tópicos e itens da grade que não encolhiam).

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
   Abrir `index.html`, navegar pelas trilhas, testar o quiz com os **31 filtros de tema** (cabem com `flex-wrap`, mas
   vale conferir em tela estreita), abrir e fechar várias leituras seguidas numa página longa (B9 e B7 são as maiores),
   testar dark mode do SO, e testar exportar/importar backup de progresso.
2. **Tópicos técnicos que ficaram de fora**, se quiser cobrir depois: gerenciamento de estado com lib própria
   (Zustand/Redux — hoje o assunto aparece de passagem na Semana 1 e no B15), build tooling por dentro (Nx,
   Vite/Turbopack). Monorepo está no R3 e i18n no R5. Nenhum tinha sido pedido explicitamente — é sugestão, não pendência.

## Notas pra continuar em outra conta/sessão do Claude

- **Commits: sem `gh`, sem linha de co-autoria do Claude.** Só `git commit` + `git push` direto pro
  `origin` (`github.com/viniciusmachioni/gabarito-teoria`, branch `main`). `gh` nem está instalado nesta máquina.
- O site inteiro (`index.html`, `paginas/`, `assets/css/estilo.css`, `assets/js/quiz-dados.js`) é **gerado** —
  nunca editar esses arquivos direto, sempre editar a fonte em `_montagem/` e rodar `node _montagem/build.mjs`.
- Pra escrever uma leitura nova: crie/edite `_montagem/leituras/<slug>.html` com `<article data-href="...">`,
  usando `03-postgresql.html` como referência de nível (um `<p class="tldr">`, seções por `<h5>`, tabela em
  `<div class="tbl">`, e uma frase de entrevista no fim quando fizer sentido). O build casa pelo `data-href`
  automaticamente e avisa se algum `<article>` não encontrar recurso correspondente.
