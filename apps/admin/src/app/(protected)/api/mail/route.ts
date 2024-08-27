import { NextResponse } from "next/server";

import { mail } from "@/lib/mail";


export async function POST(request: Request) {
    const data = await request.json();
    await mail({
        html: data.message.replace(/(?:\r\n|\r|\n)/g, "<br>"),
        subject: "Letterpad Contact Form: " + data.subject,
        to: `"Letterpad" <${process.env.SENDER_EMAIL}>`,
        from: `"Letterpad" <${process.env.SENDER_EMAIL}>`,
        replyTo: `"User" <${data.email}>`,
    });

    return new NextResponse(JSON.stringify({ ok: true }), { status: 200 });
}
