import { MeFragmentFragment } from 'letterpad-sdk';
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';

import SocialIcon from '../../components/social-icons';

export const SocialIcons = ({ me }: { me: MeFragmentFragment }) => {
  return (
    <div className="inline-flex gap-2">
      <SocialIcon
        icon={<FaGithub className="h-5 w-5" />}
        href={me.social?.github}
      />
      <SocialIcon
        icon={<FaLinkedin className="h-5 w-5" />}
        href={me.social?.linkedin}
      />
      <SocialIcon
        icon={<FaTwitter className="h-5 w-5" />}
        href={me.social?.twitter}
      />
      <SocialIcon
        icon={<FaFacebook className="h-5 w-5" />}
        href={me.social?.twitter}
      />
      <SocialIcon
        icon={<FaInstagram className="h-5 w-5" />}
        href={me.social?.twitter}
      />
    </div>
  );
};
