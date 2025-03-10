import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import fr from "javascript-time-ago/locale/fr";

TimeAgo.addLocale(en);
TimeAgo.addLocale(fr);

export const timeAgo = (
  dateInput: string | Date,
  locale: string = "en",
): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const timeAgoInstance = new TimeAgo(locale);
  return timeAgoInstance.format(date);
};
