export interface CronToStringConverter {
    minute: string;
    hour: string;
    dayOfMonth?: string;
    weekday?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    interval: 'daily' | 'weekly' | 'monthly' | 'custom';
}
export declare const cronToStr: (cronExpression: string) => CronToStringConverter | null;
