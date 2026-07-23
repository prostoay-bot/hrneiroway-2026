(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = document.querySelector(".mb-menu-button");
  const mobileMenu = document.querySelector(".mb-mobile-menu");
  const cookieNotice = document.querySelector("[data-cookie-notice]");
  const cookieAccept = document.querySelector("[data-cookie-accept]");

  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  };

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(willOpen));
      mobileMenu.hidden = !willOpen;
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  if (cookieNotice && cookieAccept) {
    let cookieAccepted = false;

    try {
      cookieAccepted = window.localStorage.getItem("hrneiroway-cookie-notice") === "accepted";
    } catch (error) {
      cookieAccepted = false;
    }

    cookieNotice.hidden = cookieAccepted;

    cookieAccept.addEventListener("click", () => {
      cookieNotice.hidden = true;
      try {
        window.localStorage.setItem("hrneiroway-cookie-notice", "accepted");
      } catch (error) {
        // Страница продолжает работать, если сохранение настроек недоступно
      }
    });
  }

  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  const revealItems = window.gsap.utils.toArray("[data-reveal]");

  revealItems.forEach((item, index) => {
    const isHeroItem = item.closest(".mb-hero");
    const direction = index % 2 === 0 ? -1 : 1;
    const horizontalOffset = window.innerWidth > 900 && !isHeroItem ? direction * 10 : 0;

    window.gsap.fromTo(
      item,
      {
        autoAlpha: 0,
        y: isHeroItem ? 26 : 54,
        x: horizontalOffset
      },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        duration: isHeroItem ? 1 : 0.9,
        delay: isHeroItem ? index * 0.08 : 0,
        ease: "power3.out",
        scrollTrigger: isHeroItem
          ? undefined
          : {
              trigger: item,
              start: "top 88%",
              end: "bottom 12%",
              toggleActions: "play none none reverse"
            }
      }
    );
  });

  const heroVisual = document.querySelector(".mb-hero__visual");
  const heroSamples = document.querySelectorAll(".mb-hero__sample");

  if (heroVisual && heroSamples.length && window.innerWidth > 900) {
    heroSamples.forEach((sample, index) => {
      window.gsap.to(sample, {
        yPercent: index === 0 ? 12 : -10,
        ease: "none",
        scrollTrigger: {
          trigger: heroVisual,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1
        }
      });
    });
  }

  const projectMedia = window.gsap.utils.toArray(
    ".mb-project__media--wide > img, .mb-project__media--landscape > img"
  );

  projectMedia.forEach((image) => {
    window.gsap.fromTo(
      image,
      { scale: 1.035 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8
        }
      }
    );
  });

  window.addEventListener("load", () => window.ScrollTrigger.refresh());
})();
