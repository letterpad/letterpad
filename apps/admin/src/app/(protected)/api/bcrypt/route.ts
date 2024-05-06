import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const password = params.get("password");
  const hash = params.get("hash");
  if (password) {
    if (hash) {
      const match = await bcrypt.compare(password, hash);
      return NextResponse.json({ match }, { status: 200 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    return NextResponse.json({ hash: hashedPassword }, { status: 200 });
  }
}
