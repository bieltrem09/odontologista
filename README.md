# Site — Clínica odontológica

Home completa em HTML/CSS/JS puro (sem dependências), seguindo o prompt "Precisão que acalma".

Abrir localmente:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Movimento

- **Intro**: o dente se desenha e a cortina sobe revelando o hero (só na 1ª visita da sessão).
- **Hero**: card abre por máscara, headline sobe linha a linha (80 ms), implante entra com desfoque → foco, linhas de anotação se desenham uma após a outra, chips em stagger.
- **Implante**: tilt 3D (máx. 6°) seguindo o cursor com física de mola; no mobile, "float" de 4 s.
- **Chips**: trocam as anotações com crossfade + redesenho das linhas e um leve "balanço" do implante.
- **Scroll**: inércia suave no mouse/trackpad, âncoras com easing, hero encolhe e a névoa escorre para a faixa seguinte, barra de progresso, header encolhe 88 → 68 px com blur, scrollspy no menu.
- **Seções**: títulos com reveal por máscara, imagens abrem por clip-path, cards em stagger de 60 ms, métricas com contagem, fundo da jornada se expande e a linha do tempo se desenha conforme o scroll.
- **Modal de tratamento**: a foto do card "voa" até o modal (View Transitions API, com fallback).
- **Antes/depois**: divisor arrastável (mouse, toque e teclado) que "respira" uma vez ao aparecer.
- `prefers-reduced-motion`: tudo vai direto ao estado final (sem intro, tilt, marquee, contagem nem inércia).

## Antes de publicar

Substituir todos os campos entre `[COLCHETES]` (HTML e o topo de `main.js`: `WA_NUMBER`, tratamentos, textos), trocar as fotos de banco pelas fotos reais da clínica e só publicar antes/depois com autorização escrita do paciente (normas do CFO).
