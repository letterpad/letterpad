export const getDirtyFields = (data: any, dirtyFields: any) => {
  const result = Object.entries(dirtyFields).reduce((acc, [key]) => {
    acc[key] = data[key];

    return acc;
  }, {});
  return result;
};
