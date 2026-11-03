(() => {
  "use strict";
  const headings = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")];
  const originalSizes = new WeakMap();
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;

  headings.forEach((heading) => originalSizes.set(heading, heading.style.fontSize));
  const fit = (heading) => {
    const original = originalSizes.get(heading);
    heading.style.fontSize = original;
    const style = getComputedStyle(heading);
    const available = heading.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    if (available <= 0) return;
    const fontSize = parseFloat(style.fontSize);
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const spacing = parseFloat(style.letterSpacing) || 0;
    // Keep NBSP groups intact, including a short preposition and its following word.
    const words = (heading.innerText || heading.textContent).trim().split(/[ \t\r\n]+/).filter(Boolean);
    const longest = Math.max(0, ...words.map((word) => context.measureText(word).width + Math.max(0, word.length - 1) * spacing));
    if (longest > available) {
      heading.style.fontSize = `${Math.floor(fontSize * available / longest * 0.98 * 10) / 10}px`;
    }
  };
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      headings.forEach(fit);
    });
  };
  schedule();
  if (document.fonts) document.fonts.ready.then(schedule);
  window.addEventListener("resize", schedule, { passive: true });
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(schedule);
    headings.forEach((heading) => observer.observe(heading));
  }
  // Dialog headings and tab headings may start with no measurable width.
  document.addEventListener("click", schedule, { passive: true });
})();
