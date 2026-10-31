// Telas: carregando, sugestão com contador, preferência salva, seleção
// manual e promoção. Todo texto entra via textContent (sem innerHTML com
// dados), então nomes vindos da config ou da API não injetam HTML.

import { normalize } from "./match.js";

const app = () => document.getElementById("app");

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c) el.append(c);
  return el;
}

function mount(...nodes) {
  const root = app();
  root.replaceChildren(...nodes);
  root.setAttribute("aria-busy", "false");
}

export function cityLabel(b) {
  return `${b.name} - ${b.state}`;
}

export function showLoading(text = "Carregando…") {
  mount(h("div", { class: "spinner", "aria-hidden": "true" }), h("p", { text }));
  app().setAttribute("aria-busy", "true");
}

// Contador circular. Só começa a contar depois que a tela foi pintada
// (dois requestAnimationFrame) e pausa enquanto a aba está escondida,
// pra ninguém ser redirecionado sem ter visto a tela.
function countdown(seconds, onDone) {
  const R = 44;
  const C = 2 * Math.PI * R;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("aria-hidden", "true");
  const track = document.createElementNS(ns, "circle");
  const bar = document.createElementNS(ns, "circle");
  for (const c of [track, bar]) {
    c.setAttribute("cx", "50");
    c.setAttribute("cy", "50");
    c.setAttribute("r", String(R));
  }
  track.setAttribute("class", "ring-track");
  bar.setAttribute("class", "ring-bar");
  bar.style.strokeDasharray = String(C);
  svg.append(track, bar);

  const num = h("span", { class: "ring-num", text: String(seconds) });
  const el = h("div", {
    class: "ring",
    role: "timer",
    "aria-live": "polite",
    "aria-label": `Redirecionando em ${seconds} segundos`
  }, [svg, num]);

  const total = seconds * 1000;
  let elapsed = 0;
  let last = null;
  let raf = null;
  let stopped = false;
  let shown = seconds;

  const frame = (t) => {
    if (stopped) return;
    if (document.hidden) { last = null; raf = requestAnimationFrame(frame); return; }
    if (last !== null) elapsed += t - last;
    last = t;
    const p = Math.min(elapsed / total, 1);
    bar.style.strokeDashoffset = String(C * p);
    const left = Math.ceil((total - elapsed) / 1000);
    if (left !== shown && left >= 0) {
      shown = left;
      num.textContent = String(left);
      el.setAttribute("aria-label", `Redirecionando em ${left} segundos`);
    }
    if (p >= 1) { stopped = true; onDone(); return; }
    raf = requestAnimationFrame(frame);
  };

  const start = () => requestAnimationFrame(() => {
    if (!stopped) raf = requestAnimationFrame(frame);
  });
  const stop = () => { stopped = true; if (raf) cancelAnimationFrame(raf); };
  return { el, start, stop };
}

// Aguardando o GPS: o navegador mostra o pedido de permissão por cima.
export function showLocating({ onSkip }) {
  mount(
    h("div", { class: "spinner", "aria-hidden": "true" }),
    h("h1", { text: "Olá!" }),
    h("p", { text: "Permita o acesso à localização para encontrarmos a unidade mais próxima de você." }),
    h("div", { class: "actions" }, [
      h("button", { class: "btn btn-ghost", type: "button", text: "Escolher cidade na lista", onclick: onSkip })
    ])
  );
}

// Sugestão baseada no GPS. seconds = 0 -> sem contador.
export function showSuggestion({ branch, seconds, onTimeout, onConfirm, onChoose }) {
  const timer = seconds > 0 ? countdown(seconds, onTimeout) : null;
  const stopThen = (fn) => () => { if (timer) timer.stop(); fn(); };

  mount(
    h("h1", { text: "Olá!" }),
    h("p", { class: "muted", text: "Identificamos que você está perto de:" }),
    h("p", { class: "city", text: cityLabel(branch) }),
    h("p", { text: `Vamos direcionar você para o atendimento desta cidade (${branch.label})?` }),
    timer && timer.el,
    h("div", { class: "actions" }, [
      h("button", { class: "btn", type: "button", text: "Sim, ir agora", onclick: stopThen(onConfirm) }),
      h("button", { class: "btn btn-ghost", type: "button", text: "Escolher outra cidade", onclick: stopThen(onChoose) })
    ])
  );
  if (timer) timer.start();
}

// Visitante que já escolheu antes: abre direto, com chance de trocar.
export function showSaved({ branch, seconds, onGo, onChange }) {
  if (seconds <= 0) { onGo(); return; }
  const timer = countdown(seconds, onGo);
  mount(
    h("p", { class: "muted", text: "Abrindo o atendimento de" }),
    h("p", { class: "city", text: cityLabel(branch) }),
    h("p", { text: branch.label }),
    timer.el,
    h("div", { class: "actions" }, [
      h("button", { class: "btn", type: "button", text: "Ir agora", onclick: () => { timer.stop(); onGo(); } }),
      h("button", { class: "btn btn-ghost", type: "button", text: "Trocar cidade", onclick: () => { timer.stop(); onChange(); } })
    ])
  );
  timer.start();
}

// Lista pesquisável das cidades com filial.
export function showPicker({ branches, intro, onSelect }) {
  const list = h("ul", { class: "list", role: "list" });
  const empty = h("p", { class: "muted empty", text: "Nenhuma cidade encontrada.", hidden: "" });

  const items = branches.map((b) => {
    const li = h("li", {}, [
      h("button", { class: "item", type: "button", onclick: () => onSelect(b) }, [
        h("span", { class: "item-city", text: cityLabel(b) }),
        h("span", { class: "item-label", text: b.label })
      ])
    ]);
    li.dataset.search = normalize(`${b.name} ${b.state} ${b.label} ${(b.aliases || []).join(" ")}`);
    list.append(li);
    return li;
  });

  const search = h("input", {
    class: "search",
    type: "search",
    placeholder: "Buscar cidade…",
    "aria-label": "Buscar cidade",
    autocomplete: "off",
    oninput: (e) => {
      const q = normalize(e.target.value);
      let visible = 0;
      for (const li of items) {
        const ok = !q || li.dataset.search.includes(q);
        li.hidden = !ok;
        if (ok) visible++;
      }
      empty.hidden = visible > 0;
    }
  });

  mount(
    h("h1", { text: "Escolha sua cidade" }),
    h("p", { class: "muted", text: intro || "Selecione a cidade para falar com o atendimento mais próximo." }),
    search,
    list,
    empty
  );
}

export function showPromo(promo, url) {
  let timer = null;
  const go = () => { if (timer) timer.stop(); window.location.href = url; };
  if (promo.autoRedirectSeconds > 0) timer = countdown(promo.autoRedirectSeconds, go);
  mount(
    promo.imageUrl ? h("img", { src: promo.imageUrl, alt: "" }) : null,
    h("h1", { text: promo.title }),
    h("p", { text: promo.message }),
    timer && timer.el,
    h("a", { class: "btn", href: url, text: promo.buttonText, onclick: (e) => { e.preventDefault(); go(); } })
  );
  if (timer) timer.start();
}
