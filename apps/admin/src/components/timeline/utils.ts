export const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  // const period = hours >= 12 ? "pm" : "am";

  // Format day with ordinal suffix
  const dayWithSuffix =
    day +
    ([11, 12, 13].includes(day % 100)
      ? "th"
      : day % 10 === 1
      ? "st"
      : day % 10 === 2
      ? "nd"
      : day % 10 === 3
      ? "rd"
      : "th");

  const formattedDate = `${dayWithSuffix} ${month}, ${pad(hours)}:${pad(
    minutes
  )}:${pad(seconds)}`;

  return formattedDate;
};

const pad = (a: number) => {
  return a.toString().padStart(2, "0");
};
