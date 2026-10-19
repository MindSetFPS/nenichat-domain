"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dateToHuman;
function dateToHuman(date) {
    if (!date)
        return '';
    const dateObject = new Date(date);
    const now = new Date();
    const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
    if (isSameDay(dateObject, now)) {
        return dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (isSameDay(dateObject, yesterday)) {
        return 'Ayer';
    }
    return dateObject.toLocaleDateString('es-ES'); // dd/mm/yyyy
}
