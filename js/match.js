// Compara a localização inferida com as filiais cadastradas.

export function normalize(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Retorna { branch, confidence: "high" | "low" } ou null.
//   high -> cidade + país batem e o estado confere: pode redirecionar sozinho
//   low  -> cidade bate mas o estado não veio na resposta: só sugere,
//           sem contador automático
export function matchBranch(loc, branches) {
  if (!loc || !loc.city) return null;
  const city = normalize(loc.city);
  const country = normalize(loc.country);
  const region = normalize(loc.regionCode);

  for (const b of branches) {
    const names = [b.name, ...(b.aliases || [])].map(normalize);
    if (!names.includes(city)) continue;
    if (country && normalize(b.country) !== country) continue;
    if (region && normalize(b.state) !== region) continue;
    return { branch: b, confidence: country && region ? "high" : "low" };
  }
  return null;
}

function distanceKm(a, b) {
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

// Ordena as filiais pela mais próxima quando há coordenadas; senão, por nome.
export function sortBranches(branches, loc) {
  const hasCoords = loc && Number.isFinite(loc.lat) && Number.isFinite(loc.lon);
  const byName = (a, b) => a.name.localeCompare(b.name, "pt-BR");
  return [...branches].sort((a, b) => {
    if (hasCoords && Number.isFinite(a.lat) && Number.isFinite(b.lat)) {
      return distanceKm(loc, a) - distanceKm(loc, b);
    }
    return byName(a, b);
  });
}
