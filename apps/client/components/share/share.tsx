'use client';
import { GrReddit } from 'react-icons/gr';
import { ImLinkedin2, ImTwitter } from 'react-icons/im';
import { RiShareFill } from 'react-icons/ri';
import {
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';

const iconClass =
  'p-1.5 dark:hover:bg-slate-400/45 hover:bg-slate-200/45 hover:rounded-full flex justify-center items-center';

export const Share = ({ title, summary, url, className }) => {
  return (
    <div
      className={'flex flex-row items-center justify-start gap-2 ' + className}
    >
      <span className="text-md">
        <RiShareFill size={18} />
      </span>
      <div className="flex gap-4 text-sm text-gray-600 hover:bg-slate-200 transition dark:text-gray-300  dark:bg-slate-800 bg-slate-100 py-1.5 px-2 rounded-full">
        <LinkedinShareButton title={title} summary={summary} url={url}>
          <div className={iconClass}>
            <ImLinkedin2 className="h-4 w-4" />
          </div>
        </LinkedinShareButton>
        <TwitterShareButton title={summary} url={url}>
          <div className={iconClass}>
            <ImTwitter className="h-4 w-4" />
          </div>
        </TwitterShareButton>
        <RedditShareButton title={title} url={url}>
          <div className={iconClass}>
            <GrReddit className="h-4 w-4" />
          </div>
        </RedditShareButton>
      </div>
    </div>
  );
};
