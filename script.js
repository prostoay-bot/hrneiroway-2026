const siteHeader = document.querySelector(".site-header");
const clarityFrame = document.querySelector(".clarity-frame");
const serviceCards = document.querySelectorAll(".service-card");
const approachSection = document.querySelector(".approach");
const approachNotes = document.querySelectorAll(".approach-note");
const approachDetail = document.querySelector(".approach-detail");
const approachModal = document.querySelector(".approach-modal");
const approachCloseControls = document.querySelectorAll("[data-approach-close]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeaderState = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (clarityFrame) {
  if (reduceMotion) {
    clarityFrame.classList.add("is-visible");
  } else {
    document.documentElement.classList.add("has-motion");
    let clarityFramePending = false;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const updateClarityFrame = () => {
      const rect = clarityFrame.getBoundingClientRect();
      const openingStart = window.innerHeight * 0.92;
      const openingEnd = window.innerHeight * 0.42;
      const progress = clamp(
        (openingStart - rect.top) / (openingStart - openingEnd),
        0,
        1
      );
      const textProgress = clamp((progress - 0.46) / 0.42, 0, 1);
      const openInset = clamp(rect.width * 0.06, 24, 96);
      const closedShift = Math.max(rect.width / 2 - openInset - 24, 0);
      const currentShift = closedShift * (1 - progress);

      clarityFrame.style.setProperty("--clarity-shift", `${currentShift}px`);
      clarityFrame.style.setProperty("--clarity-text-opacity", textProgress);
      clarityFrame.style.setProperty(
        "--clarity-text-y",
        `${12 * (1 - textProgress)}px`
      );
      clarityFrame.style.setProperty(
        "--clarity-clip",
        `${100 * (1 - textProgress)}%`
      );

      clarityFramePending = false;
    };

    const requestClarityFrameUpdate = () => {
      if (clarityFramePending) {
        return;
      }

      clarityFramePending = true;
      window.requestAnimationFrame(updateClarityFrame);
    };

    updateClarityFrame();
    window.addEventListener("scroll", requestClarityFrameUpdate, { passive: true });
    window.addEventListener("resize", requestClarityFrameUpdate);
  }
}

if (serviceCards.length) {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    serviceCards.forEach((card) => card.classList.add("is-visible"));
  } else {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          cardObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
      }
    );

    serviceCards.forEach((card) => cardObserver.observe(card));
  }
}

const approachContent = {
  hr: {
    number: "01",
    title: "Понимаю HR изнутри",
    text: "15+ лет в HR помогают мне быстро разбираться в задаче, процессах и контексте компании. Не нужно долго объяснять, как устроены адаптация, внутренние коммуникации и работа с сотрудниками.",
  },
  steps: {
    number: "02",
    title: "Работаю по этапам",
    text: "После согласования структуры последовательно собираю текст, визуальную подачу и финальные материалы. На каждом этапе понятно, что уже готово и что будет дальше.",
  },
  structure: {
    number: "03",
    title: "Сначала выстраиваю структуру",
    text: "Сначала собираю смысл и логику материала, затем согласую структуру с вами. Так мы не тратим время на переделку уже готового дизайна.",
  },
  useful: {
    number: "04",
    title: "Делаю не просто красиво, а удобно",
    text: "Материал должен не просто красиво выглядеть, а помогать людям в работе. Передаю результат в удобном редактируемом формате, чтобы его можно было обновлять и использовать дальше.",
  },
};

if (approachSection) {
  if (reduceMotion) {
    approachNotes.forEach((note) => {
      note.style.setProperty("--approach-x", "0px");
      note.style.setProperty("--approach-y", "0px");
      note.style.setProperty("--approach-opacity", "1");
      note.style.setProperty("--approach-scale", "1");
      note.style.setProperty("--approach-current-rotation", "var(--rotation)");
    });
  } else {
    let approachPending = false;

    const updateApproachCards = () => {
      const rect = approachSection.getBoundingClientRect();
      const movementStart = window.innerHeight * 0.94;
      const movementEnd = window.innerHeight * 0.34;
      const progress = Math.min(
        Math.max((movementStart - rect.top) / (movementStart - movementEnd), 0),
        1
      );
      const distance =
        window.innerWidth <= 760
          ? 18
          : Math.min(Math.max(rect.width * 0.13, 90), 170);

      approachNotes.forEach((note, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const x = distance * (1 - progress) * direction;
        const y = 12 * (1 - progress);
        const rotation = Number.parseFloat(
          window.getComputedStyle(note).getPropertyValue("--rotation")
        );

        note.style.setProperty("--approach-x", `${x}px`);
        note.style.setProperty("--approach-y", `${y}px`);
        note.style.setProperty(
          "--approach-opacity",
          String(0.38 + progress * 0.62)
        );
        note.style.setProperty(
          "--approach-scale",
          String(0.96 + progress * 0.04)
        );
        note.style.setProperty(
          "--approach-current-rotation",
          `${rotation * progress}deg`
        );
      });

      approachPending = false;
    };

    const requestApproachUpdate = () => {
      if (approachPending) {
        return;
      }

      approachPending = true;
      window.requestAnimationFrame(updateApproachCards);
    };

    updateApproachCards();
    window.addEventListener("scroll", requestApproachUpdate, { passive: true });
    window.addEventListener("resize", requestApproachUpdate);
  }
}

if (approachNotes.length && approachDetail && approachModal) {
  const detailNumber = approachDetail.querySelector(".approach-detail__number");
  const detailTitle = approachDetail.querySelector("h3");
  const detailText = approachDetail.querySelector("p");
  const detailClose = approachDetail.querySelector(".approach-detail__close");
  let lastApproachTrigger = null;

  const closeApproachDetail = () => {
    approachModal.classList.remove("is-open");
    approachModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-approach-modal");
    lastApproachTrigger?.focus();
  };

  const showApproachDetail = (note) => {
    const content = approachContent[note.dataset.approach];

    if (!content) {
      return;
    }

    lastApproachTrigger = note;

    approachNotes.forEach((item) => {
      const isCurrent = item === note;
      item.classList.toggle("is-active", isCurrent);
      item.setAttribute("aria-pressed", String(isCurrent));
    });

    const updateContent = () => {
      detailNumber.textContent = content.number;
      detailTitle.textContent = content.title;
      detailText.textContent = content.text;
      approachDetail.classList.remove("is-changing");
      approachModal.classList.add("is-open");
      approachModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("has-approach-modal");
      detailClose.focus();
    };

    if (reduceMotion) {
      updateContent();
      return;
    }

    approachDetail.classList.add("is-changing");
    window.setTimeout(updateContent, 180);
  };

  approachNotes.forEach((note) => {
    note.addEventListener("click", () => showApproachDetail(note));
  });

  approachCloseControls.forEach((control) => {
    control.addEventListener("click", closeApproachDetail);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && approachModal.classList.contains("is-open")) {
      closeApproachDetail();
    }
  });
}
