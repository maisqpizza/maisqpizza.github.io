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
//   aliases   -> outros nomes que a busca da lista deve achar (opcional),
//                ex: ["Gaspar", "Pomerode"]
//   lat / lon -> coordenadas da loja: o GPS do cliente escolhe a filial
//                mais próxima destas coordenadas
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
  // Segundos do contador antes de abrir a filial sugerida pelo GPS.
  countdownSeconds: 5,

  // Segundos antes de abrir a filial que o cliente já escolheu antes
  // (dá tempo de tocar em "Trocar cidade"). 0 = abre na hora.
  savedPreferenceSeconds: 2,

  // Distância máxima (km) entre o cliente e a filial mais próxima para
  // sugerir essa filial. Mais longe que isso, mostra a lista.
  maxDistanceKm: 40,

  // Tempo máximo esperando o GPS (inclui o cliente responder à permissão).
  // Depois disso segue com a escolha salva ou a lista.
  gpsTimeoutMs: 15000,

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
