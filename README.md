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
| `unternehmen.html` | `company.html` | Über uns, Werte |
| `karriere.html` | `careers.html` | Stellenangebote |
| `kontakt.html` | `contact.html` | Kontaktformular, FAQ |
| `anfrage.html` | `request.html` | Anfrage-Assistent (3 Schritte) |
| `passungsrechner.html` | `fit-calculator.html` | ISO-286-Passungsrechner |
| `wissen.html` + `wissen-*.html` | – | Fachartikel |
| `impressum.html`, `datenschutz.html`, `404.html` | – | Rechtliches, Fehlerseite |

## Ordner

| Ordner / Datei | Inhalt |
| --- | --- |
| `assets/css/styles.css` | Fertiges Stylesheet – **nicht von Hand bearbeiten**, wird automatisch erzeugt |
| `assets/js/main.js` | Hell/Dunkel, Handy-Menü, Animationen, Filter, Formulare, Anfrage-Assistent |
| `assets/js/fit-calculator.js` | Rechenlogik des Passungsrechners (Tabellen nach ISO 286) |
| `assets/img/` | Logo-Varianten, Illustrationen, Vorschaubild |
| `assets/downloads/` | Firmenprofil als PDF |
| `assets/fonts/` | Schrift „Inter“ (lokal, keine Verbindung zu Google) |
| `src/styles.css`, `tailwind.config.js` | Quelle des Designs (Farben, Buttons, Karten …) |

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
