"use strict";

const routeDays = [
  {
    day: "День 1",
    title: "Ориентация и знакомство",
    tasks: [
      "Встреча с руководителем: миссия, ожидания и первые задачи",
      "Получить все доступы и оборудование",
      "Познакомиться с командой лично или на созвоне",
      "Изучить адаптационный регламент целиком"
    ]
  },
  {
    day: "Дни 2–3",
    title: "Погружение в инструменты и процессы",
    tasks: [
      "Разобраться, как ставятся и отслеживаются задачи",
      "Познакомиться с CRM и облачным хранилищем",
      "Прочитать базовые регламенты и инструкции по роли",
      "Задать наставнику вопросы по непонятным моментам"
    ]
  },
  {
    day: "День 4",
    title: "Первая реальная задача",
    tasks: [
      "Получить небольшую задачу с чётким результатом",
      "Выполнить её самостоятельно и зафиксировать в системе",
      "Сдать результат и получить обратную связь"
    ]
  },
  {
    day: "День 5",
    title: "Углубление в команду",
    tasks: [
      "Провести короткие 1:1 с ключевыми коллегами",
      "Понять, кто над чем работает и как распределены зоны",
      "Посетить первую командную планёрку"
    ]
  },
  {
    day: "День 6",
    title: "Первая обратная связь",
    tasks: [
      "Обсудить с руководителем первые наблюдения",
      "Определить один конкретный фокус для роста",
      "Уточнить приоритеты на следующую неделю"
    ]
  },
  {
    day: "День 7",
    title: "Итог первой недели",
    tasks: [
      "Провести check-in с руководителем",
      "Заполнить финальный чек-лист адаптации",
      "Обозначить вопросы, которые остались открытыми"
    ]
  }
];

const people = [
  ["manager", "Р", "Руководитель", "Задачи, приоритеты, развитие и карьерные вопросы"],
  ["hr", "HR", "HR / Кадры", "Документы, отпуска, больничные и оформление"],
  ["accounting", "₽", "Бухгалтерия", "Зарплата, авансы и компенсации расходов"],
  ["it", "IT", "IT-поддержка", "Доступы, оборудование и технические проблемы"],
  ["mentor", "Н", "Коллега-наставник", "Бытовые вопросы и первая помощь в процессах"],
  ["team", "Ч", "Общий чат команды", "Текущие рабочие вопросы и координация"]
];

const tools = [
  ["CRM", "CRM-система", "Клиенты, сделки и задачи по продажам"],
  ["TM", "Таск-менеджер", "Задачи, сроки, статусы и договорённости"],
  ["М", "Мессенджер", "Оперативное общение с командой"],
  ["О", "Облачное хранилище", "Документы, шаблоны, инструкции и архивы"],
  ["V", "Видеосвязь", "Планёрки, встречи и рабочие созвоны"],
  ["@", "Почта", "Официальная переписка и уведомления"]
];

const culture = [
  ["Говорить прямо о проблемах, не замалчивать", "Молча уходить с нерешённой проблемой"],
  ["Фиксировать договорённости письменно", "Оставлять договорённости только на словах"],
  ["Задавать вопросы, если что-то непонятно", "Тратить часы на догадки вместо короткого вопроса"],
  ["Признавать ошибки и исправлять их", "Скрывать ошибки или перекладывать ответственность"],
  ["Уважать время коллег и быть пунктуальным", "Опаздывать на встречи без предупреждения"]
];

const checklist = [
  "Получены все необходимые доступы и оборудование",
  "Состоялось знакомство с командой",
  "Адаптационный регламент прочитан полностью",
  "Понятно, к кому обращаться по разным вопросам",
  "Освоены основные рабочие инструменты",
  "Выполнена первая реальная задача",
  "Проведены 1:1 с ключевыми коллегами",
  "Получена первая обратная связь от руководителя",
  "Понятны приоритеты на следующую неделю",
  "Все накопившиеся вопросы заданы"
];

const storageKey = "hrneiroway-adaptation-app-state-v2";
const defaultState = {
  profile: { name: "", company: "", role: "", startDate: "" },
  routeDone: {},
  checklistDone: {},
  contacts: {},
  questions: ""
};

let state = loadState();
let activeDay = "all";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function totalTasks() {
  return routeDays.reduce((sum, item) => sum + item.tasks.length, 0);
}

function completedRouteTasks() {
  return Object.values(state.routeDone).filter(Boolean).length;
}

function completedChecklistItems() {
  return Object.values(state.checklistDone).filter(Boolean).length;
}

function totalProgress() {
  const completed = completedRouteTasks() + completedChecklistItems();
  return Math.round((completed / (totalTasks() + checklist.length)) * 100);
}

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts.slice(0, 2).map(part => part[0]).join("").toUpperCase() : "НС";
}

function formatDate(value) {
  if (!value) return "Не указана";
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function renderProfile() {
  const profile = state.profile;
  const name = profile.name || "Новый сотрудник";
  $("#profileName").textContent = name;
  $("#employeeChipName").textContent = name;
  $("#employeeAvatar").textContent = initials(name);
  $("#profileCompany").textContent = profile.company || "Не указана";
  $("#profileRole").textContent = profile.role || "Не указана";
  $("#employeeChipRole").textContent = profile.role || "Укажите должность";
  $("#profileDate").textContent = formatDate(profile.startDate);
}

function renderDayTabs() {
  $("#dayTabs").innerHTML = [
    `<button class="${activeDay === "all" ? "active" : ""}" data-day="all">Вся неделя</button>`,
    ...routeDays.map((item, index) => `<button class="${activeDay === String(index) ? "active" : ""}" data-day="${index}">${item.day}</button>`)
  ].join("");
}

function renderRoute() {
  const days = routeDays
    .map((item, index) => ({ ...item, index }))
    .filter(item => activeDay === "all" || activeDay === String(item.index));

  $("#routeList").innerHTML = days.map(item => {
    const done = item.tasks.filter((_, taskIndex) => state.routeDone[`${item.index}-${taskIndex}`]).length;
    return `
      <article class="route-day">
        <div class="route-day-header">
          <span class="route-day-number">${item.day}</span>
          <h2>${item.title}</h2>
          <span class="route-day-count">${done} / ${item.tasks.length}</span>
        </div>
        <div class="task-list">
          ${item.tasks.map((task, taskIndex) => {
            const id = `${item.index}-${taskIndex}`;
            return `
              <label class="task-item">
                <input type="checkbox" data-route-task="${id}" ${state.routeDone[id] ? "checked" : ""}>
                <span class="fake-check"></span>
                <span>${task}</span>
              </label>
            `;
          }).join("")}
        </div>
      </article>
    `;
  }).join("");

  $("#routeCount").textContent = `${completedRouteTasks()} / ${totalTasks()}`;
}

function renderPeople() {
  $("#peopleGrid").innerHTML = people.map(([id, icon, role, responsibility]) => {
    const saved = state.contacts[id] || {};
    return `
      <article class="person-card">
        <span class="person-icon">${icon}</span>
        <h2>${role}</h2>
        <p>${responsibility}</p>
        <div class="person-contact">${saved.name || "Контакт не заполнен"}${saved.contact ? `<br>${saved.contact}` : ""}</div>
        <button type="button" data-edit-contact="${id}">${saved.name ? "Изменить контакт" : "Добавить контакт"}</button>
      </article>
    `;
  }).join("");
}

function renderTools() {
  $("#toolsGrid").innerHTML = tools.map(([icon, name, purpose]) => `
    <article class="tool-card">
      <span class="tool-icon">${icon}</span>
      <h2>${name}</h2>
      <p>${purpose}</p>
    </article>
  `).join("");
}

function renderCulture() {
  $("#cultureTable").innerHTML = `
    <div class="culture-head"><div>У нас принято</div><div>У нас не принято</div></div>
    ${culture.map(([good, bad]) => `
      <div class="culture-row">
        <div><span class="good">✓</span><span>${good}</span></div>
        <div><span class="bad">×</span><span>${bad}</span></div>
      </div>
    `).join("")}
  `;
}

function renderChecklist() {
  $("#checklistItems").innerHTML = checklist.map((item, index) => `
    <label class="check-item">
      <input type="checkbox" data-check-item="${index}" ${state.checklistDone[index] ? "checked" : ""}>
      <span class="fake-check"></span>
      <span>${item}</span>
    </label>
  `).join("");

  const percent = Math.round((completedChecklistItems() / checklist.length) * 100);
  $("#checklistPercent").textContent = `${percent}%`;
  $("#checklistBar").style.width = `${percent}%`;
}

function findNextTask() {
  for (let dayIndex = 0; dayIndex < routeDays.length; dayIndex += 1) {
    for (let taskIndex = 0; taskIndex < routeDays[dayIndex].tasks.length; taskIndex += 1) {
      if (!state.routeDone[`${dayIndex}-${taskIndex}`]) {
        return { day: routeDays[dayIndex].day, task: routeDays[dayIndex].tasks[taskIndex] };
      }
    }
  }
  return { day: "Готово", task: "Маршрут первой недели полностью пройден" };
}

function updateProgress() {
  const percent = totalProgress();
  const completed = completedRouteTasks() + completedChecklistItems();
  const total = totalTasks() + checklist.length;
  const next = findNextTask();

  $("#sidebarPercent").textContent = `${percent}%`;
  $("#sidebarBar").style.width = `${percent}%`;
  $("#heroPercent").textContent = `${percent}%`;
  $("#progressRing").style.setProperty("--progress", `${percent * 3.6}deg`);
  $("#completedCount").textContent = completed;
  $("#remainingCount").textContent = total - completed;
  $("#nextTaskTitle").textContent = next.task;
  $("#nextTaskDay").textContent = next.day;
  $("#nextTaskDescription").textContent = percent === 100
    ? "Вы закрыли весь маршрут и готовы подвести итоги."
    : "Отметьте выполнение, когда закончите этот шаг.";
  $("#progressMessage").textContent = percent === 0
    ? "Самое время сделать первый шаг."
    : percent < 50
      ? "Хорошее начало. Продолжайте в своём темпе."
      : percent < 100
        ? "Большая часть пути уже позади."
        : "Первая неделя пройдена. Отличная работа.";
}

function switchView(id) {
  $$(".view").forEach(view => view.classList.toggle("active", view.id === id));
  $$(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.section === id));
  document.body.classList.remove("menu-open");
  history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openProfile() {
  const form = $("#profileForm");
  form.elements.name.value = state.profile.name;
  form.elements.company.value = state.profile.company;
  form.elements.role.value = state.profile.role;
  form.elements.startDate.value = state.profile.startDate;
  $("#profileModal").showModal();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function exportSummary() {
  const routeLines = routeDays.flatMap((day, dayIndex) => [
    `\n${day.day}. ${day.title}`,
    ...day.tasks.map((task, taskIndex) => `${state.routeDone[`${dayIndex}-${taskIndex}`] ? "✓" : "☐"} ${task}`)
  ]);
  const checkLines = checklist.map((item, index) => `${state.checklistDone[index] ? "✓" : "☐"} ${item}`);
  const content = [
    "ИТОГ АДАПТАЦИОННОЙ НЕДЕЛИ",
    "",
    `Сотрудник: ${state.profile.name || "Не указано"}`,
    `Компания: ${state.profile.company || "Не указано"}`,
    `Должность: ${state.profile.role || "Не указано"}`,
    `Дата начала: ${formatDate(state.profile.startDate)}`,
    `Общий прогресс: ${totalProgress()}%`,
    "",
    "МАРШРУТ",
    ...routeLines,
    "",
    "ФИНАЛЬНЫЙ ЧЕК-ЛИСТ",
    ...checkLines,
    "",
    "ОТКРЫТЫЕ ВОПРОСЫ",
    state.questions || "Нет"
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "итог-адаптации.txt";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Итоговый файл подготовлен");
}

function bindEvents() {
  $$(".nav-link").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    switchView(link.dataset.section);
  }));

  $$("[data-go]").forEach(button => button.addEventListener("click", () => switchView(button.dataset.go)));
  $("#menuButton").addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $("#editProfileButton").addEventListener("click", openProfile);
  $("#profilePencil").addEventListener("click", openProfile);

  $("#dayTabs").addEventListener("click", event => {
    const button = event.target.closest("[data-day]");
    if (!button) return;
    activeDay = button.dataset.day;
    renderDayTabs();
    renderRoute();
  });

  $("#routeList").addEventListener("change", event => {
    if (!event.target.matches("[data-route-task]")) return;
    state.routeDone[event.target.dataset.routeTask] = event.target.checked;
    saveState();
    renderRoute();
    renderChecklist();
    updateProgress();
  });

  $("#checklistItems").addEventListener("change", event => {
    if (!event.target.matches("[data-check-item]")) return;
    state.checklistDone[event.target.dataset.checkItem] = event.target.checked;
    saveState();
    renderChecklist();
    updateProgress();
  });

  $("#saveProfileButton").addEventListener("click", event => {
    event.preventDefault();
    const data = new FormData($("#profileForm"));
    state.profile = Object.fromEntries(data.entries());
    saveState();
    renderProfile();
    $("#profileModal").close();
    showToast("Профиль сохранён");
  });

  $("#peopleGrid").addEventListener("click", event => {
    const button = event.target.closest("[data-edit-contact]");
    if (!button) return;
    const id = button.dataset.editContact;
    const person = people.find(item => item[0] === id);
    const saved = state.contacts[id] || {};
    const form = $("#contactForm");
    form.elements.contactId.value = id;
    form.elements.name.value = saved.name || "";
    form.elements.contact.value = saved.contact || "";
    $("#contactModalTitle").textContent = person[2];
    $("#contactModal").showModal();
  });

  $("#saveContactButton").addEventListener("click", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData($("#contactForm")).entries());
    state.contacts[data.contactId] = { name: data.name, contact: data.contact };
    saveState();
    renderPeople();
    $("#contactModal").close();
    showToast("Контакт сохранён");
  });

  let saveTimer;
  $("#questionsInput").addEventListener("input", event => {
    state.questions = event.target.value;
    $("#saveStatus").textContent = "Сохраняем…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveState();
      $("#saveStatus").textContent = "Сохранено локально";
    }, 350);
  });

  $("#exportButton").addEventListener("click", exportSummary);
  $("#resetButton").addEventListener("click", () => {
    if (!confirm("Удалить профиль, контакты, заметки и весь прогресс?")) return;
    state = structuredClone(defaultState);
    saveState();
    renderAll();
    showToast("Прогресс сброшен");
  });
}

function renderAll() {
  renderProfile();
  renderDayTabs();
  renderRoute();
  renderPeople();
  renderTools();
  renderCulture();
  renderChecklist();
  $("#questionsInput").value = state.questions;
  updateProgress();
}

function init() {
  $("#todayLabel").textContent = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());

  bindEvents();
  renderAll();
  const initialView = location.hash.slice(1);
  const availableViews = new Set($$(".view").map(view => view.id));
  if (availableViews.has(initialView)) switchView(initialView);
}

init();
