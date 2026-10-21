# Website-Berben

Website der (fiktiven) **Berben Engineering GmbH** – veröffentlicht über **GitHub Pages** unter www.berben-engineering.de.

> Demo-Projekt: Das Unternehmen ist erfunden, alle Inhalte dienen Test- und Präsentationszwecken.

## Seiten

| Deutsch | Englisch (`en/`) | Inhalt |
| --- | --- | --- |
| `index.html` | `index.html` | Startseite |
| `leistungen.html` | `services.html` | Leistungen |
| `technologien.html` | `technologies.html` | Technologien & Maschinenpark |
| `referenzen.html` | `references.html` | Referenzen mit Branchenfilter |
| `referenz-*.html` | `reference-*.html` | Fallstudien (je Referenz eine Seite) |
| `unternehmen.html` | `company.html` | Über uns, Werte |
| `karriere.html` | `careers.html` | Stellenangebote, Kurzbewerbung |
| `kontakt.html` | `contact.html` | Kontaktformular, FAQ |
| `anfrage.html` | `request.html` | Anfrage-Assistent (3 Schritte) |
| `passungsrechner.html` | `fit-calculator.html` | ISO-286-Passungsrechner |
| `kernlochrechner.html` | `tap-drill-calculator.html` | Kernlochrechner für metrische Gewinde |
| `schnittwerte-rechner.html` | `cutting-speed-calculator.html` | Drehzahl und Vorschub fürs Fräsen und Bohren |
| `wissen.html` + `wissen-*.html` | `knowledge.html` + `knowledge-*.html` | Fachartikel und Rechner |
| `impressum.html`, `datenschutz.html`, `404.html` | – | Rechtliches, Fehlerseite |

## Ordner

| Ordner / Datei | Inhalt |
| --- | --- |
| `assets/css/styles.css` | Fertiges Stylesheet – **nicht von Hand bearbeiten**, wird automatisch erzeugt |
| `assets/js/main.js` | Hell/Dunkel, Handy-Menü, Animationen, Filter, Formulare, Anfrage-Assistent |
| `assets/js/fit-calculator.js` | Rechenlogik des Passungsrechners (Tabellen nach ISO 286) |
| `assets/js/calculators.js` | Rechenlogik von Kernloch- und Schnittwerte-Rechner |
| `assets/img/fotos/` | Platzhalter-Fotos – durch echte Fotos ersetzen (siehe unten) |
| `assets/img/` | Logo-Varianten, Illustrationen, Vorschaubild |
| `assets/downloads/` | Firmenprofil als PDF |
| `assets/fonts/` | Schrift „Inter“ (lokal, keine Verbindung zu Google) |
| `src/styles.css`, `tailwind.config.js` | Quelle des Designs (Farben, Buttons, Karten …) |
| `scripts/check-links.mjs`, `.htmlvalidate.json`, `lighthouserc.json` | Automatische Prüfung (siehe unten) |

## Texte ändern

Passende `.html`-Datei auf GitHub öffnen → Stift ✏️ → Text ändern → „Commit changes“. Nach 1–2 Minuten ist die Änderung online.
Denke daran, Änderungen ggf. auch in der englischen Version im Ordner `en/` vorzunehmen.

## Design ändern

Das Design nutzt [Tailwind CSS](https://tailwindcss.com). Werden neue CSS-Klassen verwendet, erzeugt die GitHub Action
**„CSS bauen“** das Stylesheet automatisch neu. Lokal mit [Node.js](https://nodejs.org):

```bash
npm install
npm run build   # einmalig bauen
npm run watch   # bei jeder Änderung automatisch neu bauen
```

## Fotos austauschen

Alle Fotos liegen als Platzhalter in `assets/img/fotos/`. Auf jedem Platzhalter steht, welches Motiv dort hingehört.
Zum Austauschen auf GitHub den Ordner öffnen → „Add file“ → „Upload files“ → das echte Foto **mit genau demselben Dateinamen** hochladen → „Commit changes“.
Am besten im Querformat 16:10 (1600 × 1000 Pixel) als JPG, möglichst unter 300 KB. An den Seiten muss nichts geändert werden.

| Datei | Motiv | Verwendet auf |
| --- | --- | --- |
| `halle.jpg` | Fertigungshalle | Startseite, Karriere |
| `maschine-5achs.jpg` | 5-Achs-Bearbeitungszentrum | Startseite, Technologien |
| `messraum.jpg` | Messraum / Koordinatenmessmaschine | Startseite, Technologien |
| `team.jpg` | Teamfoto | Unternehmen |
| `ausbildung.jpg` | Fachkraft oder Azubi an der Maschine | Karriere |
| `referenz-*.jpg` | Bauteil der jeweiligen Fallstudie | Fallstudien |

## Zeichnungen im Anfrage-Assistenten hochladen

Das Upload-Feld ist eingebaut, aber **ausgeschaltet**, weil Formspree Datei-Uploads nur in bezahlten Tarifen (ab „Personal“) annimmt.
Zum Einschalten: Formspree-Tarif upgraden, dann in `anfrage.html` und `en/request.html` im `<form …>`-Tag `data-uploads="off"` in `data-uploads="on"` ändern.
Erlaubt sind bis zu 10 Dateien mit je max. 25 MB. Solange es aus ist, steht dort wie bisher der Hinweis auf den E-Mail-Versand.

## Automatische Prüfung

Bei jeder Änderung prüft die GitHub Action **„Website prüfen“**, ob Links, Bilder und Sprungmarken funktionieren, ob das HTML fehlerfrei ist
und ob Barrierefreiheit, SEO und Best Practices bei Lighthouse mindestens 90–95 von 100 Punkten erreichen. Ein rotes Kreuz am Commit
zeigt, dass etwas kaputt ist; die Details stehen im Reiter „Actions“. Lokal: `npm run check` (Links + HTML) und `npm run check:lighthouse`.

## Hell / Dunkel

Die Seite folgt der Geräteeinstellung. Über ☀️/🌙 im Header kann umgeschaltet werden, die Wahl wird im Browser gespeichert.

## Einmalige Einstellungen (nur über GitHub/Google möglich)

1. **HTTPS erzwingen:** Repository → Settings → Pages → Haken bei „Enforce HTTPS“.
2. **Schreibrechte für die Action:** Settings → Actions → General → Workflow permissions → „Read and write permissions“.
3. **Google Search Console:** https://search.google.com/search-console → „Domain“ `berben-engineering.de` hinzufügen →
   den angezeigten TXT-Eintrag beim Domain-Anbieter (DNS) eintragen → bestätigen → unter „Sitemaps“ `sitemap.xml` einreichen.
4. **Besucherstatistik (optional, ohne Cookies):** z. B. ein kostenloses Konto bei [GoatCounter](https://www.goatcounter.com) anlegen.
   Danach muss ein kleines Skript eingebunden und die Datenschutzerklärung ergänzt werden.

## Noch zu erledigen, falls die Firma real wird

- Impressum vervollständigen (gelb markiert), Adresse und Telefonnummer ersetzen
- Demo-Hinweis oben auf jeder Seite entfernen
- Beispielinhalte (Maschinen, Kennzahlen, Referenzen, Stellen) an die Realität anpassen
