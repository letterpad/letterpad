import { NextResponse } from "next/server";

import { validateCaptcha } from "@/graphql/resolvers/helpers";

export async function POST(request: Request) {
  const data = await request.json();
  const response = await validateCaptcha(
    process.env.RECAPTCHA_KEY_SERVER,
    data.captchaToken
  );
  return NextResponse.json({ success: response }, { status: 200 });
}
