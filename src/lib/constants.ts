export const PLUGIN_NAME = "Meal Planner";
export const PLUGIN_VERSION = "1.0.0";

export const KEYS = {
    // Setting keys
    weekStart: 'weekStart'
} as const;

export const DAYS_OF_WEEK = {
    sunday: {
        key: 'sunday',
        label: 'Sunday',
        short: 'Sun',
        order: 0
    },
    monday: {
        key: 'monday',
        label: 'Monday',
        short: 'Mon',
        order: 1
    },
    tuesday: {
        key: 'tuesday',
        label: 'Tuesday',
        short: 'Tue',
        order: 2
    },
    wednesday: {
        key: 'wednesday',
        label: 'Wednesday',
        short: 'Wed',
        order: 3
    },
    thursday: {
        key: 'thursday',
        label: 'Thursday',
        short: 'Thu',
        order: 4
    },
    friday: {
        key: 'friday',
        label: 'Friday',
        short: 'Fri',
        order: 5
    },
    saturday: {
        key: 'saturday',
        label: 'Saturday',
        short: 'Sat',
        order: 6
    }
} as const;