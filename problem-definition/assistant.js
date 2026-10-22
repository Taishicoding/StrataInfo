(() => {
  const launcher = document.querySelector(".assistant-launcher");
  const panel = document.querySelector("#assistant-panel");
  const closeButton = document.querySelector(".assistant-close");
  const form = document.querySelector("#assistant-form");
  const input = document.querySelector("#assistant-input");
  const messagesEl = document.querySelector("#assistant-messages");
  if (!launcher || !panel || !form || !input || !messagesEl) return;

  const history = [];
  let pending = false;

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  }

  function addMessage(text, kind) {
    const message = document.createElement("div");
    message.className = `assistant-message assistant-${kind}`;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    message.append(paragraph);
    messagesEl.append(message);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return message;
  }

  function setBusy(busy) {
    pending = busy;
    form.querySelector("button[type='submit']").disabled = busy;
    input.disabled = busy;
  }

  async function ask(question) {
    if (pending) return;
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    messagesEl.querySelector(".assistant-suggestions")?.remove();
    addMessage(cleanQuestion, "question");
    history.push({ role: "user", content: cleanQuestion });
    const typing = document.createElement("div");
    typing.className = "assistant-typing";
    typing.textContent = "Looking through the sources…";
    typing.setAttribute("role", "status");
    messagesEl.append(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    setBusy(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-10) }),
      });
      const result = await response.json().catch(() => ({}));
      typing.remove();
      if (!response.ok) throw new Error(result.error || "I couldn’t answer just now. Please try again.");
      history.push({ role: "assistant", content: result.answer });
      addMessage(result.answer, "answer");
    } catch (error) {
      typing.remove();
      addMessage(error.message || "I couldn’t connect just now. Please try again.", "error");
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  launcher.addEventListener("click", () => setOpen(panel.hidden));
  closeButton?.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      setOpen(false);
      launcher.focus();
    }
  });
  messagesEl.addEventListener("click", (event) => {
    const suggestion = event.target.closest(".assistant-suggestions button");
    if (suggestion) ask(suggestion.textContent);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value;
    input.value = "";
    input.style.height = "auto";
    ask(question);
  });
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
})();
