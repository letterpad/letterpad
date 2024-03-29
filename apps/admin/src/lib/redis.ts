import { Redis } from "@upstash/redis";

let client: Redis;

if (process.env.REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
  client = new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
  });
}
export const incrementPageViews = async (key: string, value: string) => {
  await client?.sadd(key, value);
};

export const getPageViewsForPost = async (postId: string): Promise<number> => {
  const count = await client?.scard(getKeyForViews("post", postId));
  return count;
};

export const getAllPageViews = async () => {
  const [, keys] = await client?.scan(0, { count: 50, match: "views*" });
  return await Promise.all(
    keys.map((key) => {
      return new Promise<{ key: string; count: number }>(async (resolve) => {
        resolve({ key, count: await client?.scard(key) });
      });
    })
  );
};

export const delAllPageViews = async (...keys) => {
  return await client?.del(...keys);
};

export const queueSubscribeEmails = async (
  postId: string,
  data: Array<any>
) => {
  if (!data.length) return;
  await client?.json.set(getKeyForEmailSubscription(postId), "$", data, {
    nx: true,
  });
};

export const getQueuedSubscriberEmails = async (postId: string) => {
  return await client?.json.get<any>(getKeyForEmailSubscription(postId));
};

export const delQueuedSubscriberEmails = async (...keys) => {
  return await client?.del(...keys);
};

export const getKeyForViews = (type: string, id: string | number) => {
  return `views:${type}:${id}`;
};

export const getKeyForEmailSubscription = (id: string) => {
  return `mail:post:${id}`;
};
