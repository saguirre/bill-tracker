import { TrashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useState } from 'react';
import { ClipLoadingIndicator } from './ClipLoadingIndicator';

interface RemoveItemButtonProps {
  loading: boolean;
  onRemove: () => void;
}
export const RemoveItemButton: React.FC<RemoveItemButtonProps> = ({ loading, onRemove }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <div className="absolute top-0 right-1 flex flex-row items-center justify-end w-full z-10">
      <button
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="transition-all duration-300 ease-in-out btn btn-error btn-xs z-10 flex flex-row items-center justify-start gap-2"
      >
        <span
          className={classNames('text-xs text-primary-content', {
            hidden: !isHovering || loading,
            flex: isHovering && !loading,
          })}
        >
          {!loading && 'Remove'}
        </span>
        {loading && <ClipLoadingIndicator size={15} loading={loading} />}
        {!loading && <TrashIcon className="h-4 w-4 text-primary-content" />}
      </button>
    </div>
  );
};
