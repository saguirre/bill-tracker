import classNames from 'classnames';

interface SidebarItemProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
  iconClassName?: string;
  onClick: () => void;
}
export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, onClick, iconClassName, className }) => {
  return (
    <li className="w-full">
      <div
        className={classNames(
          'btn btn-ghost flex flex-col w-full capitalize text-base font-semibold items-center justify-center',
          className
        )}
        onClick={onClick}
      >
        <Icon className={classNames('', iconClassName)} />
      </div>
    </li>
  );
};
