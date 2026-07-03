const Terra = {
  id: "terra",
  name: "Terra",
  type: "superficie",

  colonyName: "Colônia Terra",

  description:
    "A Terra se destaca por ser o único lugar conhecido que abriga vida.",

  npcs: [
    {
      id: "terra_comerciante",
      name: "Comerciante",
      type: "merchant",
      x: 260,
      y: 220,
      width: 36,
      height: 36,
      color: "#4cc9f0",
      dialogId: "terraComerciante"
    },
    {
      id: "terra_nave",
      name: "Nave Aurora",
      type: "ship",
      x: 720,
      y: 360,
      width: 52,
      height: 40,
      color: "#f72585",
      dialogId: "terraNave"
    }
  ]
};

const Planets = {
  terra: Terra
};