const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    if (window.innerWidth > 760) closeSiteMenu();
  });
}

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

let dialogTrigger = null;

document.querySelectorAll("[data-dialog-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.dialogOpen);
    if (!dialog) return;
    dialogTrigger = button;
    dialog.showModal();
    dialog.querySelector("[data-dialog-close]")?.focus();
  });
});

document.querySelectorAll(".project-dialog").forEach((dialog) => {
  const closeDialog = () => {
    dialog.close();
    dialogTrigger?.focus();
  };

  dialog.querySelector("[data-dialog-close]")?.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });
});
