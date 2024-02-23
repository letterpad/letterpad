'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { CommentBox, SingleComment } from 'ui';

import { useSession } from '../../context/SessionProvider';
import { getComments, postComment } from '../../src/graphql';

interface Props {
  postId: number;
}

export const Comments: FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
  const session = useSession();

  const fetchComments = useCallback(async () => {
    const res = await getComments(postId);
    setComments(res?.comments);
  }, [postId]);

  useEffect(() => {
    fetchComments();
    setReplyTo(undefined);
  }, [fetchComments]);

  const onSubmit = (text: string, child?: boolean) => {
    if (!session?.user?.name) {
      return session.showLogin(true);
    }
    if (child && !replyTo) return;
    postComment(postId, text, child ? replyTo : undefined).then(fetchComments);
  };

  const total =
    comments.reduce((acc, comment) => {
      return acc + comment.replies.length;
    }, 0) + comments.length;

  return (
    <div id="comment">
      <section className="py-4 lg:py-8 antialiased">
        <div className="mx-auto ">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              Discussion ({total})
            </h2>
          </div>
          <CommentBox onSubmit={onSubmit} />
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
