(() => {
  const isTouchDevice =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;

  if (!isTouchDevice) return;

  let copying = false;

  function announce(message) {
    const status = document.querySelector(".ref-feedback");
    if (status) status.textContent = message;
  }

  function findCardCopyButton(target) {
    const button = target instanceof Element ? target.closest("button") : null;
    return button?.textContent?.trim().startsWith("Copy card +") ? button : null;
  }

  function getPrompt() {
    const prompt = document.querySelector(".prompt-pre")?.textContent?.trim();
    if (!prompt) throw new Error("The copy instructions are unavailable.");
    return prompt;
  }

  function hasRichClipboardSupport() {
    return (
      Boolean(window.isSecureContext) &&
      typeof navigator.clipboard?.write === "function" &&
      typeof window.ClipboardItem === "function"
    );
  }

  async function copyText(text) {
    if (typeof navigator.clipboard?.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Try the manual-compatible browser copy path below.
      }
    }

    const previousFocus = document.activeElement;
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    Object.assign(textarea.style, {
      position: "fixed",
      left: "-9999px",
      opacity: "0",
    });

    try {
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      if (!document.execCommand("copy")) {
        throw new Error("The browser did not allow text to be copied.");
      }
    } finally {
      textarea.remove();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    }
  }

  async function copyCardAndPrompt(text) {
    const clipboard = navigator.clipboard;
    const ClipboardItemConstructor = window.ClipboardItem;
    if (
      !window.isSecureContext ||
      typeof clipboard?.write !== "function" ||
      typeof ClipboardItemConstructor !== "function"
    ) {
      throw new Error("Combined image and text copying is not supported.");
    }

    if (
      typeof ClipboardItemConstructor.supports === "function" &&
      (!ClipboardItemConstructor.supports("image/png") ||
        !ClipboardItemConstructor.supports("text/html"))
    ) {
      throw new Error("Combined image and text copying is not supported.");
    }

    const imageUrl = new URL("./investec-card.png", window.location.href);
    const image = fetch(imageUrl, { credentials: "same-origin" }).then(
      async (response) => {
        if (!response.ok) throw new Error("The campaign card could not be loaded.");
        const blob = await response.blob();
        return blob.type === "image/png"
          ? blob
          : new Blob([blob], { type: "image/png" });
      },
    );
    image.catch(() => {});
    const escapedUrl = imageUrl.href.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
    const escapedPrompt = text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
    const html = [
      "<div>",
      `<p><img src="${escapedUrl}" alt="Investec Out of the Ordinary campaign card" width="240"></p>`,
      `<p><strong>Investec — Out of the Ordinary AI perspective.</strong> ${escapedPrompt}</p>`,
      `<pre style="white-space:pre-wrap">${escapedPrompt}</pre>`,
      "</div>",
    ].join("");

    await clipboard.write([
      new ClipboardItemConstructor({
        "text/plain": new Blob([text], { type: "text/plain" }),
        "text/html": new Blob([html], { type: "text/html" }),
        "image/png": image,
      }),
    ]);
  }

  document.addEventListener(
    "click",
    (event) => {
      const button = findCardCopyButton(event.target);
      if (!button || button.disabled || copying) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      copying = true;
      button.disabled = true;
      button.setAttribute("aria-busy", "true");

      void (async () => {
        let prompt;
        try {
          prompt = getPrompt();
          await copyCardAndPrompt(prompt);
          announce(
            "The card and request were copied. Some apps paste only one format; if needed, use Copy the perspective for text and attach the downloaded card separately.",
          );
        } catch {
          if (!prompt) {
            announce("The request text is unavailable. Use the main copy option or read the instructions manually.");
          } else {
            try {
              await copyText(prompt);
              announce(
                "The combined copy was unavailable, so the request text was copied instead. Download the card image and attach it separately.",
              );
            } catch {
              announce(
                "The combined copy and automatic text copy both failed. Use Copy the perspective or select the instructions manually; download the card separately.",
              );
            }
          }
        } finally {
          copying = false;
          button.disabled = false;
          button.removeAttribute("aria-busy");
        }
      })();
    },
    true,
  );

  const enableTextFallback = () => {
    if (hasRichClipboardSupport()) return;

    document.querySelectorAll("button").forEach((button) => {
      if (
        button.textContent?.trim().startsWith("Copy card +") &&
        !button.hasAttribute("aria-busy")
      ) {
        button.disabled = false;
      }
    });
  };

  enableTextFallback();
  new MutationObserver(enableTextFallback).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
