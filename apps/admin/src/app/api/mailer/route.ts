import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { getServerSession } from "@/graphql/context";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function POST(req: Request) {
  const session = await getServerSession({ req });
  const data = await req.json();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const promise = await new Promise((resolve, reject) =>
      transporter.sendMail(data, function (err, info) {
        if (err) reject(err);
        else resolve(info);
      })
    );
    return NextResponse.json(promise, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
