import { format } from 'date-fns';

interface DueDateLabelProps {
  text?: string;
  dueDate?: Date | null;
  className?: string;
}
export const DueDateLabel: React.FC<DueDateLabelProps> = ({ text, dueDate, className }) => {
  return (
    <div className="flex flex-col px-4 py-3 w-fit bg-base-200 rounded-xl">
      <span className="text-sm font-semibold">{text} on: </span>
      <span className="text-lg font-bold">{dueDate ? format(new Date(dueDate), 'dd/MM/yyyy') : '-'}</span>
    </div>
  );
};
