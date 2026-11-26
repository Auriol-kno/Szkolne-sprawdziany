/* Buduje v2/index.html – jedna samodzielna strona (JS + CSS + moduł matematyki w środku).
   Uruchom: bun run build.ts (z katalogu v2) */
import { readFileSync, writeFileSync } from 'fs';

const out = await Bun.build({ entrypoints: ['./src/main.ts'], target: 'browser', minify: false, format: 'esm' });
if (!out.success) { console.error(out.logs); process.exit(1); }
const js = (await out.outputs[0].text()).replace(/<\/script/gi, '<\\/script');
const css = readFileSync('./src/legacy.css', 'utf8') + '\n' + readFileSync('./src/app.css', 'utf8');
const math = readFileSync('../src/math_app.html', 'utf8').replace(/<\/script/g, '<%%/S').replace(/<script/g, '<%%S');

const html = `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Szkolne sprawdziany Franka</title>
<link rel="icon" type="image/png" href="../icon-512.png?v=2">
<link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png?v=2">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Sprawdziany">
<meta name="theme-color" content="#2F4F4F">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&family=Caveat:wght@600;700&display=swap">
<style>
${css}
</style>
</head>
<body>
<header class="top"><div class="top-in">
  <button class="back" id="back" data-act="back" hidden>◀ Wstecz</button>
  <div class="brand" id="brand"></div>
  <nav class="nav" id="nav" aria-label="Widoki">
    <button data-act="go" data-v="hub">Przedmioty</button>
    <button data-act="go" data-v="progress">Postępy</button>
  </nav>
</div></header>
<main id="main"></main>
<script type="text/plain" id="math-src">${math}</script>
<script type="module">
${js}
</script>
</body>
</html>
`;
writeFileSync('./index.html', html);
console.log('v2/index.html', html.length, 'B');
