#!/usr/bin/env python3
"""Erzeugt die strukturierten Daten (JSON-LD) in index.html aus der Speisekarte und den FAQ.
Nach jeder Änderung an Sorten, Preisen oder FAQ einmal ausführen:  python3 tools/build-seo.py
SITE_URL anpassen, sobald die eigene Domain (z. B. https://madebyanu.de/) verbunden ist."""
import json, re, pathlib
SITE_URL = "https://wabble1508-dotcom.github.io/madebyanu/"
root = pathlib.Path(__file__).resolve().parent.parent
f = root / "index.html"
s = f.read_text()
txt = lambda h: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", h)).replace("&amp;", "&").replace("&nbsp;", " ").strip()

sections = []
for m in re.finditer(r'<div class="menu-panel" id="panel-\w+".*?<h3>(.*?)</h3>.*?<ul>(.*?)</ul>', s, re.S):
    items = []
    for d in re.finditer(r'<h4 class="dish-name">(.*?)</h4>.*?<span class="dish-price[^"]*">(.*?)</span>.*?<p class="dish-desc">(.*?)(?:<span|</p>)', m.group(2), re.S):
        it = {"@type": "MenuItem", "name": txt(d.group(1)), "description": txt(d.group(3))}
        if "€" in d.group(2):
            it["offers"] = {"@type": "Offer", "price": d.group(2).replace(" €", "").replace(",", ".").strip(), "priceCurrency": "EUR"}
        items.append(it)
    sections.append({"@type": "MenuSection", "name": txt(m.group(1)), "hasMenuItem": items})
sections.append({"@type": "MenuSection", "name": "Boxen", "hasMenuItem": [{"@type": "MenuItem", "name": "4er Box Tiramisu & Cheesecake", "description": "Vier Sorten nach Wahl, als Tiramisu- oder Cheesecake-Box", "offers": {"@type": "Offer", "price": "20.00", "priceCurrency": "EUR"}}]})
faq = [{"@type": "Question", "name": txt(q.group(1)), "acceptedAnswer": {"@type": "Answer", "text": txt(q.group(2))}}
       for q in re.finditer(r"<details><summary>(.*?)</summary>\s*<p>(.*?)</p></details>", s, re.S)]
ld = [{
    "@context": "https://schema.org", "@type": "Bakery", "@id": SITE_URL + "#business",
    "name": "madebyanu", "alternateName": "madebyanu.de", "url": SITE_URL,
    "description": "Handgemachte Cheesecake Cups, Tiramisu, Dubai Schokolade, Dubai Brownies und Peanutbutter Cups aus Dortmund. Frisch auf Bestellung, bestellbar per WhatsApp oder Instagram-DM.",
    "image": [SITE_URL + "assets/img/og-image.jpg", SITE_URL + "assets/img/menu/cheesecake-cups.jpg", SITE_URL + "assets/img/menu/tiramisu.jpg"],
    "logo": SITE_URL + "assets/img/icon-512.png", "telephone": "+49 176 61478638",
    "address": {"@type": "PostalAddress", "addressLocality": "Dortmund", "addressRegion": "Nordrhein-Westfalen", "addressCountry": "DE"},
    "areaServed": {"@type": "City", "name": "Dortmund"},
    "priceRange": "5 € – 20 €", "currenciesAccepted": "EUR",
    "servesCuisine": ["Desserts", "Cheesecake", "Tiramisu", "Dubai Schokolade"],
    "keywords": "Cheesecake Dortmund, Tiramisu Dortmund, Dubai Schokolade Dortmund, Dubai Brownies, Cheesecake im Becher, Dessert bestellen Dortmund, Dessert Box Geschenk, Cheesecake am Stiel",
    "potentialAction": {"@type": "OrderAction", "target": "https://wa.me/4917661478638"},
    "sameAs": ["https://www.instagram.com/madebyanu.de/"],
    "hasMenu": {"@type": "Menu", "name": "madebyanu Menü", "inLanguage": "de", "hasMenuSection": sections},
}, {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faq},
   {"@context": "https://schema.org", "@type": "WebSite", "name": "madebyanu.de", "url": SITE_URL, "inLanguage": "de-DE"}]
block = '<script type="application/ld+json">\n' + json.dumps(ld, ensure_ascii=False, indent=1) + "\n  </script>"
s = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda _: block, s, count=1, flags=re.S)
f.write_text(s)
print("JSON-LD aktualisiert:", [len(x["hasMenuItem"]) for x in sections], "Menüpunkte,", len(faq), "FAQ")
