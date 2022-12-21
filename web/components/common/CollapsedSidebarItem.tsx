import classNames from 'classnames';

interface CollapsedSidebarItemProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
  collapsed: boolean;
}
export const CollapsedSidebarItem: React.FC<CollapsedSidebarItemProps> = ({
  icon: Icon,
  label,
  onClick,
  collapsed,
}) => {
  return (
    <li className="w-full">
      <div
        className={classNames(
          'btn btn-ghost flex flex-row gap-2 w-full capitalize text-base font-semibold items-center justify-start',
          {
            hidden: collapsed,
            flex: !collapsed,
          }
        )}
        onClick={onClick}
      >
        <Icon className="h-5 w-5" />
        {label}
      </div>
      <div
        className={classNames(
          'btn btn-ghost flex flex-col w-full capitalize text-base font-semibold items-center justify-center',
          {
            hidden: !collapsed,
            flex: collapsed,
          }
        )}
        onClick={onClick}
      >
        <Icon className="h-5 w-5" />
      </div>
    </li>
  );
};
