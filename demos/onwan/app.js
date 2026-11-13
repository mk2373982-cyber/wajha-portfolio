// بيانات العقارات التجريبية وفلاتر البحث ونافذة التفاصيل.

// بيانات توضيحية للعقارات؛ لا تمثل وحدات متاحة للبيع.
const properties = [
  {
    id: "villa",
    title: "فيلا بحديقة مستقلة",
    city: "cairo",
    cityName: "القاهرة الجديدة",
    type: "villa",
    typeName: "فيلا",
    purpose: "sale",
    price: 8500000,
    area: 320,
    beds: 4,
    baths: 3,
    image: "hero.jpg",
    description:
      "تصوّر لوحدة بحديقة ومساحات مفتوحة، مع بيانات افتراضية لعرض تجربة المقارنة. لا تمثل عقارًا متاحًا للبيع.",
  },
  {
    id: "apartment",
    title: "شقة بإطلالة مفتوحة",
    city: "zayed",
    cityName: "الشيخ زايد",
    type: "apartment",
    typeName: "شقة",
    purpose: "sale",
    price: 4250000,
    area: 165,
    beds: 3,
    baths: 2,
    image: "apartment.jpg",
    description:
      "تصوّر لشقة بتوزيع معيشة مفتوح. الصورة مولّدة والبيانات للتجربة، دون عنوان أو توافر فعلي.",
  },
  {
    id: "duplex",
    title: "دوبلكس بمساحة رحبة",
    city: "maadi",
    cityName: "المعادي",
    type: "duplex",
    typeName: "دوبلكس",
    purpose: "sale",
    price: 6750000,
    area: 240,
    beds: 4,
    baths: 3,
    image: "duplex.jpg",
    description: "نموذج عرض لبيانات دوبلكس، بصورة داخلية توضيحية. لا يمثل إعلان بيع حقيقي.",
  },
  {
    id: "rent",
    title: "شقة للمعيشة اليومية",
    city: "cairo",
    cityName: "القاهرة الجديدة",
    type: "apartment",
    typeName: "شقة",
    purpose: "rent",
    price: 22000,
    area: 140,
    beds: 2,
    baths: 2,
    image: "apartment.jpg",
    description:
      "مثال لعرض وحدة إيجار بسعر شهري توضيحي. ليست وحدة متاحة ولا يُبرم أي حجز من النموذج.",
  },
];
const search = document.querySelector("#searchForm"),
  sort = document.querySelector("#sort"),
  grid = document.querySelector("#propertyGrid"),
  dialog = document.querySelector("#propertyDialog"),
  viewing = document.querySelector("#viewingForm");
let activeProperty = null,
  filters = { purpose: "all", city: "all", type: "all" };
const money = (p) =>
  p.price.toLocaleString("ar-EG") + " ج.م" + (p.purpose === "rent" ? " / شهر" : "");
function node(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
function specs(p) {
  return [
    p.area.toLocaleString("ar-EG") + " م²",
    p.beds.toLocaleString("ar-EG") + " غرف",
    p.baths.toLocaleString("ar-EG") + " حمّامات",
  ];
}
// عرض تفاصيل العقار المختار داخل النافذة.
function showProperty(p) {
  activeProperty = p;
  document.querySelector("#propertyTitle").textContent = p.title;
  const image = document.querySelector("#propertyImage");
  image.src = "./assets/" + p.image;
  image.alt = "تصوّر مولّد لوحدة افتراضية: " + p.title;
  document.querySelector("#propertyPrice").textContent = money(p) + " — سعر توضيحي";
  document
    .querySelector("#propertySpecs")
    .replaceChildren(...[p.cityName, p.typeName, ...specs(p)].map((s) => node("span", "", s)));
  document.querySelector("#propertyDescription").textContent = p.description;
  viewing.reset();
  viewing.querySelector(".result").textContent = "";
  dialog.showModal();
}
// إعادة عرض العناصر وفق البيانات والفلاتر الحالية.
function render() {
  let items = properties.filter((p) =>
    Object.entries(filters).every(([key, value]) => value === "all" || p[key] === value),
  );
  if (sort.value === "priceAsc") items.sort((a, b) => a.price - b.price);
  if (sort.value === "priceDesc") items.sort((a, b) => b.price - a.price);
  if (sort.value === "areaDesc") items.sort((a, b) => b.area - a.area);
  grid.replaceChildren(
    ...items.map((p) => {
      const article = node("article", "property-card"),
        photo = node("div", "property-photo"),
        image = node("img");
      image.src = "./assets/" + p.image;
      image.alt = "تصوّر مولّد: " + p.title;
      image.loading = "lazy";
      photo.append(
        image,
        node("span", "property-tag", p.purpose === "sale" ? "للبيع · توضيحي" : "للإيجار · توضيحي"),
      );
      const body = node("div", "property-content"),
        price = node("div", "property-price", money(p));
      price.append(node("small", "", "سعر توضيحي، ليس عرضًا فعليًا"));
      body.append(
        node("p", "property-place", p.cityName + " / " + p.typeName),
        node("h3", "", p.title),
        price,
      );
      const attributes = node("div", "property-specs");
      attributes.append(...specs(p).map((s) => node("span", "", s)));
      const detail = node("button", "", "استكشف الوحدة");
      detail.type = "button";
      detail.setAttribute("aria-label", "تفاصيل " + p.title);
      detail.append(node("span", "", "↗"));
      detail.onclick = () => showProperty(p);
      body.append(attributes, detail);
      article.append(photo, body);
      return article;
    }),
  );
  document.querySelector("#resultsCount").textContent =
    items.length === 1
      ? "وحدة توضيحية واحدة"
      : items.length.toLocaleString("ar-EG") + " وحدات توضيحية";
  document.querySelector("#emptyResults").hidden = items.length > 0;
}
search.onsubmit = (e) => {
  e.preventDefault();
  filters = Object.fromEntries(new FormData(search));
  render();
  location.hash = "properties";
};
sort.onchange = render;
document.querySelector("#resetFilters").onclick = () => {
  search.reset();
  sort.value = "default";
  filters = { purpose: "all", city: "all", type: "all" };
  render();
};
const now = new Date();
const today = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
].join("-");
viewing.elements.date.min = today;
viewing.onsubmit = (e) => {
  e.preventDefault();
  if (!activeProperty) return;
  const date = viewing.elements.date.value,
    result = viewing.querySelector(".result");
  if (!date || date < today) {
    result.textContent = "اختار تاريخًا من النهارده أو بعده.";
    return;
  }
  result.textContent = [
    "ملخص معاينة تجريبي — لا يوجد حجز فعلي",
    "الوحدة: " + activeProperty.title,
    "المنطقة: " + activeProperty.cityName,
    "الموعد المفضل: " + date + " " + viewing.elements.time.value,
    "لم يتم إرسال أو تخزين الطلب.",
  ].join("\n");
};
render();
