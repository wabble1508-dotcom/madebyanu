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
assets/fonts/         Fraunces, Figtree, Caveat – lokal gehostet (DSGVO-konform, OFL-Lizenz)
assets/img/           Illustrationen + Sorten-Bilder (Platzhalter für deine Fotos)
assets/video/         Hintergrundvideo (Creme-Loop) – quer + hochkant fürs Handy
```

## Vor dem Livegang – Checkliste
1. **Platzhalter ersetzen**: In `impressum.html` und `datenschutz.html` alle gelb markierten `[ … ]`
   (Name, Anschrift, E-Mail, Hoster, Landesdatenschutzbehörde) ausfüllen und die `<span class="placeholder">` entfernen.
2. **E-Mail** in `assets/js/main.js` (`CONTACT_EMAIL`) eintragen.
3. **Eigene Fotos**: Bilder (JPG/WebP, ca. 1600 px breit) nach `assets/img/` legen und im `src` der `<img>`-Tags
   austauschen. Hero: Hochformat 4:5. Über mich: am besten ein Foto von dir.
4. **Eigenes Video**: Dreh einen kurzen Clip (8–15 Sek., ohne Ton, z. B. Pistaziencreme wird aufgespritzt) quer und hochkant,
   exportiere als MP4 (H.264, max. ca. 5 MB) und ersetze `assets/video/hero-cream.mp4`, `hero-cream-mobile.mp4`
   (die `.webm`-Zeile in `index.html` dann löschen) sowie die beiden Poster-JPGs (erstes Standbild).
5. **Formular**: Ohne Einstellung wird die Anfrage nach dem Absenden fertig formuliert und per WhatsApp oder E-Mail an dich
   übergeben. Für direkten Versand: z. B. bei Formspree ein Formular anlegen und die URL in `FORM_ENDPOINT` in
   `main.js` eintragen (dann Abschnitt 5 der Datenschutzerklärung entsprechend anpassen).
6. **Texte prüfen**: „Über mich“, FAQ (Vorlaufzeit, Abholung, Allergene) und das Antwortversprechen „48 Stunden“ an deine
   Realität anpassen.
7. **Lebensmittelrecht** (nicht Teil der Website, aber wichtig): Wer gewerblich Lebensmittel verkauft, muss den Betrieb
   bei der zuständigen Lebensmittelüberwachung registrieren und Allergene (LMIV) angeben. Rechtstexte im Zweifel von
   einer Fachperson prüfen lassen – die Vorlagen ersetzen keine Rechtsberatung.

Farben ändern: in `styles.css` unter `:root` (`--rose`, `--rose-deep`, `--cream` …).
