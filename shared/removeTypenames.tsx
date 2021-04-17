export function removeTypenames(data: object) {
  const omitTypename = (key: string, value: any) =>
    key === "__typename" ? undefined : value;
  data = JSON.parse(JSON.stringify(data), omitTypename);

  return data;
}
