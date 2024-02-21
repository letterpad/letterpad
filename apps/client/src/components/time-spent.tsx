'use client';

import Cookies from 'js-cookie';
import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { useIdle, useIntersectionObserver } from 'ui';

interface Props {
  id: number | string;
  type: 'post';
  idleTimeMs?: number;
}

const sendEvent = async (props) => {
  const url = new URL('/redirect-api/events/pagetime', window.location.href);
  const params = new URLSearchParams(
    props as unknown as Record<string, string>
  );
  url.search = params.toString();
  return await fetch(url.href).then((res) => res.json());
};

const EVENT_INTERVAL = 10;
const IDLE_TIMEOUT = 10;

export const TimeSpent: FC<Props> = memo(
  ({ id, type, idleTimeMs = IDLE_TIMEOUT * 1000 }) => {
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const isIntersecting = useIntersectionObserver(nodeRef, {});
    const timeRef = useRef(Date.now());
    const isIdle = useIdle(idleTimeMs);
    const heartBeatRef = useRef<NodeJS.Timeout>();
    const endRef = useRef<HTMLDivElement>(null);
    const isEnd = useIntersectionObserver(endRef, {});

    const startTimer = useCallback(() => {
      heartBeatRef.current = setInterval(async () => {
        const res = await sendEvent({
          id,
          type,
          time: Date.now() - timeRef.current,
        });
        if (!res.continue) {
          setEndCookie(id);
          stopTimer();
        }
        timeRef.current = Date.now();
      }, EVENT_INTERVAL * 1000);
    }, [id, type]);

    const stopTimer = () => {
      clearTimeout(heartBeatRef.current);
    };

    useEffect(() => {
      if (isEnd) {
        setEndCookie(id);
        stopTimer();
      }
    }, [id, isEnd, type]);

    useEffect(() => {
      nodeRef.current = document.querySelector('#article-content');
    }, []);

    useEffect(() => {
      if (Cookies.get(getCookieName(id))) {
        return;
      }
      if (isIdle || !isIntersecting) {
        stopTimer();
        return;
      }
      timeRef.current = Date.now();
      startTimer();
    }, [isIdle, isIntersecting, startTimer, id]);

    return <div ref={endRef} />;
  }
);

TimeSpent.displayName = 'TimeSpent';

function getCookieName(id: string | number) {
  return `post-${id}`;
}

function setEndCookie(id: string | number) {
  Cookies.set(getCookieName(id), Date.now(), { expires: 7, path: '' });
}
