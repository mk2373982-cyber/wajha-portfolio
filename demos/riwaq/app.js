// قائمة المطعم والبحث وسلة طلب توضيحية دون إرسال طلب فعلي.

// بيانات قائمة الطعام التجريبية.
const dishes = [
  {
    id: "chicken",
    name: "دجاج مشوي وأرز فريك",
    description: "طبق توضيحي من الدجاج المشوي مع الأرز والخضار.",
    price: 245,
    category: "main",
  },
  {
    id: "kofta",
    name: "كفتة مشوية",
    description: "اختيار من المشويات مع أرز وسلطة جانبية.",
    price: 280,
    category: "main",
  },
  {
    id: "vegetables",
    name: "خضار موسمي بالفرن",
    description: "تشكيلة خضار مشوي مع أرز متبّل.",
    price: 175,
    category: "main",
  },
  {
    id: "hummus",
    name: "حمّص وزيت زيتون",
    description: "مقبلات توضيحية تُقدّم مع خبز.",
    price: 65,
    category: "starter",
  },
  {
    id: "salad",
    name: "سلطة رِواق",
    description: "خضار طازج وتتبيلة مستوحاة من المطبخ المتوسطي.",
    price: 85,
    category: "starter",
  },
  {
    id: "lemon",
    name: "ليمون بالنعناع",
    description: "مشروب ليمون ونعناع بارد.",
    price: 55,
    category: "drink",
  },
];
let category = "all",
  cart = new Map(),
  toastTimer;
const list = document.querySelector("#menuItems"),
  dialog = document.querySelector("#cartDialog"),
  money = (n) => n.toLocaleString("ar-EG") + " ج.م";
function node(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
function notify(text) {
  const toast = document.querySelector("#toast");
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.hidden = true), 2500);
}
// عرض أطباق القائمة وفق البحث والتصنيف المحددين.
function renderMenu() {
  const query = document.querySelector("#menuSearch").value.trim();
  const visible = dishes.filter(
    (d) =>
      (category === "all" || d.category === category) &&
      (d.name + " " + d.description).includes(query),
  );
  list.replaceChildren(
    ...visible.map((d) => {
      const item = node("article", "menu-item"),
        copy = node("div");
      copy.append(
        node("h3", "", d.name),
        node("p", "", d.description),
        node("span", "menu-price", money(d.price)),
      );
      const add = node("button", "", "+");
      add.type = "button";
      add.setAttribute("aria-label", "أضف " + d.name);
      add.onclick = () => {
        const qty = cart.get(d.id) || 0;
        if (qty >= 20) {
          notify("الحد التجريبي ٢٠ من كل صنف.");
          return;
        }
        cart.set(d.id, qty + 1);
        renderCart();
        notify("تمت إضافة " + d.name + " للطلب التجريبي");
      };
      item.append(copy, add);
      return item;
    }),
  );
  document.querySelector("#menuStatus").textContent = visible.length
    ? visible.length === 1
      ? "صنف توضيحي واحد"
      : visible.length.toLocaleString("ar-EG") + " أصناف توضيحية"
    : "مفيش أصناف مطابقة. جرّب بحثًا أو تصنيفًا آخر.";
}
// تحديث محتوى الطلب التجريبي والكميات والإجمالي.
function renderCart() {
  let total = 0,
    count = 0;
  const lines = [];
  for (const [id, qty] of cart) {
    const d = dishes.find((d) => d.id === id);
    total += d.price * qty;
    count += qty;
    const row = node("div", "cart-line"),
      copy = node("div");
    copy.append(node("h3", "", d.name), node("p", "", money(d.price * qty)));
    const controls = node("div", "cart-quantity"),
      minus = node("button", "", "−"),
      plus = node("button", "", "+");
    minus.type = plus.type = "button";
    minus.setAttribute("aria-label", "قلل " + d.name);
    plus.setAttribute("aria-label", "زود " + d.name);
    minus.onclick = () => {
      qty === 1 ? cart.delete(id) : cart.set(id, qty - 1);
      renderCart();
    };
    plus.onclick = () => {
      if (qty >= 20) return;
      cart.set(id, qty + 1);
      renderCart();
    };
    controls.append(minus, node("span", "", qty.toLocaleString("ar-EG")), plus);
    row.append(copy, controls);
    lines.push(row);
  }
  document.querySelector("#cartItems").replaceChildren(...lines);
  if (!count)
    document
      .querySelector("#cartItems")
      .append(node("p", "subtle", "طلبك التجريبي فاضي. أضف أصنافًا من القائمة."));
  document
    .querySelectorAll(".cart-count")
    .forEach((n) => (n.textContent = count.toLocaleString("ar-EG")));
  document.querySelector("#cartTotal").textContent = document.querySelector(
    "#dialogTotal",
  ).textContent = money(total);
  document.querySelector("#copyOrder").disabled = count === 0;
  document.querySelector("#copyResult").textContent = "";
}
document.querySelectorAll("[data-category]").forEach(
  (b) =>
    (b.onclick = () => {
      category = b.dataset.category;
      document.querySelectorAll("[data-category]").forEach((t) => {
        t.classList.toggle("active", t === b);
        t.setAttribute("aria-pressed", String(t === b));
      });
      renderMenu();
    }),
);
document.querySelector("#menuSearch").oninput = renderMenu;
document.querySelectorAll(".cart-toggle").forEach((b) => (b.onclick = () => dialog.showModal()));
document.querySelector("#copyOrder").onclick = async () => {
  const text = [
    "طلب تجريبي — لا يُرسل لمطعم",
    ...[...cart].map(([id, qty]) => {
      const d = dishes.find((d) => d.id === id);
      return d.name + " × " + qty + " = " + money(d.price * qty);
    }),
    "الإجمالي التوضيحي: " + document.querySelector("#dialogTotal").textContent,
  ].join("\n");
  try {
    await navigator.clipboard.writeText(text);
    document.querySelector("#copyResult").textContent = "تم نسخ الملخص. لم يُرسل أي طلب.";
  } catch {
    document.querySelector("#copyResult").textContent = text;
  }
};
renderMenu();
renderCart();
