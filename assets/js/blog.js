(() => {
  "use strict";
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-nav");
  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.addEventListener("click", event => {if (event.target.closest("a")) closeMenu();});
  document.addEventListener("click", event => {if (!event.target.closest(".site-header")) closeMenu();});
  document.addEventListener("keydown", event => {if (event.key === "Escape") closeMenu();});
  document.getElementById("copyright-year").textContent = new Date().getFullYear();
})();
