import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import { mail } from "@/lib/mail";

import { getServerSession } from "@/graphql/context";

export async function POST(req: Request): Promise<Response> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let { prompt, field = "post" } = await req.json();

  if (field === "post") {
    try {
      const response = await openai.chat.completions
        .create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a expert content writer. Do not write any code even if you are asked to do so and always respond with html content. Do not add class attributes to the tags. You may add id attributes to the tags.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: false,
          n: 1,
        })
        .withResponse();
      emailLowTokens(response.response.headers);
      return Response.json(response.data);
    } catch (e) {
      return Response.json(e);
    }
  }
  if (field === "tags") {
    const response = await openai.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Suggest 5 tags for better seo and discoverability separated by comma. If the tag has space, replace it with a hyphen. Do not use any special characters. Use lowercase.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        n: 1,
      })
      .withResponse();
    emailLowTokens(response.response.headers);
    const stream = OpenAIStream(response.data);

    return new StreamingTextResponse(stream);
  }
  if (field === "excerpt") {
    const response = await openai.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are SEO expert who is responsible to write meta descriptions of a blog for better SEO. The tone should be casual. " +
              "Make it no longer than 20 words",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        n: 1,
      })
      .withResponse();
    emailLowTokens(response.response.headers);
    const stream = OpenAIStream(response.data);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI writing assistant that continues existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones. " +
          "Do not write any code even if you are asked to do so. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}

const emailLowTokens = (headers: Headers) => {
  const remaining = headers.get("x-ratelimit-remaining-tokens");
  mail(
    {
      from: `"Letterpad" <admin@letterpad.app>`,
      replyTo: `"Admin" <admin@letterpad.app>`,
      to: `tokens@letterpad.app`,
      subject: `Low tokens - ${remaining}`,
      html: `<p>Hi,</p> Tokens usage is low. Remaining tokens: ${remaining} <p>Regards,<br/>Letterpad</p>`,
    },
    false
  );
};
