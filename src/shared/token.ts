import jwt from "jsonwebtoken";

export function getToken(email: string, validityInMins: number = 10) {
  let option = { expiresIn: validityInMins * 60 * 1000 } as any;
  if (validityInMins === 0) {
    option = {};
  }
  const token = jwt.sign({ email: email }, process.env.SECRET_KEY, option);
  return token;
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.SECRET_KEY);
}

export function decodeToken(token: string) {
  return jwt.decode(token) as any;
}
