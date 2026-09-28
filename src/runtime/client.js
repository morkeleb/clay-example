"use strict";

const roleSelect = document.querySelector("#role");
const message = document.querySelector("#message");

function role() {
  return roleSelect.value;
}

function show(text) {
  message.textContent = text;
}

function text(value) {
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (value === undefined || value === null) return "";
  return String(value);
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), "x-role": role() },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || response.statusText);
  }
  return payload;
}

function fillForm(form, note) {
  if (!note) return;
  form.querySelectorAll("[data-from-entity]").forEach((input) => {
    const key = input.dataset.fromEntity;
    if (input.type === "checkbox") {
      input.checked = Boolean(note[key]);
    } else {
      input.value = note[key] ?? "";
    }
  });
}

function bindSection(section) {
  const collection = section.dataset.collection;
  const state = { id: null, note: null };

  function setEntityButtons(enabled) {
    section.querySelectorAll("[data-needs-entity]").forEach((button) => {
      button.disabled = !enabled;
    });
  }

  function renderList(notes) {
    const tbody = section.querySelector("tbody");
    tbody.replaceChildren();
    const fields = [...section.querySelectorAll("thead th")].map((th) => th.dataset.field);
    for (const note of notes) {
      const row = document.createElement("tr");
      row.tabIndex = 0;
      row.dataset.id = note.id;
      if (note.id === state.id) row.setAttribute("aria-selected", "true");
      for (const field of fields) {
        const cell = document.createElement("td");
        cell.textContent = text(note[field]);
        row.append(cell);
      }
      row.addEventListener("click", () => {
        void selectNote(note.id);
      });
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter") void selectNote(note.id);
      });
      tbody.append(row);
    }
  }

  function showNote(note) {
    state.note = note;
    section.querySelectorAll("dd[data-field]").forEach((slot) => {
      slot.textContent = text(note[slot.dataset.field]);
    });
    section.querySelectorAll("tbody tr").forEach((row) => {
      if (row.dataset.id === note.id) row.setAttribute("aria-selected", "true");
      else row.removeAttribute("aria-selected");
    });
    setEntityButtons(true);
    section.querySelectorAll("form").forEach((form) => fillForm(form, note));
  }

  async function selectNote(id) {
    state.id = id;
    const note = await api(`${collection}/${encodeURIComponent(id)}`);
    showNote(note);
  }

  async function loadList() {
    const notes = await api(collection);
    renderList(notes);
    if (!state.id) return;
    if (notes.some((note) => note.id === state.id)) {
      await selectNote(state.id);
      return;
    }
    state.id = null;
    state.note = null;
    setEntityButtons(false);
  }

  section.querySelectorAll("[data-open-mutation]").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.openMutation;
      if (button.dataset.needsEntity !== undefined && !state.note) {
        show("Select a note.");
        return;
      }
      section.querySelectorAll("form").forEach((form) => {
        form.hidden = form.dataset.mutation !== name;
        if (!form.hidden) fillForm(form, state.note);
      });
      show("");
    });
  });

  section.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {};
      for (const element of form.elements) {
        if (!element.name) continue;
        if (element.type === "checkbox") data[element.name] = element.checked;
        else data[element.name] = element.value;
      }
      try {
        const saved = await api(form.dataset.action, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(data),
        });
        show("Saved.");
        form.hidden = true;
        state.id = saved.id;
        await loadList();
      } catch (error) {
        show(error.message);
      }
    });
  });

  return loadList;
}

const loaders = [...document.querySelectorAll(".entity")].map((section) => bindSection(section));

async function reload() {
  try {
    for (const load of loaders) await load();
  } catch (error) {
    show(error.message);
  }
}

roleSelect.addEventListener("change", () => {
  void reload();
});

void reload();
