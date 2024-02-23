import classNames from "classnames";
import { FC, MouseEvent, useEffect, useRef, useState } from "react";

interface Props {
    onSubmit: (text: string) => void;
    className?: string;
}

export const CommentBox:FC<Props> = ({ onSubmit, className }) => {
    const [comment, setComment] = useState('');
    const ref = useRef<HTMLTextAreaElement>(null);
    const onClick = (e:MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onSubmit(comment);
      setComment('');
    };

    useEffect(() => {
      if (ref.current) {
        ref.current.focus();
      }
    },[]);
  
    return (
      <form className={classNames("mb-6",className)}>
        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            ref={ref}
            value={comment}
            id="comment"
            rows={2}
            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
            placeholder="Write a comment..."
            required
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <button
          onClick={onClick}
          type="submit"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
        >
          Post comment
        </button>
      </form>
    );
  };
  