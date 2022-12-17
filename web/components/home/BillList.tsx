import classNames from 'classnames';
import { Bill } from '../../models/bill/bill';
import { BillListItem } from './BillListItem';

interface BillListProps {
  title: string;
  badge: string;
  subtitle: string;
  badgeColor: string;
  amountColor: string;
  setLoadingBillData: (loading: boolean) => void;
  setSelectedBill: (bill: Bill | null) => void;
  bills: Bill[];
}

export const BillList: React.FC<BillListProps> = ({
  title,
  badge,
  subtitle,
  setSelectedBill,
  setLoadingBillData,
  badgeColor = 'badge-primary',
  amountColor = 'badge-success',
  bills,
}) => {
  return (
    <div className="card w-96 h-[600px] bg-base-100 shadow-xl">
      <div className="card-body h-full p-2">
        <div className="flex flex-col items-start justify-start px-4 pt-2">
          <h2 className="card-title">
            {title}
            <div className={classNames('badge', badgeColor)}>{badge}</div>
          </h2>
          <p>{subtitle}</p>
        </div>
        <div className="divider m-0"></div>
        <div className="flex flex-col m-0 items-start h-full justify-start overflow-x-hidden overflow-y-scroll">
          <div className="flex flex-col h-full items-center justify-between w-full overflow-x-hidden overflow-y-scroll">
            {bills.map((bill) => (
              <BillListItem
                key={bill.id}
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
