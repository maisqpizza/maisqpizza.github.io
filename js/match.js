// Relaciona a posição do cliente com as filiais cadastradas.

export function normalize(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function distanceKm(a, b) {
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

const hasCoords = (p) => p && Number.isFinite(p.lat) && Number.isFinite(p.lon);

// Filial mais próxima da posição, se estiver a até `maxKm`; senão null.
export function nearestBranch(pos, branches, maxKm) {
  if (!hasCoords(pos)) return null;
  const [first] = sortBranches(branches, pos).filter(hasCoords);
  return first && distanceKm(pos, first) <= maxKm ? first : null;
}

// Ordena as filiais pela mais próxima quando há coordenadas; senão, por nome.
export function sortBranches(branches, pos) {
  const byName = (a, b) => a.name.localeCompare(b.name, "pt-BR");
  return [...branches].sort((a, b) => {
    if (hasCoords(pos) && hasCoords(a) && hasCoords(b)) {
      return distanceKm(pos, a) - distanceKm(pos, b);
    }
    return byName(a, b);
  });
}
