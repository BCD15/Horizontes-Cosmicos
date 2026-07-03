const PlanetData = {
  mercurio: {
    id: "mercurio",
    name: "Mercúrio",
    colonyName: "Colônia Mercúrio",
    type: "rochoso",
    travelMode: "pouso",
    order: 1,
    unlocked: true,
    x: 165,
    y: 300,
    radius: 18,
    color: "#c8a25a",
    orbitRadius: 165,
    difficulty: 1,
    description: "O menor planeta do Sistema Solar, marcado por extremos de temperatura.",
    curiosity: "Muitas crateras de Mercúrio receberam nomes de artistas, músicos e escritores famosos."
  },

  venus: {
    id: "venus",
    name: "Vênus",
    colonyName: "Colônia Vênus",
    type: "rochoso",
    travelMode: "pouso",
    order: 2,
    unlocked: true,
    x: 205,
    y: 365,
    radius: 23,
    color: "#d8a34c",
    orbitRadius: 215,
    difficulty: 2,
    description: "O planeta mais quente do Sistema Solar por causa do efeito estufa extremo.",
    curiosity: "Um dia em Vênus dura mais do que um ano venusiano."
  },

  terra: {
    id: "terra",
    name: "Terra",
    colonyName: "Colônia Terra",
    type: "rochoso",
    travelMode: "pouso",
    order: 3,
    unlocked: true,
    x: 345,
    y: 315,
    radius: 34,
    color: "#2f9fff",
    secondaryColor: "#69c75b",
    orbitRadius: 285,
    difficulty: 1,
    description: "O único planeta conhecido que abriga vida.",
    curiosity: "A atmosfera terrestre filtra radiações perigosas e queima pequenos meteoros."
  },

  marte: {
    id: "marte",
    name: "Marte",
    colonyName: "Colônia Marte",
    type: "rochoso",
    travelMode: "pouso",
    order: 4,
    unlocked: true,
    x: 330,
    y: 150,
    radius: 25,
    color: "#d45b2f",
    orbitRadius: 360,
    difficulty: 2,
    description: "O planeta vermelho, marcado pelo óxido de ferro em sua superfície.",
    curiosity: "Marte é o planeta mais explorado por sondas e robôs."
  },

  jupiter: {
    id: "jupiter",
    name: "Júpiter",
    colonyName: "Estação Orbital de Júpiter",
    type: "gasoso",
    travelMode: "orbita",
    order: 5,
    unlocked: true,
    x: 640,
    y: 350,
    radius: 58,
    color: "#b88754",
    secondaryColor: "#e6d3a8",
    orbitRadius: 455,
    difficulty: 3,
    description: "O maior planeta do Sistema Solar, com massa maior que todos os outros planetas somados.",
    curiosity: "A Grande Mancha Vermelha é uma tempestade gigantesca ativa há séculos."
  },

  saturno: {
    id: "saturno",
    name: "Saturno",
    colonyName: "Estação Orbital de Saturno",
    type: "gasoso",
    travelMode: "orbita",
    order: 6,
    unlocked: true,
    x: 750,
    y: 145,
    radius: 47,
    color: "#d6a94f",
    secondaryColor: "#b78b37",
    hasRing: true,
    orbitRadius: 545,
    difficulty: 4,
    description: "Gigante gasoso famoso por seus anéis de gelo, pedras e poeira.",
    curiosity: "Seus anéis refletem a luz do Sol e criam um dos visuais mais marcantes do Sistema Solar."
  },

  urano: {
    id: "urano",
    name: "Urano",
    colonyName: "Estação Orbital de Urano",
    type: "gasoso",
    travelMode: "orbita",
    order: 7,
    unlocked: true,
    x: 880,
    y: 500,
    radius: 42,
    color: "#1fa7e8",
    secondaryColor: "#5fc6ff",
    hasRing: true,
    orbitRadius: 635,
    difficulty: 5,
    description: "Um planeta que gira praticamente de lado, com estações extremas.",
    curiosity: "Sua inclinação provavelmente foi causada por uma grande colisão no passado."
  },

  netuno: {
    id: "netuno",
    name: "Netuno",
    colonyName: "Estação Orbital de Netuno",
    type: "gasoso",
    travelMode: "orbita",
    order: 8,
    unlocked: true,
    x: 1080,
    y: 270,
    radius: 41,
    color: "#1594d4",
    secondaryColor: "#4ac7ff",
    orbitRadius: 725,
    difficulty: 6,
    description: "O planeta mais distante do Sol, com ventos extremamente velozes.",
    curiosity: "Netuno foi descoberto por cálculos matemáticos antes de ser observado diretamente."
  },

  plutao: {
    id: "plutao",
    name: "Plutão",
    colonyName: "Posto Avançado de Plutão",
    type: "anao",
    travelMode: "pouso",
    order: 9,
    unlocked: true,
    x: 1115,
    y: 88,
    radius: 16,
    color: "#b8b8ad",
    orbitRadius: 800,
    difficulty: 7,
    description: "Um mundo anão gelado usado como ponto avançado para chegar ao Portal Estelar.",
    curiosity: "Além de Plutão fica o caminho para o antigo Portal Estelar da história."
  }
};

const PlanetDialogs = {
  mercurio: "Mercúrio é o menor planeta do Sistema Solar e vive tão perto do Sol que sua superfície chega a temperaturas absurdas, mas ainda assim mantém regiões extremamente frias.",
  venus: "Vênus é o planeta mais quente do Sistema Solar por causa do efeito estufa descontrolado. Seu dia dura mais do que seu próprio ano.",
  terra: "A Terra é o único lugar conhecido que abriga vida, protegida por uma atmosfera que filtra radiações perigosas.",
  marte: "Marte é conhecido como planeta vermelho e foi muito explorado por sondas e robôs por talvez ter abrigado água no passado.",
  jupiter: "Júpiter é gigantesco e sua Grande Mancha Vermelha mostra o poder das tempestades desse mundo gasoso.",
  saturno: "Saturno impressiona por seus anéis formados por gelo, pedras e poeira que refletem a luz do Sol.",
  urano: "Urano gira praticamente de lado, provavelmente por causa de uma grande colisão no passado.",
  netuno: "Netuno é distante, escuro e extremamente ativo, com alguns dos ventos mais velozes do Sistema Solar.",
  plutao: "Plutão é um posto avançado gelado, usado como rota final para alcançar o antigo Portal Estelar."
};

const Planets = Object.fromEntries(
  Object.values(PlanetData).map((planet) => [
    planet.id,
    {
      ...planet,
      npcs: createPlanetNPCs(planet)
    }
  ])
);

function createPlanetNPCs(planet) {
  return [
    {
      id: `${planet.id}_comerciante`,
      name: "Comerciante",
      type: "merchant",
      spriteKey: `${planet.id}_merchant`,
      x: 260,
      y: 220,
      width: 85,
      height: 85,
      color: "#4cc9f0",
      dialogId: `${planet.id}Comerciante`
    },
    {
      id: `${planet.id}_aurora`,
      name: "Nave Aurora",
      type: "ship",
      spriteKey: "nave_aurora",
      x: 650,
      y: 290,
      width: 150,
      height: 150,
      color: "#f72585"
    },
    {
      id: `${planet.id}_ajudante`,
      name: "Ajudante",
      type: "helper",
      x: 470,
      y: 450,
      width: 34,
      height: 38,
      color: "#90be6d",
      dialogId: `${planet.id}Ajudante`
    }
  ];
}
