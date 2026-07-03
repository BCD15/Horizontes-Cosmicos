const GameState = {
  currentScene: "menu",

  currentPlanet: "terra",

  gold: 50000,

  player: {
    hp: 100,
    maxHp: 100,

    shield: 100,
    maxShield: 100
  },

  flags: {},

  battlesWon: 0,

  purchasedItems: {
    propulsor_civil_mk_i: true,
    canhao_balistico_mk_i: true,
    escudo_civil_basico: true
  },

  activeWeaponId: "canhao_balistico_mk_i",

  activeHelperId: null,

  dialogueActive: false
};