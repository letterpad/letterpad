import { GrReddit } from 'react-icons/gr';
import { ImLinkedin2, ImReddit, ImTwitter } from 'react-icons/im';
import {
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
export const Share = ({ title, summary, url, className }) => {
  return (
    <div
      className={'flex flex-col items-center justify-start gap-8 ' + className}
    >
      <div className="flex gap-4 text-sm text-gray-300 transition dark:text-gray-500">
        <LinkedinShareButton title={title} summary={summary} url={url}>
          <ImLinkedin2 size={18} className="hover:text-accent-50" />
        </LinkedinShareButton>
        <TwitterShareButton title={summary} url={url}>
          <ImTwitter size={18} className="hover:text-accent-50" />
        </TwitterShareButton>
        <RedditShareButton title={title} url={url}>
          <GrReddit size={20} className="hover:text-accent-50" />
        </RedditShareButton>
      </div>
    </div>
  );
};
