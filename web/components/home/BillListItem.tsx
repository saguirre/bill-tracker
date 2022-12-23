import classNames from 'classnames';
import { format } from 'date-fns';
import { Bill } from '../../models/bill/bill';

interface BillListItemProps {
  badgeColor: string;
  amountColor: string;
  bill: Bill;
  setSelectedBill: (bill: Bill | null) => void;
  setLoadingBillData: (loading: boolean) => void;
}

export const BillListItem: React.FC<BillListItemProps> = ({
  setSelectedBill,
  setLoadingBillData,
  badgeColor,
  amountColor,
  bill,
}) => {
  return (
    <label
      onClick={() => {
        setSelectedBill(bill);
        setLoadingBillData(true);
      }}
      htmlFor="edit-bill-modal"
      key={bill.id}
      className="relative flex border border-base-300 gap-1.5 flex-col justify-center items-start hover:cursor-pointer hover:bg-base-200 transition-colors duration-300 rounded-xl pl-5 pr-4 pt-5 pb-4 w-full"
    >
      <div className="flex flex-row items-start justify-between w-full">
        <div className="text-base font-semibold">{bill.title}</div>
        <div className={classNames('badge font-semibold h-6', amountColor)}>${bill.amount}</div>
      </div>
      <div className="flex flex-row w-full justify-between text-sm">
        <div className="flex flex-row gap-2 max-w-sm w-full">
          <div className="badge badge-outline badge-secondary">Category</div>
          <div className="badge badge-outline badge-accent">Category</div>
        </div>
        {bill.dueDate && !bill.paid && (
          <span className={classNames('badge badge-outline uppercase h-6', badgeColor)}>
            {'Due on ' + format(new Date(bill.dueDate), 'dd/MM/yyyy')}
          </span>
        )}
        {bill.paidDate && bill.paid && (
          <span className="badge badge-outline badge-success uppercase h-6">
            {'Paid on ' + format(new Date(bill.paidDate), 'dd/MM/yyyy')}
          </span>
        )}
      </div>
      <div
        className={classNames('h-[75%] w-1 rounded-box absolute left-1 top-[10px]', {
          'bg-success': bill.paid,
          'bg-error': !bill.paid && bill.dueDate && new Date(bill.dueDate) < new Date(),
          'bg-primary': !bill.paid && (!bill.dueDate || new Date(bill.dueDate) >= new Date()),
        })}
      ></div>
    </label>
  );
};
