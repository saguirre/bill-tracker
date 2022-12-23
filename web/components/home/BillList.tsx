import classNames from 'classnames';
import { Bill } from '../../models/bill/bill';
import { BillListItem } from './BillListItem';

interface BillListProps {
  title: string;
  badge?: string;
  badgeColor: string;
  dueBadgeColor?: string;
  amountColor: string;
  setLoadingBillData: (loading: boolean) => void;
  setSelectedBill: (bill: Bill | null) => void;
  bills: Bill[] | undefined;
}

export const BillList: React.FC<BillListProps> = ({
  title,
  badge,
  setSelectedBill,
  setLoadingBillData,
  badgeColor = 'badge-primary',
  dueBadgeColor = badgeColor,
  amountColor = 'badge-success',
  bills,
}) => {
  return (
    <div className="flex flex-col w-full h-fit">
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
      <div className="w-full h-full max-h-[480px] bg-base-100">
        <div className="h-full">
          <div className="flex flex-col gap-3 h-full max-h-[460px] items-center justify-start w-full overflow-x-hidden overflow-y-scroll">
            {bills?.map((bill) => (
              <BillListItem
                key={bill.id}
                badgeColor={dueBadgeColor}
                setSelectedBill={setSelectedBill}
                setLoadingBillData={setLoadingBillData}
                amountColor={amountColor}
                bill={bill}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
