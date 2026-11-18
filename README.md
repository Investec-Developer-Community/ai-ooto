# OOTO AI Thing

A tiny static campaign site for the Investec “Out of the Ordinary” AI experience.
This repo is basically a landing page, a public creative brief, and the assets needed to make the experience feel polished and shareable.

It’s intentionally lightweight: no backend, no framework, no build pipeline. Just static HTML, CSS, and a few bundled image assets for GitHub Pages.

## What this repo does

This project exists to support a branded AI prompt flow:

- a campaign landing page
- a public creative brief that explains the required perspective
- a clean static export that can be hosted on GitHub Pages
- a simple, browser-friendly way to copy and reuse the experience

The site is designed to be easy to inspect, easy to host, and easy to reuse without extra infrastructure.

## Project structure

```text
.
├── README.md
├── index.html              # landing page
├── creative-brief.html     # public version of the brief
├── favicon.svg
├── investec-logo.svg
├── investec-card.png
├── .nojekyll               # keeps GitHub Pages static hosting clean
├── assets/                 # bundled CSS/JS assets
└── ...
```

## Run it locally

Because this is a static site, local preview is straightforward:

```bash
cd /workspaces/ai-ooto
python3 -m http.server 8000
```

Then open:

- http://localhost:8000/
- http://localhost:8000/creative-brief.html

If you prefer a simpler one-liner, a local static server like `npx serve .` also works.

## Deploy to GitHub Pages

This repo is set up for GitHub Pages with a static root deployment.

In GitHub:

1. Go to Settings → Pages
2. Set Source to Deploy from a branch
3. Choose your branch, usually `main`
4. Set folder to `/ (root)`
5. Save

The public pages are available at:

- https://investec-developer-community.github.io/ai-ooto/
- https://investec-developer-community.github.io/ai-ooto/creative-brief.html

## Why it’s built this way

This is a simple, reliable way to ship a campaign experience without dragging in a full app stack. The tradeoff is intentional: the repository is easy to understand, quick to deploy, and easy to maintain.

That makes it a good fit for a short-lived branded prompt experiment where the important thing is the content and the presentation—not the complexity behind it.

## Notes

- The content is static and content-first.
- The experience is meant to be triggered by a user request, not opened passively.
- The repo is best treated like a lightweight marketing / proof-of-concept asset, not a full product app.
- On touch devices, the experimental card action uses the browser share sheet to send the card image and the same short request together. Receiving apps choose how to handle shared content and may open a new chat or omit one part; this cannot target an existing conversation. If sharing is unavailable, the page copies the request and asks the user to attach the downloaded card separately.

If you want, this README can also be tightened further for a more “launch-ready” GitHub landing page feel, but this version keeps it accurate, usable, and easy to scan.
