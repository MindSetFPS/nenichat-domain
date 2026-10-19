import type { FilterFn } from "@tanstack/react-table";
/**
 * a function that can filter rows by today, this week, this month or this year. it returns true if the row matches the filter value.
 * @param row
 * @param columnId
 * @param value
 * @returns
 */
export declare const dateIntervalFilter: FilterFn<any>;
