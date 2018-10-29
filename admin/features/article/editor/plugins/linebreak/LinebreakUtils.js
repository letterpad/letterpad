export const applyLinebreak = (change, type = "line-break") =>
  change.insertBlock({
    type: type,
    isVoid: true,
  });
