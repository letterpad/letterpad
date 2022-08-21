import jwt from "jsonwebtoken";

interface GetToken {
  data: Record<any, any>;
  validityInMins?: number;
  algorithm?: string;
}
export function getToken({
  validityInMins = 120,
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

export function getClientToken({ email }: { email: string }) {
  return getToken({
    validityInMins: 0,
    data: { email },
    algorithm: "HS256",
  });
}

export function getVerifyUserToken({ email, author_id }) {
  return getToken({
    data: { email, author_id },
    algorithm: "HS256",
  });
}

export function getVerifySubscriberToken({ email, author_id, subscriber_id }) {
  return getToken({
    data: { email, author_id, subscriber_id },
    algorithm: "HS256",
  });
}

export function getForgotPasswordToken({ email }) {
  return getToken({
    data: { email },
    algorithm: "HS256",
  });
}

export function getUnsubscribeToken({ email }) {
  return getToken({
    data: { email },
    algorithm: "HS256",
    validityInMins: 0,
  });
}
