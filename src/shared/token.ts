import jwt from "jsonwebtoken";

interface GetToken {
  data: Record<any, any>;
  validityInMins?: number;
  algorithm?: string;
}
export function getToken({
  validityInMins = 10,
  data,
  algorithm = "",
}: GetToken) {
  let option = { expiresIn: validityInMins * 60 } as any;
  if (validityInMins === 0) {
    option = {};
  }
  if (algorithm) {
    option.algorithm = "HS256";
  }
  const token = jwt.sign(data, process.env.SECRET_KEY, option);
  return token;
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.SECRET_KEY);
}

export function decodeToken(token: string) {
  return jwt.decode(token) as any;
}
