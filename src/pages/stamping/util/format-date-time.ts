import { format } from "date-fns";

export const formatDate = (date: Date) => {
    return date ? format(date, "dd MMMM yyyy").toUpperCase() : new Date().toLocaleDateString();
}

export const timeString = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    const updatedTime = `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    return updatedTime
}

export const timeNowConvert = (now: Date) => {
    const hours = String(now.getHours()).padStart(2, '0'); // Format hours
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Format minutes
    const military_time = `${hours}:${minutes}`
    const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
    const adjustedHours = parseInt(hours) % 12 || 12;
    const ante_meridiem = `${adjustedHours}:${minutes} ${period}`;

    return {
        military_time,
        ante_meridiem
    }

}