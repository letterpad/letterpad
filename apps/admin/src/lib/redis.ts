import { Redis } from "@upstash/redis";

const client = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const incrementPageViews = async (key: string, value: string) => {
  await client.sadd(key, value);
};

export const getPageViewsForPost = async (postId: string): Promise<number> => {
  const count = await client.scard(getKeyForViews("post", postId));
  return count;
};

export const getKeyForViews = (type: string, id: string) => {
  return `${type}:${id}:views`;
};
