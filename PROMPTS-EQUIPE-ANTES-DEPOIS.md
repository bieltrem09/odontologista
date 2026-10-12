# Prompts — Equipe e Antes/Depois (OdontoClinic)

> **Importante:** a OdontoClinic é uma clínica fictícia, usada como demonstração ou portfólio, então pode usar estas imagens geradas por IA.
> Se o site for usado por uma **clínica real**, troque por fotos reais da equipe e por casos reais com autorização escrita do paciente.
> Apresentar rostos ou resultados gerados por IA como reais engana o paciente e vai contra o Código de Ética do CFO.

Os prompts estão em inglês porque os geradores entendem melhor assim. Cole o **bloco de estilo** no fim de cada prompt para manter a mesma luz e a mesma cor do resto do site.

```
high-key soft natural window light from the left, ice-white and pale periwinkle palette (#F7F8FC, #DCE1FF, #8C9BF5), modern bright dental clinic softly blurred in background, shallow depth of field f/1.8, shot on Sony A7R V 85mm, true-to-life skin texture, subtle film grain, editorial healthcare portrait, calm and trustworthy mood
```

**Negativo** (use em `--no` ou no campo "negative prompt"):
```
plastic skin, over-smoothed face, extra fingers, distorted hands, stethoscope, surgical blood, harsh flash, saturated cyan stock blue, neon, text, watermark, logo, name tag text, cluttered background
```

---

## 1. Equipe

**Formato:** retrato vertical **4:5** (1600 × 2000 px). Para as 4 imagens ficarem com cara de sessão de fotos única, mantenha o mesmo enquadramento:
- meio corpo;
- câmera na altura dos olhos;
- olhar para a câmera;
- espaço livre acima da cabeça.

> Dica: gere o primeiro retrato e use a mesma **seed** (Midjourney: `--seed 1234`) ou a função "estilo de referência" (`--sref`) nos outros.

### `dr-1.webp` — Dra. · Odontopediatria
```
Waist-up portrait of a warm Brazilian female pediatric dentist in her early 30s, light brown wavy hair in a loose low ponytail, gentle genuine smile showing teeth, wearing soft lavender scrubs under an open white lab coat, hands relaxed and loosely clasped at waist, small colorful children's dental chair softly blurred behind her, friendly and approachable expression, looking at camera
```
`--ar 4:5 --style raw --v 7`

### `dr-2.webp` — Dr. · Implantodontia
```
Waist-up portrait of a confident Brazilian male implant dentist in his mid 40s, short salt-and-pepper hair, neatly trimmed beard, calm closed-mouth smile, crisp white lab coat over light periwinkle shirt, arms relaxed at his sides, modern treatment room with dental chair softly blurred behind him, experienced and reassuring presence, looking at camera
```
`--ar 4:5 --style raw --v 7`

### `dr-3.webp` — Dra. · Estética e Lentes
```
Waist-up portrait of an elegant Brazilian female cosmetic dentist in her late 30s, dark straight shoulder-length hair, natural bright smile, arms gently crossed, fitted white lab coat with subtle lavender piping, small gold stud earrings, minimal makeup, bright aesthetic clinic with soft lavender accent wall blurred behind her, polished but warm, looking at camera
```
`--ar 4:5 --style raw --v 7`

### `dr-4.webp` — Dr. · Ortodontia
```
Waist-up portrait of a friendly Brazilian male orthodontist in his early 30s, short curly black hair, warm open smile, white lab coat over a light grey t-shirt, holding a clear aligner casually in one hand at chest height, bright modern clinic softly blurred behind him, relaxed and modern vibe, looking at camera
```
`--ar 4:5 --style raw --v 7`

### `dr-responsavel.webp` — Responsável técnico (miniatura do destaque)
**Formato:** quadrado **1:1** (800 × 800 px). Aparece pequena (72 px), então o rosto precisa estar bem centralizado.
```
Head-and-shoulders portrait of a distinguished Brazilian male dentist in his early 50s, short grey hair, rimless glasses, kind confident smile, white lab coat, centered face filling most of the frame, clean softly blurred clinic background in white and pale lavender
```
`--ar 1:1 --style raw --v 7`

---

## 2. Antes e depois

**Formato:** **2:1** (2000 × 1000 px). Mantenha o sorriso **bem no centro**, porque no celular a imagem é cortada em 4:5.

**Regra de ouro:** "antes" e "depois" precisam ter o **mesmo enquadramento, a mesma luz e os mesmos lábios**, mudando só os dentes. Faça assim:
1. Gere primeiro o **"depois"**.
2. Use a função de edição da ferramenta (Midjourney *Vary Region*, ChatGPT "editar imagem", Photoshop *Generative Fill*) **sobre a mesma imagem**, selecionando só os dentes, e aplique o prompt do "antes".

Isso garante que o divisor do slider compare exatamente a mesma boca.

**Base comum** (use em todos os pares):
```
Extreme close-up macro photo of a smiling mouth, lower half of the face only from the tip of the nose to the chin, no eyes visible, natural lips with soft texture, front teeth clearly visible and centered in frame, soft even studio lighting, clean ice-white background with faint lavender tint, clinical dental photography, ultra sharp detail
```

### Lentes de contato dental → `ba-lentes-antes.webp` / `ba-lentes-depois.webp`
**Depois:**
```
[base] + harmonious porcelain veneers on the upper front teeth, natural shape and proportions, soft natural white shade (not paper white), realistic translucency at the incisal edges, healthy pink gums, symmetrical smile line
```
**Antes** (editar só os dentes):
```
same mouth and lighting, upper front teeth slightly uneven in length, small chipped edge on one central incisor, mild worn edges, small gap between lateral incisors, slightly yellowish natural shade
```

### Clareamento → `ba-clareamento-antes.webp` / `ba-clareamento-depois.webp`
**Depois:**
```
[base] + naturally bright white teeth, shade A1, healthy and natural-looking, subtle enamel texture and translucency, healthy pink gums
```
**Antes:**
```
same mouth and lighting, same tooth shape and position, teeth with yellow-beige coffee staining, shade A3.5, slightly darker near the gumline, dull enamel
```

### Implantes → `ba-implantes-antes.webp` / `ba-implantes-depois.webp`
**Depois:**
```
[base] + complete natural smile, all upper teeth present, the upper left first premolar is a ceramic crown perfectly matching neighboring teeth in color and shape, healthy gum contour
```
**Antes:**
```
same mouth and lighting, the upper left first premolar is missing leaving a visible gap with healed pink gum, all other teeth identical
```

### Ortodontia → `ba-ortodontia-antes.webp` / `ba-ortodontia-depois.webp`
**Depois:**
```
[base] + perfectly aligned upper and lower front teeth, even arch form, natural white shade, healthy gums, balanced smile
```
**Antes:**
```
same mouth and lighting, crowded upper front teeth, one lateral incisor rotated and pushed behind, slightly overlapping lower incisors, uneven smile line, same natural shade
```

---

## Como colocar no site

O site já está programado para **puxar essas fotos sozinho**. Basta subir os arquivos na pasta `assets/` do GitHub com estes nomes exatos:

| Arquivo | Onde aparece |
|---|---|
| `dr-1.webp` … `dr-4.webp` | Cards da equipe (na ordem: Odontopediatria, Implantodontia, Estética, Ortodontia) |
| `dr-responsavel.webp` | Mini-card do responsável técnico |
| `ba-lentes-antes.webp` / `ba-lentes-depois.webp` | Aba Lentes |
| `ba-clareamento-antes.webp` / `ba-clareamento-depois.webp` | Aba Clareamento |
| `ba-implantes-antes.webp` / `ba-implantes-depois.webp` | Aba Implantes |
| `ba-ortodontia-antes.webp` / `ba-ortodontia-depois.webp` | Aba Ortodontia |

Se o arquivo vier em `.jpg` ou `.png`, pode mandar assim mesmo: eu converto e renomeio.
Enquanto uma foto não existir, o site continua mostrando a imagem provisória, sem quebrar.
