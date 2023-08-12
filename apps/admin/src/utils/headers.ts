export const getHeader = (headers: any, key: string) => {
  if (headers[key]) {
    return headers[key];
  }
  if ("get" in headers && headers.get(key)) {
    return headers.get(key)?.value;
  }

  return null;
};
