import { decodeJwt, jwtVerify, SignJWT } from "jose";

import {
  ForgotPasswordToken,
  UnsubscribeToken,
  VerifySubscriberToken,
} from "../types";

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.SECRET_KEY)
  );
  return payload;
}

export function decodeJWTToken<T>(token: string) {
  return decodeJwt(token) as T;
}

export function getClientToken({ email }: { email: string }) {
  return sign({ email }, "1000y");
}

export function getVerifyUserToken({ email, author_id }) {
  return sign({ email, author_id });
}

export function getVerifySubscriberToken({
  email,
  author_id,
  subscriber_id,
}: VerifySubscriberToken) {
  return sign({ email, author_id, subscriber_id });
}

export function getForgotPasswordToken({ email }: ForgotPasswordToken) {
  return sign({ email });
}

export function getUnsubscribeToken({
  email,
  author_id,
  subscriber_id,
}: UnsubscribeToken) {
  return sign({ email, author_id, subscriber_id }, "1000y");
}

function sign(payload: any, validityInHours = "2h"): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime("2h")
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.SECRET_KEY));
}
