import { FC, useEffect, useRef, useState } from 'react';

import { TextToSpeech } from './api';
import { IconPause, IconPlay } from '../icons';

export const Speak: FC<{ html: string }> = ({ html }) => {
  const speechRef = useRef<TextToSpeech>();
  const [mounted, setMounded] = useState(false);
  const cursorRef = useRef<number>(-1);
  const elementsRef = useRef<NodeListOf<Element>>();
  const [s, setS] = useState('');

  const status = (event) => {
    if (event.type === 'end') speak();
    if (speechRef.current) setS(speechRef.current.getStatus());
  };

  useEffect(() => {
    const tts = new TextToSpeech();
    if (tts) {
      speechRef.current = tts;
      setMounded(true);
      if (!speechRef.current) return;
      tts.engine.addEventListener('end', status.bind(this));
      tts.engine.addEventListener('pause', status.bind(this));
      tts.engine.addEventListener('resume', status.bind(this));
      tts.engine.addEventListener('start', status.bind(this));
    }
    return () => {
      if (!speechRef.current) return;
      elementsRef.current = undefined;
      tts.cancel();
      speechRef.current.engine.removeEventListener('end', status.bind(this));
      speechRef.current.engine.removeEventListener('pause', status.bind(this));
      speechRef.current.engine.removeEventListener('resume', status.bind(this));
      speechRef.current.engine.removeEventListener('start', status.bind(this));
    };
  }, []);

  useEffect(() => {
    const div = document.querySelector('.prose');
    const elements = div?.querySelectorAll('h1,h2,h3,h4,h5,h6,p,blockquote,li');
    elementsRef.current = elements;
    cursorRef.current = -1;
  }, [html]);

  const speak = () => {
    if (s === 'paused') {
      setS('speaking');
      return speechRef.current?.resume();
    }
    if (!elementsRef.current) return;
    const current = elementsRef.current[cursorRef.current];
    if (current) current.classList.remove('highlight-speech');
    cursorRef.current += 1;

    if (elementsRef.current && elementsRef.current.length > cursorRef.current) {
      const node = elementsRef.current[cursorRef.current];
      node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      node.classList.add('highlight-speech');
      speechRef.current?.speak(node.textContent ?? '');
      setS('speaking');
    } else {
      cursorRef.current = -1;
    }
  };

  if (!speechRef.current) return null;
  return s === 'speaking' ? (
    <button
      onClick={() => {
        speechRef.current?.pause();
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
