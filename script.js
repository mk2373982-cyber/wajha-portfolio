// تفاعلات الواجهة: القائمة والصور والفلاتر ونماذج الطلب.

const navToggle = document.querySelector(".menu-toggle"),
  mobileNav = document.querySelector("#mobile-nav");
navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "أغلق القائمة" : "افتح القائمة");
  mobileNav.hidden = !open;
});
mobileNav?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileNav.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "افتح القائمة");
  }),
);
document.querySelector("[data-top]")?.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
});
document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    document
      .querySelector(".m-gallery")
      .classList.toggle("filtered", button.dataset.filter !== "all");
    let count = 0;
    document.querySelectorAll("[data-category]").forEach((item) => {
      item.hidden =
        button.dataset.filter !== "all" && item.dataset.category !== button.dataset.filter;
      if (!item.hidden) count++;
    });
    document.querySelector("#filterResult").textContent =
      count === 2
        ? "تصوّران معماريان — صور مولّدة للتوضيح"
        : "تصوّر معماري واحد — صورة مولّدة للتوضيح";
  }),
);
const imageDialog = document.querySelector("#imageDialog");
document.querySelectorAll("[data-lightbox]").forEach((button) =>
  button.addEventListener("click", () => {
    document.querySelector("#lightboxImage").src = button.dataset.lightbox;
    document.querySelector("#lightboxImage").alt = button.dataset.title;
    document.querySelector("#lightboxTitle").textContent = button.dataset.title;
    imageDialog.showModal();
  }),
);
document.querySelector(".close-lightbox")?.addEventListener("click", () => imageDialog.close());
imageDialog?.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});
document.querySelectorAll(".request-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form),
      output = form.querySelector(".form-result");
    if (form.dataset.kind === "website") {
      const name = String(data.get("name")).trim(),
        field = String(data.get("field")).trim(),
        details = String(data.get("details")).trim();
      if (!name || !field || !details) {
        output.textContent = "اكتب بيانات الطلب بدون ترك الحقول فارغة.";
        return;
      }
      const text = [
        "أهلًا، حابب نتكلم عن تصميم موقع لنشاطي.",
        "الاسم أو النشاط: " + name,
        "المجال: " + field,
        "المطلوب: " + details,
      ].join("\n");
      const link = document.createElement("a");
      link.href = "https://wa.me/201555205993?text=" + encodeURIComponent(text);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
      output.textContent =
        "رسالتك جاهزة. راجعها وأرسلها بنفسك داخل واتساب. لو لم تفتح المحادثة، استخدم رابط واتساب المباشر.";
    } else {
      const details = String(data.get("details")).trim();
      if (!details) {
        output.textContent = "اكتب وصفًا مختصرًا للمشروع.";
        return;
      }
      const text = [
        "ملخص تجريبي — لم يُرسل لأي جهة",
        "نوع المساحة: " + data.get("space"),
        data.get("area") ? "المساحة التقريبية: " + data.get("area") + " م²" : "",
        data.get("city") ? "المدينة: " + String(data.get("city")).trim() : "",
        "الفكرة: " + details,
      ]
        .filter(Boolean)
        .join("\n");
      output.textContent = text;
      const copy = form.querySelector(".copy-brief");
      copy.hidden = false;
      copy.textContent = "انسخ الملخص";
      copy.onclick = async () => {
        try {
          await navigator.clipboard.writeText(text);
          copy.textContent = "تم نسخ الملخص";
        } catch {
          copy.textContent = "انسخ النص بالضغط المطوّل على الملخص";
        }
      };
    }
  });
});
