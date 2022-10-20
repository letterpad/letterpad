import {
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

export const Share = ({ title, summary, url }) => {
  return (
    <div className="flex gap-2">
      <LinkedinShareButton title={title} summary={summary} url={url}>
        <LinkedinIcon size={30} />
      </LinkedinShareButton>
      <TwitterShareButton title={summary} url={url}>
        <TwitterIcon size={30} />
      </TwitterShareButton>
      <RedditShareButton title={title} url={url}>
        <RedditIcon size={30} />
      </RedditShareButton>
    </div>
  );
};
