import { format } from 'date-fns';

interface DueDateLabelProps {
  dueDate: Date;
  className?: string;
}
export const DueDateLabel: React.FC<DueDateLabelProps> = ({ dueDate, className }) => {
  return (
    <div className="flex flex-col px-4 py-3 bg-base-200 w-fit rounded-xl">
      <span className="text-sm font-semibold">Due on: </span>
      <span className="text-lg font-bold">{format(dueDate, 'dd/MM/yyyy')}</span>
    </div>
  );
};
