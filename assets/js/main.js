/* madebyanu – Interaktionen (ohne externe Bibliotheken) */
(() => {
  "use strict";

  /* ------------------------------------------------------------------
     EINSTELLUNGEN
     FORM_ENDPOINT: Trage hier die URL eines Formular-Dienstes ein
     (z. B. Formspree: "https://formspree.io/f/xxxxabcd" oder dein eigenes
     PHP-Skript). Bleibt sie leer, wird die Anfrage nach dem Absenden
     fertig formuliert per WhatsApp oder E-Mail an dich übergeben.
     ------------------------------------------------------------------ */
  const FORM_ENDPOINT = "";
  const WHATSAPP_NUMBER = "4917661478638";       // 0176 61478638 im internationalen Format
  const CONTACT_EMAIL = "hallo@madebyanu.de";     // PLATZHALTER – bitte anpassen

  /* ---------- Header beim Scrollen ---------- */
  const header = document.querySelector(".site-header");
  const waFloat = document.querySelector(".wa-float");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 20);
    waFloat && waFloat.classList.toggle("is-visible", y > window.innerHeight * 0.6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WA = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  /* ---------- Hero-Reels (mit Pause-Knopf, WCAG 2.2.2) ---------- */
  const heroVideos = [...document.querySelectorAll(".hv")];
  const vBtn = document.querySelector(".video-toggle");
  if (heroVideos.length && vBtn) {
    let userPaused = reduceMotion;
    const apply = () => {
      heroVideos.forEach((v) => (userPaused ? v.pause() : v.play().catch(() => {})));
      vBtn.setAttribute("aria-pressed", String(userPaused));
      vBtn.setAttribute("aria-label", userPaused ? "Videos abspielen" : "Videos pausieren");
    };
    if (reduceMotion) heroVideos.forEach((v) => v.removeAttribute("autoplay"));
    apply();
    vBtn.addEventListener("click", () => { userPaused = !userPaused; apply(); });
  }

  /* ---------- Reels: erst laden & abspielen, wenn sichtbar ---------- */
  const lazyVideos = [...document.querySelectorAll(".lazy-video")];
  if ("IntersectionObserver" in window && !reduceMotion) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          const s = v.querySelector("source[data-src]");
          if (s) { s.src = s.dataset.src; s.removeAttribute("data-src"); v.load(); }
          v.play().catch(() => {});
        } else v.pause();
      });
    }, { threshold: 0.35 });
    lazyVideos.forEach((v) => vio.observe(v));
  }

  /* ---------- Menü-Tabs (Pfeiltasten-Navigation) ---------- */
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const selectTab = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length];
      selectTab(n); n.focus(); e.preventDefault();
    });
  });

  /* ---------- Bestellzettel ---------- */
  const bar = document.getElementById("order-bar");
  const order = new Map(); // name -> {qty, price, cat}
  const euro = (n) => n.toFixed(2).replace(".", ",") + " €";
  const live = document.getElementById("order-live");
  const listWrap = document.getElementById("order-list");
  const summaryBtn = bar && bar.querySelector(".order-summary");
  const renderOrder = () => {
    if (!bar) return;
    let count = 0, total = 0, unpriced = false;
    const ul = listWrap.querySelector("ul"); ul.innerHTML = "";
    order.forEach((o, name) => {
      count += o.qty;
      if (o.price) total += o.qty * o.price; else unpriced = true;
      const li = document.createElement("li");
      li.innerHTML = `<span>${o.qty}× ${name}</span>`;
      const rm = document.createElement("button");
      rm.type = "button"; rm.textContent = "−"; rm.setAttribute("aria-label", `Ein ${name} entfernen`);
      rm.addEventListener("click", () => { o.qty--; if (!o.qty) order.delete(name); renderOrder(); });
      li.append(rm); ul.append(li);
    });
    bar.hidden = count === 0;
    document.body.classList.toggle("has-order", count > 0);
    if (!count) { listWrap.hidden = true; summaryBtn.setAttribute("aria-expanded", "false"); }
    document.getElementById("order-count").textContent = `${count} ${count === 1 ? "Artikel" : "Artikel"}`;
    document.getElementById("order-total").textContent = total ? `${unpriced ? "ab " : ""}${euro(total)}` : "";
    const lines = [...order].map(([n, o]) => `• ${o.qty}× ${n}${o.cat && !n.includes(o.cat) ? ` (${o.cat})` : ""}${o.price ? ` – ${euro(o.price * o.qty)}` : ""}`);
    const text = ["Hallo Anu, ich möchte gern bestellen 🤎", "", ...lines, "", total ? `Summe (soweit bekannt): ${euro(total)}` : "", "Wann wäre eine Übergabe in Dortmund möglich?"].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
    document.getElementById("order-send").href = WA(text);
  };
  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.add;
      const o = order.get(name) || { qty: 0, price: parseFloat(btn.dataset.price) || 0, cat: btn.dataset.cat };
      o.qty++; order.set(name, o); renderOrder();
      btn.classList.add("added"); setTimeout(() => btn.classList.remove("added"), 600);
      if (live) live.textContent = `${name} hinzugefügt. ${o.qty} Stück auf dem Bestellzettel.`;
    });
  });
  if (summaryBtn) {
    summaryBtn.addEventListener("click", () => {
      const open = listWrap.hidden;
      listWrap.hidden = !open; summaryBtn.setAttribute("aria-expanded", String(open));
    });
    bar.querySelector(".order-clear").addEventListener("click", () => { order.clear(); renderOrder(); });
  }

  /* ---------- Mobile Navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => e.matches && setMenu(false));

  /* ---------- Aktiver Menüpunkt ---------- */
  const links = [...document.querySelectorAll(".nav-list a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
          a.getAttribute("href") === "#" + entry.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));

    /* ---------- Sanftes Einblenden ---------- */
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Formular ---------- */
  const form = document.getElementById("request-form");
  if (!form) return;
  const success = document.getElementById("form-success");
  const dateInput = form.elements.date;

  // frühestes Datum: heute + 3 Tage
  const min = new Date();
  min.setDate(min.getDate() + 3);
  const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = iso(min);

  // Karten-Links wählen den passenden Anlass vor
  document.querySelectorAll("[data-occasion]").forEach((link) => {
    link.addEventListener("click", () => {
      const radio = form.querySelector(`input[name="occasion"][value="${link.dataset.occasion}"]`);
      if (radio) radio.checked = true;
    });
  });

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Wie darf ich dich nennen?"),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Bitte gib eine gültige E-Mail-Adresse an."),
    date: (v) => {
      if (!v) return "Für wann wünschst du dir deine Kreation?";
      return v < dateInput.min ? "Bitte wähle ein Datum mindestens 3 Tage im Voraus." : "";
    },
    message: (v) => (v.trim().length >= 10 ? "" : "Erzähl mir ein bisschen mehr – mindestens ein, zwei Sätze."),
    consent: (_, el) => (el.checked ? "" : "Bitte stimme der Verarbeitung deiner Angaben zu."),
  };

  const validateField = (name) => {
    const el = form.elements[name];
    const msg = rules[name](el.value, el);
    const field = el.closest(".field");
    const err = document.getElementById(`f-${name === "message" ? "msg" : name}-err`);
    field.classList.toggle("has-error", !!msg);
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg;
    return !msg;
  };

  Object.keys(rules).forEach((name) => {
    const el = form.elements[name];
    const evt = el.type === "checkbox" ? "change" : "blur";
    el.addEventListener(evt, () => validateField(name));
    el.addEventListener("input", () => el.closest(".field").classList.contains("has-error") && validateField(name));
  });

  const formatDate = (v) => new Date(v + "T12:00:00").toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const buildMessage = (d) =>
    [
      "Hallo Anu, ich möchte gern eine Anfrage stellen:",
      "",
      `Name: ${d.name}`,
      `E-Mail: ${d.email}`,
      `Wunschdatum: ${formatDate(d.date)}`,
      `Anlass: ${d.occasion}`,
      d.guests ? `Personen: ${d.guests}` : null,
      "",
      `Meine Wünsche: ${d.message}`,
    ].filter((l) => l !== null).join("\n");

  const showSuccess = (data, sent) => {
    const firstName = data.name.trim().split(/\s+/)[0];
    success.querySelector("[data-name]").textContent = firstName;
    const actions = document.getElementById("success-actions");
    actions.innerHTML = "";

    const title = document.getElementById("success-title").firstChild;
    if (sent) {
      title.textContent = "Danke, ";
      document.getElementById("success-text").textContent =
        "Deine Anfrage ist bei mir angekommen. Ich freue mich riesig und melde mich innerhalb von 48 Stunden persönlich bei dir.";
    } else {
      // Ohne Formular-Dienst: Anfrage wird vorbereitet und per WhatsApp/E-Mail übergeben
      title.textContent = "Fast geschafft, ";
      document.getElementById("success-text").textContent =
        "Deine Anfrage ist fertig formuliert. Wähle nur noch aus, wie sie zu mir kommen soll – ich freue mich schon darauf!";
      const text = buildMessage(data);
      const wa = document.createElement("a");
      wa.className = "btn btn--rose";
      wa.href = WA(text);
      wa.target = "_blank"; wa.rel = "noopener";
      wa.innerHTML = '<svg aria-hidden="true"><use href="#i-whatsapp"/></svg> Per WhatsApp senden';
      const mail = document.createElement("a");
      mail.className = "btn btn--ghost";
      mail.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Anfrage: " + data.occasion + " am " + formatDate(data.date))}&body=${encodeURIComponent(text)}`;
      mail.innerHTML = '<svg aria-hidden="true"><use href="#i-mail"/></svg> Per E-Mail senden';
      actions.append(wa, mail);
    }

    const again = document.createElement("button");
    again.type = "button"; again.className = "btn btn--ghost"; again.textContent = "Neue Anfrage";
    again.addEventListener("click", () => {
      form.reset(); success.hidden = true; form.hidden = false; form.elements.name.focus();
    });
    actions.append(again);

    form.hidden = true;
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const valid = Object.keys(rules).map(validateField);
    if (valid.includes(false)) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid && firstInvalid.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    if (!FORM_ENDPOINT) { showSuccess(data, false); return; }

    const btn = form.querySelector('button[type="submit"]');
    btn.setAttribute("aria-busy", "true");
    btn.firstChild.textContent = "Wird gesendet … ";
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _subject: `Neue Anfrage: ${data.occasion}` }),
      });
      if (!res.ok) throw new Error(res.status);
      showSuccess(data, true);
    } catch {
      showSuccess(data, false); // Fallback: WhatsApp / E-Mail
    } finally {
      btn.removeAttribute("aria-busy");
      btn.firstChild.textContent = "Anfrage absenden ";
    }
  });
})();
