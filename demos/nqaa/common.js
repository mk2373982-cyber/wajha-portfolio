// تفاعلات مشتركة بين الصفحات، مثل القائمة وإغلاق النوافذ.

const menu = document.querySelector(".menu-button"),
  nav = document.querySelector(".nav-links");
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "أغلق القائمة" : "افتح القائمة");
  nav.classList.toggle("open", open);
});
nav?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
    menu?.setAttribute("aria-label", "افتح القائمة");
  }),
);
document
  .querySelectorAll("[data-close]")
  .forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
