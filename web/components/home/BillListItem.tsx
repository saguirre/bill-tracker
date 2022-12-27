import { TrashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { format } from 'date-fns';
import { useState } from 'react';
import { Bill } from '../../models/bill/bill';
import { currencyFormat } from '../../utils/currency-format.util';
interface BillListItemProps {
  badgeColor: string;
  amountColor: string;
  bill: Bill;
  removeBill: (bill: Bill) => void;
  setSelectedBill: (bill: Bill | null) => void;
  setLoadingBillData: (loading: boolean) => void;
}

export const BillListItem: React.FC<BillListItemProps> = ({
  setSelectedBill,
  setLoadingBillData,
  removeBill,
  badgeColor,
  amountColor,
  bill,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
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
          {!bill?.category && <div className='max-w-sm w-full'></div>}
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
      <div className="absolute top-0 right-1 flex flex-row items-center justify-end w-full z-10">
        <button
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeBill(bill);
          }}
          className="transition-all duration-300 ease-in-out btn btn-error btn-xs z-10 flex flex-row items-center justify-start gap-2"
        >
          <span
            className={classNames('text-xs text-primary-content', {
              hidden: !isHovering,
              flex: isHovering,
            })}
          >
            Remove
          </span>
          <TrashIcon className="h-4 w-4 text-primary-content" />
        </button>
      </div>
    </div>
  );
};
