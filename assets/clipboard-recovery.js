(() => {
  const INSTRUCTION = "Give this conversation an Out of the Ordinary perspective. Before responding, open and read the complete instructions at https://investec-developer-community.github.io/ai-ooto/creative-brief.html. Apply them to one answer in this conversation. If you cannot access or read the brief, say so and ask me to paste it; do not claim to have applied it.";
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
        "when ready. Your AI needs to open the linked brief. " +
        "This page does not access or send your chat.";
      if (consent.textContent !== description) consent.textContent = description;
    }

    const fullInstructions = document.querySelector(".full-instructions-action");
    if (fullInstructions) {
      setButtonLabel(fullInstructions, "Open the full instructions to copy");
    }

    const originalCardCopy = [...document.querySelectorAll(".secondary__row button")]
      .find((item) => item.textContent.trim().startsWith("Copy card +"));
    originalCardCopy?.remove();

    const options = document.querySelector(".ref-options");
    const summary = options?.querySelector("summary");
    if (summary) setTextContent(summary, "More options");
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

  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;
      const fullInstructions = event.target.closest(".full-instructions-action");
      if (fullInstructions) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign("./creative-brief.html");
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

  updateInterface();
  new MutationObserver(updateInterface).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["open"],
  });
})();
