# O Alquimista — Especificação de Interações

> Documento de handoff para Figma.
> Cada animação, hover, e fluxo deste micro-site está descrito abaixo com tokens, timings e curvas de easing. Onde existe state, está documentado o estado por defeito e as transições.

---

## 0. Tokens base

### Cores
```
--bg          #0a0a0a   /* fundo principal */
--bg-2        #131312   /* cards, painéis */
--bg-3        #1a1814   /* hover state, ênfase suave */
--ink         #e8e6e0   /* texto principal */
--ink-soft    #a8a59c   /* texto secundário */
--ink-muted   #5a5854   /* meta, labels */
--rule        rgba(232,230,224,0.10)   /* divisores */
--rule-strong rgba(232,230,224,0.22)   /* divisores ênfase, borders */
--gold        #d4a85a   /* primária, accent */
--gold-deep   #a87f30   /* hover, profundidade */
--gold-soft   #e8d8b8   /* highlights */
--green       #6b8a4a   /* status indicator */
```

### Tipografia
```
--mono   JetBrains Mono   /* labels, código, fórmulas */
--sans   Inter            /* títulos, body */
--serif  Cormorant Garamond italic   /* lede, ênfase poética */
```

### Easing & timings (usar em Figma Smart Animate)
```
fast      150ms   linear            /* hovers de chips/calendário */
default   200ms   ease              /* botões, borders */
slow      600ms   cubic-bezier(.4,0,.2,1)   /* bean morph */
pulse     1.6s    ease-in-out infinite       /* status dots */
map-pulse 2.4s    ease-in-out infinite       /* pin de Lisboa */
```

### Grid de fundo (universal)
- Linhas `1px` a `rgba(232,230,224,0.025)`, espaçadas a `56×56px`. Está em todas as páginas, fixa (não rola).

---

## 1. Top Bar (presente em todas as páginas)

**Estrutura:** logo · nav · status · CTA. Altura `48px`. Backdrop blur `12px`. Fundo `rgba(10,10,10,0.85)`.

| Elemento | Estado idle | Hover | Active (página atual) |
|---|---|---|---|
| Logo (`● O.ALQUIMISTA`) | dot dourado, texto `--ink` | — (link) | — |
| Nav `/sobre /processo …` | `--ink-soft` | `--gold` (transição instantânea) | `--gold` permanente |
| Status `lab ativo` | dot verde a pulsar (1.6s, opacity 0.4 ↔ 1) | — | — |
| CTA `Compor →` | fundo `--gold`, texto `--bg` | sem estado definido (cor sólida) | — |

**Pulse animation:** `@keyframes blink` — opacity `0.4 → 1 → 0.4`, 1.6s infinite.

---

## 2. Landing — Microsite-Tech.html

### 2.1 Hero
- **Layout:** split 50/50. Esquerda: meta strip 3-col + h1 `clamp(48px,6vw,92px)` + parágrafo + 2 botões.
- **Direita:** "bean tech" — bean SVG centrado em radial-gradient, com 3 ringues concêntricos e crosshair sobreposta.
- **Sem animação de entrada.** Apenas hovers nos botões.

### 2.2 Botões `.btn`
- **Idle:** border `--rule-strong`, texto `--ink`, fundo transparente.
- **Hover:** border + texto → `--gold` (200ms ease).
- **Variant `.primary`:** fundo `--gold`, texto `--bg`. Hover: fundo + border → `--ink`.

### 2.3 Blend Builder (secção `#blend`) — INTERAÇÃO PRINCIPAL

Esta é a peça central. É um state machine reactivo: 4 inputs alimentam um SVG do grão + uma fórmula codificada + um preço.

**Estado inicial:**
```js
{
  origin: 'B1',   // Brasil — Cerrado
  roast: 50,      // 0..100
  aroma: 'V',     // V=baunilha, L=laranja, C=cardamomo, A=anis, N=canela, ∅=puro
  topping: '∅'    // ∅, ◐, ◯, ≋
}
```

**Inputs e estados:**

| Input | Idle | Hover | Active/Selected |
|---|---|---|---|
| `.origin` (4 cards 2×2) | fundo `--bg-2`, texto `--ink` | fundo → `--bg-3` (200ms) | fundo `--gold`, texto `--bg` |
| `.aroma` chip | border `--rule-strong`, texto `--ink-soft` | border → `--gold` (200ms) | fundo + border `--gold`, texto `--bg` |
| `.topping` (4-col) | fundo `--bg-2`, texto `--ink-soft` | fundo `--bg-3`, texto `--ink` | fundo `--gold`, texto `--bg` |
| `#roast` slider 0–100 | track preto, thumb dourado | — | label "TORRA: 50 / 100" atualiza live |

**Saídas (todas atualizam via `render()` em cada change):**

1. **Bean SVG** (`#beanSvg`) — re-pintado em cada mudança.
   - `transition: transform .6s cubic-bezier(.4,0,.2,1), filter .6s`
   - Cor base muda com origem (4 paletas: Brasil=castanho-escuro, Etiópia=âmbar, Colômbia=cobre, Guatemala=avermelhado).
   - Saturação/escurecimento com slider `roast` (0=claro, 100=escuro).
   - Glow drop-shadow muda intensidade.
   - Para Figma: criar 4 variants × 3 roast levels = 12 frames. Smart-animate entre eles.

2. **Fórmula** (canvas overlay, top-right) — `B1·050·V·∅` — atualiza instantaneamente em mono.

3. **Notas de prova** — chips dinâmicos por origem (3 notas cada).

4. **Preço** (`#price`) — fórmula:
   ```
   base = 14.80
   + topping !== ∅ ? 1.20 : 0
   + roast > 70 ? 0.80 : 0
   ```
   Atualiza sem animação (sem tween numérico).

5. **CTA `Encomendar →`** — `location.href='Encomendar.html'`. Estado do blend NÃO é passado (mock). Em produção: localStorage ou query string.

### 2.4 About strip — 4 KPIs `120` `04` `100` `∅`
- Estático. Números grandes em `--gold`, label mono pequena em baixo.

### 2.5 Tests — 3 testimonials grid
- Cards com `quote` em serif italic, divisor inferior, avatar circular dourado com inicial.
- Sem hover.

---

## 3. Marcar Visita — Encomendar.html

### 3.1 Summary banner (topo)
- Mostra blend escolhido. `.s-edit` botão "Editar":
  - Idle: border `--rule-strong`, texto `--ink-soft`.
  - Hover: ambos → `--gold` (200ms).
  - Click: volta a `Microsite-Tech.html#blend`.

### 3.2 Calendário (`.cal`)
- 7 colunas (DOM SEG TER QUA QUI SEX SAB).
- **Estados de dia:**

| Estado | Fundo | Texto | Cursor |
|---|---|---|---|
| Default | `--bg` | `--ink` | pointer |
| Hover (não disabled) | `--bg-3` (150ms) | `--ink` | pointer |
| Disabled (`.dis` — fechado/passado) | `--bg-2` | `--ink-muted` | not-allowed |
| Selected (`.active`) | `--gold` | `--bg`, weight 600 | pointer |

- **Domingo e segunda sempre disabled** (cafetaria fechada).
- **Navegação meses:** 2 setas `‹ ›`. Hover: border + texto → `--gold`.
- Click no dia: limpa todas as `.active`, adiciona ao clicado, atualiza `state.day`.

### 3.3 Time slots (`.slot`)
- Grid 5 colunas. Slots: 09:00 / 10:30 / 12:00 / 14:00 / 15:30 / 17:00 / 18:30.
- Estados como o calendário (default/hover/dis/active).
- Disabled = horários já reservados (mock: 12:00 e 18:30).

### 3.4 Stepper de pessoas (1–4)
- `−` `[n]` `+`. Buttons: hover → texto `--gold` (200ms).
- `+` desativado em 4. `−` desativado em 1.
- Número central em `--gold` mono.

### 3.5 Inputs (`.field input`)
- Border `--rule-strong`, fundo `--bg`, mono.
- **Focus:** border → `--gold` (200ms). Sem outline default.

### 3.6 Sidebar resumo (sticky)
- Atualiza live com `state` (data, hora, pessoas).
- CTA `Confirmar visita →`:
  - Fundo `--gold`, texto `--bg`.
  - Hover: fundo → `--ink` (200ms).
  - Click: `alert()` mock — em produção, POST + tela de sucesso.

---

## 4. Biblioteca de Blends — Biblioteca.html

### 4.1 Filtros (sticky topo, abaixo da bar)
- Dois grupos de chips: Intensidade (4 chips) e Aroma (6 chips).
- **Comportamento:** single-select dentro do grupo. Click remove `.active` dos siblings, adiciona ao clicado, re-renderiza grid.
- **Contador `f-count`:** "A mostrar X de 12" — atualiza com filtros.

| Estado chip | Visual |
|---|---|
| Idle | border `--rule-strong`, texto `--ink-soft` |
| Hover | border + texto → `--gold` (150ms) |
| Active | fundo `--gold`, texto `--bg`, border `--gold` |

### 4.2 Cards (`.card`)
- 12 fórmulas hardcoded em `BLENDS[]`.
- Layout vertical: nº fórmula + dots intensidade · bean SVG · nome + sub italic · fórmula · notas · footer.
- **Hover:** fundo `--bg → --bg-3` (200ms). Sem scale, sem lift.
- **Click:** vai para `Microsite-Tech.html#blend` (em produção: pre-popular o blend builder com a fórmula).

### 4.3 Bean SVG por card
- Gerado pela função `beanSvg(c1,c2,c3)` — cada blend tem 3 cores próprias para o gradient. Drop-shadow `0 6px 16px rgba(212,168,90,0.18)`.
- Em Figma: criar component `Bean Card / variant=N°XX`, 12 instâncias.

### 4.4 Dots de intensidade
- 3 dots `8×8`. `1`/`2`/`3` ligados a `--gold`, restantes a `--rule-strong`.

---

## 5. O Processo — Processo.html

### 5.1 Hero centrado
- Título com `i.` etc — pretende sugerir índice editorial.
- "scroll" hint com linha vertical dourada `1×32px` opacity 0.5.

### 5.2 Steps alternados (4 secções, `.step` / `.step.flip`)
- Layout `1fr 1fr` 80px gap. `flip` inverte ordem (texto direita / visual esquerda).
- **Sem animação on-scroll** (intencional: editorial estático). Se quiser adicionar: fade-in 600ms + translateY 20px → 0 quando entra no viewport.

### 5.3 Diagramas (4)
1. **Origem — globo:** círculo + 3 lat + 3 lng + 4 pins dourados com ring duplo (box-shadow concêntrica).
2. **Torra — curva:** SVG path com gradient stroke + ponto "FC" marcado a `cx=200,cy=170`.
3. **Aroma — raios:** 6 raios em `0,60,120,180,240,300°` saindo de centro radial-gradient. Centro tem `box-shadow: 0 0 40px rgba(212,168,90,0.3)`.
4. **Fórmula — composição:** 4 linhas grid `pos | val | desc` + total destacado em caixa dourada.

### 5.4 Corner marks (em todos os step-vis)
- 4 esquadros `14×14px` border `--gold`, posicionados nos cantos (TL/TR/BL/BR). Ornamento técnico — não animados.

### 5.5 Read-out tags (corner labels)
- Mono `9px`, `--gold` opacity 0.7. Texto técnico tipo `curve · v.04` `peak 220°C`.

---

## 6. A Experiência — Experiencia.html

### 6.1 Hero full-bleed
- `min-height: 88vh`. Background composto: 2 radial gradients dourados + linear vertical + grid pattern dourado por cima.
- **Coordenadas top-right:** `38.7064°N · 9.1726°W` em mono.
- **Mark top-left:** linha + texto pequeno.

### 6.2 Galeria (`.gallery`)
- Grid `2fr 1fr` × 2 rows. Frame grande à esquerda (rowspan 2), 2 frames empilhados à direita.
- **Placeholders gradient-only.** Em produção: substituir `.ph-1/.ph-2/.ph-3` por imagens reais.
- Cada frame tem `num` (top-right, "N°01 / 03") + `lbl` (bottom-left, fundo blur).
- **Sem hover effect.** Sugestão Figma: hover scale 1.02 image, label up 4px.

### 6.3 Ritual (5 passos)
- Layout sticky: título à esquerda fica fixo (`top: 80px`) enquanto se rola pelos passos à direita.
- Cada passo: índice romano (i, ii, iii, iv, v) em serif italic dourado · título + descrição mono · timestamp `+0 min`, `+4 min`, etc.

### 6.4 Mapa estilizado (`.map`)
- SVG inline com:
  - "rio" (path com fill semi-dourado) sugerindo o Tejo
  - 3 ruas horizontais + 3 verticais em `rgba` ténue
  - cruz fina no ponto do pin
- **Pin animado:**
  - `16×16` dot dourado central
  - 3 box-shadows concêntricos (6px / 18px / 36px) com opacities decrescentes
  - `@keyframes pulse` — 2.4s, expande para 8/24/48px no peak
- Compass `N` top-right, escala "200 m" bottom-left, coordenadas top-left.

### 6.5 Info rows
- Tabela com colunas `120px | 1fr`. Cada row separada por `1px var(--rule)` border-bottom.
- Sem interação além do link telefone (não estilizado especialmente).

---

## 7. Fluxo completo do utilizador

```
┌──────────────────────────────────────────────────────────┐
│  ENTRY                                                    │
│  Microsite-Tech.html (landing)                            │
└──────────────────────────────────────────────────────────┘
              │
   ┌──────────┼──────────┬───────────────┬──────────────┐
   ▼          ▼          ▼               ▼              ▼
/sobre   /processo   /biblioteca   /criar (blend)   /experiência
                                        │                │
                                        ▼                ▼
                                  /encomendar      /encomendar
                                  (Marcar Visita)
                                        │
                                        ▼
                                   alert mock
                                   (em prod: success state)
```

### Estado partilhado (a implementar em Figma com variables)
- `selectedBlend = {origin, roast, aroma, topping}` — partilhado entre Landing → Encomendar.
- `selectedDate, selectedTime, partySize, customerInfo` — vivem em Encomendar.
- Em produção: localStorage + URL query params.

---

## 8. Notas para Figma

### Componentes a criar (com variants)

| Componente | Variants |
|---|---|
| `Bar / TopBar` | `active=Sobre/Processo/Biblioteca/Criar/Experiência` |
| `Button / Btn` | `style=default/primary`, `state=idle/hover` |
| `Chip / Aroma` | `state=idle/hover/active` |
| `Card / Origin` | `origin=B1/E1/C1/G1`, `state=idle/hover/active` |
| `Card / Topping` | `topping=∅/◐/◯/≋`, `state=idle/hover/active` |
| `Card / BlendLib` | `formula=Nº04..Nº64` (12 instâncias), `state=idle/hover` |
| `Day / Calendar` | `state=default/hover/disabled/active` |
| `Slot / Time` | `state=default/hover/disabled/active` |
| `Bean / SVG` | `origin=B1/E1/C1/G1`, `roast=light/med/dark` (12 frames) |
| `Diagram / Origin` | static |
| `Diagram / Roast curve` | static |
| `Diagram / Aroma rays` | static |
| `Diagram / Formula` | static |

### Smart Animate hints
- Hovers: 200ms `Ease Out`.
- Bean morph entre origens/torras: 600ms `Ease Out`. Use como bridge entre frames.
- Slider drag: criar 11 frames (0, 10, 20… 100). Smart Animate consecutivos.
- Pulse status / map: usar After Effects ou Lottie — Figma não suporta keyframes infinitos nativamente.

### Prototipagem flow
1. Landing → click `.origin` button → swap variant active + bean frame muda.
2. Landing → click `.btn primary Compor →` → scroll para `#blend`.
3. Blend `.b-finalise button` → navega para `Encomendar.html` (frame separado).
4. Encomendar → `Confirmar visita →` → frame de sucesso (criar: ✓ verde + "Reserva confirmada · email enviado").

### Checklist do que NÃO está no HTML mas deve existir em produção
- [ ] Persistência de blend (Landing → Encomendar)
- [ ] Tela de sucesso pós-reserva (substitui `alert()`)
- [ ] Página de detalhe de cada fórmula da Biblioteca (atualmente todos os cards apontam ao blend builder)
- [ ] Validação de email/telefone no form
- [ ] Loading states (calendário, confirmação)
- [ ] Empty state Biblioteca (filtros sem resultado)
- [ ] Mobile menu (atualmente nav desaparece em <1000px sem alternativa)

---

## 9. Resumo das animações infinitas

| Elemento | Onde | Duração | Easing | Propriedade |
|---|---|---|---|---|
| Status pulse | TopBar todas as páginas | 1.6s | ease-in-out | opacity 0.4 ↔ 1 |
| Canvas pulse (blend builder) | Landing canvas top-left | 1.6s | ease-in-out | opacity 0.4 ↔ 1 |
| Map pin pulse | Experiencia mapa | 2.4s | ease-in-out | box-shadow expansion |

---

*Última atualização: 2 maio 2026 · O Alquimista — Laboratório do Grão*
