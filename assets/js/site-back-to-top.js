(() => {
  "use strict";

  if (document.querySelector(".site-back-to-top")) return;

  const button = document.createElement("button");
  button.className = "site-back-to-top";
  button.type = "button";
  button.hidden = true;
  button.setAttribute("aria-label", "Вернуться к началу страницы");
  button.innerHTML = '<span class="site-back-to-top__arrow" aria-hidden="true">↑</span><span>Наверх</span>';
  document.body.append(button);

  const threshold = 420;
  let scheduled = false;
  const updateVisibility = () => {
    scheduled = false;
    const visible = window.scrollY > threshold;
    button.hidden = !visible;
    button.classList.toggle("is-visible", visible);
  };
  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateVisibility);
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("pageshow", scheduleUpdate);
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  button.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
  updateVisibility();
})();
