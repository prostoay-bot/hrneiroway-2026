const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroSection = document.querySelector(".hero");
const projectsSection = document.querySelector("#projects");
const formatsSection = document.querySelector("#formats");

if (projectsSection && formatsSection) formatsSection.before(projectsSection);

const formatTabs = [...document.querySelectorAll(".format-tab")];
const formatPanels = [...document.querySelectorAll(".format-panel")];

const activateFormatTab = (activeTab, moveFocus = false) => {
  const panelId = activeTab.getAttribute("aria-controls");

  formatTabs.forEach((tab) => {
    const isActive = tab === activeTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  formatPanels.forEach((panel) => {
    const isActive = panel.id === panelId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  if (moveFocus) activeTab.focus();
};

formatTabs.forEach((tab, tabIndex) => {
  tab.addEventListener("click", () => activateFormatTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = tabIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (tabIndex + 1) % formatTabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (tabIndex - 1 + formatTabs.length) % formatTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = formatTabs.length - 1;
    else return;

    event.preventDefault();
    activateFormatTab(formatTabs[nextIndex], true);
  });
});

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

const setGallerySlide = (dialog, nextIndex) => {
  const slides = [...dialog.querySelectorAll("[data-gallery-slide]")];
  const thumbs = [...dialog.querySelectorAll("[data-gallery-thumb]")];
  if (!slides.length) return;

  const index = (nextIndex + slides.length) % slides.length;
  dialog.dataset.galleryIndex = index;
  slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === index));
  thumbs.forEach((thumb, thumbIndex) => {
    const isActive = thumbIndex === index;
    thumb.classList.toggle("is-active", isActive);
    thumb.setAttribute("aria-current", isActive ? "true" : "false");
  });

  const count = dialog.querySelector("[data-gallery-count]");
  if (count) count.textContent = `${index + 1} / ${slides.length}`;

  const hasMultipleSlides = slides.length > 1;
  dialog.querySelectorAll("[data-gallery-prev], [data-gallery-next]").forEach((button) => {
    button.disabled = !hasMultipleSlides;
  });

  const stage = dialog.querySelector(".gallery-stage");
  if (stage) stage.scrollTop = 0;
};

document.querySelectorAll(".gallery-dialog").forEach((dialog) => {
  setGallerySlide(dialog, 0);

  dialog.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
    setGallerySlide(dialog, Number(dialog.dataset.galleryIndex || 0) - 1);
  });
  dialog.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
    setGallerySlide(dialog, Number(dialog.dataset.galleryIndex || 0) + 1);
  });
  dialog.querySelectorAll("[data-gallery-thumb]").forEach((thumb) => {
    thumb.addEventListener("click", () => setGallerySlide(dialog, Number(thumb.dataset.galleryThumb)));
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") setGallerySlide(dialog, Number(dialog.dataset.galleryIndex || 0) - 1);
    if (event.key === "ArrowRight") setGallerySlide(dialog, Number(dialog.dataset.galleryIndex || 0) + 1);
  });
});

dialogTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dialog = document.getElementById(trigger.dataset.dialogOpen);
    if (!dialog) return;
    lastDialogTrigger = trigger;
    if (dialog.classList.contains("gallery-dialog")) setGallerySlide(dialog, 0);
    dialog.showModal();
    document.body.classList.add("dialog-open");
    dialog.querySelector(".dialog-close")?.focus();
  });
});

document.querySelectorAll(".tariff-dialog, .gallery-dialog").forEach((dialog) => {
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

const telegramNotice = document.getElementById("telegram-notice");

if (telegramNotice) {
  document.querySelectorAll('a[href^="https://t.me/"]:not([data-telegram-direct])').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      lastDialogTrigger = link;
      telegramNotice.showModal();
      document.body.classList.add("dialog-open");
      telegramNotice.querySelector(".dialog-close")?.focus();
    });
  });

  const closeTelegramNotice = () => telegramNotice.close();
  telegramNotice.querySelector(".dialog-close")?.addEventListener("click", closeTelegramNotice);
  telegramNotice.addEventListener("click", (event) => {
    const bounds = telegramNotice.getBoundingClientRect();
    const isBackdrop =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (isBackdrop) closeTelegramNotice();
  });
  telegramNotice.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    lastDialogTrigger?.focus();
  });
}

const revealItems = document.querySelectorAll(
  ".meaning-copy, .meaning-step, .format-switcher, .pricing-heading, .pricing-cards, .pricing-footnote, .included, .process-list li, .price-includes-heading, .price-includes-card, .price-includes-item, .price-extras, .prototype-heading, .prototype-copy, .prototype-visual, .faq-heading, .faq-item, .project, .contact"
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
