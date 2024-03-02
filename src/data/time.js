// ==============================================
const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const defaultDenominator = "th";

const denominators = [
    "st",
    "nd",
    "rd"
];

const timezoneAbbrs = {
    "-11": "UTC-11",
    "-10": "UTC-10",
    "-9": "AKST",
    "-8": "PST",
    "-7": "MST",
    "-6": "CST",
    "-5": "UTC-05",
    "-4": "EDT",
    "-3": "UTC-03",
    "-2": "UTC-02",
    "-1": "UTC-01",
    "+0": "UTC",
    "+1": "UTC+01",
    "+2": "UTC+02",
    "+3": "UTC+03",
    "+4": "UTC+04",
    "+5": "UTC+05",
    "+6": "UTC+06",
    "+7": "UTC+07",
    "+8": "SGT",
    "+9": "JST",
    "+10": "AEST",
    "+11": "AEDT",
};
// ==============================================
export function formatTime(date, skipSeconds = false) {
    let hours = date.getHours() % 12;
    const isPm = Math.floor(date.getHours() / 12) >= 1;

    if (hours === 0)
        hours += 12;

    let result = `${hours.toString().padStart(2, "0")}`;
    result += `:${date.getMinutes().toString().padStart(2, "0")}`;

    if (!skipSeconds)
        result += `:${date.getSeconds().toString().padStart(2, "0")} `;

    result += isPm ? " PM" : " AM";

    return result;
}

export function formatDate(date) {
    const dateNo = date.getDate();
    let result = `${days[date.getDay()]},  ${dateNo + (dateNo - 1 >= denominators.length ? defaultDenominator : denominators[dateNo - 1])} 
    ${months[date.getMonth()]}, ${date.getFullYear()}`;

    return result;
}

export function formatTimezone(date, shortFormat = false, skipMinutes = false) {
    const timezoneOffset = date.getTimezoneOffset();
    const minutesPerHour = 60;
    const timezoneHours = Math.floor(Math.abs((timezoneOffset + 30) / minutesPerHour));
    const timezoneMinutes = Math.abs((timezoneOffset + 30) % minutesPerHour);

    let result = `GMT${timezoneOffset < 0 ? "+" : "-"}${timezoneHours.toString().padStart(2, "0")}`;

    if (!skipMinutes)
        result += `:${timezoneMinutes.toString().padStart(2, "0")}`;

    if (!shortFormat)
        result = `${Intl.DateTimeFormat().resolvedOptions().timeZone} - ${result}`;

    return result;
}

export function formatTimezoneSimpleParseH(hours) {
    const hoursAbs = Math.abs(hours);

    let result = `GMT${hours < 0 ? "-" : "+"}`;
    result += `${hoursAbs.toString().padStart(2, "0")}`;
    
    return result;
}

export function formatTimezoneSimpleParseHM(hours, minutes) {
    const hoursAbs = Math.abs(hours);

    let result = `GMT${hours < 0 ? "-" : "+"}`;
    result += `${hoursAbs.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    
    return result;
}
// ==============================================
export { days, months, defaultDenominator, denominators, timezoneAbbrs };
// ==============================================