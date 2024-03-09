'use client';
import { PageFragmentFragment } from 'letterpad-sdk';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { hasLiked, likePost } from './like.api';
import { useSession } from '../../../context/SessionProvider';

interface ContextProps {
  liked: boolean;
  likesArr: PageFragmentFragment['likes'];
  onLike: () => void;
}

const initial = {
  liked: false,
  likesArr: [],
  onLike: () => {},
};
const Context = createContext<ContextProps>(initial);

interface Props {
  postId: string;
  likes: PageFragmentFragment['likes'];
  children: React.ReactNode;
}

export const LikeProvider: FC<Props> = ({ children, postId, likes }) => {
  const [liked, setLiked] = useState(false);
  const [likesArr, setLikesArr] = useState(likes ?? []);
  const session = useSession();

  useEffect(() => {
    if (!session?.user?.name) {
      return;
    }
    hasLiked(postId).then(setLiked);
  }, [session, postId]);

  const sendRequest = useCallback(async () => {
    if (!session?.user?.name) {
      setLiked(false);
      session.showLogin(true);
    }
    return await likePost(postId);
  }, [session, postId]);

  const onLike = useCallback(async () => {
    setLiked(true);
    try {
      const res = await sendRequest();
      if (!res.likePost.ok) {
        setLiked(false);
      } else {
        setLikesArr((likes) => [
          { avatar: session?.user?.avatar, username: session?.user?.name },
          ...likes,
        ]);
      }
    } catch (e) {
      setLiked(false);
    }
  }, [sendRequest, session?.user?.avatar, session?.user?.name]);

  const value = useMemo(() => {
    return {
      liked,
      likesArr,
      onLike,
    };
  }, [liked, likesArr, onLike]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useLikeContext = () => {
  return useContext(Context);
};
