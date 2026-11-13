# GitHub Pages tracer — static campaign

## Generate and copy

In the original workspace, with its existing dependencies installed and Node 22.6+:

```sh
pnpm export:github-pages
```

This rebuilds only the campaign and replaces **generated-artifacts/github-pages-tracer/**.
Copy **that folder's contents**, including the hidden `.nojekyll`, to a public
repository's root. Do not copy the containing folder, workspace, package files,
private IDS archives, attachments, environment files, agent memory or Git history.
The output includes `index.html`, `creative-brief.html`, assets, `.nojekyll` and this README.
It has no install/build step, secrets, API server or Replit runtime requirement.
Regenerate and replace the copied site after campaign edits; do not edit the built files.
The normal Replit development and build commands remain separate.

## Owner-operated publishing

Nothing has been uploaded or published by this export. Before making the repository
public, confirm approval to expose the campaign content, artwork, logo, fonts and
bundled IDS runtime/assets. Private source archives are excluded. The inspected IDS
package manifests declare MIT, but this is **not redistribution or brand-rights
clearance**. Confirm applicable notices and permissions with the owner; no additional
redistribution restrictions have been established by this technical check.

In GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
branch**, choose your branch (for example `main`) and **/(root)**, then Save.
No custom GitHub Actions source-build pipeline is needed.

For a project repository called `campaign-tracer`, the expected URLs are:

- Landing: `https://OWNER.github.io/campaign-tracer/`
- Brief: `https://OWNER.github.io/campaign-tracer/creative-brief.html`

For an account site repository named `OWNER.github.io` (or a domain-root site):

- Landing: `https://OWNER.github.io/`
- Brief: `https://OWNER.github.io/creative-brief.html`

Use the actual URL shown by Pages, not these placeholders. Keep the trailing slash
on the landing directory URL. Relative paths also work with other repository names.
Use HTTPS for clipboard support (localhost is allowed for local checks).

## Manual tracer experiment

1. Visit the landing and brief in a signed-out/private window. Check artwork, logo,
   favicon, typography, the “Read the full creative brief” link inside the copy
   disclosure, and the brief's “Return to the campaign page” link.
2. Check the public brief without authentication:

   ```sh
   curl --fail --silent --show-error --dump-header brief-headers.txt \
     'https://OWNER.github.io/campaign-tracer/creative-brief.html' -o brief.html
   ```

   Require direct HTTP 200, HTML content type, no login/redirect, and the complete
   unchanged prompt inside `pre#campaign-instructions` in the saved **raw HTML**.
   A 200 response containing a login or generic landing page is not enough.
   Compare that element's decoded text with the exported brief; JavaScript must
   not be needed to obtain any part of the prompt.
3. Start or return to an **existing AI conversation** with a topic/answer to revisit.
   Manually paste and send this request, replacing the URL with the full published
   brief URL (do not shorten it):

   > Give your previous answer an Investec ‘Out of the Ordinary’ perspective.
   > Read the creative brief at https://OWNER.github.io/campaign-tracer/creative-brief.html
   > and apply it once, where compatible with your rules. If you cannot access it, tell me.

4. Record the date, AI tool/model, browsing setting, exact URL, whether retrieval
   succeeded, and whether the response followed the framework. Do not record
   confidential chat content. A plausible response alone is not proof of retrieval.
5. If the AI cannot browse or declines the link, use **Copy the perspective** on the
   landing page and paste the full prompt into that same conversation. If automatic
   copying fails, use “View or manually copy the full instructions”.

The landing page continues to copy the **full canonical prompt**, unchanged. This
export does not activate short-link mode or create a verification receipt.
Merely opening a link does not activate the experience. Public hosting does not
guarantee that any AI can retrieve a link, use its instructions, or follow them.

## Local verification versus live results

From the original workspace:

```sh
pnpm --filter @workspace/ai-perspective test
pnpm --filter @workspace/ai-perspective typecheck
pnpm export:github-pages
pnpm --filter @workspace/ai-perspective check:github-pages
```

The last command serves the actual export using a plain static server at root and
`/example-repository/`, with no SPA fallback. It checks both HTML pages, exact raw
prompt, navigation, bundled assets/fonts, and Chromium rendering. Existing real
artwork and simulated clipboard-recovery checks run against both locations.
Requires Chromium (`CHROMIUM_BIN` may select the executable).

Local checks are not a live GitHub Pages or AI test. Native clipboard behavior,
other browsers/devices, real AI retrieval and public-host permissions remain
unverified until separately tested. See the original workspace's
`artifacts/ai-perspective/GITHUB-PAGES-VALIDATION.md` for the recorded preparation results.
