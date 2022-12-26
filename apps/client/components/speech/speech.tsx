import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { TextToSpeech } from './api';
import { IconPause, IconPlay } from '../icons';

let tts: TextToSpeech | null = null;
if (typeof window !== 'undefined') {
  tts = new TextToSpeech();
}
export const Speak: FC<{ html: string }> = ({ html }) => {
  const [, setMounted] = useState(false);
  const cursorRef = useRef<number>(-1);
  const elementsRef = useRef<NodeListOf<Element>>();
  const [s, setS] = useState('');
  const speak = useCallback(() => {
    if (s === 'paused') {
      setS('start');
      return tts?.resume();
    }
    if (!elementsRef.current) return;
    const current = elementsRef.current[cursorRef.current];
    if (current) current.classList.remove('highlight-speech');
    cursorRef.current += 1;

    if (elementsRef.current && elementsRef.current.length > cursorRef.current) {
      const node = elementsRef.current[cursorRef.current];
      node.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      node.classList.add('highlight-speech');
      tts?.speak(node.textContent ?? '');
      setS('start');
    } else {
      cursorRef.current = -1;
    }
  }, [s, elementsRef]);

  useEffect(() => {
    const status = (event) => {
      if (event.type === 'end') speak();
      if (tts) setS(event.type);
    };
    //@ts-ignore
    if (!window.chrome || !('speechSynthesis' in window) || !tts) {
      return;
    }

    setMounted(true);
    tts.engine.addEventListener('end', status.bind(this));
    tts.engine.addEventListener('pause', status.bind(this));
    tts.engine.addEventListener('resume', status.bind(this));
    tts.engine.addEventListener('start', status.bind(this));

    return () => {
      if (!tts) return;
      // elementsRef.current = undefined;
      tts?.cancel();
      tts?.engine.removeEventListener('end', status.bind(this));
      tts?.engine.removeEventListener('pause', status.bind(this));
      tts?.engine.removeEventListener('resume', status.bind(this));
      tts?.engine.removeEventListener('start', status.bind(this));
    };
  }, [html, speak]);

  useEffect(() => {
    const div = document.querySelector('.prose');
    const elements = div?.querySelectorAll('h1,h2,h3,h4,h5,h6,p,blockquote,li');
    elementsRef.current = elements;
    cursorRef.current = -1;
  }, [html]);

  if (!tts) return null;
  return s === 'start' ? (
    <button
      onClick={() => {
        clearTimeout(tts?.timeout);
        tts?.pause();
        setS('paused');
      }}
    >
      <IconPause />
    </button>
  ) : (
    <button onClick={() => speak()}>
      <IconPlay />
    </button>
  );
};
