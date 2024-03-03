// Follows Military Time Format (00:00 to 23:59)
const gameInfo = [
    // Aether Gazer 
    {
        id: "aether-gazer",
        title: "Aether Gazer",
        icon: "aether-gazer.webp",
        supportedRegions: [
            {
                name: "Global",
                serverResetHour: 5,
                serverResetMinute: 0,
                timezoneOffsetHours: -7,
                timezoneOffsetMinutes: 0
            }
        ]
    },
    // Alchemy Stars
    {
        id: "alchemy-stars",
        title: "Alchemy Stars",
        icon: "alchemy-stars.webp",
        supportedRegions: [
            {
                name: "Global",
                serverResetHour: 5,
                serverResetMinute: 0,
                timezoneOffsetHours: 0,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Japan",
                serverResetHour: 10,
                serverResetMinute: 0,
                timezoneOffsetHours: 9,
                timezoneOffsetMinutes: 0
            },
            {
                name: "LATAM",
                serverResetHour: 5,
                serverResetMinute: 0,
                timezoneOffsetHours: -3,
                timezoneOffsetMinutes: 0
            },
            {
                name: "South East Asia",
                serverResetHour: 5,
                serverResetMinute: 0,
                timezoneOffsetHours: 8,
                timezoneOffsetMinutes: 0
            }
        ]
    },
    // Blue Archive
    {
        id: "blue-archive",
        title: "Blue Archive",
        icon: "blue-archive.webp",
        supportedRegions: [
            {
                name: "Global",
                serverResetHour: 19,
                serverResetMinute: 0,
                timezoneOffsetHours: 0,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Japan",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: 9,
                timezoneOffsetMinutes: 0
            }
        ]
    },
    // Genshin Impact
    {
        id: "genshin-impact",
        title: "Genshin Impact",
        icon: "genshin-impact.webp",
        supportedRegions: [
            {
                name: "America",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: -5,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Asia",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: 8,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Europe",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: 1,
                timezoneOffsetMinutes: 0
            }
        ]
    },
    // Guardian Tales
    {
        id: "guardian-tales",
        title: "Guardian Tales",
        icon: "guardian-tales.webp",
        supportedRegions: [
            {
                name: "Asia",
                serverResetHour: 0,
                serverResetMinute: 0,
                timezoneOffsetHours: 8,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Europe",
                serverResetHour: 0,
                serverResetMinute: 0,
                timezoneOffsetHours: 8,
                timezoneOffsetMinutes: 0
            },
            {
                name: "North America",
                serverResetHour: 0,
                serverResetMinute: 0,
                timezoneOffsetHours: -8,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Central America",
                serverResetHour: 0,
                serverResetMinute: 0,
                timezoneOffsetHours: -3,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Oceanic",
                serverResetHour: 0,
                serverResetMinute: 0,
                timezoneOffsetHours: 10,
                timezoneOffsetMinutes: 0
            }
        ]
    },
    // Honkai Impact 3rd
    {
        id: "honkai-impact-3rd",
        title: "Honkai Impact 3rd",
        icon: "honkai-impact-3rd.webp",
        supportedRegions: [
            {
                name: "America",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: -5,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Asia",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: 8,
                timezoneOffsetMinutes: 0
            },
            {
                name: "China",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: 8,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Europe",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: 1,
                timezoneOffsetMinutes: 0
            }
        ]
    },
    // Honkai Star Rail
    {
        id: "honkai-star-rail",
        title: "Honkai Star Rail",
        icon: "honkai-star-rail.webp",
        supportedRegions: [
            {
                name: "America",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: -5,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Asia",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: 8,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Europe",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: 1,
                timezoneOffsetMinutes: 0
            }
        ]
    },
    // Memento Mori
    {
        id: "memento-mori",
        title: "Memento Mori",
        icon: "memento-mori.webp",
        supportedRegions: [
            {
                name: "Europe/Global",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: 1,
                timezoneOffsetMinutes: 0
            },
            {
                name: "America",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: -7,
                timezoneOffsetMinutes: 0
            }
        ]
    },
    // Punishing Gray Raven
    {
        id: "punishing-gray-raven",
        title: "Punishing Gray Raven",
        icon: "punishing-gray-raven.webp",
        supportedRegions: [
            {
                name: "China & Taiwan",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: -6,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Global",
                serverResetHour: 7,
                serverResetMinute: 0,
                timezoneOffsetHours: 0,
                timezoneOffsetMinutes: 0
            },
            {
                name: "Japan",
                serverResetHour: 4,
                serverResetMinute: 0,
                timezoneOffsetHours: 9,
                timezoneOffsetMinutes: 0
            }
        ]
    },
    // Reverse: 1999
    {
        id: "reverse-1999",
        title: "Reverse: 1999",
        icon: "reverse-1999.webp",
        supportedRegions: [
            {
                name: "Global",
                serverResetHour: 5,
                serverResetMinute: 0,
                timezoneOffsetHours: -5,
                timezoneOffsetMinutes: 0
            }
        ]
    },
    // Pokemon UNITE
    {
        id: "pokemon-unite",
        title: "Pokemon UNITE",
        icon: "pokemon-unite.webp",
        supportedRegions: [
            {
                name: "Global",
                serverResetHour: 0,
                serverResetMinute: 0,
                timezoneOffsetHours: 0,
                timezoneOffsetMinutes: 0
            }
        ]
    }
];

export default gameInfo;