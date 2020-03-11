const retry = <T>(
  fn: () => Promise<T>,
  ms: number = 1000,
  maxRetries: number = 5,
) =>
  new Promise((resolve, reject) => {
    let retries = 0;
    fn()
      .then(resolve)
      .catch(() => {
        setTimeout(() => {
          console.log("retrying failed promise...");
          retries++;
          if (retries == maxRetries) {
            return reject("maximum retries exceeded");
          }
          retry(fn, ms).then(resolve);
        }, ms);
      });
  });

export default retry;
