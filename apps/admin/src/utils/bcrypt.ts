export const isPasswordValid = async (password: string, hash: string) => {
  const req = await fetch(
    process.env.ROOT_URL + "/api/bcrypt?password=" + password + "&hash=" + hash
  );
  const res = await req.json();
  return res.match;
};

export const getHashedPassword = async (password: string) => {
  const req = await fetch(
    process.env.ROOT_URL + "/api/bcrypt?password=" + password
  );
  const res = await req.json();
  return res.hash;
};
