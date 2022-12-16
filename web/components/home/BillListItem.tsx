import classNames from 'classnames';
import { format } from 'date-fns';
import { Bill } from '../../models/bill';

interface BillListItemProps {
  amountColor: string;
  bill: Bill;
  setSelectedBill: (bill: Bill | null) => void;
  setLoadingBillData: (loading: boolean) => void;
}

export const BillListItem: React.FC<BillListItemProps> = ({
  setSelectedBill,
  setLoadingBillData,
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
      className="flex flex-col justify-center items-start hover:cursor-pointer hover:bg-base-200 transition-colors duration-300 rounded-xl px-4 pt-2 pb-3 w-full"
    >
      <div className="flex flex-row items-center justify-between w-full">
        <div className="text-xl font-bold">{bill.name}</div>
        <div className={classNames('badge font-semibold', amountColor)}>${bill.amount}</div>
      </div>
      <div className="text-sm">{'Due on ' + format(bill.dueDate, 'dd/MM/yyyy')}</div>
    </label>
  );
};
