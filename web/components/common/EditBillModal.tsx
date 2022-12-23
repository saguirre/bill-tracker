import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import fetchJson from '../../lib/fetchJson';
import { Bill } from '../../models/bill/bill';
import { DueDateLabel } from './DueDateLabel';

interface EditBillModalProps {
  loading: boolean;
  bills: Bill[] | undefined;
  mutateBills: (bills: Bill[]) => void;
  bill: Bill | null;
}

export const EditBillModal: React.FC<EditBillModalProps> = ({ bills, mutateBills, loading, bill }) => {
  const [checked, setChecked] = useState(false);
  const [isPaid, setIsPaid] = useState(bill?.paid || false);
  const closeRef = useRef<HTMLInputElement>(null);

  useKeyPress(() => {
    if (closeRef.current) {
      closeRef.current.checked = false;
    }
  }, ['Escape']);

  useEffect(() => {
    setIsPaid(bill?.paid || false);
  }, [bill]);

  const markBillAsPayed = async (id?: number) => {
    try {
      if (!id) return;
      mutateBills([
        ...(bills || []).map((bill: Bill) => {
          if (bill.id === id) {
            return { ...bill, paid: true };
          }
          return bill;
        }),
      ]);
      const billResponse = await fetchJson(`/api/bills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paid: true, paidDate: new Date() }),
      });
      if (billResponse) {
        mutateBills([
          ...(bills || [])?.map((bill: Bill) => {
            if (bill.id === id) {
              return billResponse;
            }
            return bill;
          }),
        ]);
      }
      toast.success('Bill Marked as Paid');
    } catch (error) {
      toast.error('There was an error marking the bill as paid. Please try again later');
      console.error(error);
    }
  };

  return (
    <>
      <input ref={closeRef} type="checkbox" id="edit-bill-modal" className="modal-toggle" />
      <label htmlFor="edit-bill-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          {loading ? (
            <div className="w-full h-60 flex flex-col items-center justify-center">
              <progress className="progress w-56"></progress>
            </div>
          ) : (
            <>
              {bill && (
                <div className="flex flex-col space-y-6 min-h-[240px] max-h-[400px] ">
                  <div className="flex flex-row items-center justify-between">
                    <input
                      type="text"
                      value={bill.title}
                      placeholder="Bill name"
                      className="input -mr-3 pl-2 h-10 mb-2 focus:ring-0 focus:border-base-300 text-xl font-bold w-full max-w-xs"
                    />

                    {isPaid ? (
                      <span className="badge badge-success font-semibold">PAID</span>
                    ) : (
                      <span className="badge badge-warning font-semibold">NOT PAID</span>
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-between my-2 px-1">
                    {!bill.paid && <DueDateLabel text="Due" dueDate={bill.dueDate} />}
                    {bill.paid && <DueDateLabel text="Paid" dueDate={bill.paidDate} />}
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold mr-2">Amount</span>
                      <span className="text-lg font-bold badge !h-6 badge-ghost">${bill.amount}</span>
                    </div>
                  </div>
                  {!bill?.paid && !isPaid && (
                    <div
                      onClick={() => {
                        setIsPaid(true);
                        markBillAsPayed(bill.id);
                      }}
                      className="flex flex-row items-center justify-end"
                    >
                      <label className="btn btn-success w-36 relative">Mark as paid</label>
                    </div>
                  )}
                  <div
                    onClick={(e) => setChecked(!checked)}
                    className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
                  >
                    <input type="checkbox" checked={checked} />
                    <div className="collapse-title text-base font-semibold">Previous Payments</div>
                    <div className="collapse-content">
                      <div className="flex flex-row items-center mt-2 justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm">Amount</span>
                          <span className="text-base font-bold">$100</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm">Date</span>
                          <span className="text-base font-bold">12/12/2021</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </label>
      </label>
    </>
  );
};
