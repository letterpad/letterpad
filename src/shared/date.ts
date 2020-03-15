export const getReadableDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("en-us", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
};

export const getDateTime = (timestamp: number) => {
  var ts = new Date(timestamp);
  return ts.toISOString();
};
