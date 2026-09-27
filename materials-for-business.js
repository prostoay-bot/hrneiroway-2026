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

  const galleryData = {
    "facial-cleaning": {
      eyebrow: "Косметология",
      title: "Чистка лица: какую выбрать",
      description: "Короткий клиентский гид: виды профессиональной чистки, сравнение подходов и памятка по уходу после процедуры",
      slides: [
        { src: "./assets/images/presentations/facial-cleaning-01.jpg", alt: "Обложка гида о выборе профессиональной чистки лица" },
        { src: "./assets/images/presentations/facial-cleaning-02.jpg", alt: "Сравнение механической, ультразвуковой и комбинированной чистки лица" },
        { src: "./assets/images/presentations/facial-cleaning-03.jpg", alt: "Памятка по уходу за кожей после процедуры" }
      ]
    },
    "teachers-day": {
      eyebrow: "Праздничное оформление",
      title: "Материалы ко Дню учителя",
      description: "Два персональных макета: поздравительный плакат и календарь на учебный год",
      slides: [
        { src: "./assets/images/presentations/teachers-day-01.jpg", alt: "Персональный поздравительный плакат ко Дню учителя" },
        { src: "./assets/images/presentations/teachers-day-02.jpg", alt: "Персональный календарь на учебный год ко Дню учителя" }
      ]
    },
    nutritionist: {
      eyebrow: "Нутрициология",
      title: "Полезное питание без перегруза",
      description: "Серия наглядных карточек о насыщении, незаметных калориях и причинах, которые могут мешать снижению веса",
      slides: [
        { src: "./assets/images/presentations/nutritionist-01.jpg", alt: "Карточка о рационе, который плохо насыщает" },
        { src: "./assets/images/presentations/nutritionist-02.jpg", alt: "Обложка серии о причинах, мешающих снижать вес" },
        { src: "./assets/images/presentations/nutritionist-03.jpg", alt: "Карточка о незаметных калориях в повседневных продуктах" }
      ]
    },
    "shoe-plan": {
      eyebrow: "Бизнес-план",
      title: "Переход на новую коллекцию обуви",
      description: "Один информационно насыщенный слайд с поэтапным планом обновления ассортиментной матрицы на 2026–2030 годы",
      slides: [
        { src: "./assets/images/presentations/shoe-collection-plan.jpg", alt: "План перехода на новую коллекцию обуви с 2026 по 2030 год" }
      ]
    },
    school: {
      eyebrow: "Учебные материалы",
      title: "Инфографика для школы",
      description: "Разные визуальные языки под возраст и тему: устройство самолёта, история, безопасность и экология",
      slides: [
        { src: "./assets/images/presentations/school-airplane.jpg", alt: "Учебная инфографика об устройстве пассажирского самолёта" },
        { src: "./assets/images/presentations/school-history.jpg", alt: "Учебная инфографика о крупнейших ядерных взрывах в истории" },
        { src: "./assets/images/presentations/school-fire-safety.jpg", alt: "Памятка для школьников о действиях при пожаре" },
        { src: "./assets/images/presentations/school-stranger-safety.jpg", alt: "Памятка для школьников о безопасном поведении с незнакомцами" },
        { src: "./assets/images/presentations/school-home-safety.jpg", alt: "Памятка о личной безопасности ребёнка дома" },
        { src: "./assets/images/presentations/school-internet-safety.jpg", alt: "Памятка для школьников о безопасности в интернете" },
        { src: "./assets/images/presentations/school-recycling.jpg", alt: "Учебная инфографика о сортировке и переработке мусора" }
      ]
    }
  };

  const gallery = document.querySelector("[data-gallery]");

  if (gallery) {
    const dialog = gallery.querySelector(".mb-gallery__dialog");
    const image = gallery.querySelector("[data-gallery-image]");
    const title = gallery.querySelector("[data-gallery-title]");
    const description = gallery.querySelector("[data-gallery-description]");
    const eyebrow = gallery.querySelector("[data-gallery-eyebrow]");
    const count = gallery.querySelector("[data-gallery-count]");
    const previousButton = gallery.querySelector("[data-gallery-prev]");
    const nextButton = gallery.querySelector("[data-gallery-next]");
    const closeButton = gallery.querySelector(".mb-gallery__close");
    const stage = gallery.querySelector("[data-gallery-stage]");
    let activeGallery = null;
    let activeIndex = 0;
    let lastTrigger = null;
    let touchStartX = null;

    const renderGallery = () => {
      const item = galleryData[activeGallery];
      if (!item) return;
      const slide = item.slides[activeIndex];
      image.src = slide.src;
      image.alt = slide.alt;
      eyebrow.textContent = item.eyebrow;
      title.textContent = item.title;
      description.textContent = item.description;
      count.textContent = `${activeIndex + 1} / ${item.slides.length}`;
      previousButton.hidden = item.slides.length < 2;
      nextButton.hidden = item.slides.length < 2;
    };

    const moveGallery = (direction) => {
      const item = galleryData[activeGallery];
      if (!item) return;
      activeIndex = (activeIndex + direction + item.slides.length) % item.slides.length;
      renderGallery();
    };

    const openGallery = (key, trigger) => {
      if (!galleryData[key]) return;
      activeGallery = key;
      activeIndex = 0;
      lastTrigger = trigger;
      renderGallery();
      gallery.hidden = false;
      document.body.classList.add("mb-gallery-open");
      closeButton.focus();
    };

    const closeGallery = () => {
      if (gallery.hidden) return;
      gallery.hidden = true;
      document.body.classList.remove("mb-gallery-open");
      image.src = "";
      activeGallery = null;
      if (lastTrigger) lastTrigger.focus();
    };

    document.querySelectorAll("[data-gallery-open]").forEach((trigger) => {
      trigger.addEventListener("click", () => openGallery(trigger.dataset.galleryOpen, trigger));
    });

    gallery.querySelectorAll("[data-gallery-close]").forEach((control) => {
      control.addEventListener("click", closeGallery);
    });

    previousButton.addEventListener("click", () => moveGallery(-1));
    nextButton.addEventListener("click", () => moveGallery(1));

    stage.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    stage.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const distance = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(distance) > 50) moveGallery(distance > 0 ? -1 : 1);
    }, { passive: true });

    document.addEventListener("keydown", (event) => {
      if (gallery.hidden) return;
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") moveGallery(-1);
      if (event.key === "ArrowRight") moveGallery(1);

      if (event.key === "Tab" && dialog) {
        const focusable = Array.from(dialog.querySelectorAll("button:not([hidden])"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
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
