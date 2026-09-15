# Plano de montagem — O Gabarito da Teoria

Tudo o que é publicado (`index.html`, `paginas/`, `assets/css/estilo.css`, `assets/js/quiz-dados.js`)
é **gerado** por `node _montagem/build.mjs` a partir das fontes em `_montagem/`. Não edite os gerados à mão —
rode o build depois de qualquer mudança nas fontes.

## Fontes

| Fonte | Vira |
|---|---|
| `_montagem/original/gabarito-da-teoria.html` | CSS base, seções s1–s14, prática, quiz (42 questões), histórias STAR |
| `_montagem/estilo-extra.css` | anexado ao CSS base |
| `_montagem/leituras/<slug>.html` | resumos embutidos: cada `<article data-href>` entra no recurso de mesmo link da página `<slug>` |
| `_montagem/novos/<slug>.html` | páginas dos blocos B10–B19, no mesmo markup das seções originais |
| `_montagem/quiz-novos.mjs` | questões novas anexadas às 42 originais |

## Status: montagem completa (15/09/2026)

- 27/27 páginas geradas · 168 tópicos · 25 leituras resumidas embutidas · 91 perguntas abertas com gabarito · 72 de múltipla escolha
- Núcleo (5 semanas) com leituras completas: JS/React, Next.js/Tailwind, PostgreSQL, Concorrência, Segurança
- 9 blocos bônus originais (B1–B9) migrados do arquivo único
- 10 blocos novos (B10–B19) cobrindo lacunas de sênior front-end/SWE pro Brasil e exterior: testes, acessibilidade, CSS moderno, performance de navegador, front-end system design, React avançado, design de APIs, produção/observabilidade, senioridade/comportamental, processo seletivo
- Capa com 4 trilhas por vaga (Front-end BR/exterior, SWE BR/exterior), índice com progresso por seção e backup de progresso (texto/arquivo)
- Verificação automática no build: ids de checkbox únicos e sequenciais, JSON do quiz válido, sem link interno quebrado

## Verificação feita (15/09/2026)

Passei o gerado por uma checagem estrutural depois do build: tags balanceadas (section/details/div/ul/ol)
em `index.html` e todas as `paginas/*.html`, classes CSS de `.r-tag` (`t-full`/`t-part`/`t-ref`) todas definidas,
`data-prog-pagina`/`data-leituras-pagina` presentes onde esperado, `assets/js/quiz-dados.js` parseia e as 72
questões têm `c` (índice da correta) dentro do range de `o`, nenhum link interno (`paginas/*.html`, âncoras de
`index.html`) apontando pra página inexistente, nenhum resquício do "42 questões" antigo fora do que devia mudar.
Nenhum bug encontrado nessa checagem — o que falta abaixo é **conteúdo**, não correção.

## O que falta (nenhum item é bloqueante — o site funciona e está no ar)

Em ordem de impacto:

1. **Leituras embutidas pras 9 seções bônus originais (B1–B9)** — a maior lacuna visível. O núcleo (5 semanas)
   e os 10 blocos novos (B10–B19) têm um resumo em português direto na página (`_montagem/leituras/<slug>.html`,
   `<article data-href="...">` casado por link com o recurso). B1–B9 (system design, IA/agentes, arquitetura,
   TypeScript, HTTP, OAuth, fundamentos soltos, algoritmos, arquiteturas de software) só têm a dica de escopo
   original (`r-scope`, tipo "ler trechos · ~30min") — pra ler de verdade ainda é preciso abrir o link externo.
   Pra fechar: criar `_montagem/leituras/b01-system-design.html` … `b09-arquiteturas.html` no mesmo formato dos
   5 arquivos já existentes (ver `_montagem/leituras/03-postgresql.html` como referência de nível/tamanho — uns
   4–6 `<article>` por seção, cada um com `.tldr`, seções por `<h5>`, e fechando com uma frase de entrevista
   quando fizer sentido). Rodar `node _montagem/build.mjs` depois — o build já casa automaticamente pelo
   `data-href`, não precisa mexer em mais nada.
2. **Poucas questões novas por bloco** — B10–B19 têm 3–4 cada (`_montagem/quiz-novos.mjs`); o núcleo tem 4–6.
   Pra igualar, adicionar mais entradas no array (mesmo formato `{t, s, q, o, c, e}`, `s` igual ao slug de tema
   já usado no bloco) e rodar o build de novo.
3. **Nunca foi revisado visualmente num navegador por um humano.** Só validação estrutural/automática até agora
   (ver seção acima). Abrir `index.html`, navegar pelas trilhas, testar o quiz com os 22 filtros de tema (cabe
   com `flex-wrap`, mas vale conferir em tela estreita), testar dark mode do SO, e testar exportar/importar
   backup de progresso.
4. **Tópicos técnicos que ficaram de fora**, se quiser cobrir depois: gerenciamento de estado com lib própria
   (Zustand/Redux — hoje só cito "store externa" de passagem na Semana 1), monorepo e build tooling (Turborepo,
   Nx, Vite/Turbopack por dentro), i18n/l10n. Nenhum tinha sido pedido explicitamente — é sugestão, não pendência.

## Notas pra continuar em outra conta/sessão do Claude

- **Commits: sem `gh`, sem linha de co-autoria do Claude.** Só `git commit` + `git push` direto pro
  `origin` (`github.com/viniciusmachioni/gabarito-teoria`, branch `main`). `gh` nem está instalado nesta máquina.
- O site inteiro (`index.html`, `paginas/`, `assets/css/estilo.css`, `assets/js/quiz-dados.js`) é **gerado** —
  nunca editar esses arquivos direto, sempre editar a fonte em `_montagem/` e rodar `node _montagem/build.mjs`.
