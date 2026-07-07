# KIM'S PHOTO APP 📸

Impressão de fotos em grade com tamanho exato (estilo PhotoScape) — funciona como app no iPhone (PWA) e gera PDF pronto para imprimir.

## Recursos

- Papel: A3, A4, A5, Carta, Ofício, 10×15 ou personalizado (mm), retrato/paisagem
- Tamanho exato da foto em mm, com presets (3×4, 5×7, 10×15…)
- Repetição por foto (global e individual), "preencher página"
- Papel completo / imagem completa / estender / modo DPI (tamanho real)
- Alinhamento, girar automático, borda, gamma, nitidez, escala de cinza/sépia
- PDF em 180 / 300 / 600 / 1200 DPI com medidas exatas em milímetros
- PWA: ícone na tela de início, tela cheia, funciona offline após a primeira visita

## Deploy no Coolify

1. Suba este repositório para o GitHub.
2. No Coolify: **+ New → Public Repository** (ou Private com a integração GitHub).
3. Cole a URL do repositório e selecione **Build Pack: Static**.
4. Em **Domains**, defina o domínio (ex.: `https://fotos.seudominio.com`) — o Coolify emite o certificado HTTPS automaticamente.
5. **Deploy.** Pronto.

> HTTPS é necessário para o modo offline (service worker) e o comportamento de app no Safari — o Coolify já resolve isso.

## Atualizações

Ao publicar uma nova versão, troque o nome do cache no `sw.js` (`kims-photo-v1` → `v2`) para os aparelhos baixarem os arquivos novos.

## Uso no iPhone

Abra o site no Safari → **Compartilhar → Adicionar à Tela de Início**. O app abre em tela cheia com o ícone KIM'S PHOTO e funciona até sem internet.
