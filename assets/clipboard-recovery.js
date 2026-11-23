(() => {
  const CARD_URL = new URL("./x_investec-card.png", window.location.href).href;
  const BRIEF_URL =
    "https://investec-developer-community.github.io/ai-ooto/creative-brief.html";
  const INSTRUCTION =
    `Revisit your previous answer from an Out of the Ordinary perspective. ` +
    `Read and follow the brief at ${BRIEF_URL}`;
  let promptCopied = false;
  let copyingPrompt = false;

  function announce(message) {
    const status = document.querySelector(".ref-feedback");
    if (status) status.textContent = message;
  }

  function setButtonLabel(button, label) {
    const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
    let node;
    let lastTextNode;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim()) lastTextNode = node;
    }
    if (lastTextNode && lastTextNode.textContent !== label) {
      lastTextNode.textContent = label;
    }
    if (button.getAttribute("aria-label") !== label) {
      button.setAttribute("aria-label", label);
    }
  }

  function setTextContent(element, text) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    let lastTextNode;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim()) lastTextNode = node;
    }
    if (lastTextNode) {
      if (lastTextNode.textContent !== text) lastTextNode.textContent = text;
    } else {
      element.append(document.createTextNode(text));
    }
  }

  function updateInterface() {
    const status = document.querySelector(".ref-feedback");
    if (status) {
      if (status.id !== "ref-feedback") status.id = "ref-feedback";
      if (status.getAttribute("role") !== "status") {
        status.setAttribute("role", "status");
      }
      if (status.getAttribute("aria-live") !== "polite") {
        status.setAttribute("aria-live", "polite");
      }
    }

    const button = document.querySelector(".cta");
    if (button) {
      const label = copyingPrompt
        ? "Copying prompt…"
        : promptCopied
          ? "Prompt copied"
          : "Copy prompt";
      setButtonLabel(button, label);
      button.disabled = copyingPrompt;
      if (copyingPrompt) {
        if (button.getAttribute("aria-busy") !== "true") {
          button.setAttribute("aria-busy", "true");
        }
      } else {
        button.removeAttribute("aria-busy");
      }
      if (button.getAttribute("aria-describedby") !== "ref-consent ref-feedback") {
        button.setAttribute("aria-describedby", "ref-consent ref-feedback");
      }
    }

    const consent = document.querySelector("#ref-consent");
    if (consent) {
      const description =
        "Copy the prompt, then paste it into your current AI chat and send it " +
        "when ready. This page does not access or send your chat.";
      if (consent.textContent !== description) consent.textContent = description;
    }

    const originalCardCopy = [...document.querySelectorAll(".secondary__row button")]
      .find((item) => item.textContent.trim().startsWith("Copy card +"));
    originalCardCopy?.remove();

    const cardNote = document.querySelector(".secondary > .fine");
    if (cardNote) {
      const note =
        "The main button copies the prompt for your current AI chat. Download " +
        "the card separately if you want to use the artwork.";
      if (cardNote.textContent !== note) cardNote.textContent = note;
    }

    const options = document.querySelector(".ref-options");
    const summary = options?.querySelector("summary");
    if (summary) setTextContent(summary, "More options");

    const image = document.querySelector(".ref-artwork");
    if (image) {
      const imageAlt =
        "Investec Out of the Ordinary card artwork: a matte-black bank card shown as a cut-out.";
      if (image.alt !== imageAlt) image.alt = imageAlt;
      if (!image.draggable) image.draggable = true;
      if (image.tabIndex !== 0) image.tabIndex = 0;
      if (image.getAttribute("role") !== "button") {
        image.setAttribute("role", "button");
      }
      const imageLabel = "Download the Out of the Ordinary card as a PNG";
      if (image.getAttribute("aria-label") !== imageLabel) {
        image.setAttribute("aria-label", imageLabel);
      }
    }

    if (!document.querySelector(".ooto-drag-hint")) {
      const primary = document.querySelector(".primary-action");
      if (primary) {
        const hint = document.createElement("p");
        hint.className = "ooto-drag-hint";
        hint.textContent = "Or drag the card into your open AI chat.";
        primary.after(hint);
      }
    }
  }

  async function copyInstruction(button) {
    if (copyingPrompt) return;
    copyingPrompt = true;
    promptCopied = false;
    updateInterface();
    announce("");
    try {
      if (
        !window.isSecureContext ||
        typeof navigator.clipboard?.writeText !== "function"
      ) {
        throw new Error("Text clipboard access is unavailable.");
      }
      await navigator.clipboard.writeText(INSTRUCTION);
      promptCopied = true;
      announce(
        "Prompt copied. Paste it into your current AI chat and send it when ready.",
      );
    } catch {
      announce(
        "The prompt could not be copied here. Try again in a browser that allows clipboard access.",
      );
    } finally {
      copyingPrompt = false;
      updateInterface();
      button?.focus();
    }
  }

  function downloadCard() {
    const downloadLink = document.querySelector('.secondary__row a[download]');
    if (downloadLink) downloadLink.click();
  }

  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;
      const image = event.target.closest(".ref-artwork");
      if (image) {
        event.preventDefault();
        downloadCard();
        return;
      }

      const button = event.target.closest(".cta");
      if (button) {
        event.preventDefault();
        event.stopImmediatePropagation();
        void copyInstruction(button);
      }
    },
    true,
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        (event.key === "Enter" || event.key === " ") &&
        event.target instanceof Element &&
        event.target.matches(".ref-artwork")
      ) {
        event.preventDefault();
        downloadCard();
      }
    },
    true,
  );

  document.addEventListener("dragstart", (event) => {
    if (
      event.target instanceof HTMLImageElement &&
      event.target.matches(".ref-artwork") &&
      event.dataTransfer
    ) {
      event.dataTransfer.setData("text/uri-list", CARD_URL);
      event.dataTransfer.setData("text/plain", CARD_URL);
    }
  });

  updateInterface();
  new MutationObserver(updateInterface).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["open"],
  });
})();
