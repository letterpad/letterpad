import { NextResponse } from "next/server";
import OpenAI from "openai";

import { prisma } from "@/lib/prisma";

import { TOPIC_PREFIX } from "../../../shared/utils";

export const tags = [
  `${TOPIC_PREFIX}health-&-wellness`,
  `${TOPIC_PREFIX}technology`,
  `${TOPIC_PREFIX}travel-&-adventure`,
  `${TOPIC_PREFIX}entertainment`,
  `${TOPIC_PREFIX}business-&-finance`,
  `${TOPIC_PREFIX}food-&-cooking`,
  `${TOPIC_PREFIX}personal-development`,
  `${TOPIC_PREFIX}science`,
  `${TOPIC_PREFIX}sports`,
  `${TOPIC_PREFIX}art-&-creativity`,
  `${TOPIC_PREFIX}fashion`,
  `${TOPIC_PREFIX}environment`,
  `${TOPIC_PREFIX}education`,
  `${TOPIC_PREFIX}philosophy`,
  `${TOPIC_PREFIX}social-media`,
  `${TOPIC_PREFIX}programming`,
  `${TOPIC_PREFIX}gaming`,
  `${TOPIC_PREFIX}photography`,
  `${TOPIC_PREFIX}literature`,
  `${TOPIC_PREFIX}music`,
  `${TOPIC_PREFIX}film`,
  `${TOPIC_PREFIX}design`,
  `${TOPIC_PREFIX}entrepreneurship`,
  `${TOPIC_PREFIX}mindfulness`,
  `${TOPIC_PREFIX}psychology`,
  `${TOPIC_PREFIX}sustainability`,
  `${TOPIC_PREFIX}history`,
  `${TOPIC_PREFIX}astronomy`,
  `${TOPIC_PREFIX}fitness`,
  `${TOPIC_PREFIX}diy-crafts`,
];

export async function GET(req: Request): Promise<Response> {
  const openai = new OpenAI({
    apiKey: '',
  });

  const posts = await prisma.post.findMany({
    where: {
      status: "published",
      NOT: [
        {
          title: {
            equals: "",
          },
        },
        {
          title: {
            equals: "Coming Soon",
          },
        },
      ],
    },
    select: {
      title: true,
      excerpt: true,
      id: true,
    },
    skip: 750,
    take: 50,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          `You are an excellent blogger who is responsible to assign a tag based on the title of the blog. The tags should be one of this: ${tags.join(", ")}. I will provide with a list of titles in the format id::title. This should be inside an array. The output should be json where the keys are id.
          Example: 
          {
            1:${tags[0]},
            2:${tags[1]},
            3:${tags[2]}
          }
          `
      },
      {
        role: "user",
        content: posts.map((post) => `${post.id}::${post.title} - ${post.excerpt}`).join("\n"),
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false,
    n: 1,
  });
  const data = JSON.parse(response.choices[0].message.content!);

  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const id = keys[i];
    const tag = data[id];

    await new Promise(resolve => setTimeout(resolve, 100)); // Adding delay

    await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        tags: {
          connectOrCreate: {
            where: {
              name: tag,
            },
            create: {
              name: tag,
              slug: tag,
            }
          },
        },
      }
    }).catch((e) => {
      // console.log(tag, id)
    });
  }


  return NextResponse.json(data, { status: 200 })
}
