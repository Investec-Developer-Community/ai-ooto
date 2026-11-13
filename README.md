# OOTO AI Thing — static campaign

## Current link-first campaign

The owner-published brief at
https://investec-developer-community.github.io/ai-ooto/creative-brief.html
returned direct HTTP 200 HTML with the exact canonical prompt on 13 November 2026.
The main action now copies:

> Give your previous answer an Investec ‘Out of the Ordinary’ perspective. Read https://investec-developer-community.github.io/ai-ooto/creative-brief.html and apply the brief once. If you cannot access it, tell me.

Replace the existing repository contents with this regenerated export (including
`.nojekyll` and the new assets), then let GitHub Pages redeploy. Local regeneration
does not update the public site. The verified URL is deliberate: hosting a copy
elsewhere does not automatically change the URL in copied requests.

The new brief is image-led with a closed **Read the AI brief** disclosure.
Its complete instructions remain in the raw HTML without JavaScript. Some AI
extractors omit collapsed content; HTTP accessibility is not proof that an AI
can retrieve or apply it. Recheck the public brief after uploading.
Card copying is optional and browser-dependent. The image alone has no brief URL;
if only the image pastes, also use the main text-copy action.

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
   Use **Copy the perspective**, then paste and send this request:

   > Give your previous answer an Investec ‘Out of the Ordinary’ perspective.
   > Read https://investec-developer-community.github.io/ai-ooto/creative-brief.html
   > and apply the brief once. If you cannot access it, tell me.

4. Record the date, AI tool/model, browsing setting, exact URL, whether retrieval
   succeeded, and whether the response followed the framework. Do not record
   confidential chat content. A plausible response alone is not proof of retrieval.
5. If the AI cannot browse or declines the link, expand **Read the instructions & other ways to copy**
   and select **AI can’t open the link? Copy the full instructions.**
   Copy the full prompt into that same conversation; manual selection remains available.

The landing page defaults to the **short request** using the verified public URL.
The unchanged full canonical prompt remains available as a secondary fallback.
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
`/ai-ooto/`, with no SPA fallback. It checks both HTML pages, exact raw
prompt, navigation, bundled assets/fonts, and Chromium rendering. Existing real
artwork and simulated clipboard-recovery checks run against both locations.
Requires Chromium (`CHROMIUM_BIN` may select the executable).

Local checks are not a live GitHub Pages or AI test. Native clipboard behavior,
other browsers/devices, real AI retrieval and public-host permissions remain
unverified until separately tested. See the original workspace's
`artifacts/ai-perspective/GITHUB-PAGES-VALIDATION.md` for the recorded preparation results.
