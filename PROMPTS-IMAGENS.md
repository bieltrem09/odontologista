# Prompts de imagem — site da clínica

Os prompts estão em inglês porque os geradores (Midjourney, DALL·E/ChatGPT, Firefly, Ideogram, Flux) entendem melhor assim.
Todos compartilham o mesmo **bloco de estilo** para as imagens parecerem uma sessão só.

## Bloco de estilo (cole no final de qualquer prompt)

```
high-key soft natural daylight, ice-white and pale periwinkle color palette (#F7F8FC, #DCE1FF, #8C9BF5 accents), clean minimal premium healthcare aesthetic, gentle diffused shadows, true-to-life skin tones, subtle film grain, shot on Sony A7R V with 85mm f/1.8, shallow depth of field, editorial photography, calm and reassuring mood
```

## Negativo (onde a ferramenta aceitar "negative prompt" / `--no`)

```
saturated cyan stock-photo blue, neon, purple-pink gradient, harsh flash, blood, needles close-up, scary tools, open wounds, plastic skin, extra fingers, distorted teeth, overly perfect veneers, text, watermark, logo, cluttered background
```

---

## 1. Hero — implante 3D (a imagem mais importante)

- **Onde:** substitui o SVG do implante no hero
- **Formato:** 5:4 (2000 × 1600 px), **fundo transparente** (PNG → depois converter para WebP)

```
Studio product render of a single dental implant, perfectly centered: a glossy white ceramic molar crown with soft subsurface translucency, sitting on a polished titanium abutment collar and a precisely threaded titanium screw with crisp machined threads and realistic anisotropic metal reflections. The implant emerges from a stylized translucent cross-section of gum and porous trabecular bone in frosted white-lavender glass. Two natural molars flank it on the left and right, softly out of focus with strong depth of field. Pure white seamless background with a soft lavender-blue haze rising from the bottom. High-key three-point studio lighting, large soft key light from upper left, subtle rim light on the titanium. Ultra clean, Apple-style product photography, octane render, 8k, hyper-detailed, no text.
```
`--ar 5:4 --style raw --v 7`

**Dica:** gere com fundo branco e remova o fundo (remove.bg, Photoshop ou Canva). Exporte com no máximo 250 KB.

---

## 2. Cards de tratamento (8 imagens)

- **Formato:** 3:4 (1200 × 1600 px)
- **Composição:** deixe o terço de baixo mais limpo, porque é onde entram o nome e a seta.
- **Ângulo:** todas mostram o tratamento de forma calma, sem instrumento invasivo em close.

**Limpeza e prevenção**
```
Close-up of a relaxed young adult woman in a dental chair smiling gently while a dentist's gloved hand holds a small mirror near her mouth, bright modern clinic, white and soft lavender tones, calm atmosphere, lower third of frame clean and softly blurred
```

**Clareamento**
```
Close-up portrait of a smiling adult woman with naturally white (not artificial) teeth, holding a transparent whitening tray, soft window light, ice-white background with lavender haze, joyful but natural expression, lower third clean
```

**Lentes de contato dental**
```
Macro shot of a dentist's gloved fingertips holding an ultra-thin translucent porcelain veneer against a soft periwinkle backdrop, light passing through the ceramic, jewelry-like product photography, extreme detail, lower third clean
```

**Implantes**
```
Elegant macro product photo of a titanium dental implant with ceramic crown standing upright on a frosted glass surface, soft reflections, white background with gentle lavender gradient, premium medical device photography, lower third clean
```

**Ortodontia e alinhadores**
```
Smiling teenager holding a clear aligner between two fingers next to her face, bright airy clinic, natural light, soft white and periwinkle palette, authentic happy expression, lower third clean
```

**Odontopediatria**
```
Happy 6-year-old child in a dental chair giving a thumbs up, a friendly female pediatric dentist in soft lavender scrubs smiling beside him, playful but calm modern clinic, bright natural light, lower third clean
```

**Tratamento de canal**
```
Calm adult man reclining comfortably in a modern dental chair wearing noise-cancelling headphones, eyes relaxed, dentist softly blurred in background, serene atmosphere, ice-white and lavender tones, conveys painless comfortable treatment, lower third clean
```

**Ambiente / outro tratamento**
```
Minimalist modern dental treatment room, white ergonomic dental chair, large window with soft daylight, light wood and white surfaces, a small olive plant, lavender accent wall, no people, architectural interior photography, lower third clean
```
`--ar 3:4 --style raw` em todas

---

## 3. Sobre nós — foto grande

- **Formato:** 11:10 (2200 × 2000 px)

```
Warm editorial photo of a dentist wearing a mask and loupes gently treating a smiling woman reclining in a dental chair, the patient laughing naturally, golden-hour sunlight from a large window creating soft lens flare, modern clinic with white and pale lavender tones, intimate human moment, compassionate care, cinematic shallow depth of field
```
`--ar 11:10 --style raw`

---

## 4. Fundo do CTA final (opcional)

- **Formato:** 16:9 (2400 × 1350 px)

```
Abstract soft-focus close-up of a white ceramic tooth crown floating in an ice-white space, dreamy lavender-periwinkle mist rising from the bottom, ethereal, minimal, lots of negative space on the left for text, high-key studio render
```
`--ar 16:9`

---

## 5. Imagem de compartilhamento (WhatsApp/Instagram)

- **Formato:** 1200 × 630 px (OG image) → salvar como `assets/og-hero.jpg`

```
Wide minimal composition: glossy white dental implant with titanium screw on the right third, soft lavender haze at the bottom, large empty ice-white area on the left for a headline, premium product render, high-key lighting
```
`--ar 1.91:1`

---

## ⚠️ O que NÃO gerar com IA

Para estas imagens use **fotos reais**. Rosto gerado por IA apresentado como se fosse da equipe ou de paciente engana quem visita o site, e o Código de Ética do CFO proíbe isso na publicidade odontológica.

- **Dentistas** (cards da equipe e destaque do responsável técnico)
- **Antes e depois**: só com casos reais e autorização escrita do paciente
- **Depoimentos**

**Briefing para a sessão de fotos da equipe** (passe ao fotógrafo):
retrato vertical 4:5, meio corpo, jaleco branco, fundo do próprio consultório desfocado (f/1.8), luz de janela suave pela lateral, sorriso natural (não posado), olhar para a câmera, todas as fotos com o mesmo enquadramento, luz e altura de câmera, tratamento de cor claro e frio, puxado para o lavanda.

---

## Como entregar os arquivos

Coloque as imagens numa pasta `assets/` com estes nomes. Eu ligo cada uma no site.

| Arquivo | Uso |
|---|---|
| `implante.webp` | Hero (fundo transparente) |
| `t-limpeza.webp` … `t-ambiente.webp` | 8 cards de tratamento |
| `sobre.webp` | Seção Sobre |
| `cta.webp` | Fundo do CTA |
| `og-hero.jpg` | Compartilhamento |
| `dr-*.webp` | Fotos reais da equipe |
