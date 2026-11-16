# madebyanu – Website

Statische Website (HTML + handgeschriebenes CSS + Vanilla-JS). Ohne Build-Schritt, ohne externe CDNs:
`index.html` im Browser öffnen oder den Ordner bei einem beliebigen Webhoster hochladen. Fertig.

## Struktur
```
index.html            Startseite (Hero, Kreationen, Ablauf, Über mich, Galerie, FAQ, Anfrage)
impressum.html        Impressum (§ 5 DDG, Kleinunternehmer § 19 UStG)
datenschutz.html      Datenschutzerklärung (DSGVO)
assets/css/styles.css Design (Farben & Schriften oben als Variablen in :root)
assets/js/main.js     Menü, Animationen, Formular
assets/fonts/         Bodoni Moda, Figtree, Pinyon Script – lokal gehostet (DSGVO-konform, OFL-Lizenz)
assets/img/menu/      Menü-Grafiken & Fotos von Instagram
assets/reels/         Reels von Instagram (MP4, ohne Ton) + Standbilder
```

## Vor dem Livegang – Checkliste
1. **Platzhalter ersetzen**: In `impressum.html`, `datenschutz.html` und `agb.html` (Zahlung, Stornofrist, Lagerung) alle gelb markierten `[ … ]`
   (Name, Anschrift, E-Mail, Hoster, Landesdatenschutzbehörde) ausfüllen und die `<span class="placeholder">` entfernen.
2. **E-Mail** in `assets/js/main.js` (`CONTACT_EMAIL`) eintragen.
3. **Eigene Fotos**: Bilder (JPG/WebP, ca. 1600 px breit) nach `assets/img/` legen und im `src` der `<img>`-Tags
   austauschen. Hero: Hochformat 4:5. Über mich: am besten ein Foto von dir.
4. **Neue Reels**: MP4 nach `assets/reels/` legen (ohne Ton, ca. 540×960, max. ~1 MB) und in `index.html` im Abschnitt „Reels“ eine Karte kopieren.
   Neue Sorten/Preise stehen direkt in `index.html` im Abschnitt „Menü“.
5. **Formular**: Ohne Einstellung wird die Anfrage nach dem Absenden fertig formuliert und per WhatsApp oder E-Mail an dich
   übergeben. Für direkten Versand: z. B. bei Formspree ein Formular anlegen und die URL in `FORM_ENDPOINT` in
   `main.js` eintragen (dann Abschnitt 5 der Datenschutzerklärung entsprechend anpassen).
6. **Texte prüfen**: „Über mich“, FAQ (Vorlaufzeit, Abholung, Allergene) und das Antwortversprechen „48 Stunden“ an deine
   Realität anpassen.
7. **Lebensmittelrecht** (nicht Teil der Website, aber wichtig): Wer gewerblich Lebensmittel verkauft, muss den Betrieb
   bei der zuständigen Lebensmittelüberwachung registrieren und Allergene (LMIV) angeben. Rechtstexte im Zweifel von
   einer Fachperson prüfen lassen – die Vorlagen ersetzen keine Rechtsberatung.

Farben ändern: in `styles.css` unter `:root` (`--rose`, `--rose-deep`, `--cream` …).

## SEO, Vorschaubild & KI-Suche
- **Vorschaubild beim Teilen:** `assets/img/og-image.jpg` (1200×630). Vorlage: `tools/og-image.html`, neu erzeugen mit `node tools/render-og.js`.
- **Strukturierte Daten (Google & KI):** Bäckerei, Menü mit Preisen und FAQ werden aus `index.html` erzeugt.
  Nach Änderungen an Sorten, Preisen oder FAQ einmal ausführen: `python3 tools/build-seo.py`
- **Für Suchmaschinen & KI:** `robots.txt`, `sitemap.xml`, `llms.txt`.
- **Eigene Domain (madebyanu.de):** Sobald sie verbunden ist, die Adresse `https://wabble1508-dotcom.github.io/madebyanu/`
  in `index.html`, `tools/build-seo.py`, `robots.txt`, `sitemap.xml` und `llms.txt` ersetzen und `build-seo.py` ausführen.
  Erst mit eigener Domain liest Google die `robots.txt` (bei github.io-Unterordnern wird sie ignoriert).
- **Wichtigste Schritte außerhalb der Website:**
  1. Google Unternehmensprofil (business.google.com) anlegen – Kategorie „Konditorei“/„Dessertgeschäft“, Dortmund, Website-Link, Fotos.
  2. Google Search Console: Website hinzufügen und `sitemap.xml` einreichen.
  3. In der Instagram-Bio den Website-Link eintragen.
