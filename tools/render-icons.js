// Erzeugt PNG-Icons aus assets/img/favicon.svg
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const svg = fs.readFileSync(path.join(__dirname, '..', 'assets/img/favicon.svg'), 'utf8');
  for (const [name, size] of [['icon-48.png', 48], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    await p.setContent(`<style>*{margin:0}svg{width:${size}px;height:${size}px;display:block}</style>${svg}`);
    await p.screenshot({ path: path.join(__dirname, '..', 'assets/img', name), omitBackground: true }); await p.close();
  }
  await b.close();
})();
