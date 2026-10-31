// Fluxo: preferência salva > localização por IP > seleção manual.
// O link (https://maisqpizza.github.io/) é o mesmo pra todas as filiais;
// a escolha acontece aqui e o destino é o WhatsApp da filial.
//
// Parâmetro opcional: ?cidade=<id>  -> força uma filial (ex: QR da loja)
//                     ?trocar       -> esquece a preferência e abre a lista

import { BRANCHES, SETTINGS } from "./config.js";
import { locateByIp } from "./geo.js";
import { matchBranch, sortBranches } from "./match.js";
import { getPreference, savePreference, clearPreference } from "./preference.js";
import { showLoading, showSuggestion, showSaved, showPicker, showPromo, cityLabel } from "./ui.js";

function whatsAppUrl(wa) {
  const text = encodeURIComponent(wa.message || "");
  return `https://wa.me/${wa.number}${text ? `?text=${text}` : ""}`;
}

function openBranch(branch) {
  const url = whatsAppUrl(branch.whatsapp);
  if (SETTINGS.mode === "promo") {
    showPromo(SETTINGS.promo, url);
  } else {
    showLoading(`Abrindo WhatsApp — ${branch.label} (${cityLabel(branch)})…`);
    window.location.href = url;
  }
}

function chooseManually(loc, intro) {
  showPicker({
    branches: sortBranches(BRANCHES, loc),
    intro,
    onSelect: (b) => { savePreference(b.id); openBranch(b); }
  });
}

async function start() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("trocar")) {
    clearPreference();
    chooseManually(null);
    return;
  }

  const forced = BRANCHES.find((b) => b.id === params.get("cidade"));
  if (forced) { openBranch(forced); return; }

  if (BRANCHES.length === 1) { openBranch(BRANCHES[0]); return; }

  const saved = getPreference(BRANCHES);
  if (saved) {
    showSaved({
      branch: saved,
      seconds: SETTINGS.savedPreferenceSeconds,
      onGo: () => openBranch(saved),
      onChange: () => chooseManually(null)
    });
    return;
  }

  showLoading("Encontrando o atendimento mais próximo…");
  const loc = await locateByIp({ timeoutMs: SETTINGS.geoTimeoutMs });
  const match = matchBranch(loc, BRANCHES);

  if (!match) {
    chooseManually(loc);
    return;
  }

  showSuggestion({
    branch: match.branch,
    seconds: match.confidence === "high" ? SETTINGS.countdownSeconds : 0,
    // tempo esgotado = escolha inferida: abre, mas não salva como preferência
    onTimeout: () => openBranch(match.branch),
    // clique explícito = preferência do visitante
    onConfirm: () => { savePreference(match.branch.id); openBranch(match.branch); },
    onChoose: () => chooseManually(loc)
  });
}

// Voltar do WhatsApp pelo botão "voltar" pode restaurar a página do cache
// já no estado "Abrindo…": recomeça o fluxo pra mostrar a tela certa.
window.addEventListener("pageshow", (e) => { if (e.persisted) start(); });

start();
