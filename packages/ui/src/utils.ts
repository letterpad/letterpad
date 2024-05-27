export const disableScroll = (flag: boolean) => {
  if (flag) {
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.overflowY = "scroll";
  }
};


export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>));
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>));
  }
}
export function throttle<T extends (...args: any[]) => void>(delay: number, func: T) {
  let timeout: ReturnType<typeof setTimeout> | null;
  let lastExecTime = 0;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const currentExecTime = Date.now();
    const elapsed = currentExecTime - lastExecTime;

    const execute = () => {
      func.apply(this, args);
      lastExecTime = currentExecTime;
    };

    if (!timeout) {
      execute();
      timeout = setTimeout(() => {
        timeout = null;
      }, delay);
    } else if (elapsed >= delay) {
      execute();
    }
  };
}

export const getRootUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
    const protocol = "https://";
    return new URL(
      protocol + process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
    ).toString();
  }
  if (typeof process.env.NEXT_PUBLIC_ROOT_URL === "undefined") {
    throw new Error("NEXT_PUBLIC_ROOT_URL is not defined in apps/admin/.env")
  }
  return new URL(process.env.NEXT_PUBLIC_ROOT_URL).toString();
};