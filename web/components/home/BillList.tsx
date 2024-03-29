import classNames from 'classnames';
import { Bill } from '../../models/bill/bill';
import { getRandomMoneyImage } from '../../utils/get-random-money-image';
import { BillListItem } from './BillListItem';

interface BillListProps {
  title: string;
  badge?: string;
  badgeColor: string;
  dueBadgeColor?: string;
  amountColor: string;
  bills: Bill[] | undefined;
  mutateBills: (bills: Bill[]) => void;
  calendarSelectedBills: Bill[];
  setCalendarSelectedBills: (bill: Bill[]) => void;
  setLoadingBillData: (loading: boolean) => void;
  setSelectedBill: (bill: Bill | null) => void;
}

export const BillList: React.FC<BillListProps> = ({
  title,
  badge,
  setSelectedBill,
  mutateBills,
  calendarSelectedBills,
  setCalendarSelectedBills,
  setLoadingBillData,
  badgeColor = 'badge-primary',
  dueBadgeColor = badgeColor,
  amountColor = 'badge-success',
  bills,
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-start justify-start px-2 py-2">
        <h2 className="text-lg font-semibold flex flex-row items-center gap-2">
          {title}
          {badge && badge?.length > 0 && (
            <>
              {bills && bills?.length > 0 && (
                <div className={classNames('badge badge-outline', badgeColor)}>{badge}</div>
              )}
              {bills?.length === 0 && (
                <span className="badge badge-success h-6 badge-outline uppercase">Cleared 🎉</span>
              )}
            </>
          )}
        </h2>
      </div>
      {(bills && bills?.length > 0) || (title !== 'Expired Bills' && <div className="divider my-0"></div>)}
      <div className="w-full bg-base-100">
        <div className="flex flex-col gap-3 items-center justify-start w-full">
          {bills?.map((bill) => (
            <BillListItem
              key={bill.id}
              bills={bills}
              calendarSelectedBills={calendarSelectedBills}
              mutateBills={mutateBills}
              setCalendarSelectedBills={setCalendarSelectedBills}
              badgeColor={dueBadgeColor}
              setSelectedBill={setSelectedBill}
              setLoadingBillData={setLoadingBillData}
              amountColor={amountColor}
              bill={bill}
            />
          ))}
          {bills?.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full h-fit">
              {title === 'Upcoming Bills' && (
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <p className="text-sm text-base-content/60 mt-8 -mb-9">No Upcoming Bills</p>
                  <img src={getRandomMoneyImage()} alt="No Upcoming Bills" className="w-[250px]" />
                </div>
              )}
              {title === 'Paid Bills' && (
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <p className="text-sm text-base-content/60 mt-8 -mb-9">No Paid Bills</p>
                  <img src={getRandomMoneyImage()} alt="No Bills Paid" className="w-[250px]" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
