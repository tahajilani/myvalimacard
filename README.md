# Taha & Noor — Walima Invitation

A single-page, static Walima invitation site for Syed Muhammad Taha Jilani & Syeda Noor Fatima Gilani — Sunday, 29th November 2026, Shershah Palace, Lahore.

No build step required — plain HTML/CSS/JS.

## Structure

- `index.html` — the site (Home / Details / Venue sections)
- `assets/css/style.css` — styles (emerald & gold theme, animations)
- `assets/js/main.js` — countdown timer, scroll-reveal, active nav highlighting
- `assets/img/og-image.png` — social share thumbnail (1200×630)
- `assets/img/favicon.png`, `favicon.ico` — site icon
- `scripts/generate_og_image.py` — regenerates the thumbnail/favicon if details change (`python scripts/generate_og_image.py`)

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, pick the branch (e.g. `main`) and folder `/ (root)`.
4. Save — the site will be live at `https://<username>.github.io/<repo-name>/`.
5. Update the `og:url` meta tag in `index.html` to match the final URL for accurate link previews.
