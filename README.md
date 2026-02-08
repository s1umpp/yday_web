# yday Web

The official website for yday - discover, collect, and build community around vinyl records.

🌐 **Live Site**: [www.yday.ai](https://www.yday.ai)

## Features

- **Home Page**: Landing page with app features and download links
- **Scan Records**: Bulk upload vinyl record photos for AI identification
- **Changelog**: Track all updates to the yday app and website

## Tech Stack

- React 18
- Tailwind CSS
- GitHub Pages hosting

## Development

```bash
cd web
npm install
npm start
```

## Deployment

The site is deployed to GitHub Pages automatically. To deploy manually:

```bash
cd web
npm run deploy
```

## Connecting Custom Domain (yday.ai)

1. In your domain registrar (where you bought yday.ai), add these DNS records:
   - Type: `A`, Name: `@`, Value: `185.199.108.153`
   - Type: `A`, Name: `@`, Value: `185.199.109.153`
   - Type: `A`, Name: `@`, Value: `185.199.110.153`
   - Type: `A`, Name: `@`, Value: `185.199.111.153`
   - Type: `CNAME`, Name: `www`, Value: `s1umpp.github.io`

2. In the GitHub repo settings → Pages → Custom domain, enter: `www.yday.ai`

3. Enable "Enforce HTTPS"

## API Integration

The website calls the yday backend API for record scanning:
- Production: `https://yday-ios-backend-cee9m.ondigitalocean.app`

Make sure CORS is configured to allow `https://www.yday.ai` on the backend.

## Color Palette (from logo)

```css
--yday-dark: #0a0f1a;    /* Deep dark blue-black */
--yday-navy: #141e30;    /* Dark navy */
--yday-blue: #1a3a5c;    /* Muted blue */
--yday-purple: #2d2545;  /* Deep purple */
--yday-accent: #4a6fa5;  /* Muted accent blue */
--yday-text: #8b9dc3;    /* Muted text */
--yday-light: #c5d0e6;   /* Light text */
```

## License

MIT
