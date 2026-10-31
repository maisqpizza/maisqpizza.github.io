// Preferência de filial do visitante, guardada só no navegador dele.
// Guarda apenas o id da filial e quando foi escolhida — nada de IP ou
// cidade detectada. Só é salva quando o visitante escolhe/confirma
// explicitamente; a cidade inferida pelo IP nunca vira preferência sozinha.

// v2: descarta escolhas salvas antes de existir a pergunta para filiais
// vizinhas, quando o contador induzia a confirmar Blumenau estando em Timbó.
const KEY = "maisq.branch.v2";

export function getPreference(branches) {
  try {
    const pref = JSON.parse(localStorage.getItem(KEY) || "null");
    if (pref && pref.source === "manual") {
      return branches.find((b) => b.id === pref.id) || null;
    }
  } catch (_) {
    // storage bloqueado/corrompido: segue sem preferência
  }
  return null;
}

export function savePreference(branchId) {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      id: branchId,
      source: "manual",
      savedAt: new Date().toISOString()
    }));
  } catch (_) {
    // aba anônima/storage cheio: a escolha vale só nesta visita
  }
}

export function clearPreference() {
  try { localStorage.removeItem(KEY); } catch (_) {}
}
