const siteHeader = document.querySelector(".site-header");
const clarityFrame = document.querySelector(".clarity-frame");
const serviceCards = document.querySelectorAll(".service-card");
const approachSection = document.querySelector(".approach");
const approachNotes = document.querySelectorAll(".approach-note");
const approachDetail = document.querySelector(".approach-detail");
const approachModal = document.querySelector(".approach-modal");
const approachCloseControls = document.querySelectorAll("[data-approach-close]");
const diagnosticBook = document.querySelector("[data-diagnostic]");
const usefulMaterialButtons = document.querySelectorAll("[data-useful-material]");
const usefulMailModal = document.querySelector(".useful-mail-modal");
const usefulMailDialog = document.querySelector(".useful-mail-dialog");
const usefulMailCloseControls = document.querySelectorAll("[data-useful-close]");
const usefulMailSignature = document.querySelector(".useful-mail__signature");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeaderState = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (usefulMailSignature) {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    usefulMailSignature.classList.add("is-visible");
  } else {
    const usefulSignatureObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          usefulSignatureObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    usefulSignatureObserver.observe(usefulMailSignature);
  }
}

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

const usefulMaterials = {
  prompts: {
    number: "Письмо 01",
    title: "HR-промты",
    text: "Готовые формулировки для рассылок, инструкций и внутренних коммуникаций.",
    action: "Скачать материал",
    href: "https://hrneiroway.ru/hr-prompts.pdf",
  },
  canva: {
    number: "Письмо 02",
    title: "Шаблоны гайда в Canva",
    text: "Основа для чек-листов, мини-гайдов и аккуратных PDF-материалов.",
    action: "Открыть шаблоны",
    href: "https://canva.link/qrfjbz38egi6h25",
  },
  stickers: {
    number: "Письмо 03",
    title: "Офисные стикеры",
    text: "Набор удобных стикеров для рабочих материалов и внутренних заметок.",
    action: "Открыть в Telegram",
    href: "https://t.me/addstickers/hr_ne_v_resurse",
  },
  support: {
    number: "Письмо поддержки",
    title: "У вас всё получится",
    text: "Не обязательно решать всё сразу. Выберите один понятный следующий шаг — и система начнёт складываться.",
  },
  steps: {
    number: "Небольшое напоминание",
    title: "Маленькие шаги тоже считаются",
    text: "Хороший результат начинается не с идеального документа, а с ясной мысли и первого аккуратного действия.",
  },
};

if (usefulMailModal && usefulMailDialog) {
  const usefulDialogNumber = usefulMailDialog.querySelector(
    ".useful-mail-dialog__number"
  );
  const usefulDialogTitle = usefulMailDialog.querySelector("h3");
  const usefulDialogText = usefulMailDialog.querySelector(
    ".useful-mail-dialog__text"
  );
  const usefulDialogAction = usefulMailDialog.querySelector(
    ".useful-mail-dialog__action"
  );
  let usefulMailTrigger = null;

  const closeUsefulMail = () => {
    usefulMailModal.classList.remove("is-open");
    usefulMailModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-useful-modal");
    usefulMailTrigger?.focus();
  };

  const openUsefulMail = (button) => {
    const material = usefulMaterials[button.dataset.usefulMaterial];

    if (!material) {
      return;
    }

    usefulMailTrigger = button;
    usefulDialogNumber.textContent = material.number;
    usefulDialogTitle.textContent = material.title;
    usefulDialogText.textContent = material.text;
    if (material.href) {
      usefulDialogAction.hidden = false;
      usefulDialogAction.textContent = material.action;
      usefulDialogAction.insertAdjacentHTML(
        "beforeend",
        ' <span aria-hidden="true">↗</span>'
      );
      usefulDialogAction.href = material.href;
    } else {
      usefulDialogAction.hidden = true;
      usefulDialogAction.removeAttribute("href");
    }
    usefulMailModal.classList.add("is-open");
    usefulMailModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-useful-modal");
    window.requestAnimationFrame(() => usefulMailDialog.focus());
  };

  usefulMaterialButtons.forEach((button) => {
    button.addEventListener("click", () => openUsefulMail(button));
  });

  usefulMailCloseControls.forEach((control) => {
    control.addEventListener("click", closeUsefulMail);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && usefulMailModal.classList.contains("is-open")) {
      closeUsefulMail();
    }
  });
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

const diagnosticQuestions = [
  {
    category: "route",
    question: "Есть ли у нового сотрудника понятный маршрут первых недель?",
    context:
      "Оцените не намерение, а реальный опыт: знает ли человек, что делать, где искать информацию и к кому обращаться.",
    options: [
      ["Да, всё понятно", "Маршрут зафиксирован и работает одинаково для всех"],
      ["Частично", "Что-то есть, но многое зависит от руководителя или коллег"],
      ["Нет", "Новый сотрудник собирает информацию по частям"],
    ],
    risk: "Нет единого маршрута первых недель",
  },
  {
    category: "knowledge",
    question: "Может ли новичок самостоятельно найти ответы на частые вопросы?",
    context:
      "Представьте первый рабочий день без подсказок коллег: насколько быстро человек найдёт нужную информацию сам.",
    options: [
      ["Да, за пару минут", "Есть понятное место с актуальными ответами"],
      ["Не всегда", "Часть ответов есть, часть приходится уточнять"],
      ["Нет, нужно спрашивать", "Информация разбросана по чатам и папкам"],
    ],
    risk: "Ответы приходится собирать в чатах и у коллег",
  },
  {
    category: "route",
    question: "Понятны ли задачи, роли и ожидаемый результат на испытательный срок?",
    context:
      "Хорошая адаптация снимает неопределённость: сотрудник понимает приоритеты и критерии успешной работы.",
    options: [
      ["Да, зафиксированы", "Есть цели, этапы и понятные критерии результата"],
      ["Только в общих чертах", "Приоритеты уточняются уже в процессе"],
      ["Нет единой картины", "Ожидания существуют только в голове руководителя"],
    ],
    risk: "Нет ясных ожиданий на испытательный срок",
  },
  {
    category: "guides",
    question: "Инструкции актуальны и ими действительно удобно пользоваться?",
    context:
      "Важно не наличие файла, а то, помогает ли он выполнить задачу без дополнительных расшифровок.",
    options: [
      ["Да, помогают в работе", "Шаги понятны, документы регулярно обновляются"],
      ["Есть, но не все", "Часть инструкций устарела или перегружена"],
      ["Скорее нет", "Документы существуют формально или их никто не открывает"],
    ],
    risk: "Инструкции устарели или не помогают выполнить задачу",
  },
  {
    category: "guides",
    question: "Все руководители используют одинаковые материалы для адаптации?",
    context:
      "Единая база снижает разницу между командами и не превращает качество адаптации в лотерею.",
    options: [
      ["Да, есть стандарт", "Материалы и логика едины для всех подразделений"],
      ["Частично", "Есть основа, но каждый дополняет её по-своему"],
      ["Нет", "Каждый руководитель начинает адаптацию с нуля"],
    ],
    risk: "Качество адаптации зависит от конкретного руководителя",
  },
  {
    category: "knowledge",
    question: "Есть ли одно место, где собраны правила, процессы и полезные материалы?",
    context:
      "Сотрудник не должен помнить названия десятков папок и каналов, чтобы найти рабочий документ.",
    options: [
      ["Да, единая база", "Структура понятна, поиск занимает минимум времени"],
      ["Есть несколько мест", "Нужно знать, где именно искать каждый тип информации"],
      ["Нет", "Документы распределены между чатами, дисками и личными папками"],
    ],
    risk: "Материалы разбросаны по разным каналам",
  },
  {
    category: "feedback",
    question: "Собираете ли вы обратную связь после адаптации?",
    context:
      "Без обратной связи система не замечает, где новичок теряет время и какие объяснения не работают.",
    options: [
      ["Да, регулярно", "Есть вопросы, сроки и ответственный за улучшения"],
      ["Иногда", "Отзывы собираются не у всех и не всегда используются"],
      ["Нет", "О качестве адаптации судят по общему впечатлению"],
    ],
    risk: "Нет регулярной обратной связи от новичков",
  },
  {
    category: "feedback",
    question: "Повторяющиеся вопросы превращаются в новые материалы и улучшения?",
    context:
      "Каждый повторный вопрос — сигнал, что системе не хватает понятного объяснения или удобного формата.",
    options: [
      ["Да, мы обновляем систему", "Вопросы фиксируются и становятся частью материалов"],
      ["Иногда", "Изменения зависят от инициативы отдельных людей"],
      ["Нет", "Команда продолжает отвечать на одно и то же вручную"],
    ],
    risk: "Повторяющиеся вопросы не превращаются в улучшения",
  },
];

if (diagnosticBook) {
  const questionStep = diagnosticBook.querySelector(".diagnostic-book__step");
  const questionTitle = diagnosticBook.querySelector(".diagnostic-book__question h3");
  const questionContext = diagnosticBook.querySelector(".diagnostic-book__question p");
  const progressText = diagnosticBook.querySelector(".diagnostic-book__progress strong");
  const answerButtons = [...diagnosticBook.querySelectorAll("[data-diagnostic-score]")];
  const backButton = diagnosticBook.querySelector(".diagnostic-book__back");
  const result = diagnosticBook.querySelector(".diagnostic-result");
  const resultScore = diagnosticBook.querySelector("[data-diagnostic-result-score]");
  const resultMeter = diagnosticBook.querySelector(".diagnostic-result__meter span");
  const resultLabel = diagnosticBook.querySelector(".diagnostic-result__label");
  const resultTitle = diagnosticBook.querySelector(".diagnostic-result__copy h3");
  const resultRisks = diagnosticBook.querySelector("[data-diagnostic-risks]");
  const resultRecommendation = diagnosticBook.querySelector(
    "[data-diagnostic-recommendation]"
  );
  const restartButton = diagnosticBook.querySelector("[data-diagnostic-restart]");
  const answers = Array(diagnosticQuestions.length).fill(null);
  let currentQuestion = 0;
  let pageIsTurning = false;

  const renderDiagnosticQuestion = () => {
    const item = diagnosticQuestions[currentQuestion];
    const savedAnswer = answers[currentQuestion];

    questionStep.textContent = `Вопрос ${String(currentQuestion + 1).padStart(
      2,
      "0"
    )} / ${String(diagnosticQuestions.length).padStart(2, "0")}`;
    questionTitle.textContent = item.question;
    questionContext.textContent = item.context;
    progressText.textContent = `${currentQuestion + 1} из ${diagnosticQuestions.length}`;
    backButton.disabled = currentQuestion === 0;
    diagnosticBook.style.setProperty(
      "--diagnostic-progress",
      String(currentQuestion / (diagnosticQuestions.length - 1))
    );

    answerButtons.forEach((button, index) => {
      const label = button.querySelector("strong");
      const description = button.querySelector("small");
      const score = 2 - index;
      const isSelected = savedAnswer === score;

      label.textContent = item.options[index][0];
      description.textContent = item.options[index][1];
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    diagnosticBook.classList.remove("is-turning");
    pageIsTurning = false;
  };

  const turnDiagnosticPage = (callback) => {
    if (reduceMotion) {
      callback();
      return;
    }

    pageIsTurning = true;
    diagnosticBook.classList.add("is-turning");
    window.setTimeout(callback, 260);
  };

  const diagnosticSummaries = {
    low: {
      label: "Системе нужна опора",
      title: "Сотрудники тратят время на поиск ответов",
    },
    middle: {
      label: "Основа уже есть",
      title: "Материалы работают неравномерно и зависят от людей",
    },
    high: {
      label: "Система помогает",
      title: "Адаптация выстроена — осталось усилить отдельные точки",
    },
  };

  const recommendationByCategory = {
    route:
      "Начните с welcome book и маршрута адаптации: зафиксируйте первые недели, роли, задачи и точки контакта.",
    knowledge:
      "Соберите единую базу знаний с понятной навигацией, поиском и владельцами разделов.",
    guides:
      "Пересоберите HR-гайды и инструкции: сократите текст, добавьте сценарии, шаги и удобный редактируемый формат.",
    feedback:
      "Добавьте короткий цикл обратной связи и журнал повторяющихся вопросов, чтобы материалы регулярно улучшались.",
  };

  const showDiagnosticResult = () => {
    const total = answers.reduce((sum, value) => sum + (value ?? 0), 0);
    const score = Math.round((total / (diagnosticQuestions.length * 2)) * 100);
    const summary =
      score >= 75
        ? diagnosticSummaries.high
        : score >= 45
          ? diagnosticSummaries.middle
          : diagnosticSummaries.low;
    const categoryScores = diagnosticQuestions.reduce((scores, item, index) => {
      scores[item.category] = (scores[item.category] || 0) + (answers[index] ?? 0);
      return scores;
    }, {});
    const weakestCategory = Object.entries(categoryScores).sort(
      (first, second) => first[1] - second[1]
    )[0][0];
    const risks = diagnosticQuestions
      .filter((item, index) => (answers[index] ?? 0) < 2)
      .sort(
        (first, second) =>
          answers[diagnosticQuestions.indexOf(first)] -
          answers[diagnosticQuestions.indexOf(second)]
      )
      .slice(0, 3)
      .map((item) => item.risk);

    resultScore.textContent = String(score);
    resultLabel.textContent = summary.label;
    resultTitle.textContent = summary.title;
    resultRisks.replaceChildren();

    (risks.length ? risks : ["Критичных разрывов не обнаружено"]).forEach(
      (risk) => {
        const item = document.createElement("li");
        item.textContent = risk;
        resultRisks.append(item);
      }
    );

    resultRecommendation.textContent = recommendationByCategory[weakestCategory];
    result.hidden = false;
    diagnosticBook.style.setProperty("--diagnostic-progress", "1");

    window.requestAnimationFrame(() => {
      diagnosticBook.classList.add("is-complete");
      resultMeter.style.width = `${score}%`;
      result.focus?.();
    });
  };

  const chooseDiagnosticAnswer = (button) => {
    if (pageIsTurning) {
      return;
    }

    const score = Number(button.dataset.diagnosticScore);
    answers[currentQuestion] = score;
    answerButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    turnDiagnosticPage(() => {
      if (currentQuestion === diagnosticQuestions.length - 1) {
        showDiagnosticResult();
        diagnosticBook.classList.remove("is-turning");
        pageIsTurning = false;
        return;
      }

      currentQuestion += 1;
      renderDiagnosticQuestion();
    });
  };

  answerButtons.forEach((button) => {
    button.addEventListener("click", () => chooseDiagnosticAnswer(button));
  });

  backButton.addEventListener("click", () => {
    if (currentQuestion === 0 || pageIsTurning) {
      return;
    }

    turnDiagnosticPage(() => {
      currentQuestion -= 1;
      renderDiagnosticQuestion();
    });
  });

  restartButton.addEventListener("click", () => {
    answers.fill(null);
    currentQuestion = 0;
    resultMeter.style.width = "0";
    diagnosticBook.classList.remove("is-complete");
    diagnosticBook.style.setProperty("--diagnostic-progress", "0");
    window.setTimeout(() => {
      result.hidden = true;
      renderDiagnosticQuestion();
    }, reduceMotion ? 0 : 320);
  });

  renderDiagnosticQuestion();
}
