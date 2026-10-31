// Fluxo a cada visita: GPS > escolha salva > lista.
//   1. Pede a localização do aparelho. Se o cliente permitir e houver
//      filial perto, mostra a cidade com contador.
//   2. Se negar/não tiver GPS/não houver filial perto: usa a cidade que ele
//      escolheu da última vez, se houver.
//   3. Senão, mostra a lista. A escolha fica salva para as próximas visitas.
// O link (https://maisqpizza.github.io/) é o mesmo pra todas as filiais;
// a escolha acontece aqui e o destino é o WhatsApp da filial.
//
// Parâmetro opcional: ?cidade=<id>  -> força uma filial (ex: QR da loja)
//                     ?trocar       -> esquece a preferência e abre a lista

import { BRANCHES, SETTINGS } from "./config.js";
import { locateByGps } from "./geo.js";
import { nearestBranch, sortBranches } from "./match.js";
import { getPreference, savePreference, clearPreference } from "./preference.js";
import { showLocating, showSuggestion, showSaved, showPicker, showPromo, showLoading, cityLabel } from "./ui.js";

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

function chooseManually(pos, intro) {
  showPicker({
    branches: sortBranches(BRANCHES, pos),
    intro,
    onSelect: (b) => { savePreference(b.id); openBranch(b); }
  });
}

// Visita atual. Trocar de tela incrementa o número e faz o resultado de um
// GPS que chegou atrasado ser ignorado.
let run = 0;

async function start() {
  const current = ++run;
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

  showLocating({ onSkip: () => { run++; chooseManually(null); } });
  const pos = await locateByGps({ timeoutMs: SETTINGS.gpsTimeoutMs });
  if (current !== run) return;

  const near = nearestBranch(pos, BRANCHES, SETTINGS.maxDistanceKm);
  if (near) {
    showSuggestion({
      branch: near,
      seconds: SETTINGS.countdownSeconds,
      onTimeout: () => { savePreference(near.id); openBranch(near); },
      onConfirm: () => { savePreference(near.id); openBranch(near); },
      onChoose: () => chooseManually(pos)
    });
    return;
  }

  if (saved) {
    showSaved({
      branch: saved,
      seconds: SETTINGS.savedPreferenceSeconds,
      onGo: () => openBranch(saved),
      onChange: () => chooseManually(pos)
    });
    return;
  }

  chooseManually(pos, pos
    ? "Não encontramos uma unidade perto de você. Escolha a cidade:"
    : undefined);
}

// Voltar do WhatsApp pelo botão "voltar" pode restaurar a página do cache
// já no estado "Abrindo…": recomeça o fluxo pra mostrar a tela certa.
window.addEventListener("pageshow", (e) => { if (e.persisted) start(); });

start();
