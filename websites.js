const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroSection = document.querySelector(".hero");
const projectsSection = document.querySelector("#projects");
const formatsSection = document.querySelector("#formats");

const siteMenuToggle = document.querySelector(".site-menu-toggle");
const siteNavigation = document.getElementById("site-nav");

if (siteMenuToggle && siteNavigation) {
  const closeSiteMenu = () => {
    siteNavigation.classList.remove("is-open");
    siteMenuToggle.setAttribute("aria-expanded", "false");
    siteMenuToggle.setAttribute("aria-label", "Открыть меню");
  };

  siteMenuToggle.addEventListener("click", () => {
    const willOpen = !siteNavigation.classList.contains("is-open");
    siteNavigation.classList.toggle("is-open", willOpen);
    siteMenuToggle.setAttribute("aria-expanded", String(willOpen));
    siteMenuToggle.setAttribute("aria-label", willOpen ? "Закрыть меню" : "Открыть меню");
  });
  siteNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeSiteMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSiteMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeSiteMenu();
  });
}

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", revealHero, { once: true });
} else {
  revealHero();
}

const dialogTriggers = document.querySelectorAll("[data-dialog-open]");
const dialogReturnFocus = new WeakMap();
let lockedScrollY = 0;

const lockPageScroll = () => {
  if (document.body.classList.contains("dialog-open")) return;
  lockedScrollY = window.scrollY;
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.classList.add("dialog-open");
};

const unlockPageScroll = () => {
  document.body.classList.remove("dialog-open");
  document.body.style.top = "";
  window.scrollTo({ top: lockedScrollY, behavior: "instant" });
};

const openSiteDialog = (dialog, trigger) => {
  dialogReturnFocus.set(dialog, trigger);
  lockPageScroll();
  dialog.showModal();
  dialog.querySelector(".dialog-close")?.focus({ preventScroll: true });
};

const restoreDialogPosition = (event) => {
  const dialog = event.currentTarget;
  if (!document.querySelector("dialog[open]")) unlockPageScroll();
  dialogReturnFocus.get(dialog)?.focus({ preventScroll: true });
};

const casesViewport = document.querySelector(".projects-viewport");
const casesControls = document.querySelector(".projects-controls");
if (casesViewport && casesControls) {
  const cards = [...casesViewport.querySelectorAll(".projects-track > article")];
  const previous = casesControls.querySelector("[data-case-prev]");
  const next = casesControls.querySelector("[data-case-next]");
  const count = casesControls.querySelector("[data-case-count]");
  const cardOffset = (card) => {
    const viewport = casesViewport.getBoundingClientRect();
    const item = card.getBoundingClientRect();
    return item.left + item.width / 2 - viewport.left - viewport.width / 2;
  };

  let current = 0;
  const updateCases = () => {
    current = cards.reduce((nearest, card, index) =>
      Math.abs(cardOffset(card)) < Math.abs(cardOffset(cards[nearest])) ? index : nearest, 0);
    const label = `${current + 1} / ${cards.length}`;
    if (count.textContent !== label) count.textContent = label;
    previous.setAttribute("aria-disabled", String(current === 0));
    next.setAttribute("aria-disabled", String(current === cards.length - 1));
  };

  const moveCase = (direction) => {
    const card = cards[current + direction];
    if (card) casesViewport.scrollBy({ left: cardOffset(card), behavior: reducedMotion ? "instant" : "smooth" });
  };

  previous.addEventListener("click", () => moveCase(-1));
  next.addEventListener("click", () => moveCase(1));
  casesViewport.addEventListener("scroll", updateCases, { passive: true });
  window.addEventListener("resize", updateCases, { passive: true });
  updateCases();
}

const setGallerySlide = (dialog, nextIndex) => {
  const slides = [...dialog.querySelectorAll("[data-gallery-slide]")];
  const thumbs = [...dialog.querySelectorAll("[data-gallery-thumb]")];
  if (!slides.length) return;

  const index = (nextIndex + slides.length) % slides.length;
  dialog.dataset.galleryIndex = index;
  if (dialog.open) {
    dialog.querySelectorAll("img[data-gallery-src]").forEach((image) => {
      const slide = image.closest("[data-gallery-slide]");
      if (slide && slide !== slides[index]) return;
      image.loading = "eager";
      image.src = image.dataset.gallerySrc;
      image.removeAttribute("data-gallery-src");
    });
  }
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
    openSiteDialog(dialog, trigger);
    if (dialog.classList.contains("gallery-dialog")) setGallerySlide(dialog, 0);
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
  dialog.addEventListener("close", restoreDialogPosition);
});

const telegramNotice = document.getElementById("telegram-notice");

if (telegramNotice) {
  document.querySelectorAll('a[href^="https://t.me/"]:not([data-telegram-direct])').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openSiteDialog(telegramNotice, link);
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
  telegramNotice.addEventListener("close", restoreDialogPosition);
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
