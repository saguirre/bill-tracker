import { ClipboardDocumentIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useRef } from 'react';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import { Bill } from '../../models/bill/bill';
import { BillListItem } from '../home/BillListItem';

interface ViewBillsFromCalendarModalProps {
  bills: Bill[] | undefined;
  removeBill: (bill: Bill) => void;
  setSelectedBill: React.Dispatch<React.SetStateAction<Bill | null>>;
  setLoadingBillData: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ViewBillsFromCalendarModal: React.FC<ViewBillsFromCalendarModalProps> = ({
  bills,
  removeBill,
  setSelectedBill,
  setLoadingBillData,
}) => {
  const closeRef = useRef<HTMLInputElement>(null);

  useKeyPress(() => {
    if (closeRef.current) {
      closeRef.current.checked = false;
    }
  }, ['Escape']);

  const badgeColor = (bill: Bill) => {
    if (bill.paid) {
      return 'badge-success';
    }
    if (bill?.dueDate && bill?.dueDate < new Date()) {
      return 'badge-danger';
    }
    return 'badge';
  };

  return (
    <>
      <input ref={closeRef} type="checkbox" id="view-bills-from-calendar-modal" className="modal-toggle" />
      <label htmlFor="view-bills-from-calendar-modal" className="modal cursor-pointer">
        <label className="modal-box w-11/12 max-w-4xl relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <div className="border rounded-box p-1.5">
                <ClipboardDocumentListIcon className="h-8 w-8" />
              </div>
              {bills && bills?.[0] && bills?.[0]?.dueDate && (
                <h1 className="text-2xl font-semibold">
                  Bills on {format(new Date(bills?.[0]?.dueDate), 'dd/MM/yyyy')}
                </h1>
              )}
            </div>
            <span className="text-base-content text-sm font-normal">Manage your bills on this date</span>
          </div>
          <div className="divider my-1.5"></div>
          <div className="h-full">
            <div className="flex flex-col gap-2 h-full max-h-[460px] items-center justify-start w-full overflow-x-hidden overflow-y-scroll">
              {bills?.map((bill) => (
                <BillListItem
                  key={bill.id}
                  removeBill={(bill) => {
                    if (bills?.length === 1 && closeRef.current) {
                      closeRef.current.checked = false;
                    }
                    removeBill(bill);
                  }}
                  badgeColor={badgeColor(bill)}
                  setSelectedBill={(bill) => {
                    if (closeRef.current) {
                      closeRef.current.checked = false;
                    }
                    setSelectedBill(bill);
                  }}
                  setLoadingBillData={setLoadingBillData}
                  amountColor={badgeColor(bill)}
                  bill={bill}
                />
              ))}
            </div>
          </div>
        </label>
      </label>
    </>
  );
};
