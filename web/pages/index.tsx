import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { EditBillModal } from '../components/common/EditBillModal';
import { BillList } from '../components/home/BillList';
import { Bill } from '../models/bill/bill';
import { AddBillModal } from '../components/common/AddBillModal';
import { authenticatedRoute } from '../components/common/AuthenticatedRoute';

const Home: NextPage = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [loadingBillData, setLoadingBillData] = useState(false);

  useEffect(() => {
    setLoadingBillData(false);
  }, [selectedBill]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row max-w-7xl mt-6 mb-2 w-full gap-5 items-center justify-end px-5">
        <input className="input w-1/3 border-2 border-base-300 placeholder:text-black/30" placeholder="Search" />
        <label htmlFor="add-bill-modal" className="btn btn-primary flex flex-col items-center justify-center">
          Add Bill
        </label>
      </div>
      <div className="flex flex-row items-center justify-between w-full max-w-7xl pt-4 px-4">
        <BillList
          title="Upcoming Bills"
          subtitle="Here you can review your upcoming bills"
          badge="DUE"
          badgeColor="badge-primary"
          amountColor="badge-ghost"
          bills={bills}
          setSelectedBill={setSelectedBill}
          setLoadingBillData={setLoadingBillData}
        />
        <BillList
          title="Expired Bills"
          subtitle="Here you can review your expired bills"
          badge="EXPIRED"
          badgeColor="badge-error"
          amountColor="badge-warning"
          bills={bills}
          setSelectedBill={setSelectedBill}
          setLoadingBillData={setLoadingBillData}
        />
        <BillList
          title="Paid Bills"
          subtitle="Here you can review your paid bills"
          badge="PAID"
          badgeColor="badge-success"
          amountColor="badge-success"
          bills={bills}
          setSelectedBill={setSelectedBill}
          setLoadingBillData={setLoadingBillData}
        />
      </div>
      <AddBillModal loading={loadingBillData} />
      <EditBillModal loading={loadingBillData} bill={selectedBill} />
    </div>
  );
};

export default authenticatedRoute(Home);
