import Redis from "ioredis";

const client = new Redis(process.env.REDIS_URL!);

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
