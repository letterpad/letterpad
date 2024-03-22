import { getRootUrl } from "@/shared/getRootUrl";


export const isPasswordValid = async (password: string, hash: string) => {
  const url = new URL(getRootUrl() + "api/bcrypt");
  url.searchParams.append("password", password);
  url.searchParams.append("hash", hash);

  const req = await fetch(url);
  const res = await req.json();
  return res.match;
};

export const getHashedPassword = async (password: string) => {
  const url = new URL(getRootUrl() + "api/bcrypt");
  url.searchParams.append("password", password);
  const req = await fetch(url);
  const res = await req.json();
  return res.hash;
};
