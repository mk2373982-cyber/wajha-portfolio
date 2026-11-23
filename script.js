// تفاعلات الواجهة: القائمة، الستارة الافتتاحية، الخلفية السائلة، بطاقة 3D، الكروت المتكدسة، المؤشر المخصص، الأزرار المغناطيسية، ونماذج الطلب.

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointerQuery = window.matchMedia("(pointer: fine) and (hover: hover)");
const isReducedMotion = () => reducedMotionQuery.matches;
const hasFinePointer = () => finePointerQuery.matches;

/* --------------------------------------------------------------------------
   1. التفاعلات الأساسية المشتركة (القائمة، الصعود للأعلى، الفلاتر، التكبير، النماذج)
   -------------------------------------------------------------------------- */
const navToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "أغلق القائمة" : "افتح القائمة");
  if (mobileNav) mobileNav.hidden = !open;
});

mobileNav?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileNav.hidden = true;
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "افتح القائمة");
  }),
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileNav && !mobileNav.hidden) {
    mobileNav.hidden = true;
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "افتح القائمة");
    navToggle?.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!mobileNav || mobileNav.hidden) return;
  const target = event.target instanceof Node ? event.target : null;
  if (target && !mobileNav.contains(target) && !navToggle?.contains(target)) {
    mobileNav.hidden = true;
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "افتح القائمة");
  }
});

document.querySelector("[data-top]")?.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: isReducedMotion() ? "instant" : "smooth",
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
      ?.classList.toggle("filtered", button.dataset.filter !== "all");
    let count = 0;
    document.querySelectorAll("[data-category]").forEach((item) => {
      item.hidden =
        button.dataset.filter !== "all" && item.dataset.category !== button.dataset.filter;
      if (!item.hidden) count++;
    });
    const filterResult = document.querySelector("#filterResult");
    if (filterResult) {
      filterResult.textContent =
        count === 2
          ? "تصوّران معماريان — صور مولّدة للتوضيح"
          : "تصوّر معماري واحد — صورة مولّدة للتوضيح";
    }
  }),
);

const imageDialog = document.querySelector("#imageDialog");
document.querySelectorAll("[data-lightbox]").forEach((button) =>
  button.addEventListener("click", () => {
    const img = document.querySelector("#lightboxImage");
    const title = document.querySelector("#lightboxTitle");
    if (img) {
      img.src = button.dataset.lightbox || "";
      img.alt = button.dataset.title || "";
    }
    if (title) title.textContent = button.dataset.title || "";
    imageDialog?.showModal();
  }),
);

document.querySelector(".close-lightbox")?.addEventListener("click", () => imageDialog?.close());
imageDialog?.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});

document.querySelectorAll(".request-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const output = form.querySelector(".form-result");
    if (form.dataset.kind === "website") {
      const name = String(data.get("name") || "").trim();
      const field = String(data.get("field") || "").trim();
      const details = String(data.get("details") || "").trim();
      if (!name || !field || !details) {
        if (output) output.textContent = "اكتب بيانات الطلب بدون ترك الحقول فارغة.";
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
      if (output) {
        output.textContent =
          "رسالتك جاهزة. راجعها وأرسلها بنفسك داخل واتساب. لو لم تفتح المحادثة، استخدم رابط واتساب المباشر.";
      }
    } else {
      const details = String(data.get("details") || "").trim();
      if (!details) {
        if (output) output.textContent = "اكتب وصفًا مختصرًا للمشروع.";
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
      if (output) output.textContent = text;
      const copy = form.querySelector(".copy-brief");
      if (copy) {
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
    }
  });
});

/* --------------------------------------------------------------------------
   2. الستارة الافتتاحية السينمائية (Cinematic Curtain Preloader — 1.1s)
   -------------------------------------------------------------------------- */
function initCurtainPreloader() {
  const preloader = document.getElementById("curtain-preloader");
  const countEl = document.getElementById("curtain-count");
  const barEl = document.getElementById("curtain-bar");

  if (!preloader) {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    return;
  }

  if (isReducedMotion()) {
    preloader.classList.add("is-done");
    preloader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    return;
  }

  const duration = 1100;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - rawProgress, 3);
    const value = Math.min(100, Math.round(eased * 100));

    if (countEl) {
      countEl.textContent = String(value).padStart(2, "0");
    }
    if (barEl) {
      barEl.style.transform = `scaleX(${eased.toFixed(4)})`;
    }

    if (rawProgress < 1) {
      requestAnimationFrame(tick);
    } else {
      window.setTimeout(() => {
        preloader.classList.add("is-lifting");
        preloader.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-loading");
        window.setTimeout(() => {
          document.body.classList.add("is-ready");
        }, 180);
        window.setTimeout(() => {
          preloader.classList.add("is-done");
        }, 1050);
      }, 90);
    }
  };

  requestAnimationFrame(tick);
}

/* --------------------------------------------------------------------------
   3. الخلفية التفاعلية الحية (Interactive Fluid Canvas — Ambient Orbs + Lerp)
   -------------------------------------------------------------------------- */
function initFluidCanvas() {
  const canvas = document.getElementById("fluid-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const scale = 0.45; // خفيف وسلس ويعطي تدرجات ضوئية مخملية

  const mouse = {
    x: 0.5,
    y: 0.4,
    tx: 0.5,
    ty: 0.4,
  };

  const orbs = [
    {
      baseX: 0.24,
      baseY: 0.28,
      radiusRatio: 0.52,
      color: "rgba(59, 130, 246, 0.22)",
      speedX: 0.00022,
      speedY: 0.00018,
      ampX: 0.12,
      ampY: 0.1,
      follow: 0.32,
      phase: 0.4,
    },
    {
      baseX: 0.78,
      baseY: 0.22,
      radiusRatio: 0.48,
      color: "rgba(6, 182, 212, 0.17)",
      speedX: 0.00017,
      speedY: 0.00024,
      ampX: 0.14,
      ampY: 0.11,
      follow: 0.22,
      phase: 2.1,
    },
    {
      baseX: 0.52,
      baseY: 0.76,
      radiusRatio: 0.56,
      color: "rgba(37, 99, 235, 0.14)",
      speedX: 0.00014,
      speedY: 0.00019,
      ampX: 0.16,
      ampY: 0.09,
      follow: 0.14,
      phase: 4.3,
    },
    {
      baseX: 0.5,
      baseY: 0.45,
      radiusRatio: 0.36,
      color: "rgba(6, 182, 212, 0.16)",
      speedX: 0.00011,
      speedY: 0.00013,
      ampX: 0.04,
      ampY: 0.04,
      follow: 0.75,
      phase: 1.2,
    },
  ];

  let lastW = 0;
  let lastH = 0;
  const resize = (force = false) => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    // تجنّب إعادة تهيئة الكانفس عند اختفاء/ظهور شريط العنوان في متصفحات الهاتف
    if (!force && winW === lastW && Math.abs(winH - lastH) < 120) return;
    lastW = winW;
    lastH = winH;
    width = Math.max(1, Math.floor(winW * scale));
    height = Math.max(1, Math.floor(winH * scale));
    canvas.width = width;
    canvas.height = height;
  };

  resize(true);
  window.addEventListener("resize", () => resize(false), { passive: true });

  if (hasFinePointer()) {
    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse") return;
        mouse.tx = event.clientX / Math.max(window.innerWidth, 1);
        mouse.ty = event.clientY / Math.max(window.innerHeight, 1);
      },
      { passive: true },
    );
  }

  const drawFrame = (time) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#030508";
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "screen";
    const maxDim = Math.max(width, height);

    mouse.x += (mouse.tx - mouse.x) * 0.055;
    mouse.y += (mouse.ty - mouse.y) * 0.055;

    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      const driftX = Math.sin(time * orb.speedX + orb.phase) * orb.ampX;
      const driftY = Math.cos(time * orb.speedY + orb.phase) * orb.ampY;
      const offsetX = hasFinePointer() ? (mouse.x - 0.5) * orb.follow : 0;
      const offsetY = hasFinePointer() ? (mouse.y - 0.5) * orb.follow : 0;

      const cx = (orb.baseX + driftX + offsetX) * width;
      const cy = (orb.baseY + driftY + offsetY) * height;
      const r = maxDim * orb.radiusRatio;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, orb.color);
      grad.addColorStop(0.5, orb.color.replace(/[\d.]+\)$/, "0.05)"));
      grad.addColorStop(1, "rgba(3, 5, 8, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  if (isReducedMotion()) {
    drawFrame(0);
    return;
  }

  let rafId = 0;
  const loop = (time) => {
    if (!document.hidden) {
      drawFrame(time);
    }
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!document.hidden && !rafId) {
      rafId = requestAnimationFrame(loop);
    }
  });
}

/* --------------------------------------------------------------------------
   4. بطاقة العرض التفاعلية ثلاثية الأبعاد (3D Perspective Tilt — ديسكتوب)
   -------------------------------------------------------------------------- */
function initHero3DTilt() {
  const stage = document.querySelector("[data-tilt]");
  if (!stage || !hasFinePointer() || isReducedMotion()) return;

  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let animating = false;
  const maxAngle = 9;

  const update = () => {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    stage.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;

    if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
      requestAnimationFrame(update);
    } else {
      animating = false;
    }
  };

  const trigger = () => {
    if (!animating) {
      animating = true;
      requestAnimationFrame(update);
    }
  };

  stage.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = stage.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    targetY = (px - 0.5) * 2 * maxAngle;
    targetX = (0.5 - py) * 2 * maxAngle;

    stage.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
    stage.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
    stage.classList.add("is-tilting");
    trigger();
  });

  stage.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    stage.classList.remove("is-tilting");
    trigger();
  });
}

/* --------------------------------------------------------------------------
   5. تفاعل الكروت المتكدسة (Sticky Stacking Deck Depth Attenuation)
   -------------------------------------------------------------------------- */
function initStackingDeck() {
  const cards = Array.from(document.querySelectorAll("[data-stack-card]"));
  if (!cards.length) return;

  // جعل كامل بطاقة المشروع قابلة للنقر بما يتطابق مع مؤشر "جرّب الموقع ↗"
  cards.forEach((card) => {
    const inner = card.querySelector(".stack-card-inner");
    const primaryLink = card.querySelector(".stack-action");
    if (!inner || !primaryLink) return;
    inner.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a, button")) return;
      primaryLink.click();
    });
  });

  if (cards.length < 2 || isReducedMotion()) return;

  let ticking = false;

  const updateStack = () => {
    ticking = false;
    const vh = window.innerHeight || 800;

    for (let i = 0; i < cards.length - 1; i++) {
      const currentCard = cards[i];
      const nextCard = cards[i + 1];
      const inner = currentCard.querySelector(".stack-card-inner");
      const scrim = currentCard.querySelector(".stack-card-scrim");
      if (!inner) continue;

      const currentRect = currentCard.getBoundingClientRect();
      const nextRect = nextCard.getBoundingClientRect();

      // حساب مدى اقتراب وتراكب البطاقة التالية فوق البطاقة المثبّتة دون تعتيم مبكر على الهاتف
      const startDistance = Math.max(180, Math.min(vh * 0.58, currentRect.height * 0.88));
      const distance = nextRect.top - currentRect.top;
      const raw = 1 - Math.min(Math.max(distance / startDistance, 0), 1);

      const scale = 1 - raw * 0.055;
      const translateY = raw * -8;
      inner.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;

      if (scrim) {
        scrim.style.opacity = (raw * 0.38).toFixed(3);
      }
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateStack);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateStack();
}

/* --------------------------------------------------------------------------
   6. المؤشر المخصص (Custom Cursor — للديسكتوب فقط)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  if (!cursor || !hasFinePointer() || isReducedMotion()) return;

  const ring = cursor.querySelector(".cursor-ring");
  const dot = cursor.querySelector(".cursor-dot");
  if (!ring || !dot) return;

  document.body.classList.add("has-custom-cursor");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;
  let visible = false;

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!visible) {
        visible = true;
        ringX = mouseX;
        ringY = mouseY;
        dotX = mouseX;
        dotY = mouseY;
        document.body.classList.add("cursor-visible");
      }

      const target = event.target instanceof Element ? event.target : null;
      const isProject = Boolean(target?.closest('[data-cursor="project"]'));
      const isInteractive = !isProject && Boolean(target?.closest("a, button, summary"));

      cursor.classList.toggle("is-project", isProject);
      cursor.classList.toggle("is-interactive", isInteractive);
    },
    { passive: true },
  );

  document.addEventListener("mouseleave", () => {
    visible = false;
    document.body.classList.remove("cursor-visible");
  });

  const render = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    dotX += (mouseX - dotX) * 0.45;
    dotY += (mouseY - dotY) * 0.45;

    ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
    dot.style.transform = `translate3d(${dotX.toFixed(1)}px, ${dotY.toFixed(1)}px, 0)`;

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

/* --------------------------------------------------------------------------
   7. الأزرار المغناطيسية (Magnetic Buttons — للديسكتوب فقط)
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  if (!hasFinePointer() || isReducedMotion()) return;
  const buttons = document.querySelectorAll("[data-magnetic]");

  buttons.forEach((btn) => {
    const strength = 0.24;
    const maxPull = 10;

    btn.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = btn.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (event.clientY - (rect.top + rect.height / 2)) * strength;
      const clampedX = Math.max(-maxPull, Math.min(maxPull, dx));
      const clampedY = Math.max(-maxPull, Math.min(maxPull, dy));
      btn.style.transition = "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)";
      btn.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0)`;
    });

    btn.addEventListener("pointerleave", () => {
      btn.style.transition = "transform 0.48s cubic-bezier(0.16, 1, 0.3, 1)";
      btn.style.transform = "translate3d(0, 0, 0)";
    });
  });
}

/* --------------------------------------------------------------------------
   8. ظهور العناصر بسلاسة أثناء التمرير (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const nodes = document.querySelectorAll(".reveal-on-scroll");
  if (!nodes.length) return;

  if (isReducedMotion() || !("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  nodes.forEach((el) => observer.observe(el));
}

/* تشغيل كافة الطبقات التفاعلية لصفحة البورتفوليو */
if (document.body.classList.contains("portfolio")) {
  initCurtainPreloader();
  initFluidCanvas();
  initHero3DTilt();
  initStackingDeck();
  initCustomCursor();
  initMagneticButtons();
  initScrollReveals();
}
