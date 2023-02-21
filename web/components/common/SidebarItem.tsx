import classNames from 'classnames';

interface SidebarItemProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
  popoverText?: string;
  iconClassName?: string;
  onClick: () => void;
}
export const SidebarItem: React.FC<SidebarItemProps> = ({
  popoverText,
  icon: Icon,
  onClick,
  iconClassName,
  className,
}) => {
  return (
    <li className="w-full">
      {!popoverText || popoverText.length === 0 ? (
        <div
          className={classNames(
            'btn btn-ghost flex flex-col w-full capitalize text-base font-semibold items-center justify-center',
            className
          )}
          onClick={onClick}
        >
          <Icon className={iconClassName} />
        </div>
      ) : (
        <div className="dropdown dropdown-hover dropdown-right">
          <label
            tabIndex={0}
            className={classNames(
              'btn btn-ghost flex flex-col w-full capitalize text-base font-semibold items-center justify-center',
              className
            )}
            onClick={onClick}
          >
            <Icon className={iconClassName} />
          </label>
          <div tabIndex={0} className="dropdown-content dropdown-right">
            <div className="w-fit px-4 py-1 bg-base-100 border ml-1 rounded-box mt-1.5">
              <div className="whitespace-nowrap">{popoverText}</div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};
