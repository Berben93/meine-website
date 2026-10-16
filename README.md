# Website Berben Engineering GmbH

Statische Website, veröffentlicht über **GitHub Pages** unter www.berben-engineering.de.

## Aufbau

| Datei / Ordner | Inhalt |
| --- | --- |
| `*.html` | Die einzelnen Seiten (Start, Leistungen, Technologien, Referenzen, Unternehmen, Kontakt, Impressum, Datenschutz, 404) |
| `assets/css/styles.css` | Fertiges Stylesheet – **nicht von Hand bearbeiten**, wird automatisch erzeugt |
| `assets/js/main.js` | Hell/Dunkel-Umschalter, Handy-Menü, Einblend-Animationen, Referenzen-Filter, Kontaktformular |
| `assets/img/` | Logo-Varianten, Illustrationen (SVG) und Vorschaubild für geteilte Links |
| `assets/fonts/` | Schrift „Inter“ (lokal eingebunden, keine Verbindung zu Google) |
| `src/styles.css`, `tailwind.config.js` | Quelle des Designs (Farben, Buttons, Karten …) |

## Hell / Dunkel

Die Seite folgt automatisch der Einstellung des Geräts (helles oder dunkles Design). Über den Knopf ☀️/🌙 im Header
können Besucher umschalten – die Wahl wird im Browser gespeichert. Dunkle Farben stehen in `tailwind.config.js` unter `ink`.

## Texte ändern

Einfach die passende `.html`-Datei auf GitHub öffnen, auf den Stift ✏️ klicken, Text ändern und „Commit changes“ drücken.
Nach 1–2 Minuten ist die Änderung online.

## Design ändern

Das Design nutzt [Tailwind CSS](https://tailwindcss.com). Werden in einer HTML-Datei neue CSS-Klassen verwendet,
erzeugt die GitHub Action **„CSS bauen“** das Stylesheet automatisch neu.

Lokal geht das mit [Node.js](https://nodejs.org):

```bash
npm install
npm run build   # einmalig bauen
npm run watch   # bei jeder Änderung automatisch neu bauen
```

## Noch zu erledigen

- Impressum: Geschäftsführer, Registergericht, HRB-Nummer und USt-IdNr. ergänzen (gelb markiert)
- Adresse und Telefonnummer sind Platzhalter
