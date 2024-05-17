'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  CommentBox,
  SingleComment,
  useIntersectionObserver,
} from 'ui/dist/index.mjs';

import { totalComments } from './utils';
import { useSession } from '../../context/SessionProvider';
import { getComments, postComment } from '../../src/graphql';

interface Props {
  postId: string;
}

export const Comments: FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement | null>(null);
  const { isIntersecting } = useIntersectionObserver(ref, {});
  const [seen, setSeen] = useState(false);

  const session = useSession();
  const fetchComments = useCallback(async () => {
    const res = await getComments(postId);
    setComments(res?.comments);
  }, [postId]);

  useEffect(() => {
    if (isIntersecting) {
      setSeen(true);
      fetchComments();
    }
    setReplyTo(undefined);
  }, [fetchComments, isIntersecting]);

  const onSubmit = (text: string, child?: boolean) => {
    if (!session?.user?.name) {
      return session.showLogin(true);
    }
    if (child && !replyTo) return;
    if (!text) return alert('Please enter a comment');
    postComment(postId, text, child ? replyTo : undefined).then(fetchComments);
  };

  return (
    <div id="comment" ref={ref}>
      <section className="py-4 lg:py-8 antialiased">
        <div className="mx-auto ">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              Discussion ({totalComments(comments)})
            </h2>
          </div>
          {seen && <CommentBox onSubmit={onSubmit} />}
        </div>
        <div className="flex gap-3 flex-col">
          {comments.map((comment) => {
            return (
              <SingleComment
                {...comment}
                key={comment.id}
                setReplyTo={setReplyTo}
                replyToCommentId={replyTo}
                onSubmitReply={(text) => onSubmit(text, true)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Comments;
