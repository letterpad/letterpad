export const getHeader = (headers: Request["headers"], key: string) => {
  if (headers[key]) {
    return headers[key];
  }
  if ("get" in headers && headers.get(key)) {
    return headers.get(key);
  }

  return null;
};
