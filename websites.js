const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroSection = document.querySelector(".hero");

const revealHero = () => {
  if (!heroSection) return;
  requestAnimationFrame(() => requestAnimationFrame(() => heroSection.classList.add("is-ready")));
};

if (reducedMotion || document.readyState === "complete") {
  revealHero();
} else {
  window.addEventListener("load", revealHero, { once: true });
}

const dialogTriggers = document.querySelectorAll("[data-dialog-open]");
let lastDialogTrigger = null;

dialogTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dialog = document.getElementById(trigger.dataset.dialogOpen);
    if (!dialog) return;
    lastDialogTrigger = trigger;
    dialog.showModal();
    document.body.classList.add("dialog-open");
    dialog.querySelector(".dialog-close")?.focus();
  });
});

document.querySelectorAll(".tariff-dialog").forEach((dialog) => {
  const closeDialog = () => dialog.close();

  dialog.querySelector(".dialog-close")?.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const isBackdrop =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (isBackdrop) closeDialog();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    lastDialogTrigger?.focus();
  });
});

const revealItems = document.querySelectorAll(
  ".meaning-copy, .meaning-step, .tariff, .included, .process-list li, .project, .result-panel, .contact"
);

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  revealItems.forEach((item) => item.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.14 }
  );
  revealItems.forEach((item) => observer.observe(item));
}
