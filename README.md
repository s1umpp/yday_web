# yday Web

The official website for yday - discover, collect, and build community around vinyl records.

🌐 **Live Site**: [www.yday.ai](https://www.yday.ai)

## Quick Start

```bash
cd web
npm install
npm start  # Development
npm run deploy  # Deploy to GitHub Pages
```

## Deployment & Domain Setup

### 1. Make Repository Public
- Go to: Settings → Danger Zone → Change visibility → Make public

### 2. Deploy to GitHub Pages
```bash
cd web
npm run deploy
```

### 3. Configure GitHub Pages
- Go to: Settings → Pages
- Source: `gh-pages` branch / `(root)`
- Custom domain: `www.yday.ai`
- Enable "Enforce HTTPS"

### 4. Update DNS (GoDaddy)
- Edit existing `www` CNAME: Value = `your-username.github.io`
- Add 4 A records for root domain (if needed):
  - `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

### 5. Wait & Verify
- DNS propagation: 5-60 minutes
- Check: https://dnschecker.org/#CNAME/www.yday.ai
- Visit: https://www.yday.ai

## Tech Stack

- React 18
- Tailwind CSS
- GitHub Pages hosting

## Color Palette

```css
--yday-dark: #0a0f1a;
--yday-navy: #141e30;
--yday-blue: #1a3a5c;
--yday-purple: #2d2545;
--yday-accent: #4a6fa5;
--yday-text: #8b9dc3;
--yday-light: #c5d0e6;
```

## License

MIT
