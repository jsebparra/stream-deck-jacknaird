// js/presets.js - Game Presets & Dedicated Payloads for TikTok Live Streamers

window.DEFAULT_PRESETS = [
    {
        id: 'skyrim_live',
        gameName: 'Skyrim',
        category: 'RPG / Aventura',
        emoji: '🗡️',
        title: '🗡️ ¡Estamos EN VIVO explorando Skyrim!',
        description: 'Vuelve la aventura en las frías tierras del norte. Misiones épicas, dragones y mucho chisme en el chat.',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80',
        accentColor: '#5C8A99', // Nordic Ice Blue
        isArchived: false,
        order: 1,
        customFields: [
            { name: '🎮 Juego', value: 'The Elder Scrolls V: Skyrim', inline: true },
            { name: '✨ Modo', value: 'Survival & Lore', inline: true }
        ]
    },
    {
        id: 'minecraft_live',
        gameName: 'Minecraft',
        category: 'Supervivencia',
        emoji: '⛏️',
        title: '⛏️ ¡EN VIVO en Minecraft!',
        description: 'Construyendo grandes proyectos, explorando cuevas peligrosas y pasando un rato agradable en comunidad.',
        imageUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=1000&q=80',
        thumbnailUrl: '',
        accentColor: '#4CAF50', // Emerald Grass Green
        isArchived: false,
        order: 2,
        customFields: [
            { name: '🎮 Juego', value: 'Minecraft Java / Bedrock', inline: true },
            { name: '🧱 Mundo', value: 'Survival Técnico', inline: true }
        ]
    },
    {
        id: 'valorant_live',
        gameName: 'Valorant / FPS',
        category: 'Competitivo',
        emoji: '🎯',
        title: '🎯 ¡Directo de Valorant en TikTok Live!',
        description: 'Hoy se suben rangos... o se intenta con dignidad. Ven a mandar buena vibra y apoyar las jugadas.',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
        thumbnailUrl: '',
        accentColor: '#FF4655', // Crimson Valorant Red
        isArchived: false,
        order: 3,
        customFields: [
            { name: '🎮 Juego', value: 'Valorant', inline: true },
            { name: '🔥 Modo', value: 'Ranked Competitivo', inline: true }
        ]
    },
    {
        id: 'charla_live',
        gameName: 'Charla & Chisme',
        category: 'Just Chatting',
        emoji: '🌸',
        title: '🌸 ¡Charlando en VIVO! Pásate a platicar',
        description: 'Momento chill del día: chisme fresco, buena música, reaccionando a videos y contestando sus preguntas.',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
        thumbnailUrl: '',
        accentColor: '#FFB7C5', // Sakura Blossom Pink
        isArchived: false,
        order: 4,
        customFields: [
            { name: '💬 Tema', value: 'Charla Abierta & Relax', inline: true },
            { name: '☕ Vibra', value: 'Cozy & Chill', inline: true }
        ]
    },
    {
        id: 'torneo_live',
        gameName: 'Torneo Comunidad',
        category: 'Eventos',
        emoji: '🏆',
        title: '🏆 ¡TORNEO CON SEGUIDORES EN VIVO!',
        description: '¡Salas comunitarias abiertas! Ven a unirte a las partidas, competir y pasar un rato divertido con todos.',
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
        thumbnailUrl: '',
        accentColor: '#FFD700', // Nordic Gold
        isArchived: false,
        order: 5,
        customFields: [
            { name: '🏆 Evento', value: 'Salas Abiertas', inline: true },
            { name: '🎟️ Unirse', value: 'Gratis en el Live', inline: true }
        ]
    },
    {
        id: 'sorteo_live',
        gameName: 'Sorteo / Especial',
        category: 'Eventos',
        emoji: '🎁',
        title: '🎉 ¡EVENTO ESPECIAL Y SORTEO EN LIVE!',
        description: '¡Llegamos a una gran meta! Estaremos realizando dinámicas, sorteos especiales y sorpresas durante el directo.',
        imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
        thumbnailUrl: '',
        accentColor: '#9B59B6', // Mystic Purple
        isArchived: false,
        order: 6,
        customFields: [
            { name: '🎁 Sorteo', value: 'Premios & Dinámicas', inline: true }
        ]
    }
];
