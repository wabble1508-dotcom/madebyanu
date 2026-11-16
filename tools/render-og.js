// Erzeugt assets/img/og-image.jpg aus tools/og-image.html (1200×630)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + path.join(__dirname, 'og-image.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(__dirname, '..', 'assets', 'img', 'og-image.jpg'), type: 'jpeg', quality: 88 });
  await b.close();
})();
