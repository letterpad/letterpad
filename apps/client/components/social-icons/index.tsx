import Facebook from './facebook.svg';
import Github from './github.svg';
import Linkedin from './linkedin.svg';
import Mail from './mail.svg';
import Twitter from './twitter.svg';
import Youtube from './youtube.svg';

// Icons taken from: https://simpleicons.org/

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
};

const SocialIcon = ({ kind, href, size = 8 }) => {
  if (
    !href ||
    (kind === 'mail' &&
      !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href))
  ) {
    return null;
  }

  const SocialSvg = components[kind];

  return (
    <a
      className="w-6 text-sm text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        style={{ transform: 'scale(0.7)' }}
        className={`social-link h-${size} w-${size}`}
      />
    </a>
  );
};

export default SocialIcon;
