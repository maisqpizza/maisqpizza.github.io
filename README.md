# Link canônico de redirecionamento (QR Code) — Mais Q Pizza

Página estática que serve de "link mestre" pro QR Code. O QR Code nunca
muda — quem muda é o destino, editando `index.html` e dando push.

**Link ao vivo:** https://maisqpizza.github.io/
**Repositório:** https://github.com/maisqpizza/maisqpizza.github.io
**Organização GitHub:** maisqpizza (gratuita, sem cartão de crédito)

## Como funciona (várias filiais, um link só)

O mesmo link atende todas as filiais. Ao abrir:

1. **Preferência salva** — se o cliente já escolheu uma cidade antes
   (fica no `localStorage` do aparelho dele), abre essa filial após 2s,
   com botão "Trocar cidade".
2. **Localização por IP** — senão, consulta `ipwho.is` (reserva:
   `ipapi.co`), sem GPS e sem pedir permissão. Se a cidade bate com uma
   filial, mostra "Identificamos que você pode estar em: …" com contador
   circular de 5s. Ao zerar, abre a filial (sem salvar como preferência).
   "Sim, ir agora" salva a escolha; "Escolher outra cidade" para o contador.
3. **Seleção manual** — se a API falhar/demorar (>2,5s por serviço), a
   cidade não tiver filial, ou a confiança for baixa, mostra a lista
   pesquisável. A cidade escolhida fica salva pras próximas visitas.

Links úteis:
- `https://maisqpizza.github.io/?trocar` → esquece a cidade salva e abre a lista.
- `https://maisqpizza.github.io/?cidade=blumenau` → abre direto uma filial
  (ex: QR Code colado dentro de uma loja específica).

## Adicionar/editar filiais e destinos

1. Abra `js/config.js`.
2. Edite a lista `BRANCHES` (uma entrada por cidade: `id`, `name`,
   `state`, `label`, `whatsapp.number`, `whatsapp.message`; opcionais
   `aliases` pra cidades vizinhas e `lat`/`lon`).
3. Em `SETTINGS`: tempo do contador, `mode: "direct"` (vai direto pro
   WhatsApp) ou `mode: "promo"` (tela de promoção antes).
4. Salve, depois:
   ```
   git add js/config.js
   git commit -m "Atualiza filiais"
   git push
   ```
5. Em ~30-60s a mudança está no ar. **O QR Code impresso continua
   funcionando igual, sem precisar gerar um novo.**

Também dá pra editar direto pelo site do GitHub (ícone de lápis no
arquivo), sem terminal. Se mudar números, atualize também os links do
`<noscript>` em `index.html` (só usados com JavaScript desligado).

Estrutura: `js/geo.js` (localização por IP), `js/match.js` (cidade →
filial), `js/preference.js` (localStorage), `js/ui.js` (telas),
`js/main.js` (fluxo), `css/style.css`.

## Gerar o QR Code de novo (só se o link mudar)

```
node tmp/generate-qr.js
```
Gera `qrcode/qrcode.png` (1200px, pra imprimir) e `qrcode/qrcode.svg`
(vetor) apontando pra `https://maisqpizza.github.io/`.

## Custo

R$ 0. GitHub Pages é gratuito para repositórios públicos, sem limite de
tempo, sem cartão de crédito. Mesmo valendo pra organizações.
