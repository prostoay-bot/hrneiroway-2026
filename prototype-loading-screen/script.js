const startIntro = () => {
  document.body.classList.add("is-started");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startIntro, { once: true });
} else {
  startIntro();
}
