// ===============================================
const pokemonUniteInfo = {
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
};

const punishingGrayRavenInfo = {
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
};
// ===============================================
const games = [
    pokemonUniteInfo,
    punishingGrayRavenInfo
];

export default games;
// ===============================================