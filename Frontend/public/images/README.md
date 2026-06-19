# Bilder / Images

Diese Dateien hier ablegen — sie werden automatisch im Design verwendet. Solange eine
Datei fehlt, zeigt das Design einen warmen Verlauf als Platzhalter (kein kaputtes Bild).

Drop the real photos here; until a file exists, the layout falls back to a warm gradient
(no broken-image icon).

## Benötigte Bilder

| Dateiname | Verwendung | Empfohlene Größe | Hinweis |
|-----------|-----------|------------------|---------|
| `hero-tutoring.jpg` | Startseite, großes Hero-Bild rechts | ~1000 × 1250 px (Hochformat 4:5) | Echtes, warmes Foto: Schüler:in mit Lehrkraft, freundlich, hell. |

## Tipps

- Format: `.jpg` (Fotos) oder `.webp` (kleiner) — bei `.webp` den Pfad in
  `home.component.scss` (`.hero__photo`) anpassen.
- Querformat-Bilder wirken im Hochformat-Rahmen abgeschnitten; bevorzugt Hochformat.
- Für beste Performance vor dem Upload komprimieren (z. B. squoosh.app), Ziel < 250 KB.
- Echte Fotos des Zentrums schlagen Stockfotos — sobald vorhanden, einfach Datei ersetzen.
