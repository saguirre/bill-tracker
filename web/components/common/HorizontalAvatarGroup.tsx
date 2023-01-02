import { Member } from '../../models/group/member';
import { User } from '../../models/user/user';

interface HorizontalAvatarGroupProps {
  admin?: User;
  members?: Member[];
  maxAvatars?: number;
  showCount?: boolean;
}
export const HorizontalAvatarGroup: React.FC<HorizontalAvatarGroupProps> = ({
  members,
  maxAvatars = 3,
  showCount = true,
}) => {
  const getExtraMemberCount = () => {
    if (members && members?.length > maxAvatars) {
      return members?.length - maxAvatars;
    }
  };

  return (
    <div className="avatar-group -space-x-5">
      {members?.slice(0, maxAvatars).map((member) => (
        <div className="avatar">
          <div className="w-11">
            <img src="https://placeimg.com/192/192/people" />
          </div>
        </div>
      ))}
      {showCount && members && members?.length > maxAvatars && (
        <div className="avatar placeholder">
          <div className="w-12 bg-neutral-focus text-neutral-content">
            <span>+{getExtraMemberCount()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
