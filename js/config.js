// ======================================================================
// CONFIGURAÇÃO — É SÓ MEXER AQUI PRA TROCAR FILIAIS E DESTINOS.
// Depois de editar: salve, faça commit + push. Some 30-60s e já está
// valendo, sem precisar gerar um QR Code novo.
// ======================================================================

// Cada filial = uma cidade atendida + seu WhatsApp.
//   id        -> identificador fixo (não mude depois de publicado: é o que
//                fica salvo como preferência no navegador do cliente)
//   name      -> nome da cidade, como aparece na tela
//   state     -> sigla do estado (UF)
//   country   -> sigla do país (ISO, ex: "BR")
//   label     -> nome do atendimento/loja mostrado na tela
//   aliases   -> outras cidades que devem cair nesta filial (opcional),
//                ex: ["Gaspar", "Pomerode"]
//   lat / lon -> coordenadas da cidade (opcional, usado só pra ordenar a
//                lista manual pela mais próxima)
//   whatsapp  -> número (DDI + DDD + número, só dígitos) e mensagem
export const BRANCHES = [
  {
    id: "timbo",
    name: "Timbó",
    state: "SC",
    country: "BR",
    label: "Mais Q Pizza",
    aliases: [],
    lat: -26.8233,
    lon: -49.2717,
    whatsapp: {
      number: "5547991503132",
      message: "Olá, gostaria de ver o cardápio."
    }
  },
  {
    id: "blumenau",
    name: "Blumenau",
    state: "SC",
    country: "BR",
    label: "Sushi Blumenau",
    aliases: [],
    lat: -26.9194,
    lon: -49.0661,
    whatsapp: {
      number: "554788307839",
      message: "Olá, gostaria de ver o cardápio."
    }
  }
];

export const SETTINGS = {
  // Segundos do contador antes de abrir a filial sugerida pela localização.
  countdownSeconds: 5,

  // Segundos antes de abrir a filial que o cliente já escolheu antes
  // (dá tempo de tocar em "Trocar cidade"). 0 = abre na hora.
  savedPreferenceSeconds: 2,

  // Se outra filial fica a até esta distância (km) da cidade detectada pelo
  // IP, não redireciona sozinho: pergunta qual unidade. A localização por
  // IP costuma apontar a cidade vizinha maior (Timbó aparece como
  // Blumenau, ~23 km). 0 = desliga essa proteção.
  ambiguityRadiusKm: 60,

  // Tempo máximo esperando cada serviço de localização por IP.
  geoTimeoutMs: 2500,

  // "direct" -> depois de escolher a cidade, vai direto pro WhatsApp
  // "promo"  -> mostra uma tela de promoção antes, com botão pro WhatsApp
  mode: "direct",

  promo: {
    title: "🔥 Promoção especial!",
    message: "Aproveite nossa oferta exclusiva antes de falar com a gente.",
    imageUrl: "",                  // opcional: URL de uma imagem/banner
    buttonText: "Falar no WhatsApp",
    autoRedirectSeconds: 0         // 0 = espera clique. Ex: 5 = redireciona sozinho em 5s
  }
};
