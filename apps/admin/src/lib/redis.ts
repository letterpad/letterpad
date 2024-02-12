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

export const getAllPageViews = async () => {
  const [, keys] = await client.scan(0, { count: 50, match: "views*" });
  return await Promise.all(
    keys.map((key) => {
      return new Promise<{ key: string; count: number }>(async (resolve) => {
        resolve({ key, count: await client.scard(key) });
      });
    })
  );
};

export const delAllPageViews = async (...keys) => {
  return await client.del(...keys);
};

export const queueSubscribeEmails = async (
  postId: number,
  data: Array<any>
) => {
  await client.json.set(getKeyForEmailSubscription(postId), "$", data, {
    nx: true,
  });
};

// export const removePostFromSubscribeEmail = async (postId: number) => {
//   await client.json.del(getKeyForEmailSubscription(postId));
// };

export const getQueuedSubscriberEmails = async (postId: number) => {
  return await client.json.get(getKeyForEmailSubscription(postId));
};

export const delQueuedSubscriberEmails = async (...keys) => {
  return await client.del(...keys);
};

export const getKeyForViews = (type: string, id: string | number) => {
  return `views:${type}:${id}`;
};

export const getKeyForEmailSubscription = (id: number) => {
  return `mail:post:${id}`;
};
