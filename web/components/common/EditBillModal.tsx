import { Bill } from '../../models/bill';
import { DueDateLabel } from './DueDateLabel';

interface EditBillModalProps {
  loading: boolean;
  bill: Bill | null;
}

export const EditBillModal: React.FC<EditBillModalProps> = ({ loading, bill }) => {
  return (
    <>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          {loading ? (
            <div className="w-full h-60 flex flex-col items-center justify-center">
              <progress className="progress w-56"></progress>
            </div>
          ) : (
            <>
              {bill && (
                <div className="flex flex-col  min-h-[240px] max-h-[400px] ">
                  <div className="flex flex-row items-center justify-between">
                    <input
                      type="text"
                      value={bill.name}
                      placeholder="Bill name"
                      className="input focus:ring-0 focus:border-base-300 text-xl font-bold w-full max-w-xs"
                    />

                    {bill?.paid ? (
                      <span className="badge badge-success font-semibold">PAID</span>
                    ) : (
                      <span className="badge badge-warning font-semibold">NOT PAID</span>
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-between my-2 px-4">
                    <DueDateLabel dueDate={bill.dueDate} />
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold mr-2">Amount</span>
                      <span className="text-lg font-bold badge badge-ghost">${bill.amount}</span>
                    </div>
                  </div>
                  <div className="flex flex-col px-4 py-3">
                    <h2 className="text-base font-semibold">Previous payments</h2>
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
              )}
            </>
          )}
        </label>
      </label>
    </>
  );
};
