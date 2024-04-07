import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "@/graphql/context";

export async function POST(req: Request): Promise<Response> {
  const session = await getServerSession({ req });
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const setting = await prisma.setting.findFirst({
    where: {
      author_id: session.user.id,
    },
  });
  const openai_api_key = setting?.openai_key;

  if (!openai_api_key || openai_api_key === "") {
    return new Response(
      "Missing OPENAI_API_KEY – Add the openai key in settings under Open AI.",
      {
        status: 400,
      }
    );
  }

  const openai = new OpenAI({
    apiKey: openai_api_key,
  });

  let { prompt, field = "post" } = await req.json();

  if (field === "excerpt") {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are SEO expert who is responsible to write meta descriptions of a blog. " +
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
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  }

  if (field === "html_draft") {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            `You will receive a block of HTML. Your task is to identify and correct any mistakes and provide suggestions to improve its quality. Your suggestions should fall in one of this category: typo, grammar, sentence, word choice, alternate sentence, spacing, or formatting.
            For each correction, wrap the relevant word or sentence with a <span> tag and add the appropriate data attribute with meaningful reasons. 
            Example:

            <p>She looks so <span data-type="word-choice" data-original="good">beautiful</span>.</p>
            <p>When I <span data-type="alternate-sentence" data-original="got up in the morning">woke up</span> at 10am, it was already very bright..</p>
           `,
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
