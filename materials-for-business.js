(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = document.querySelector(".mb-menu-button");
  const mobileMenu = document.querySelector(".mb-mobile-menu");
  const cookieNotice = document.querySelector("[data-cookie-notice]");
  const cookieAccept = document.querySelector("[data-cookie-accept]");

  const galleryItems = {
    presentations: {
      category: "Презентации",
      items: [
        {
          src: "./assets/images/materials-business/gallery/shoe-collection-presentation.jpg",
          alt: "Слайд с поэтапным переходом на новую коллекцию обуви с 2026 по 2030 год",
          title: "Переход на новую коллекцию обуви",
          description: "Стратегический слайд с временной шкалой, ассортиментной матрицей и последовательностью обновления коллекции"
        }
      ]
    },
    guides: {
      category: "Гайды и буклеты",
      items: [
        {
          src: "./assets/images/materials-business/gallery/russian-food-guide.jpg",
          alt: "Развороты гастрономического путеводителя по городам России",
          title: "10 дней со вкусом",
          description: "Концепция гастрономического путеводителя, объединяющего рецепты, города и небольшие истории"
        },
        {
          src: "./assets/images/materials-business/gallery/confectionery-booklet.jpg",
          alt: "Внешняя и внутренняя стороны буклета кондитерской",
          title: "Буклет кондитерской",
          description: "Компактная презентация ассортимента, преимуществ и способов заказа для кондитерского проекта"
        },
        {
          src: "./assets/images/materials-business/gallery/nutrition-guide.jpg",
          alt: "Страницы гайда для нутрициолога о составлении рациона",
          title: "Гайд для нутрициолога",
          description: "Наглядный материал о сбалансированном питании, расчёте нормы калорий и организации приёмов пищи"
        },
        {
          src: "./assets/images/materials-business/gallery/coloristics-guide.jpg",
          alt: "Подборка страниц обучающего гайда по базовой колористике",
          title: "Гайд по базовой колористике",
          description: "Обучающий материал для специалистов индустрии красоты с понятиями, схемами и практическими подсказками"
        },
        {
          src: "./assets/images/materials-business/gallery/marketing-guide.jpg",
          alt: "Страницы рабочего гайда о маркетинге в компании",
          title: "Как устроен маркетинг в компании",
          description: "Рабочий гайд для маркетолога о продукте, аудитории, позиционировании, каналах продвижения и показателях"
        }
      ]
    },
    instructions: {
      category: "Инструкции и памятки",
      items: [
        {
          src: "./assets/images/materials-business/gallery/business-trip-memo.jpg",
          alt: "Памятка с восемью этапами подготовки сотрудника к командировке",
          title: "Как подготовиться к командировке",
          description: "Пошаговая памятка для сотрудника: от планирования и документов до отчёта после поездки"
        },
        {
          src: "./assets/images/materials-business/gallery/cake-care-memo.jpg",
          alt: "Памятка клиенту о хранении и подаче торта",
          title: "Памятка клиенту после получения торта",
          description: "Короткие рекомендации о сроке хранения, температуре и подготовке десерта к подаче"
        }
      ]
    },
    checklists: {
      category: "Чек-листы и рабочие материалы",
      items: [
        {
          src: "./assets/images/ezhednevny-check-list-menedzhera.webp",
          alt: "Ежедневный чек-лист менеджера",
          title: "Ежедневный чек-лист менеджера",
          description: "Рабочий список для последовательной проверки повторяющихся задач в течение дня"
        },
        {
          src: "./assets/images/check-list-raboty-v-crm.webp",
          alt: "Чек-лист работы менеджера в системе CRM",
          title: "Чек-лист работы в CRM",
          description: "Структурированный маршрут для контроля действий и сохранения порядка в клиентской базе"
        }
      ]
    },
    cards: {
      category: "Баннеры и карточки",
      items: [
        {
          src: "./assets/images/materials-business/gallery/skincare-cards.jpg",
          alt: "Серия карточек о привычках, которые вредят коже",
          title: "8 привычек, которые портят кожу",
          description: "Серия информационных карточек с визуальными примерами, последствиями и полезными рекомендациями"
        },
        {
          src: "./assets/images/materials-business/gallery/nutrition-infographics.jpg",
          alt: "Серия карточек с инфографикой о питании",
          title: "Инфографика о питании",
          description: "Карточки для нутрициолога о насыщении, незаметных калориях и ежедневных пищевых привычках"
        },
        {
          src: "./assets/images/materials-business/gallery/cake-infographic.jpg",
          alt: "Инфографика с последовательностью слоёв торта Сникерс",
          title: "Разрез торта",
          description: "Карточка товара, которая наглядно показывает состав и чередование слоёв десерта"
        }
      ]
    }
  };

  const galleryDialog = document.querySelector("[data-gallery-dialog]");
  const galleryImage = galleryDialog?.querySelector("[data-gallery-image]");
  const galleryCategory = galleryDialog?.querySelector("[data-gallery-category]");
  const galleryTitle = galleryDialog?.querySelector("[data-gallery-title]");
  const galleryDescription = galleryDialog?.querySelector("[data-gallery-description]");
  const galleryCounter = galleryDialog?.querySelector("[data-gallery-counter]");
  const galleryPrevious = galleryDialog?.querySelector("[data-gallery-previous]");
  const galleryNext = galleryDialog?.querySelector("[data-gallery-next]");
  const galleryClose = galleryDialog?.querySelector("[data-gallery-close]");
  const galleryStage = galleryDialog?.querySelector("[data-gallery-stage]");

  let activeGallery = null;
  let activeGalleryIndex = 0;
  let galleryTouchStartX = 0;
  let pageOverflow = "";

  const fitGalleryImage = () => {
    if (!galleryImage || !galleryStage || !galleryImage.naturalWidth || !galleryImage.naturalHeight) return;
    const imageRatio = galleryImage.naturalWidth / galleryImage.naturalHeight;
    const stageRatio = galleryStage.clientWidth / galleryStage.clientHeight;
    galleryImage.style.width = imageRatio > stageRatio ? "100%" : "auto";
    galleryImage.style.height = imageRatio > stageRatio ? "auto" : "100%";
  };

  const renderGalleryItem = () => {
    if (!activeGallery || !galleryImage) return;

    const item = activeGallery.items[activeGalleryIndex];
    galleryImage.src = item.src;
    galleryImage.alt = item.alt;
    galleryCategory.textContent = activeGallery.category;
    galleryTitle.textContent = item.title;
    galleryDescription.textContent = item.description;
    galleryCounter.textContent = `${String(activeGalleryIndex + 1).padStart(2, "0")} / ${String(activeGallery.items.length).padStart(2, "0")}`;

    const hasSeveralItems = activeGallery.items.length > 1;
    galleryPrevious.disabled = !hasSeveralItems;
    galleryNext.disabled = !hasSeveralItems;
  };

  const moveGallery = (step) => {
    if (!activeGallery || activeGallery.items.length < 2) return;
    activeGalleryIndex = (activeGalleryIndex + step + activeGallery.items.length) % activeGallery.items.length;
    renderGalleryItem();
  };

  const openGallery = (galleryName) => {
    if (!galleryDialog || !galleryItems[galleryName]) return;
    activeGallery = galleryItems[galleryName];
    activeGalleryIndex = 0;
    renderGalleryItem();
    pageOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    galleryDialog.showModal();
  };

  document.querySelectorAll("[data-gallery]").forEach((trigger) => {
    trigger.addEventListener("click", () => openGallery(trigger.dataset.gallery));
  });

  if (galleryDialog) {
    galleryImage?.addEventListener("load", fitGalleryImage);
    galleryClose?.addEventListener("click", () => galleryDialog.close());
    galleryPrevious?.addEventListener("click", () => moveGallery(-1));
    galleryNext?.addEventListener("click", () => moveGallery(1));

    galleryDialog.addEventListener("click", (event) => {
      if (event.target === galleryDialog) galleryDialog.close();
    });

    galleryDialog.addEventListener("close", () => {
      document.body.style.overflow = pageOverflow;
    });

    galleryDialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") moveGallery(-1);
      if (event.key === "ArrowRight") moveGallery(1);
    });

    galleryStage?.addEventListener("touchstart", (event) => {
      galleryTouchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    galleryStage?.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - galleryTouchStartX;
      if (Math.abs(distance) < 50) return;
      moveGallery(distance > 0 ? -1 : 1);
    }, { passive: true });

    window.addEventListener("resize", fitGalleryImage);
  }

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
