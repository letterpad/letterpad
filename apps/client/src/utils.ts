export const getReadableDate = (timestamp: Date | number) => {
  return new Date(timestamp).toLocaleString('en-us', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });
};
