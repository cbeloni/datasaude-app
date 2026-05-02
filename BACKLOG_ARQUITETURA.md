# Backlog de Melhorias Arquiteturais

Candidatos de aprofundamento (refatorações que transformam módulos rasos em módulos profundos, com mais alavancagem para chamadores e mais localidade para mantenedores). Cada item descreve **arquivos**, **problema**, **solução** e **benefícios**.

Ordem sugerida de execução: **#2 + #3 → #1 → #4**, com **#5** como side-quest.

Status legenda: `[ ]` aberto · `[~]` em andamento · `[x]` concluído

---

## #2 — Extrair hook profundo `usePatientQuery` para o loop de fetch dos gráficos `[ ]`

**Prioridade:** Alta (pequeno, alta alavancagem, prepara terreno para os outros)

**Arquivos envolvidos**
- `src/components/Graph/CustomGraph.js` (126 linhas)
- `src/components/Graph/CustomCidGraph.js` (123)
- `src/components/Graph/CustomInternacaoGraph.js` (105)
- `src/components/Graph/CustomLeitosGraph.js` (35)
- Mesmo padrão inline em `src/views/Previsao/Previsao.js` (linhas ~60–110)
- Mesmo padrão inline em `src/views/Dashboard/Dashboard.js`

**Problema**
Cada gráfico re-implementa a mesma receita: monta filter-string com `dateRange` + CID, formata datas como `ddMMyyyy`, seta uma URL, `useEffect([url])` → `axios.get` → `setDados`. Mesmo prefixo `/api/v1/paciente/queries/?query=…`, mesmo formato de data, mesmo (não-)tratamento de erro. Não existe costura entre o gráfico e a rede — nenhum teste consegue se interpor.

**Solução**
Um único hook profundo de query para o subsistema patient-query. Interface pequena (qual query, quais filtros); implementação esconde construção de URL, formatação de data, axios, mapeamento de erro e cache futuro. Cada gráfico encolhe para "renderizar `data`".

**Benefícios**
- **Alavancagem**: todo gráfico atual e futuro herda construção de URL + tratamento de erro de graça.
- **Localidade**: mudar o formato da data em um só lugar.
- **Testabilidade**: o hook é a superfície de teste — stuba axios uma vez e verifica URL + dado parseado. Os gráficos viram render puro.

---

## #3 — Consolidar a camada de API atrás de serviços nomeados pelo domínio `[ ]`

**Prioridade:** Alta (combina com #2)

**Arquivos envolvidos**
- `src/services/ApiService.js` (27 linhas — só uma função para um POST)
- `src/views/Dashboard/Dashboard.js:35` (`axios.put …/poluentes/cetesb`)
- `src/views/Previsao/Previsao.js:61` (treino ML)
- `src/components/Graph/CustomGraph.js:77`
- `src/components/Table/Datatable-Paciente.js:48-75` (query string montada à mão)
- Duas base URLs em uso: `REACT_APP_API_URL` e `REACT_APP_API_ML_URL`

**Problema**
Camada de serviço pela metade que a maioria dos chamadores ignora. Escolha de env-URL, formato de request e tratamento de erro vivem em cada call site. Os dois backends estão misturados nas views sem nomear a distinção.

**Solução**
Separar por substantivo de domínio:
- serviço `paciente`
- serviço `previsão` (backend ML)
- serviço `poluente`

A interface é a operação de domínio; a implementação esconde axios, base URL, encoding de query e a regra única de mapeamento de erro.

**Benefícios**
- Combina com #2: `usePatientQuery` chama `paciente.queries(...)`. Separação limpa transporte / ciclo de vida.
- Costura em dois passos: testes de serviço stubam axios; testes de hook stubam o serviço.
- **Localidade** para todas as decisões "fala com backend ML".

---

## #1 — Colapsar as quatro implementações de Mapa em um único módulo profundo `PatientMap` `[ ]`

**Prioridade:** Alta (maior payoff, maior implementação)

**Arquivos envolvidos**
- `src/components/Map/ReactMap.js` (178 linhas)
- `src/components/Map/ReactMap2.js` (406)
- `src/components/Map/ReactMapBronquiolite.js` (291)
- `src/components/Map/ReactMapMaxacali.js` (218)
- Apoios: `src/components/Map/HelperMap.js`, `ConstantsEstacoes.js`, `ConstantsMap.js`
- Total: ~1100 LOC

**Problema**
Cada mapa repete o mesmo esqueleto — `MapContainer` + `LayersControl` + `ImageOverlay` de fundo + marcadores de estação + marcadores de paciente + UI de filtros + ciclo de vida do fetch. Diferem só em:
- *Quais filtros aplicam* (poluente vs. internação vs. multi-select de CID)
- *De onde vêm os dados* (`/api/v1/paciente` ao vivo vs. JSON estático)
- *Como os marcadores são coloridos*

A interface de cada mapa é "monte-o" — implementação grossa atrás de view grossa, mas com zero alavancagem (nenhuma variação entre call sites). Pior: **localidade** quebrada — uma correção de marcador tem que ser feita em 4 lugares.

Teste de deleção: deletar `ReactMap.js` não relocaliza complexidade — é uma cópia.

**Solução**
Um módulo profundo que detém o esqueleto do mapa, a máquina de estado dos filtros, a renderização de marcadores e o ciclo de vida dos dados. A costura é uma config dizendo:
- Quais dimensões de filtro estão habilitadas
- Qual fonte de dados usar
- Regra de cor dos marcadores

Os 4 mapas atuais viram 4 configs (~30–50 linhas cada).

**Benefícios**
- Correções de marcador/layout uma única vez.
- **Localidade** total das decisões de renderização do mapa.
- **Testabilidade**: a costura é o objeto de config — testes podem dirigir o módulo com fonte de dados fake e lista de estações em memória, sem montar Leaflet ponta a ponta.

---

## #4 — `useReportFilters` (ou contexto) para o conjunto de filtros compartilhado `[ ]`

**Prioridade:** Média (depende de quanto os filtros vão crescer)

**Arquivos envolvidos**
- `src/views/Indicadores/Indicadores.js` (171 — prop-drilling de `dateRange` para 4 gráficos filhos)
- `src/views/Previsao/Previsao.js` (cópia própria de CID + tipo + dateRange)
- Cada um dos 4 mapas (estado de filtro próprio)
- `src/components/Table/Datatable-Paciente.js` (mais um conjunto)

**Problema**
"O conjunto de filtros" — date range, CID, tipo, faixa etária, poluente — é um único conceito de domínio espalhado por N componentes, cada um com seu subset e UI. Adicionar um filtro significa mexer em toda view. Cada view é uma quase-cópia de "gerencie esses filtros e passe pra baixo".

**Solução**
Um módulo profundo de filtros — provavelmente um contexto com seletores, opcionalmente serializado na URL para sobreviver a refresh e virar link compartilhável. Cada view assina a fatia que lhe interessa.

Corte natural inicial: `Indicadores` + seus 4 gráficos.

**Benefícios**
- Um lugar para adicionar nova dimensão de filtro.
- Estado endereçável por URL (refresh-safe, compartilhável) de graça se serializar.
- **Localidade** para qualquer pergunta "o que esse intervalo de data significa".

**Aviso de custo**
Maior empreitada das quatro e a única que mexe no formato das views. Vale a pena se o conjunto de filtros vai continuar crescendo.

---

## #5 — Centralizar a paleta de domínio `[ ]`

**Prioridade:** Baixa (side-quest de cinco minutos)

**Arquivos envolvidos**
- `src/views/Indicadores/Indicadores.js:45-54`
- `src/views/Previsao/Previsao.js:118-127`
- `src/components/Map/ReactMap2.js:182-185` (CID_COLORS)
- Repetida em configs de gráfico
- Possível ponto de consolidação: `src/theme/tokens.js`

**Problema**
O mesmo objeto de paleta copiado em três lugares. Novo código CID → três edições, e "esqueci de uma" é a falha óbvia.

**Solução**
Um pequeno módulo `palette` / `colorForCid()` centralizado (potencialmente em `src/theme/`).

**Benefícios**
- Honesto: é mais deduplicação do que aprofundamento.
- Mas o teste de deleção passa (concentra decisão de cor por CID em um arquivo).
- Combina bem com #1 e #2.

---

## Observações gerais

- **Cobertura de testes hoje:** zero (`*.test.js` retorna nenhum match no repo). Cada candidato acima também é um movimento "dar superfície de teste a esse código" — a costura é a superfície de teste.
- **Sem `CONTEXT.md` nem `docs/adr/`** ainda. Conforme novos termos de domínio surgirem (ex.: "patient query", "report filters"), criar lazily.
- **Mistura MUI v4 + v5** no `package.json` — não é um candidato de aprofundamento, mas é dívida latente que vale registrar.
