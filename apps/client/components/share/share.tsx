'use client';
import { GrReddit } from 'react-icons/gr';
import { ImLinkedin2, ImTwitter } from 'react-icons/im';
import {
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';

export const Share = ({ title, summary, url, className }) => {
  return (
    <div
      className={'flex flex-row items-center justify-start gap-2 ' + className}
    >
      <span className="text-md"></span>
      <div className="flex gap-4 text-sm text-gray-400 hover:bg-slate-200 transition dark:text-gray-300  dark:bg-slate-800 bg-slate-100 py-2 px-6 rounded-full">
        <LinkedinShareButton title={title} summary={summary} url={url}>
          <ImLinkedin2 size={18} className="" />
        </LinkedinShareButton>
        <TwitterShareButton title={summary} url={url}>
          <ImTwitter size={18} />
        </TwitterShareButton>
        <RedditShareButton title={title} url={url}>
          <GrReddit size={20} />
        </RedditShareButton>
      </div>
    </div>
  );
};
