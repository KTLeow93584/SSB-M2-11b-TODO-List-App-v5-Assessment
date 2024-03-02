// Follows Military Time Format (00:00 to 23:59)
const gameInfo = [
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
    },
];

export default gameInfo;