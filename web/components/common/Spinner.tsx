import classNames from 'classnames';

interface SpinnerProps {
  className?: string;
  text?: string;
}
export const Spinner: React.FC<SpinnerProps> = ({ text, className = 'h-10 w-10 border-b-4 border-primary' }) => {
  return (
    <div className="flex flex-row justify-center items-center gap-2">
      <div className={classNames('animate-spin rounded-full', className ?? 'border-primary')}></div>
      {text && text?.length > 0 && <span className="ml-1 font-semibold">{text}</span>}
    </div>
  );
};
