(() => {
  const isTouchDevice =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;

  if (!isTouchDevice) return;

  const SHORT_REQUEST =
    "Visit https://investec-developer-community.github.io/ai-ooto/creative-brief.html and tap out of the ordinary.";
  let copying = false;

  function announce(message) {
    const status = document.querySelector(".ref-feedback");
    if (status) status.textContent = message;
  }

  function findCardCopyButton(target) {
    const button = target instanceof Element ? target.closest("button") : null;
    return button?.textContent?.trim().startsWith("Copy card +") ? button : null;
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
          await copyText(SHORT_REQUEST);
          announce(
            "The short request was copied. Download the card image and attach it separately in your AI chat.",
          );
        } catch {
          announce(
            "The request could not be copied. Use Copy the perspective, or open the instructions to copy it manually; attach the downloaded card separately.",
          );
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
