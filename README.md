# OOTO AI Thing

A tiny static campaign site for the Investec “Out of the Ordinary” AI experience.
This repo is basically a landing page, a public creative brief, and the assets needed to make the experience feel polished.

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
├── CHANGELOG.md           # notable project changes
├── index.html              # landing page
├── creative-brief.html     # public version of the brief
├── creative-brief.md       # Markdown version for AI and text clients
├── llms.txt                # AI-friendly site index
├── 404.html                # custom GitHub Pages not-found page
├── favicon.svg
├── investec-logo.svg
├── investec-card.png        # alternate card artwork
├── x_investec-card.png      # card artwork used by the landing page and downloads
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
- https://investec-developer-community.github.io/ai-ooto/index.md
- https://investec-developer-community.github.io/ai-ooto/creative-brief.html
- https://investec-developer-community.github.io/ai-ooto/creative-brief.md
- https://investec-developer-community.github.io/ai-ooto/llms.txt

## Why it’s built this way

This is a simple, reliable way to ship a campaign experience without dragging in a full app stack. The tradeoff is intentional: the repository is easy to understand, quick to deploy, and easy to maintain.

That makes it a good fit for a short-lived branded prompt experiment where the important thing is the content and the presentation—not the complexity behind it.

## Notes

- The content is static and content-first.
- The homepage and creative brief are available as Markdown files as well as HTML. GitHub Pages serves static files by URL and does not negotiate a Markdown response based on the `Accept` request header.
- The experience is meant to be triggered by a user request, not opened passively.
- The repo is best treated like a lightweight marketing / proof-of-concept asset, not a full product app.
- The primary action copies the prompt and a link to the public creative brief. Paste it into the AI conversation already open and send it when ready. The page does not access or send chat content.
- The card remains available as artwork and can be downloaded separately; it is not attached to the copied prompt.

If you want, this README can also be tightened further for a more “launch-ready” GitHub landing page feel, but this version keeps it accurate, usable, and easy to scan.
