import classNames from "classnames";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { FC } from "react";
import { GoComment } from 'react-icons/go';

import { CommentBox } from "./comment-box";

dayjs.extend(relativeTime)

interface Props {
    author: {
        name: string;
        avatar: string;
        siteUrl: string;
    }
    content: string;
    createdAt: Date
    id: string;
    replies: Array<Props>;
    child?: boolean;
    replyToCommentId?: string;
    setReplyTo: (commentId: string) => void;
    onSubmitReply: (text: string) => void;
}

export const SingleComment:FC<Props> = ({
    author,
    id,
    replies = [],
    content,
    createdAt,
    child = false,
    onSubmitReply,
    replyToCommentId,
    setReplyTo,
  }) => {
    const datetime = dayjs(createdAt);
    return (
      <>
        <article
          className={classNames(
            'p-4 text-base dark:bg-gray-800/40 bg-gray-50/50 rounded-md',
            {
              'border border-gray-200 dark:border-gray-700/30': true,
              'ml-6': child,
            }
          )}
        >
          <footer className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <p className="inline-flex items-center text-sm text-gray-900 dark:text-white font-semibold">
                <img
                  className="w-6 h-6 rounded-full bg-blue-200 p-1 mr-2"
                  src={author.avatar}
                  alt="Michael Gough"
                />
                {author.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <time dateTime={datetime.format('YYYY-MM-DDTHH:mm:ssZ[Z]')} title={datetime.format('MMMM D, YYYY h:mm A')}>
                  {dayjs().to(datetime)}
                </time>
              </p>
            </div>
          </footer>
          <div className="flex justify-between items-start flex-col md:flex-row">
            <p className="text-gray-500 dark:text-gray-400 font-paragraph">
              {content}
            </p>
            {!child && (
              <div className="flex items-center space-x-4 md:ml-4 mt-4 md:mt-0">
                <button
                  type="button"
                  className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium gap-1"
                  onClick={() => setReplyTo(id)}
                >
                  <GoComment />
                  Reply
                </button>
              </div>
            )}
          </div>
        </article>
        {!child && replyToCommentId === id && (
          <CommentBox
            onSubmit={onSubmitReply}
            className="ml-6"
          />
        )}
        {replies.map((reply) => {
          return (
            <SingleComment
              {...reply}
              author={reply.author}
              child={true}
              key={reply.id}
            />
          );
        })}
      </>
    );
  };
  