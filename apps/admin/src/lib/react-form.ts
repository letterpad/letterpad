export const getDirtyFields = <K>(data: any, dirtyFields: any) => {
  const result = Object.entries(dirtyFields as any).reduce((acc, [key]) => {
    acc[key] = data[key];

    return acc;
  }, {} as K);
  return result;
};
