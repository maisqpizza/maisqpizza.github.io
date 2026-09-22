# Link canônico de redirecionamento (QR Code)

Página estática que serve de "link mestre" pro QR Code. O QR Code nunca
muda — quem muda é o destino, editando `index.html` e dando push.

## Publicar (só na primeira vez)

1. Crie um repositório novo e **público** no GitHub (obrigatório pro GitHub
   Pages grátis), ex: `promo-redirect`.
2. Neste diretório, rode:
   ```
   git init
   git add index.html README.md
   git commit -m "Página inicial de redirecionamento"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/promo-redirect.git
   git push -u origin main
   ```
3. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy
   from a branch → Branch: `main` / `(root)` → Save**.
4. Em 1-2 minutos o site fica disponível em:
   `https://SEU_USUARIO.github.io/promo-redirect/`

Esse é o link que vai virar o QR Code (canônico, nunca muda).

## Trocar o destino depois (sempre que quiser)

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

## Custo

R$ 0. GitHub Pages é gratuito para repositórios públicos, sem limite de
tempo, sem cartão de crédito.
