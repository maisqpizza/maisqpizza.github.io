// Localização pelo GPS do aparelho (Geolocation API). O navegador pede
// permissão na primeira vez e lembra a resposta do cliente. As coordenadas
// ficam só na memória da página: servem pra achar a filial mais próxima e
// não são enviadas a nenhum serviço nem salvas.
//
// Localização por IP foi descartada: na região (ex: Unifique) todos os
// serviços testados enxergam Timbó como Blumenau ou Itajaí.

// Retorna { lat, lon } ou null (negou, sem GPS, demorou demais).
// Nunca lança erro.
export function locateByGps({ timeoutMs = 15000 } = {}) {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) { resolve(null); return; }
    let done = false;
    const finish = (v) => { if (!done) { done = true; clearTimeout(timer); resolve(v); } };
    // O `timeout` da API só conta depois que o cliente responde à permissão;
    // este cobre o caso de ele ignorar o pedido.
    const timer = setTimeout(() => finish(null), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => finish({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => finish(null),
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 10 * 60 * 1000 }
    );
  });
}
