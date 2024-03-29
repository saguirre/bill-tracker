import classNames from 'classnames';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Bill } from '../../models/bill/bill';
import { currencyFormat } from '../../utils/currency-format.util';
import { RemoveItemButton } from '../common/RemoveItemButton';

interface BillListItemProps {
  badgeColor: string;
  amountColor: string;
  bill: Bill;
  bills: Bill[];
  mutateBills: (bills: Bill[]) => void;
  calendarSelectedBills: Bill[];
  setCalendarSelectedBills: (bill: Bill[]) => void;
  setSelectedBill: (bill: Bill | null) => void;
  setLoadingBillData: (loading: boolean) => void;
}

export const BillListItem: React.FC<BillListItemProps> = ({
  setSelectedBill,
  setLoadingBillData,
  mutateBills,
  bills,
  calendarSelectedBills,
  setCalendarSelectedBills,
  badgeColor,
  amountColor,
  bill,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  const removeBill = async (bill: Bill) => {
    try {
      setLoadingDelete(true);
      const response = await fetch(`/api/bills/${bill.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLoadingDelete(false);
      if (response.status === 200) {
        toast.success('Bill deleted successfully!');
        mutateBills(bills?.filter((b) => b.id !== bill.id));
        setCalendarSelectedBills(calendarSelectedBills?.filter((b) => b.id !== bill.id));
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error happened');
    } finally {
      // setLoadingDelete(false);
    }
  };

  return (
    <div className="relative pr-4 pt-4 w-full">
      <label
        onClick={() => {
          setSelectedBill(bill);
          setLoadingBillData(true);
        }}
        htmlFor="edit-bill-modal"
        key={bill.id}
        className="flex border border-base-300 gap-1.5 flex-col justify-center items-start hover:cursor-pointer hover:bg-base-200 transition-colors duration-300 rounded-xl pl-5 pr-4 pt-5 pb-4 w-full"
      >
        <div className="flex flex-row items-start justify-between w-full">
          <div className="text-base font-semibold">{bill.title}</div>
          <div className={classNames('text-base-content text-lg font-bold')}>{currencyFormat(bill?.amount || 0)}</div>
        </div>
        <div className="flex flex-row w-full justify-between text-sm">
          {bill?.category && (
            <div className="flex flex-row gap-2 max-w-sm w-full">
              <div className="badge badge-outline badge-secondary">{bill?.category?.name}</div>
            </div>
          )}
          {!bill?.category && <div className="max-w-sm w-full"></div>}
          {bill.dueDate && !bill.paid && (
            <span
              className={classNames('font-bold badge badge-error badge-xs badge-outline h-5 mt-1 uppercase text-xs')}
            >
              {'Due on ' + format(new Date(bill.dueDate), 'dd/MM/yyyy')}
            </span>
          )}
          {bill.paidDate && bill.paid && (
            <span className="font-bold badge badge-success badge-xs badge-outline h-5 mt-1 uppercase text-xs">
              {'Paid on ' + format(new Date(bill.paidDate), 'dd/MM/yyyy')}
            </span>
          )}
        </div>
        <div
          className={classNames('h-[50%] w-1 rounded-box absolute left-1 top-[35px]', {
            'bg-success': bill.paid,
            'bg-error': !bill.paid && bill.dueDate && new Date(bill.dueDate) < new Date(),
            'bg-primary': !bill.paid && (!bill.dueDate || new Date(bill.dueDate) >= new Date()),
          })}
        ></div>
      </label>
      <RemoveItemButton loading={loadingDelete} onRemove={() => removeBill(bill)} />
    </div>
  );
};
