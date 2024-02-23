'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { CommentBox, SingleComment } from 'ui';

import { getComments, postComment } from '../../src/graphql';
import { getReadableDate } from '../../src/utils';

interface Props {
  postId: number;
}

export const Comments: FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);

  const fetchComments = useCallback(async () => {
    const res = await getComments(postId);
    setComments(res?.comments);
  }, [postId]);

  useEffect(() => {
    fetchComments();
    setReplyTo(undefined);
  }, [fetchComments]);

  const onSubmit = (text: string, child?: boolean) => {
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

// const SingleComment = ({
//   author,
//   id,
//   replies = [],
//   content,
//   createdAt,
//   child = false,
//   refetch = () => {},
//   postId,
//   replyTo,
//   setReplyTo,
// }) => {
//   return (
//     <>
//       <article
//         className={classNames(
//           'p-4 text-base dark:bg-gray-800/40 bg-gray-50/50 rounded-md',
//           {
//             'border border-gray-200 dark:border-gray-700/30': true,
//             'ml-6': child,
//           }
//         )}
//       >
//         <footer className="flex justify-between items-center mb-2">
//           <div className="flex items-center gap-2">
//             <p className="inline-flex items-center text-sm text-gray-900 dark:text-white font-semibold">
//               <img
//                 className="w-6 h-6 rounded-full bg-blue-200 p-1 mr-2"
//                 src={author.avatar}
//                 alt="Michael Gough"
//               />
//               {author.name}
//             </p>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               <time dateTime="2022-02-08" title="February 8th, 2022">
//                 {getReadableDate(createdAt)}
//               </time>
//             </p>
//           </div>
//         </footer>
//         <div className="flex justify-between items-start flex-col md:flex-row">
//           <p className="text-gray-500 dark:text-gray-400 font-paragraph">
//             {content}
//           </p>
//           {!child && (
//             <div className="flex items-center space-x-4 md:ml-4 mt-4 md:mt-0">
//               <button
//                 type="button"
//                 className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium gap-1"
//                 onClick={() => setReplyTo(id)}
//               >
//                 <GoComment />
//                 Reply
//               </button>
//             </div>
//           )}
//         </div>
//       </article>
//       {!child && replyTo === id && (
//         <CommentBox
//           postId={postId}
//           refetch={refetch}
//           replyTo={id}
//           setReplyTo={setReplyTo}
//         />
//       )}
//       {replies.map((reply) => {
//         return (
//           <SingleComment
//             {...reply}
//             avatar={reply.author.avatar}
//             child={true}
//             key={reply.id}
//           />
//         );
//       })}
//     </>
//   );
// };

// const CommentBox = ({ postId, refetch, replyTo, setReplyTo }) => {
//   const [comment, setComment] = useState('');

//   const onSubmit = (e) => {
//     e.preventDefault();
//     postComment(postId, comment, replyTo).then(refetch);
//     setComment('');
//     setReplyTo?.(null);
//   };

//   return (
//     <form className="mb-6">
//       <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
//         <label htmlFor="comment" className="sr-only">
//           Your comment
//         </label>
//         <textarea
//           value={comment}
//           id="comment"
//           rows={2}
//           className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
//           placeholder="Write a comment..."
//           required
//           onChange={(e) => setComment(e.target.value)}
//         ></textarea>
//       </div>
//       <button
//         onClick={onSubmit}
//         type="submit"
//         className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
//       >
//         Post comment
//       </button>
//     </form>
//   );
// };
