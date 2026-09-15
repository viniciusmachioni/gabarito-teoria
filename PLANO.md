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

## Possíveis próximos passos (não bloqueantes)

- [ ] Leituras embutidas pra B1–B9 (hoje essas páginas usam só o resumo de escopo `r-scope` do link, sem resumo em português completo como B10+ têm — funcional, mas menos rico)
- [ ] Mais perguntas de quiz por bloco novo (hoje 3 cada; núcleo tem ~4-6)
- [ ] Revisão visual/responsiva em mobile depois de abrir `index.html`
