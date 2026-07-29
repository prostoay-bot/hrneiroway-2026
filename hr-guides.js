document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".hg-menu-button");
  const menu = document.querySelector(".hg-mobile-menu");

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle?.addEventListener("click", () => {
    if (!menu) return;
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    menuToggle.setAttribute("aria-expanded", String(willOpen));
  });

  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  const cookieNotice = document.querySelector("[data-cookie-notice]");
  const cookieClose = document.querySelector("[data-cookie-accept]");
  const cookieKey = "hrneiroway-cookie-notice";

  if (cookieNotice && localStorage.getItem(cookieKey) !== "accepted") {
    cookieNotice.hidden = false;
  }

  cookieClose?.addEventListener("click", () => {
    localStorage.setItem(cookieKey, "accepted");
    if (cookieNotice) cookieNotice.hidden = true;
  });

  const pdfModal = document.querySelector("[data-pdf-modal]");
  const pdfOpen = document.querySelector("[data-pdf-open]");
  const pdfClose = document.querySelector("[data-pdf-close]");
  const pdfFrame = document.querySelector("[data-pdf-frame]");
  const pdfSource = "./assets/documents/onboarding.pdf#view=FitH&toolbar=1";

  const closePdf = () => {
    if (!pdfModal?.open) return;
    pdfModal.close();
  };

  pdfOpen?.addEventListener("click", () => {
    if (!pdfModal) return;
    if (typeof pdfModal.showModal !== "function") {
      window.open("./assets/documents/onboarding.pdf", "_blank", "noopener");
      return;
    }
    if (pdfFrame && !pdfFrame.getAttribute("src")) {
      pdfFrame.setAttribute("src", pdfSource);
    }
    pdfModal.showModal();
    document.body.classList.add("hg-modal-open");
  });

  pdfClose?.addEventListener("click", closePdf);

  pdfModal?.addEventListener("click", (event) => {
    if (event.target === pdfModal) closePdf();
  });

  pdfModal?.addEventListener("close", () => {
    document.body.classList.remove("hg-modal-open");
  });

  pdfModal?.addEventListener("cancel", () => {
    document.body.classList.remove("hg-modal-open");
  });

  pdfModal?.addEventListener("toggle", () => {
    document.body.classList.toggle("hg-modal-open", pdfModal.open);
  });

  const projects = document.querySelector("[data-projects]");
  const projectTabs = [...(projects?.querySelectorAll("[data-project-tab]") || [])];
  const projectPanels = [...(projects?.querySelectorAll("[data-project-panel]") || [])];

  const showProject = (index, moveFocus = false) => {
    projectTabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === index;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    projectPanels.forEach((panel, panelIndex) => {
      const isActive = panelIndex === index;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });

    if (moveFocus) projectTabs[index]?.focus();
  };

  projectTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showProject(index));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;

      if (event.key === "ArrowRight") nextIndex = (index + 1) % projectTabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + projectTabs.length) % projectTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = projectTabs.length - 1;
      if (nextIndex === index) return;

      event.preventDefault();
      showProject(nextIndex, true);
    });
  });

  if (projectTabs.length) showProject(0);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray("[data-reveal]").forEach((element) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
});
