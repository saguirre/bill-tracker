import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { EditBillModal } from '../components/common/EditBillModal';
import { BillList } from '../components/home/BillList';
import { Bill } from '../models/bill';
import { PlusIcon } from '@heroicons/react/24/solid';
import { AddBillModal } from '../components/common/AddBillModal';
const bills = [
  {
    id: '1',
    name: 'Rent',
    dueDate: new Date('12/12/2021'),
    amount: 1000,
    paid: false,
  },
  {
    id: '2',
    name: 'Electric',
    dueDate: new Date('12/12/2021'),
    amount: 100,
    paid: false,
  },
  {
    id: '3',
    name: 'Water',
    dueDate: new Date('12/12/2021'),
    amount: 50,
    paid: false,
  },
  {
    id: '4',
    name: 'Internet',
    dueDate: new Date('12/12/2021'),
    amount: 50,
    paid: false,
  },
  {
    id: '5',
    name: 'Phone',
    dueDate: new Date('12/12/2021'),
    amount: 50,
    paid: false,
  },
  {
    id: '6',
    name: 'Car Insurance',
    dueDate: new Date('12/12/2021'),
    amount: 50,
    paid: false,
  },
  {
    id: '7',
    name: 'Car Payment',

    dueDate: new Date('12/12/2021'),
    amount: 50,
    paid: false,
  },
  {
    id: '8',
    name: 'Car Registration',
    dueDate: new Date('12/12/2021'),
    amount: 50,
    paid: false,
  },
  {
    id: '9',
    name: 'Car Maintenance',
    dueDate: new Date('12/12/2021'),
    amount: 50,
    paid: false,
  },
  {
    id: '10',
    name: 'Car Wash',
    dueDate: new Date('12/12/2021'),
    amount: 5,
    paid: false,
  },
  {
    id: '11',
    name: 'Gas',
    dueDate: new Date('12/12/2021'),
    amount: 50,
    paid: false,
  },
  {
    id: '12',
    name: 'Groceries',
    dueDate: new Date('12/12/2021'),
    amount: 50,
    paid: false,
  },
];

const Home: NextPage = () => {
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

export default Home;
