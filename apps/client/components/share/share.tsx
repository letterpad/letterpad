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
    <div className="flex flex-col items-center justify-start gap-8">
      <div className="flex gap-1">
        <LinkedinShareButton title={title} summary={summary} url={url}>
          <LinkedinIcon
            size={30}
            round={true}
            iconFillColor="#9e9e9e"
            bgStyle={{ fill: 'transparent' }}
          />
        </LinkedinShareButton>
        <TwitterShareButton title={summary} url={url}>
          <TwitterIcon
            size={30}
            round={true}
            bgStyle={{ fill: 'transparent' }}
            iconFillColor="#9e9e9e"
          />
        </TwitterShareButton>
        <RedditShareButton title={title} url={url}>
          <RedditIcon
            size={30}
            round={true}
            iconFillColor="#9e9e9e"
            bgStyle={{ fill: 'transparent' }}
          />
        </RedditShareButton>
      </div>
    </div>
  );
};
