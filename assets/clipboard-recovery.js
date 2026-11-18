(() => {
  const CARD_URL = new URL("./investec-card.png", window.location.href).href;
  const BRIEF_URL = new URL("./creative-brief.html", window.location.href).href;
  const INSTRUCTION =
    `Revisit your previous answer from an Out of the Ordinary perspective. ` +
    `Read and follow the brief at ${BRIEF_URL}`;
  let cardFile;
  const cardFilePromise = fetch(CARD_URL, { credentials: "same-origin" })
    .then(async (response) => {
      if (!response.ok) throw new Error("The card image could not be loaded.");
      return new File(
        [await response.blob()],
        "investec-out-of-the-ordinary-card.png",
        { type: "image/png" },
      );
    })
    .then((file) => {
      cardFile = file;
      updateInterface();
      return file;
    });
  cardFilePromise.catch(() => {});

  let copyState = "idle";
  let copyFailed = false;
  let copying = false;
  let copyingInstruction = false;
  let sharing = false;
  let shareButton;
  let instructionButton;

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
      setButtonLabel(
        button,
        copyState === "working"
          ? "Preparing card…"
          : copyState === "success"
            ? "Copied"
            : "Copy OOTO card",
      );
      button.disabled = copyState === "working";
      if (copyState === "working") {
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
        "Copy OOTO card copies only the image. Share card sends the image and " +
        "instruction together when supported. This page does not access or send your chat.";
      if (consent.textContent !== description) consent.textContent = description;
    }

    const originalCardCopy = [...document.querySelectorAll(".secondary__row button")]
      .find((item) => item.textContent.trim().startsWith("Copy card +"));
    originalCardCopy?.remove();

    const cardNote = document.querySelector(".secondary > .fine");
    if (cardNote) {
      const note =
        "Copy OOTO card copies only the image. Share card sends the image and instruction together when supported; Copy instruction is available separately in More options.";
      if (cardNote.textContent !== note) cardNote.textContent = note;
    }

    const options = document.querySelector(".ref-options");
    const summary = options?.querySelector("summary");
    if (summary) setTextContent(summary, "More options");
    if (copyFailed && options && !options.open) options.open = true;

    const optionsContent = document.querySelector(".ref-options-content");
    if (
      optionsContent &&
      (!instructionButton || !instructionButton.isConnected)
    ) {
      instructionButton = document.createElement("button");
      instructionButton.type = "button";
      instructionButton.className = "ooto-prompt-button";
      instructionButton.textContent = "Copy instruction";
      optionsContent.append(instructionButton);
    }
    if (instructionButton) {
      instructionButton.disabled = copyingInstruction;
      if (
        copyingInstruction &&
        instructionButton.getAttribute("aria-busy") !== "true"
      ) {
        instructionButton.setAttribute("aria-busy", "true");
      } else if (!copyingInstruction) {
        instructionButton.removeAttribute("aria-busy");
      }
      if (instructionButton.getAttribute("aria-describedby") !== "ref-feedback") {
        instructionButton.setAttribute("aria-describedby", "ref-feedback");
      }
    }

    if (
      optionsContent &&
      typeof navigator.share === "function" &&
      (!shareButton || !shareButton.isConnected)
    ) {
      shareButton = document.createElement("button");
      shareButton.type = "button";
      shareButton.className = "ooto-share-button";
      shareButton.textContent = "Share card";
      optionsContent.append(shareButton);
    }
    if (shareButton) {
      let canShareCard = false;
      if (
        cardFile &&
        typeof navigator.canShare === "function"
      ) {
        canShareCard = navigator.canShare({
          files: [cardFile],
          text: INSTRUCTION,
        });
      }
      const isHidden = !canShareCard || (!copyFailed && !options?.open);
      if (shareButton.hidden !== isHidden) shareButton.hidden = isHidden;
      shareButton.disabled = sharing;
      if (sharing && shareButton.getAttribute("aria-busy") !== "true") {
        shareButton.setAttribute("aria-busy", "true");
      }
      else shareButton.removeAttribute("aria-busy");
    }

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

  async function copyCard(button) {
    if (copying) return;
    copying = true;
    copyState = "working";
    updateInterface();
    announce("");

    try {
      if (
        !window.isSecureContext ||
        typeof navigator.clipboard?.write !== "function" ||
        typeof window.ClipboardItem !== "function"
      ) {
        throw new Error("Image clipboard access is unavailable.");
      }
      await navigator.clipboard.write([
        new window.ClipboardItem({ "image/png": cardFilePromise }),
      ]);
      copyState = "success";
      copyFailed = false;
      announce(
        "Card copied. Paste it into your AI chat; if image paste is unavailable, use More options → Share card.",
      );
    } catch {
      copyState = "idle";
      copyFailed = true;
      announce("Copy did not work here. Download or share the card instead.");
    } finally {
      copying = false;
      updateInterface();
      button?.focus();
    }
  }

  async function copyInstruction() {
    if (copyingInstruction) return;
    copyingInstruction = true;
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
      announce(
        "Instruction copied. Paste it into your current AI chat and send it when ready.",
      );
    } catch {
      announce(
        "The instruction could not be copied here. Try again in a browser that allows clipboard access.",
      );
    } finally {
      copyingInstruction = false;
      updateInterface();
      instructionButton?.focus();
    }
  }

  async function shareCard() {
    if (sharing) return;
    if (!cardFile) {
      announce("The card is still loading. Please try sharing again in a moment.");
      return;
    }
    sharing = true;
    updateInterface();
    try {
      if (
        typeof navigator.share !== "function" ||
        typeof navigator.canShare !== "function" ||
        !navigator.canShare({ files: [cardFile], text: INSTRUCTION })
      ) {
        throw new Error("Sharing is not supported here.");
      }
      const data = {
        title: "Investec — Out of the Ordinary",
        text: INSTRUCTION,
        files: [cardFile],
      };
      await navigator.share(data);
      announce(
        "Card and instruction shared with your selected app. Sharing does not continue your AI conversation.",
      );
    } catch (error) {
      announce(
        error?.name === "AbortError"
          ? "Sharing was cancelled. The card was not shared."
          : "The card could not be shared here. Download the PNG instead.",
      );
    } finally {
      sharing = false;
      updateInterface();
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
        void copyCard(button);
        return;
      }

      if (event.target.closest(".ooto-share-button")) {
        event.preventDefault();
        void shareCard();
        return;
      }

      if (event.target.closest(".ooto-prompt-button")) {
        event.preventDefault();
        void copyInstruction();
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
