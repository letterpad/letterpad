import { TagProps } from '../../types/pageTypes';

export const Tag = ({ posts, me, tagName, settings }: TagProps) => {
  return <div>Display a list of posts for the tag {tagName}</div>;
};
