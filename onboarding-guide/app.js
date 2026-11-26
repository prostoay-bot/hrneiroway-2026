const checklist = document.querySelector("[data-checklist]");
const progressValue = document.querySelector("[data-progress-value]");
const progressBar = document.querySelector("[data-progress-bar]");
const progressCopy = document.querySelector("[data-progress-copy]");
const resetButton = document.querySelector("[data-reset]");
const printButton = document.querySelector("[data-print]");
const navLinks = [...document.querySelectorAll(".nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const storageKey = "hrneiroway-onboarding-guide-checklist-v1";

function readSavedProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "[]");
  } catch {
    return [];
  }
}

function writeSavedProgress(values) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(values));
  } catch {
    // Progress still updates on the page if storage is unavailable.
  }
}

function getChecks() {
  return [...checklist.querySelectorAll('input[type="checkbox"]')];
}

function saveProgress() {
  const values = getChecks().map((input) => input.checked);
  writeSavedProgress(values);
}

function restoreProgress() {
  const saved = readSavedProgress();
  getChecks().forEach((input, index) => {
    input.checked = Boolean(saved[index]);
  });
}

function updateProgress() {
  const checks = getChecks();
  const done = checks.filter((input) => input.checked).length;
  const percent = checks.length ? Math.round((done / checks.length) * 100) : 0;

  progressValue.textContent = percent;
  progressBar.style.width = `${percent}%`;
  progressCopy.textContent =
    percent === 100
      ? "Все базовые шаги отмечены. Отличный старт."
      : `${done} из ${checks.length} шагов выполнено.`;
}

function updateActiveNav() {
  const offset = window.scrollY + 140;
  let current = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= offset) {
      current = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current?.id}`);
  });
}

restoreProgress();
updateProgress();
updateActiveNav();

checklist.addEventListener("change", () => {
  saveProgress();
  updateProgress();
});

resetButton.addEventListener("click", () => {
  getChecks().forEach((input) => {
    input.checked = false;
  });
  saveProgress();
  updateProgress();
});

printButton.addEventListener("click", () => {
  if (typeof window.print === "function") {
    window.print();
  }
});

document.querySelectorAll(".accordion__trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    const panel = trigger.nextElementSibling;

    trigger.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
  });
});

window.addEventListener("scroll", updateActiveNav, { passive: true });
