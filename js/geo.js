// Localização aproximada por IP. Não usa a Geolocation API do navegador
// (que pede permissão) e não guarda nada: o resultado vive só na memória
// da página. Os dados são estimativa — VPN e rede móvel erram bastante.

const PROVIDERS = [
  {
    name: "ipwho.is",
    // `fields` limita a resposta ao necessário (sem IP, sem provedor).
    url: "https://ipwho.is/?fields=success,country_code,region,region_code,city,latitude,longitude",
    parse: (d) => d && d.success !== false ? {
      country: d.country_code,
      regionCode: d.region_code,
      region: d.region,
      city: d.city,
      lat: d.latitude,
      lon: d.longitude
    } : null
  },
  {
    name: "ipapi.co",
    url: "https://ipapi.co/json/",
    parse: (d) => d && !d.error ? {
      country: d.country_code,
      regionCode: d.region_code,
      region: d.region,
      city: d.city,
      lat: d.latitude,
      lon: d.longitude
    } : null
  }
];

async function fetchJson(url, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      credentials: "omit",
      referrerPolicy: "no-referrer",
      cache: "no-store"
    });
    if (!res.ok) return null;
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// Retorna { country, regionCode, region, city, lat, lon } ou null.
// Nunca lança erro: falha de rede/timeout/dado incompleto vira null.
export async function locateByIp({ timeoutMs = 2500 } = {}) {
  for (const provider of PROVIDERS) {
    try {
      const loc = provider.parse(await fetchJson(provider.url, timeoutMs));
      if (loc && loc.city && loc.country) return loc;
    } catch (_) {
      // tenta o próximo serviço
    }
  }
  return null;
}
