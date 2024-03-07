// ===============================================
// Category: G
const genshinImpactInfo = {
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
};

const guardianTalesInfo = {
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
};
// ===============================================
const games = [
    genshinImpactInfo,
    guardianTalesInfo
];

export default games;
// ===============================================