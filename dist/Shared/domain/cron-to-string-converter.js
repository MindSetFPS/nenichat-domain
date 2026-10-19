"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronToStr = void 0;
const weekdayMap = {
    '0': 'sunday',
    '1': 'monday',
    '2': 'tuesday',
    '3': 'wednesday',
    '4': 'thursday',
    '5': 'friday',
    '6': 'saturday',
    '7': 'sunday',
    'sun': 'sunday',
    'mon': 'monday',
    'tue': 'tuesday',
    'wed': 'wednesday',
    'thu': 'thursday',
    'fri': 'friday',
    'sat': 'saturday'
};
/*
A function that takes a cron
expression and returns internal, dayOfMonth, weekday, etc.

@params cronExpression: string A string representing a cron expression
@returns a CronToStringConverter object
*/
const cronToStr = (cronExpression) => {
    if (!cronExpression)
        return null;
    const parts = cronExpression.split(' ');
    // Standard cron: minute hour dayOfMonth month dayOfWeek
    if (parts.length !== 5)
        return null;
    const [minute, hour, dayOfMonth, month, weekday] = parts;
    let interval = 'custom';
    // Heuristics for interval
    if (dayOfMonth === '*' && month === '*' && weekday === '*') {
        interval = 'daily';
    }
    else if (dayOfMonth === '*' && month === '*' && weekday !== '*') {
        interval = 'weekly';
    }
    else if (dayOfMonth !== '*' && month === '*' && weekday === '*') {
        interval = 'monthly';
    }
    const res = {
        minute,
        hour,
        interval,
        dayOfMonth: dayOfMonth === '*' ? undefined : dayOfMonth,
        weekday: undefined
    };
    if (weekday !== '*') {
        const lowerWeekday = weekday.toLowerCase();
        // Check if it is a number or short string in our map
        if (weekdayMap[lowerWeekday]) {
            res.weekday = weekdayMap[lowerWeekday];
        }
        else {
            // If it's explicitly a full day name (like "monday"), use it if valid
            const validWeekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
            if (validWeekdays.includes(lowerWeekday)) {
                res.weekday = lowerWeekday;
            }
        }
    }
    return res;
};
exports.cronToStr = cronToStr;
