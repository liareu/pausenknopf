# Pausenknopf

**Für Momente, die gerade viel sind.**

Eine Progressive Web App (PWA), die in herausfordernden Momenten Unterstützung bietet durch Atemübungen, Regulierungstechniken und Selbstfürsorge-Karten.

🌐 **Live Demo:** [https://liareu.github.io/pausenknopf/](https://liareu.github.io/pausenknopf/)

![Pausenknopf Screenshot](https://liareu.github.io/pausenknopf/icon-512.png)

## 📱 Features

- **🎯 Kategoriebasierte Navigation**: Sechs verschiedene Kategorien für unterschiedliche emotionale Zustände
- **🎲 Zufallsfunktion**: Lasse dir eine zufällige Karte zeigen
- **💪 Offline-Funktionalität**: Funktioniert vollständig offline als PWA
- **📱 Installierbar**: Kann als App auf dem Smartphone installiert werden
- **♿ Barrierefrei**: WCAG-konforme Farbkontraste, ARIA-Labels, Keyboard-Navigation
- **🎨 Animationen**: Sanfte Animationen mit Reduced-Motion-Support
- **⚡ Performance-optimiert**: Schnelle Ladezeiten durch optimierte Assets

## 🎨 Kategorien

1. **Runterfahren** (Blau) - Wenn das Herz rast
2. **Regulieren** (Orange) - Wenn du sehr unruhig bist
3. **Aktivieren** (Koralle) - Wenn du Bewegung brauchst
4. **Erdung** (Grün) - Wenn du dich nicht ganz da fühlst
5. **Sicherheit** (Rosa) - Wenn du Ruhe brauchst
6. **Halten** (Beige) - Wenn du zweifelst oder erschöpft bist

## 🚀 Installation & Entwicklung

### Voraussetzungen

- Node.js (v18 oder höher)
- npm oder pnpm

### Setup

```bash
# Repository klonen
git clone https://github.com/liareu/pausenknopf.git
cd pausenknopf

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App ist dann unter `http://localhost:5174/pausenknopf/` erreichbar.

### Build für Produktion

```bash
# Production Build erstellen
npm run build

# Build-Ergebnis liegt in /dist
```

## 📦 Technologie-Stack

- **Framework**: React 18 mit TypeScript
- **Styling**: Tailwind CSS 4
- **Animationen**: Motion (Framer Motion)
- **Build Tool**: Vite 6
- **PWA**: Custom Service Worker
- **Fonts**: Google Fonts (Rufina, Mulish)
- **Deployment**: GitHub Pages

## 🎯 Performance-Optimierungen

- ✅ Background-Image: 721KB → 45KB (94% Reduktion)
- ✅ CSS Bundle: 94KB → 23KB (75% Reduktion)
- ✅ Entfernung von 49 ungenutzten UI-Komponenten
- ✅ Optimierte Font-Loading-Strategie
- ✅ Service Worker mit vollständigem Asset-Caching
- ✅ Lazy Loading für bessere Initial Load Time

**Gesamt-Einsparung**: ~750KB | **Ladezeit-Verbesserung**: 60-70% auf mobilen Geräten

## ♿ Accessibility

- **ARIA-Labels** für Screen Reader
- **WCAG 2.1 Level AA** konforme Farbkontraste
- **Keyboard-Navigation** mit sichtbaren Focus-Styles
- **Prefers-Reduced-Motion** Support
- **Semantisches HTML** (h1-h4 Hierarchie)
- **Error Boundaries** für robuste Fehlerbehandlung

## 📱 PWA-Features

- **Installierbar** auf iOS, Android und Desktop
- **Offline-fähig** durch Service Worker
- **App Shortcuts** für schnellen Zugriff
- **Responsive** auf allen Bildschirmgrößen
- **Stand-alone Display** ohne Browser-UI

### Als App installieren

**Android (Chrome/Edge):**
1. Öffne die URL im Browser
2. Tippe auf "App installieren" oder Menü → "Zum Startbildschirm hinzufügen"

**iOS (Safari):**
1. Öffne die URL in Safari
2. Tippe auf das Teilen-Symbol
3. Wähle "Zum Home-Bildschirm"

**Desktop (Chrome/Edge):**
1. Öffne die URL
2. Klicke auf das Install-Symbol in der Adressleiste
3. Oder: Menü → "Pausenknopf installieren"

## 🔒 Datenschutz

Die App erfasst und speichert **keine personenbezogenen Daten**. Alle Inhalte werden lokal ausgeführt. Es werden keine Daten an externe Server übermittelt.

## 📄 Lizenz & Credits

**Design & Konzept**: Julia Reuter
**Website**: [juliareuter-design.com](https://juliareuter-design.com)

Original Figma Design: [pausenknopf auf Figma](https://www.figma.com/design/oMBb2d6LtGjQhfg2rTgPTG/pausenknopf)

## 🤝 Mitwirken

Dieses Projekt wurde als persönliches Tool entwickelt. Bei Fragen oder Anregungen kannst du gerne ein Issue erstellen.

## 🐛 Bekannte Einschränkungen

- Die App ist derzeit nur auf Deutsch verfügbar
- Einige Browser unterstützen möglicherweise nicht alle PWA-Features
- Service Worker benötigt HTTPS (funktioniert aber auf localhost)

## 📞 Support

Bei technischen Fragen oder Problemen erstelle bitte ein [GitHub Issue](https://github.com/liareu/pausenknopf/issues).

---

**Wichtiger Hinweis**: Diese App ersetzt keine professionelle therapeutische oder medizinische Beratung. Bei anhaltenden Beschwerden wende dich bitte an eine Fachperson.

---

Erstellt mit ❤️ von Julia Reuter
