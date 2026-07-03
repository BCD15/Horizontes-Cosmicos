const ShopModules = {
  propulsion: {
    id: "propulsion",
    menuText: "MÓDULOS DE PROPULSÃO",
    items: [
      {
        id: "propulsor_civil_mk_i",
        level: 1,
        title: "Propulsor Nível 1",
        stats: [
          "Velocidade: 3/10",
          "Vida: 100",
          "Custo: 0 Ouro"
        ],
        cost: 0
      },
      {
        id: "propulsor_vetorial_mk_ii",
        level: 2,
        title: "Propulsor Nível 2",
        stats: [
          "Velocidade: 4/10",
          "Vida: 140",
          "Custo: 350 Ouro"
        ],
        cost: 350
      },
      {
        id: "propulsor_ionico_mk_iii",
        level: 3,
        title: "Propulsor Nível 3",
        stats: [
          "Velocidade: 6/10",
          "Vida: 190",
          "Custo: 900 Ouro"
        ],
        cost: 900
      },
      {
        id: "propulsor_quantico_mk_iv",
        level: 4,
        title: "Propulsor Nível 4",
        stats: [
          "Velocidade: 8/10",
          "Vida: 260",
          "Custo: 2200 Ouro"
        ],
        cost: 2200
      },
      {
        id: "nucleo_dobra_estelar",
        level: 5,
        title: "Propulsor Nível 5",
        stats: [
          "Velocidade: 10/10",
          "Vida: 400",
          "Custo: 5000 Ouro"
        ],
        cost: 5000
      }
    ]
  },

  cannon: {
    id: "cannon",
    menuText: "CANHÃO",
    parent: "weapon",
    items: [
      {
        id: "canhao_balistico_mk_i",
        level: 1,
        title: "Canhão Balístico Nível 1",
        stats: [
          "Tipo: Balístico",
          "Dano: 100",
          "Cadência: 1 tiro/s",
          "Vida: 150",
          "Custo: 0 Ouro"
        ],
        cost: 0
      },
      {
        id: "canhao_reforcado_mk_ii",
        level: 2,
        title: "Canhão Balístico Nível 2",
        stats: [
          "Tipo: Balístico",
          "Dano: 140",
          "Cadência: 1.2 tiros/s",
          "Vida: 190",
          "Custo: 450 Ouro"
        ],
        cost: 450
      },
      {
        id: "canhao_perfurante_mk_iii",
        level: 3,
        title: "Canhão Balístico Nível 3",
        stats: [
          "Tipo: Balístico",
          "Dano: 200",
          "Cadência: 1.4 tiros/s",
          "Vida: 240",
          "Custo: 1100 Ouro"
        ],
        cost: 1100
      },
      {
        id: "artilharia_gauss_mk_iv",
        level: 4,
        title: "Canhão Balístico Nível 4",
        stats: [
          "Tipo: Magnético",
          "Dano: 300",
          "Cadência: 1.8 tiros/s",
          "Vida: 320",
          "Custo: 2600 Ouro"
        ],
        cost: 2600
      },
      {
        id: "devastador_leviathan",
        level: 5,
        title: "Canhão Balístico Nível 5",
        stats: [
          "Tipo: Balístico Pesado",
          "Dano: 450",
          "Cadência: 2 tiros/s",
          "Vida: 450",
          "Custo: 5200 Ouro"
        ],
        cost: 5200
      }
    ]
  },

  laser: {
    id: "laser",
    menuText: "LASER",
    parent: "weapon",
    items: [
      {
        id: "laser_plasma_mk_i",
        level: 1,
        title: "Canhão Laser Nível 1",
        stats: [
          "Tipo: Laser",
          "Aquecimento: Nível 1 (rápido)",
          "Dano: 40/s",
          "Vida: 300",
          "Custo: 300 Ouro"
        ],
        cost: 300
      },
      {
        id: "laser_plasma_mk_ii",
        level: 2,
        title: "Canhão Laser Nível 1I",
        stats: [
          "Tipo: Laser",
          "Aquecimento: Nível 2",
          "Dano: 65/s",
          "Vida: 340",
          "Custo: 800 Ouro"
        ],
        cost: 800
      },
      {
        id: "feixe_ionico_mk_iii",
        level: 3,
        title: "Canhão Laser Nível 3",
        stats: [
          "Tipo: Laser Iônico",
          "Aquecimento: Nível 3",
          "Dano: 95/s",
          "Vida: 390",
          "Custo: 1700 Ouro"
        ],
        cost: 1700
      },
      {
        id: "laser_prismatico_mk_iv",
        level: 4,
        title: "Canhão Laser Nível 4",
        stats: [
          "Tipo: Laser",
          "Aquecimento: Nível 4",
          "Dano: 140/s",
          "Vida: 470",
          "Custo: 3200 Ouro"
        ],
        cost: 3200
      },
      {
        id: "raio_solar_experimental",
        level: 5,
        title: "Canhão Laser Nível 5",
        stats: [
          "Tipo: Laser Estelar",
          "Aquecimento: Nível 5 (alto)",
          "Dano: 220/s",
          "Vida: 600",
          "Custo: 6000 Ouro"
        ],
        cost: 6000
      }
    ]
  },

  emp: {
    id: "emp",
    menuText: "PULSO ELETROMAGNÉTICO",
    parent: "weapon",
    items: [
      {
        id: "pulso_eletromagnetico_omega",
        level: 1,
        title: "Pulso Eletromagnético (Arma lendária)",
        stats: [
          "Tipo: Eletromagnético",
          "Velocidade de Recarga: 2s",
          "Dano: 500",
          "Vida: 1000",
          "Raridade: Lendária",
          "Custo: 8000 Ouro"
        ],
        cost: 8000
      }
    ]
  },

  shield: {
    id: "shield",
    menuText: "ESCUDOS",
    items: [
      {
        id: "escudo_civil_basico",
        level: 1,
        title: "Escudo Balístico Nível 1",
        stats: [
          "Capacidade: 100",
          "Regeneração: 2/s",
          "Resistência: 5%",
          "Custo: 0 Ouro"
        ],
        cost: 0
      },
      {
        id: "escudo_reforcado_mk_ii",
        level: 2,
        title: "Escudo Balístico Nível 2",
        stats: [
          "Capacidade: 180",
          "Regeneração: 3/s",
          "Resistência: 8%",
          "Custo: 500 Ouro"
        ],
        cost: 500
      },
      {
        id: "escudo_energetico_mk_iii",
        level: 3,
        title: "Escudo Balístico Nível 3",
        stats: [
          "Capacidade: 300",
          "Regeneração: 5/s",
          "Resistência: 12%",
          "Custo: 1400 Ouro"
        ],
        cost: 1400
      },
      {
        id: "escudo_fusao_mk_iv",
        level: 4,
        title: "Escudo Balístico Nível 4",
        stats: [
          "Capacidade: 450",
          "Regeneração: 7/s",
          "Resistência: 18%",
          "Custo: 3000 Ouro"
        ],
        cost: 3000
      },
      {
        id: "barreira_quantica_estelar",
        level: 5,
        title: "Escudo Balístico Nível 5",
        stats: [
          "Capacidade: 700",
          "Regeneração: 10/s",
          "Resistência: 25%",
          "Custo: 6500 Ouro"
        ],
        cost: 6500
      }
    ]
  }

  ,
  helpers: {
    id: "helpers",
    menuText: "ENGENHEIROS AJUDANTES",
    selectionType: "helper",
    items: [
      {
        id: "engenheiro_casco",
        level: 1,
        title: "Engenheira de Casco",
        imageKey: "helperHull",
        imageSrc: "./assets/images/helpers/engenheiro-casco.png",
        color: "#90be6d",
        bonusType: "hp",
        bonusPercent: 25,
        stats: [
          "Função: Aumenta a vida total",
          "Bônus: +25% vida máxima",
          "Uso: apenas 1 engenheiro ativo",
          "Custo: 1000 Ouro"
        ],
        cost: 1000
      },
      {
        id: "engenheiro_armas",
        level: 1,
        title: "Engenheiro de Armas",
        imageKey: "helperDamage",
        imageSrc: "./assets/images/helpers/engenheiro-armas.png",
        color: "#f9c74f",
        bonusType: "damage",
        bonusPercent: 15,
        stats: [
          "Função: Aumenta o dano da nave",
          "Bônus: +15% dano",
          "Uso: apenas 1 engenheiro ativo",
          "Custo: 1000 Ouro"
        ],
        cost: 1000
      },
      {
        id: "engenheiro_escudo",
        level: 1,
        title: "Engenheira de Escudos",
        imageKey: "helperShield",
        imageSrc: "./assets/images/helpers/engenheiro-escudo.png",
        color: "#4cc9f0",
        bonusType: "shield",
        bonusPercent: 20,
        stats: [
          "Função: Aumenta o escudo da nave",
          "Bônus: +20% escudo máximo",
          "Uso: apenas 1 engenheiro ativo",
          "Custo: 1000 Ouro"
        ],
        cost: 1000
      }
    ]
  }
};
