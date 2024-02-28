'use client';
import { useRef, useState } from 'react';
import { CiTwitter } from 'react-icons/ci';
import { FcReddit } from 'react-icons/fc';
import { PiShareFat } from 'react-icons/pi';
import { RiLinkedinLine } from 'react-icons/ri';
import {
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';
import { Button } from 'ui';

import { useOnClickOutside } from '../../src/hooks/useOnClickOutisde';

const iconClass = 'p-1.5 gap-2 flex justify-center items-center';

export const Share = ({ title, summary, url }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = () => {
    setOpen(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div className="relative" ref={ref}>
      <Button
        className="flex items-center gap-1 font-paragraph text-sm"
        variant="ghost"
        size="small"
        onClick={() => setOpen(!open)}
      >
        <PiShareFat size={18} />
        <span>Share</span>
      </Button>
      {open && (
        <div
          id="dropdownTop"
          className="absolute origin-bottom rounded-md mt-2 w-fit p-2 bottom-full flex flex-col items-start -translate-x-4 font-medium bg-white shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-700 border border-gray-100 text-sm z-20"
          onClick={() => setOpen(false)}
        >
          <LinkedinShareButton title={title} summary={summary} url={url}>
            <div className={iconClass}>
              <RiLinkedinLine className="h-4 w-4" />
              LinkedIn
            </div>
          </LinkedinShareButton>
          <TwitterShareButton title={summary} url={url}>
            <div className={iconClass}>
              <CiTwitter className="h-4 w-4" />
              Twitter
            </div>
          </TwitterShareButton>
          <RedditShareButton title={title} url={url}>
            <div className={iconClass}>
              <FcReddit className="h-4 w-4" />
              Reddit
            </div>
          </RedditShareButton>
        </div>
      )}
    </div>
  );
};
