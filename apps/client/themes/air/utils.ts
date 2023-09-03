export const chunk = <T>(arr: T[], size: number): T[][] =>
  [...Array(Math.ceil(arr.length / size))].map((_, i) =>
    arr.slice(size * i, size + size * i)
  );
