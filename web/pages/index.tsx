import type { InferGetServerSidePropsType } from 'next';
import { useEffect, useRef, useState } from 'react';
import { EditBillModal } from '../components/common/EditBillModal';
import { BillList } from '../components/home/BillList';
import { Bill } from '../models/bill/bill';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../lib/session';
import { User } from '../models/user/user';
import useBills from '../lib/useBills';
import { Layout } from '../components/Layout';
import { AddBillModal } from '../components/common/AddBillModal';
import classNames from 'classnames';
import { HomeCalendar } from '../components/common/HomeCalendar';
import { useKeyPress } from '../hooks/useKeyPress.hook';
import { toast } from 'react-toastify';
import { ViewBillsFromCalendarModal } from '../components/common/ViewBillsFromCalendarModal';
import { AddCategoryModal } from '../components/common/AddCategoryModal';
import useCategories from '../lib/useCategories';
import { AddGroupModal } from '../components/common/AddGroupModal';
import useGroups from '../lib/useGroups';
import { Group } from '../models/group/group';
import { useRouter } from 'next/router';

export default function SsrHome({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [calendarSelectedBills, setCalendarSelectedBills] = useState<Bill[]>([]);
  const [loadingBillData, setLoadingBillData] = useState(false);
  const addBillRef = useRef<HTMLLabelElement>(null);
  const addCategoryRef = useRef<HTMLLabelElement>(null);
  const addGroupRef = useRef<HTMLLabelElement>(null);
  const [searchString, setSearchString] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'inbox' | 'paid'>('inbox');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { groups, mutateGroups } = useGroups(user);
  const [availableFilters, setAvailableFilters] = useState<string[]>(['all']);
  const [isMac, setIsMac] = useState(false);
  const { bills, mutateBills } = useBills({
    ...user,
  });
  const { categories, mutateCategories } = useCategories({
    ...user,
  });

  const [filterableBills, setFilterableBills] = useState<Bill[] | undefined>(bills);

  const filterBillsByDropdown = (filter: string) => {
    if (filter === 'all') {
      filterBySearchInput(searchString);
    } else {
      const filteredBills = filterableBills?.filter(
        (bill) => bill?.group && bill?.group?.name?.toLowerCase() === filter
      );
      setFilterableBills(filteredBills);
    }
  };

  const filterBySearchInput = (value: string, shouldImpactState = true) => {
    let filteredBills = bills?.filter((bill) => bill.title?.toLowerCase()?.includes(value.toLowerCase()));
    if (selectedFilter !== 'all') {
      filteredBills = filteredBills?.filter(
        (bill) => bill?.group && bill?.group?.name?.toLowerCase() === selectedFilter
      );
    }
    if (filteredBills && filteredBills.length > 0) {
      if (shouldImpactState && selectedTab === 'paid' && !filteredBills?.some((bill) => bill.paid)) {
        setSelectedTab('inbox');
      } else if (shouldImpactState && selectedTab === 'inbox' && !filteredBills?.some((bill) => !bill.paid)) {
        setSelectedTab('paid');
      }
    }
    if (shouldImpactState) setFilterableBills(filteredBills);
    return filteredBills;
  };

  useKeyPress(() => {
    if (addBillRef.current) {
      addBillRef.current.click();
    }
  }, ['KeyA']);

  useKeyPress(() => {
    if (addCategoryRef.current) {
      addCategoryRef.current.click();
    }
  }, ['KeyE']);

  useKeyPress(() => {
    if (addGroupRef.current) {
      addGroupRef.current.click();
    }
  }, ['KeyG']);

  useEffect(() => {
    setAvailableFilters(['all', ...(groups || [])?.map((group: Group) => group.name?.toLowerCase() || '')]);
  }, [groups]);

  useEffect(() => {
    filterBySearchInput(searchString);
  }, [searchString]);

  useEffect(() => {
    filterBillsByDropdown(selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    setFilterableBills(bills);
  }, [bills]);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
      setIsMac(true);
    }
  }, [router.isReady]);

  return (
    <Layout showSearch={true} user={user} search={(value: string) => setSearchString(value)}>
      <div className="flex flex-col items-center px-12">
        <div className="flex flex-row w-full gap-5 items-center justify-between px-6">
          <div className="flex flex-row items-center justify-start">
            <div className="flex flex-col items-start justify-start gap-1">
              <h2 className="card-title text-xl">Hi, {user?.name}</h2>
              <p className="text-sm text-base-content/60">Let's track your bills today!</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-end gap-2 ">
            <div className="flex flex-col items-center gap-1.5">
              <label
                ref={addBillRef}
                htmlFor="add-bill-modal"
                className="btn btn-primary flex flex-col items-center justify-center"
              >
                Add Bill
              </label>
              <div className="flex flex-row items-center justify-center gap-1">
                {isMac ? <span className="kbd kbd-sm">⌘</span> : <span className="kbd kbd-sm px-2 py-0.5">ctrl</span>}
                <span className="kbd kbd-sm">A</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <label
                ref={addCategoryRef}
                htmlFor="add-category-modal"
                className="btn btn-secondary flex flex-col items-center justify-center"
              >
                Add Category
              </label>
              <div className="flex flex-row items-center justify-center gap-1">
                {isMac ? <span className="kbd kbd-sm">⌘</span> : <span className="kbd kbd-sm px-2 py-0.5">ctrl</span>}
                <span className="kbd kbd-sm">E</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <label
                ref={addGroupRef}
                htmlFor="add-group-modal"
                className="btn btn-accent flex flex-col items-center justify-center"
              >
                Add Group
              </label>
              <div className="flex flex-row items-center justify-center gap-1">
                {isMac ? <span className="kbd kbd-sm">⌘</span> : <span className="kbd kbd-sm px-2 py-0.5">ctrl</span>}
                <span className="kbd kbd-sm">G</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full mb-20">
          <div className="grid w-full px-5 pt-4">
            <div className="flex flex-row items-center w-full">
              <div className="tabs z-10 -mb-px w-full">
                <a
                  onClick={() => setSelectedTab('inbox')}
                  className={classNames(
                    'text-base flex flex-col gap-0.5 rounded-t-box w-32 h-10 font-semibold tab tab-lifted',
                    {
                      'tab-active pt-4 ': selectedTab === 'inbox',
                      'border-b-transparent hover:text-base-content': selectedTab !== 'inbox',
                    }
                  )}
                >
                  <span
                    className={classNames('badge badge-outline badge-md uppercase', {
                      badge: selectedTab === 'inbox',
                      'badge-ghost': selectedTab !== 'inbox',
                    })}
                  >
                    Inbox
                  </span>
                </a>
                <a
                  onClick={() => setSelectedTab('paid')}
                  className={classNames(
                    'text-base rounded-t-box flex flex-col gap-0.5 w-32 h-10 font-semibold tab tab-lifted',
                    {
                      'tab-active pt-4 ': selectedTab === 'paid',
                      'hover:text-base-content': selectedTab !== 'paid',
                    }
                  )}
                >
                  <span
                    className={classNames('badge badge-outline badge-md uppercase', {
                      'badge-success': selectedTab === 'paid',
                      'badge-ghost': selectedTab !== 'paid',
                    })}
                  >
                    Paid
                  </span>
                </a>
              </div>
              <div className="flex flex-row items-center gap-1 justify-end -mt-2">
                Viewing
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-sm btn-outline m-1">
                    <span className="whitespace-nowrap uppercase">{selectedFilter} Bills</span>
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 border shadow bg-base-100 rounded-box w-52">
                    <div className="w-full flex flex-col overflow-y-scroll max-h-52">
                      {availableFilters?.map((filter) => (
                        <li key={filter}>
                          <a onClick={() => setSelectedFilter(filter)} className="whitespace-nowrap capitalize">
                            {filter}
                          </a>
                        </li>
                      ))}
                    </div>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'flex flex-col bg-base-100 rounded-tr-box relative overflow-x-auto items-center justify-start rounded-b-box gap-5 w-full',
                {
                  'rounded-r-lg': selectedTab === 'inbox',
                  'rounded-t-lg': selectedTab === 'paid',
                }
              )}
            >
              <div
                style={{ backgroundSize: '5px 5px' }}
                className={classNames(
                  'border border-base-300 bg-base-100 rounded-b-box flex flex-col h-[500px] min-h-[6rem] w-full min-w-[18rem] flex-wrap items-center justify-center gap-2 overflow-x-hidden bg-top pt-4 px-4 pb-12 mb-12',
                  {
                    'rounded-tr-box': selectedTab === 'inbox',
                    'rounded-t-box': selectedTab === 'paid',
                  }
                )}
              >
                {selectedTab === 'inbox' && (
                  <div className="flex flex-col w-full h-full items-start">
                    <BillList
                      title="Expired Bills"
                      badge="EXPIRED"
                      badgeColor="badge-error"
                      amountColor="badge-error"
                      bills={filterableBills?.filter((bill) => {
                        if (!bill?.dueDate) return false;
                        return new Date(bill.dueDate) <= new Date() && !bill?.paid;
                      })}
                      calendarSelectedBills={calendarSelectedBills}
                      mutateBills={mutateBills}
                      setCalendarSelectedBills={setCalendarSelectedBills}
                      setSelectedBill={setSelectedBill}
                      setLoadingBillData={setLoadingBillData}
                    />
                    <div className="divider mt-0 mb-0">
                      <span className="badge badge-xs badge-ghost"></span>
                      <span className="badge badge-xs badge-ghost"></span>
                      <span className="badge badge-xs badge-ghost"></span>
                    </div>
                    <div className="w-full pb-10">
                      <BillList
                        title="Upcoming Bills"
                        badge="DUE"
                        calendarSelectedBills={calendarSelectedBills}
                        mutateBills={mutateBills}
                        setCalendarSelectedBills={setCalendarSelectedBills}
                        badgeColor="badge-primary"
                        dueBadgeColor="badge-ghost"
                        amountColor="badge-ghost"
                        bills={filterableBills?.filter((bill) => {
                          if (!bill?.dueDate) return false;
                          return new Date(bill.dueDate) > new Date() && !bill?.paid;
                        })}
                        setSelectedBill={setSelectedBill}
                        setLoadingBillData={setLoadingBillData}
                      />
                    </div>
                  </div>
                )}
                {selectedTab === 'paid' && (
                  <div className="flex flex-col w-full h-full items-start">
                    <BillList
                      title="Paid Bills"
                      badgeColor="badge-success"
                      calendarSelectedBills={calendarSelectedBills}
                      mutateBills={mutateBills}
                      setCalendarSelectedBills={setCalendarSelectedBills}
                      amountColor="badge-success"
                      bills={filterableBills?.filter((bill) => {
                        return bill?.paid;
                      })}
                      setSelectedBill={setSelectedBill}
                      setLoadingBillData={setLoadingBillData}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-[48%] pr-4 pt-4">
            <HomeCalendar
              bills={bills}
              onSelectDate={(bills: Bill[]) => {
                if (bills?.length > 0) {
                  setCalendarSelectedBills(bills);
                }
              }}
            />
          </div>
        </div>
        <AddBillModal
          bills={bills}
          groups={groups}
          mutateCategories={mutateCategories}
          categories={categories}
          mutateBills={mutateBills}
          userId={user?.id}
        />
        <AddCategoryModal categories={categories} mutateCategories={mutateCategories} userId={user?.id} />
        {selectedBill && (
          <EditBillModal
            bills={bills}
            groups={groups}
            userId={user?.id}
            categories={categories}
            mutateBills={mutateBills}
            bill={selectedBill}
          />
        )}
        <ViewBillsFromCalendarModal
          calendarSelectedBills={calendarSelectedBills}
          mutateBills={mutateBills}
          setCalendarSelectedBills={setCalendarSelectedBills}
          bills={calendarSelectedBills}
          setSelectedBill={setSelectedBill}
          setLoadingBillData={setLoadingBillData}
        />
        <AddGroupModal groups={groups} mutateGroups={mutateGroups} userId={user?.id} />
      </div>
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  const user = req.session.user;

  if (!user || !user?.isLoggedIn) {
    res.writeHead(301, { Location: '/signin' });
    res.end();
    return {
      props: {
        user: { isLoggedIn: false } as User,
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
}, sessionOptions);
