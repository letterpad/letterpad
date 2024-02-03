// Epochs
const epochs = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

// Get duration
const getDuration = (timeAgoInSeconds) => {
  for (let [name, seconds] of epochs) {
    const interval = Math.floor(timeAgoInSeconds / Number(seconds));

    if (interval >= 1) {
      return {
        interval: interval,
        epoch: name,
      };
    }
  }
  return { interval: 0, epoch: "" };
};

// Calculate
export const timeAgo = (date: Date) => {
  const timeAgoInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
  const { interval, epoch } = getDuration(timeAgoInSeconds);
  const suffix = interval === 1 ? "" : "s";

  return `${interval} ${epoch}${suffix} ago`;
};
