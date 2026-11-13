// نموذج موعد توضيحي لعيادة الأسنان؛ يعرض الملخص دون إرسال حجز.

const form = document.querySelector("#appointmentForm"),
  dateInput = form.elements.date;
const today = new Date();
dateInput.min = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");
document.querySelectorAll("[data-service]").forEach((button) =>
  button.addEventListener("click", () => {
    form.elements.service.value = button.dataset.service;
    location.hash = "appointment";
  }),
);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements.name.value.trim(),
    date = dateInput.value,
    result = form.querySelector(".result");
  if (!name) {
    result.textContent = "اكتب اسمًا تجريبيًا.";
    return;
  }
  if (!date || date < dateInput.min) {
    result.textContent = "اختار تاريخًا من النهارده أو بعده.";
    return;
  }
  result.textContent = [
    "ملخص توضيحي — ليس حجزًا فعليًا",
    "الاسم التجريبي: " + name,
    "الخدمة: " + form.elements.service.value,
    "التاريخ المفضل: " + date,
    "الفترة: " + form.elements.time.value,
    "لم يتم إرسال أو تخزين الطلب.",
  ].join("\n");
});
