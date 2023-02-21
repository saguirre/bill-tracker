import classNames from 'classnames';
import { Color } from '../../types/color.type';

interface TagProps {
  text: string;
  tagColor?: Color;
}
export const Tag: React.FC<TagProps> = ({ text, tagColor }) => {
  return <div className={classNames('badge badge-outline', tagColor)}>{text}</div>;
};
