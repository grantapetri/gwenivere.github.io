window.PORTFOLIO_VIDEO_MANIFEST = {
  projects: {
    "site-23": {
      enabled: false,
      title: "Site 23 — Gameplay Showcase",
      description: "A showcase clip of Site 23's procedural generation in action.",
      poster: "images/hero/site-23.png",
      sources: [{ src: "videos/showcase/site-23.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Site 23 — Technical Showcase",
        description: "An inside look at the procedural generation pipeline and constraint solver.",
        poster: "images/hero/site-23.png",
        sources: [{ src: "videos/showcase/site-23-technical.mp4", type: "video/mp4" }]
      }
    },
    "data-hunters": {
      enabled: false,
      title: "Data Hunters — Gameplay Showcase",
      description: "A showcase clip of Data Hunters multiplayer systems in action.",
      poster: "images/hero/data-hunters.png",
      sources: [{ src: "videos/showcase/data-hunters.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Data Hunters — Technical Showcase",
        description: "An inside look at the server-authoritative networking and weapon framework.",
        poster: "images/hero/data-hunters.png",
        sources: [{ src: "videos/showcase/data-hunters-technical.mp4", type: "video/mp4" }]
      }
    },
    "your-shadow": {
      enabled: false,
      title: "Your Shadow — Gameplay Showcase",
      description: "A showcase clip of Your Shadow's horror gameplay and stalking AI.",
      poster: "images/hero/your-shadow.png",
      sources: [{ src: "videos/showcase/your-shadow.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Your Shadow — Technical Showcase",
        description: "An inside look at the stalking AI behavior model and procedural map generation.",
        poster: "images/hero/your-shadow.png",
        sources: [{ src: "videos/showcase/your-shadow-technical.mp4", type: "video/mp4" }]
      }
    },
    "rps": {
      enabled: true,
      title: "RPS — Gameplay Showcase",
      description: "A showcase clip of RPS gameplay.",
      poster: "images/hero/rps.png",
      sources: [{ src: "videos/showcase/rps.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "RPS — Technical Showcase",
        description: "An inside look at the game loop and system architecture of RPS.",
        poster: "images/hero/rps.png",
        sources: [{ src: "videos/showcase/rps-technical.mp4", type: "video/mp4" }]
      }
    },
    "slime-dungeon": {
      enabled: false,
      title: "Slime Dungeon — Gameplay Showcase",
      description: "A showcase clip of Slime Dungeon gameplay.",
      poster: "images/hero/slime-dungeon.png",
      sources: [{ src: "videos/showcase/slime-dungeon.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Slime Dungeon — Technical Showcase",
        description: "An inside look at the combat loop and procedural dungeon layout.",
        poster: "images/hero/slime-dungeon.png",
        sources: [{ src: "videos/showcase/slime-dungeon-technical.mp4", type: "video/mp4" }]
      }
    }
  },
  engineering: {
    "procedural-map-generation": {
      enabled: true,
      title: "Procedural Map Generation — Showcase",
      description: "A showcase clip of the procedural map generation system.",
      poster: "images/hero/site-23.png",
      sources: [{ src: "videos/showcase/procedural-map-generation.mp4", type: "video/mp4" }],
      technical: {
        enabled: true,
        title: "Procedural Map Generation — Technical Showcase",
        description: "A showcase of the map being generated in real-time. Rooms are placed one after another, then open doorways are filled, furniture is added, then items are placed. Finally, the nav mesh is generated for roaming AI and the map is ready to be played.",
        poster: "images/hero/site-23.png",
        sources: [{ src: "videos/showcase/procedural-map-generation-technical.mp4", type: "video/mp4" }]
      }
    },
    "smart-ai-group-pathfinding": {
      enabled: false,
      title: "Smart AI Group Pathfinding — Showcase",
      description: "A showcase clip of the AI group pathfinding system in action.",
      poster: "images/hero/data-hunters.png",
      sources: [{ src: "videos/showcase/smart-ai-group-pathfinding.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Smart AI Group Pathfinding — Technical Showcase",
        description: "A walkthrough of group weight vectors, avoidance logic, and navigation runtime.",
        poster: "images/hero/data-hunters.png",
        sources: [{ src: "videos/showcase/smart-ai-group-pathfinding-technical.mp4", type: "video/mp4" }]
      }
    },
    "functional-gameplay-architecture": {
      enabled: false,
      title: "Functional Gameplay Architecture — Showcase",
      description: "A showcase of the gameplay architecture system.",
      poster: "images/hero/data-hunters.png",
      sources: [{ src: "videos/showcase/functional-gameplay-architecture.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Functional Gameplay Architecture — Technical Showcase",
        description: "A walkthrough of the framework structure, module boundaries, and state isolation patterns.",
        poster: "images/hero/data-hunters.png",
        sources: [{ src: "videos/showcase/functional-gameplay-architecture-technical.mp4", type: "video/mp4" }]
      }
    },
    "dynamic-weapon-sway": {
      enabled: true,
      title: "Dynamic Weapon Sway — Showcase",
      description: "A showcase clip of the spring-based weapon sway system.",
      poster: "images/hero/dynamic-weapon-sway.jpg",
      sources: [{ src: "videos/showcase/dynamic-weapon-sway.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Dynamic Weapon Sway — Technical Showcase",
        description: "A walkthrough of the spring simulation math, config values, and frame-independent update loop.",
        poster: "images/hero/dynamic-weapon-sway.jpg",
        sources: [{ src: "videos/showcase/dynamic-weapon-sway-technical.mp4", type: "video/mp4" }]
      }
    },
    "server-authoritative-hit-validation": {
      enabled: false,
      title: "Server Authoritative Hit Validation — Showcase",
      description: "A showcase clip of the hit validation system in a live session.",
      poster: "images/hero/data-hunters.png",
      sources: [{ src: "videos/showcase/server-authoritative-hit-validation.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Server Authoritative Hit Validation — Technical Showcase",
        description: "A walkthrough of the latency-aware validation pipeline and damage authority boundary.",
        poster: "images/hero/data-hunters.png",
        sources: [{ src: "videos/showcase/server-authoritative-hit-validation-technical.mp4", type: "video/mp4" }]
      }
    },
    "projectile-simulation": {
      enabled: false,
      title: "Projectile Simulation — Showcase",
      description: "A showcase clip of the ballistic projectile simulation.",
      poster: "images/hero/data-hunters.png",
      sources: [{ src: "videos/showcase/projectile-simulation.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Projectile Simulation — Technical Showcase",
        description: "A walkthrough of the deterministic update path, gravity application, and collision checks.",
        poster: "images/hero/data-hunters.png",
        sources: [{ src: "videos/showcase/projectile-simulation-technical.mp4", type: "video/mp4" }]
      }
    },
    "modular-weapon-framework": {
      enabled: false,
      title: "Modular Weapon Framework — Showcase",
      description: "A showcase clip of the config-driven weapon framework.",
      poster: "images/hero/data-hunters.png",
      sources: [{ src: "videos/showcase/modular-weapon-framework.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Modular Weapon Framework — Technical Showcase",
        description: "A walkthrough of the weapon configuration schema and shared controller architecture.",
        poster: "images/hero/data-hunters.png",
        sources: [{ src: "videos/showcase/modular-weapon-framework-technical.mp4", type: "video/mp4" }]
      }
    },
    "persistent-player-data": {
      enabled: false,
      title: "Persistent Player Data — Showcase",
      description: "A showcase clip of the persistent economy and data system.",
      poster: "images/hero/data-hunters.png",
      sources: [{ src: "videos/showcase/persistent-player-data.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Persistent Player Data — Technical Showcase",
        description: "A walkthrough of the data model, write safety, and session continuity architecture.",
        poster: "images/hero/data-hunters.png",
        sources: [{ src: "videos/showcase/persistent-player-data-technical.mp4", type: "video/mp4" }]
      }
    },
    "matchmaking-lobby-system": {
      enabled: false,
      title: "Matchmaking Lobby System — Showcase",
      description: "A showcase clip of the lobby and matchmaking system.",
      poster: "images/hero/data-hunters.png",
      sources: [{ src: "videos/showcase/matchmaking-lobby-system.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Matchmaking Lobby System — Technical Showcase",
        description: "A walkthrough of the session assembly pipeline and lobby-to-match transition state.",
        poster: "images/hero/data-hunters.png",
        sources: [{ src: "videos/showcase/matchmaking-lobby-system-technical.mp4", type: "video/mp4" }]
      }
    },
    "sandbox-placement-system": {
      enabled: false,
      title: "Sandbox Placement System — Showcase",
      description: "A showcase clip of the sandbox placement system.",
      poster: "images/hero/site-23.png",
      sources: [{ src: "videos/showcase/sandbox-placement-system.mp4", type: "video/mp4" }],
      technical: {
        enabled: false,
        title: "Sandbox Placement System — Technical Showcase",
        description: "A walkthrough of the placement validation, snapping logic, and grid constraint system.",
        poster: "images/hero/site-23.png",
        sources: [{ src: "videos/showcase/sandbox-placement-system-technical.mp4", type: "video/mp4" }]
      }
    }
  }
};
