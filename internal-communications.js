(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = document.querySelector(".ic-menu-button");
  const mobileMenu = document.querySelector(".ic-mobile-menu");
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

  document.querySelectorAll(".ic-doubt").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll(".ic-doubt").forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.utils.toArray("[data-reveal]").forEach((item, index) => {
    const heroItem = item.closest(".ic-hero");

    window.gsap.fromTo(
      item,
      {
        autoAlpha: 0,
        y: heroItem ? 24 : 48
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: heroItem ? 1 : 0.82,
        delay: heroItem ? index * 0.08 : 0,
        ease: "power3.out",
        scrollTrigger: heroItem
          ? undefined
          : {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none reverse"
            }
      }
    );
  });

  const statementLines = window.gsap.utils.toArray("[data-statement-line]");

  if (statementLines.length) {
    window.gsap.fromTo(
      statementLines,
      { yPercent: 105 },
      {
        yPercent: 0,
        stagger: 0.16,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ic-statement",
          start: "top 68%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  const situationCards = window.gsap.utils.toArray("[data-situation-card]");

  if (situationCards.length && window.innerWidth > 900) {
    const situationTimeline = window.gsap.timeline({
      scrollTrigger: {
        trigger: ".ic-situations",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.85
      }
    });

    situationCards.forEach((card, index) => {
      situationTimeline.fromTo(
        card,
        {
          y: 120,
          autoAlpha: 0,
          rotate: index % 2 === 0 ? -1.2 : 1.2
        },
        {
          y: 0,
          autoAlpha: 1,
          rotate: index % 2 === 0 ? -0.25 : 0.25,
          duration: 1,
          ease: "power2.out"
        },
        index * 0.82
      );
    });
  }

  window.gsap.utils.toArray("[data-process-step]").forEach((step, index) => {
    window.gsap.fromTo(
      step,
      {
        autoAlpha: 0.28,
        x: index % 2 === 0 ? -34 : 34
      },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.82,
        ease: "power2.out",
        scrollTrigger: {
          trigger: step,
          start: "top 84%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  window.addEventListener("load", () => window.ScrollTrigger.refresh());
})();
