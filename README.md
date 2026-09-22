# Link canônico de redirecionamento (QR Code) — Mais Q Pizza

Página estática que serve de "link mestre" pro QR Code. O QR Code nunca
muda — quem muda é o destino, editando `index.html` e dando push.

**Link ao vivo:** https://maisqpizza.github.io/
**Repositório:** https://github.com/maisqpizza/maisqpizza.github.io
**Organização GitHub:** maisqpizza (gratuita, sem cartão de crédito)

## Trocar o destino (sempre que quiser)

1. Abra `index.html`.
2. Edite o bloco `CONFIG` no topo do `<script>`:
   - `mode: "direct"` → vai direto pro WhatsApp.
   - `mode: "promo"` → mostra uma tela de promoção com botão pro WhatsApp
     antes (pode configurar redirecionamento automático em N segundos).
   - `whatsapp.number` e `whatsapp.message` → número e mensagem pré-preenchida.
3. Salve, depois:
   ```
   git add index.html
   git commit -m "Atualiza destino do redirecionamento"
   git push
   ```
4. Em ~30-60s a mudança está no ar. **O QR Code impresso continua
   funcionando igual, sem precisar gerar um novo.**

Também dá pra editar `index.html` direto pelo site do GitHub (ícone de
lápis no arquivo), sem precisar de terminal — útil pra trocar em cima da
hora, do celular.

## Gerar o QR Code de novo (só se o link mudar)

```
node tmp/generate-qr.js
```
Gera `qrcode/qrcode.png` (1200px, pra imprimir) e `qrcode/qrcode.svg`
(vetor) apontando pra `https://maisqpizza.github.io/`.

## Custo

R$ 0. GitHub Pages é gratuito para repositórios públicos, sem limite de
tempo, sem cartão de crédito. Mesmo valendo pra organizações.
