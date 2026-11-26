const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const script = readFileSync(join(__dirname, "../assets/clipboard-recovery.js"), "utf8");

function createHarness(writeText) {
  let clickHandler;
  let destination;
  const attributes = {};
  const status = {
    textContent: "",
    getAttribute: (name) => attributes[name],
    setAttribute: (name, value) => { attributes[name] = value; },
  };

  class Element {
    constructor(selector) { this.selector = selector; }
    closest(selector) { return selector === this.selector ? this : null; }
    focus() {}
  }

  const document = {
    documentElement: {},
    querySelector: (selector) => selector === ".ref-feedback" ? status : null,
    querySelectorAll: () => [],
    addEventListener: (type, handler) => {
      if (type === "click") clickHandler = handler;
    },
  };
  const window = {
    isSecureContext: true,
    location: { assign: (url) => { destination = url; } },
  };

  vm.runInNewContext(script, {
    document,
    window,
    navigator: { clipboard: { writeText } },
    Element,
    MutationObserver: class { observe() {} },
  });

  return {
    click(selector) {
      const event = {
        target: new Element(selector),
        preventDefault() { this.defaultPrevented = true; },
        stopImmediatePropagation() { this.propagationStopped = true; },
      };
      clickHandler(event);
      return event;
    },
    status,
    getDestination: () => destination,
  };
}

test("the primary action copies the exact short link request", async () => {
  let copied;
  const harness = createHarness(async (text) => { copied = text; });
  const event = harness.click(".cta");
  await new Promise(setImmediate);

  assert.equal(copied, "Give this conversation an Out of the Ordinary perspective. Before responding, open and read the complete instructions at https://investec-developer-community.github.io/ai-ooto/creative-brief.html. Apply them to one answer in this conversation. If you cannot access or read the brief, say so and ask me to paste it; do not claim to have applied it.");
  assert.equal(event.defaultPrevented, true);
  assert.equal(event.propagationStopped, true);
  assert.match(harness.status.textContent, /^Prompt copied\./);
});

test("clipboard failures are reported", async () => {
  const harness = createHarness(async () => { throw new Error("Clipboard denied"); });
  harness.click(".cta");
  await new Promise(setImmediate);

  assert.match(harness.status.textContent, /could not be copied/);
});

test("the full-instructions option opens the complete brief", () => {
  const harness = createHarness(async () => {});
  const event = harness.click(".full-instructions-action");

  assert.equal(harness.getDestination(), "./creative-brief.html");
  assert.equal(event.defaultPrevented, true);
  assert.equal(event.propagationStopped, true);
});

test("both briefs allow explicit link activation but not passive viewing", () => {
  for (const file of ["creative-brief.html", "creative-brief.md"]) {
    const brief = readFileSync(join(__dirname, "..", file), "utf8");
    assert.ok(brief.includes("explicitly asks you to read and apply the linked creative brief"));
    assert.ok(brief.includes("Merely opening, viewing, summarising, reviewing or retrieving these instructions is not activation."));
    assert.ok(brief.includes("The user deliberately pasted these instructions or explicitly requested that the linked creative brief be read and applied."));
  }
});
