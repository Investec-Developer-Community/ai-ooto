(() => {
  const isTouchDevice =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;

  if (!isTouchDevice) return;

  const SHORT_REQUEST =
    "Visit https://investec-developer-community.github.io/ai-ooto/creative-brief.html and tap out of the ordinary.";
  const cardFilePromise = fetch(new URL("./investec-card.png", window.location.href), {
    credentials: "same-origin",
  }).then(async (response) => {
    if (!response.ok) throw new Error("The campaign card could not be loaded.");
    return new File(
      [await response.blob()],
      "investec-out-of-the-ordinary-card.png",
      { type: "image/png" },
    );
  });
  cardFilePromise.catch(() => {});
  let copying = false;

  function announce(message) {
    const status = document.querySelector(".ref-feedback");
    if (status) status.textContent = message;
  }

  function findCardCopyButton(target) {
    const button = target instanceof Element ? target.closest("button") : null;
    return button &&
      (button.getAttribute("aria-label") === "Share card and request" ||
        button.textContent?.trim().startsWith("Copy card +"))
      ? button
      : null;
  }

  function hasRichClipboardSupport() {
    return (
      Boolean(window.isSecureContext) &&
      typeof navigator.clipboard?.write === "function" &&
      typeof window.ClipboardItem === "function"
    );
  }

  async function shareCardAndRequest() {
    if (typeof navigator.share !== "function") {
      throw new Error("Sharing is not supported in this browser.");
    }

    const image = await cardFilePromise;
    const shareData = {
      title: "Investec — Out of the Ordinary",
      text: SHORT_REQUEST,
      files: [image],
    };

    if (
      typeof navigator.canShare === "function" &&
      !navigator.canShare({ files: shareData.files })
    ) {
      throw new Error("Sharing images is not supported in this browser.");
    }

    await navigator.share(shareData);
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
        try {
          await shareCardAndRequest();
          announce(
            "Shared with your selected app. Check whether it received both the card and request; ChatGPT may open a new chat instead of your current conversation.",
          );
        } catch (error) {
          if (error?.name === "AbortError") {
            announce("Sharing was cancelled. Nothing was copied or sent.");
            return;
          }

          try {
            await copyText(SHORT_REQUEST);
            announce(
              "Sharing the card and request was unavailable, so only the request text was copied. Download the card and attach it separately.",
            );
          } catch {
            announce(
              "Sharing and copying the request failed. Use Copy the perspective and attach the downloaded card separately.",
            );
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
    document.querySelectorAll("button").forEach((button) => {
      if (
        button.textContent?.trim().startsWith("Copy card +") &&
        !button.hasAttribute("aria-busy")
      ) {
        const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
        let textNode;
        while ((textNode = walker.nextNode())) {
          if (textNode.textContent?.trim().startsWith("Copy card +")) {
            textNode.textContent = "Share card + request";
          }
        }
        button.setAttribute("aria-label", "Share card and request");
        if (!hasRichClipboardSupport()) button.disabled = false;
      }
    });
  };

  enableTextFallback();
  new MutationObserver(enableTextFallback).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
