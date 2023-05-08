import { ClipboardDocumentIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import fetchJson from '../../lib/fetchJson';
import { Bill } from '../../models/bill/bill';
import { FormInput } from './FormInput';
import * as Ably from 'ably/promises';
import { configureAbly } from '@ably-labs/react-hooks';
import { CategoryModel } from '../../models/category';
import { Group } from '../../models/group/group';
import { ClipLoadingIndicator } from './ClipLoadingIndicator';
import { BillData, extractBillData } from '../../lib/nlp';

interface AddBillModalProps {
  userId?: number;
  bills: Bill[] | undefined;
  mutateBills: (bills: Bill[]) => void;
  groups: Group[] | undefined;
  categories?: CategoryModel[];
  mutateCategories?: (categories: CategoryModel[]) => void;
}

interface FormValues {
  title: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  categoryId?: number;
  groupId?: number;
  paid: boolean;
}

export const AddBillModal: React.FC<AddBillModalProps> = ({
  categories,
  mutateCategories,
  userId,
  bills,
  groups,
  mutateBills,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange' });
  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelPromise | null>(null);
  const [addAnother, setAddAnother] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addFieldsIndividually, setAddFieldsIndividually] = useState(false);
  const [nlpBillData, setNlpBillData] = useState<any>(null); // TODO: Type this
  const [input, setInput] = useState('');
  const [shouldCreateCategory, setShouldCreateCategory] = useState<boolean>(false);
  const [tempCategory, setTempCategory] = useState<any>(null);
  const watchedCategoryId = watch('categoryId');
  const [selectedCategory, setSelectedCategory] = useState<number | string>('');

  const closeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ably: Ably.Types.RealtimePromise = configureAbly({ authUrl: '/api/authentication' });

    const _channel = ably.channels.get('status-updates');
    setChannel(_channel);

    return () => {
      _channel.unsubscribe();
    };
  }, []); // Only run the client

  const publishFromClient = async (bill: any) => {
    if (channel === null) return;

    const notificationBody = {
      title: `${bill.user.name} added a new bill`,
      message: `${bill.title} - ${bill.amount}`,
    };
    channel.publish('update-from-client', { ...notificationBody });

    await fetchJson(`/api/notifications/user/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationBody),
    });
  };

  useKeyPress(
    () => {
      if (closeRef.current) {
        closeRef.current.checked = false;
      }
    },
    ['Escape'],
    false
  );

  const handleNlpPrompt = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      setLoading(true);
      const billData = await extractBillData(input);
      console.log(billData);
      if (billData) {
        if (billData?.category) {
          console.log('Category found');
          const category = categories?.find((c) => c?.name?.toLowerCase() === billData.category.toLowerCase());
          if (category && category?.id) {
            console.log('Category already exists');
            billData.categoryId = category.id;
            console.log('Category id: ', category.id);
            setSelectedCategory(category.id);
            setTempCategory(null);
          } else {
            console.log('Category does not exist');
            const newCategory = {
              id: 0,
              name: billData.category,
              userId: userId!,
            };
            console.log('New category: ', newCategory);
            mutateCategories?.([...categories!, newCategory]);
            console.log('Category id: ', newCategory.id);
            setTempCategory(newCategory);
            setSelectedCategory(newCategory.id);
            setShouldCreateCategory(true);
          }
        }
        setNlpBillData(billData);
        setLoading(false);
      } else {
        toast.error('There was an error analyzing your prompt. Please try wording the prompt differently.');
      }
    } catch (error) {
      console.error(error);
      toast.error('There was an error adding your bill. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      if (!data.categoryId) {
        delete data.categoryId;
      }
      if (!data.groupId) {
        delete data.groupId;
      }
      const newBill: Bill = {
        ...data,
        paid: checked,
        paidDate: data.paidDate ? new Date(data.paidDate).toISOString() : undefined,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      setLoading(true);
      const billResponse = await fetchJson(`/api/bills/user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBill),
      });
      setLoading(false);

      if (billResponse) {
        mutateBills([billResponse, ...(bills || [])]);
      }

      const modal = document.getElementById('add-bill-modal') as any;
      if (!addAnother) {
        if (modal) modal.checked = false;
        setChecked(false);
      }
      reset();
      publishFromClient(billResponse);
      toast.success('Bill added successfully');
    } catch (error) {
      console.error(error);
      toast.error('There was an error adding your bill. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleNlpSubmit: SubmitHandler<FormValues> = async () => {
    try {
      const newBill: Bill = {
        ...nlpBillData,
        paid: checked,
        paidDate: nlpBillData.paidDate ? new Date(nlpBillData.paidDate).toISOString() : undefined,
        dueDate: new Date(nlpBillData.dueDate).toISOString(),
      };

      setLoading(true);
      if (shouldCreateCategory && tempCategory) {
        const { userId, id, ...category } = tempCategory;
        const categoryResponse: CategoryModel = await fetchJson(`/api/categories/user/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category),
        });
        if (categoryResponse) {
          mutateCategories?.([categoryResponse, ...(categories || [])]);
          newBill.categoryId = categoryResponse.id;
        }
      }

      const billResponse = await fetchJson(`/api/bills/user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBill),
      });
      setLoading(false);

      if (billResponse) {
        mutateBills([billResponse, ...(bills || [])]);
      }

      const modal = document.getElementById('add-bill-modal') as any;
      if (!addAnother) {
        if (modal) modal.checked = false;
        setChecked(false);
      }
      reset();
      setNlpBillData(null);
      setTempCategory(null);
      setSelectedCategory('');
      setShouldCreateCategory(false);
      publishFromClient(billResponse);
      toast.success('Bill added successfully');
    } catch (error) {
      console.error(error);
      toast.error('There was an error adding your bill. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tempCategory) {
      setValue('categoryId', tempCategory.id);
    }
  }, [tempCategory, setValue]);

  useEffect(() => {
    // If the watched category is not the temporary new category, set shouldCreateCategory to false
    if (watchedCategoryId !== 0) {
      setShouldCreateCategory(false);
    } else {
      // If the watched category is the temporary new category, set shouldCreateCategory to true
      setShouldCreateCategory(true);
    }
  }, [watchedCategoryId]);

  return (
    <>
      <input ref={closeRef} type="checkbox" id="add-bill-modal" className="modal-toggle" />
      <label htmlFor="add-bill-modal" className="modal cursor-pointer">
        <label className="modal-box max-w-xl relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-between w-full gap-2">
              <div className="flex flex-row items-center justify-start gap-2">
                <div className="border rounded-box p-1.5">
                  <ClipboardDocumentIcon className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-semibold">Add Bill</h1>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (!addFieldsIndividually) {
                    setAddFieldsIndividually(true);
                  } else {
                    setAddFieldsIndividually(false);
                  }
                }}
              >
                {!addFieldsIndividually && 'Add fields individually'}
                {addFieldsIndividually && 'Add fields via prompt'}
              </button>
            </div>
            <span className="text-base-content text-sm font-normal">Fill out the details for your Bill.</span>
          </div>
          <div className="divider my-1.5"></div>
          {addFieldsIndividually && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-start justify-center">
                <FormInput
                  id="title"
                  type="text"
                  htmlFor="title"
                  autoComplete="true"
                  placeholder="Bill title"
                  labelText="Title"
                  required={true}
                  errors={errors}
                  {...register('title', {
                    required: 'Bill title should not be empty',
                    maxLength: {
                      value: 50,
                      message: 'Bill title should not be more than 50 characters',
                    },
                  })}
                />
                <div className="flex flex-row gap-3 w-full mt-2">
                  <div className="flex flex-col items-start">
                    <FormInput
                      id="dueDate"
                      type="date"
                      htmlFor="dueDate"
                      autoComplete="true"
                      placeholder="Due Date"
                      labelText="Due Date"
                      required={true}
                      errors={errors}
                      {...register('dueDate', {
                        required: 'Due Date should not be empty',
                      })}
                    />
                    {/* <RecurringBillDropdown date={watch('dueDate')} /> */}
                  </div>
                  <FormInput
                    id="amount"
                    type="number"
                    htmlFor="amount"
                    autoComplete="true"
                    placeholder="Amount"
                    labelText="Amount"
                    errors={errors}
                    {...register('amount')}
                  />
                </div>
                <div className="form-control w-full mt-1">
                  <label className="label pt-0 pb-1">
                    <span className="label-text text-sm font-semibold">Category</span>
                  </label>
                  <select
                    placeholder="Select a category"
                    defaultValue={''}
                    {...register('categoryId')}
                    className="select select-bordered border-base-content select-primary focus:border-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category: CategoryModel) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="label pt-0 pb-1">
                  <span className="label-text text-sm font-semibold">Group</span>
                </label>
                <select
                  placeholder="Select a group"
                  defaultValue={''}
                  {...register('groupId')}
                  className="select select-bordered border-base-content select-primary focus:border-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a group</option>
                  {groups?.map((group: Group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <div className="flex flex-col mt-2 items-end w-full justify-end">
                  <div className="form-control">
                    <label className="label cursor-pointer flex flex-row items-center gap-3">
                      <input
                        type="checkbox"
                        id="paid"
                        className="toggle toggle-sm toggle-primary"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                      />
                      <span className="label-text text-sm font-semibold">Already Paid?</span>
                    </label>
                  </div>

                  {checked && (
                    <div className="flex flex-row items-end gap-2 w-full">
                      <FormInput
                        id="paidDate"
                        type="date"
                        htmlFor="paidDate"
                        autoComplete="true"
                        placeholder="Paid Date"
                        labelText="Paid Date"
                        required={true}
                        errors={errors}
                        {...register('paidDate')}
                      />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="input-file"
                  className="w-full p-4 mt-2 rounded-box hover:border-primary hover:border-solid cursor-pointer border border-base-content/40 border-dashed"
                >
                  <div className="flex flex-row items-center justify-center gap-2">
                    <input id="input-file" className="hidden" type="file" />
                    <CloudArrowUpIcon className="h-6 w-6" />
                    <h1 className="text-regular font-semibold">Upload file</h1>
                  </div>
                </label>
              </div>
              <div className="modal-action flex flex-row items-center justify-between">
                <div className="form-control w-32">
                  <label className="label cursor-pointer flex flex-row items-center gap-3">
                    <span className="label-text text-sm font-semibold whitespace-nowrap">Add another</span>
                    <input
                      type="checkbox"
                      id="add-another"
                      className="toggle toggle-sm toggle-primary"
                      checked={addAnother}
                      onChange={(e) => setAddAnother(e.target.checked)}
                    />
                  </label>
                </div>
                <div className="flex flex-row items-center justify-end gap-2">
                  <label htmlFor="add-bill-modal" className="btn btn-ghost rounded-xl">
                    Cancel
                  </label>
                  <button className="btn btn-primary rounded-xl">
                    <ClipLoadingIndicator loading={loading} />
                    {!loading && 'Save'}
                  </button>
                </div>
              </div>
            </form>
          )}
          {!addFieldsIndividually && !nlpBillData && (
            <form onSubmit={handleNlpPrompt}>
              <textarea
                className="textarea textarea-bordered textarea-sm w-full"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Bought groceries for $100."
                required
              />

              <div className="modal-action flex flex-row items-center justify-end">
                <div className="flex flex-row items-center justify-end gap-2">
                  <label htmlFor="add-bill-modal" className="btn btn-ghost rounded-xl">
                    Cancel
                  </label>
                  <button type="submit" className="btn btn-primary rounded-xl">
                    <ClipLoadingIndicator loading={loading} />
                    {!loading && 'Review'}
                  </button>
                </div>
              </div>
            </form>
          )}
          {!addFieldsIndividually && nlpBillData && (
            <form onSubmit={handleSubmit(handleNlpSubmit)}>
              <div className="form-control w-full mt-1 mb-2">
                <label className="label pt-0 pb-1">
                  <span className="label-text text-sm font-semibold">Your Prompt</span>
                </label>
                <div className="alert shadow-sm text-sm">
                  <span>{input}</span>
                </div>
              </div>
              <div className="flex flex-col items-start justify-center">
                <FormInput
                  id="title"
                  type="text"
                  htmlFor="title"
                  autoComplete="true"
                  placeholder="Bill title"
                  labelText="Title"
                  required={true}
                  errors={errors}
                  name="title"
                  value={nlpBillData?.title || ''}
                  onChange={(e: any) =>
                    setNlpBillData((nlpBillData: BillData) => ({ ...nlpBillData, title: e.target.value }))
                  }
                />
                <div className="flex flex-row gap-3 w-full mt-2">
                  <div className="flex flex-col items-start">
                    <FormInput
                      id="dueDate"
                      type="date"
                      htmlFor="dueDate"
                      autoComplete="true"
                      placeholder="Due Date"
                      labelText="Due Date"
                      required={true}
                      errors={errors}
                      name="dueDate"
                      value={nlpBillData?.dueDate || ''}
                      onChange={(e: any) =>
                        setNlpBillData((nlpBillData: BillData) => ({ ...nlpBillData, dueDate: e.target.value }))
                      }
                    />
                    {/* <RecurringBillDropdown date={watch('dueDate')} /> */}
                  </div>
                  <FormInput
                    id="amount"
                    type="number"
                    htmlFor="amount"
                    autoComplete="true"
                    placeholder="Amount"
                    labelText="Amount"
                    errors={errors}
                    name="amount"
                    value={nlpBillData?.amount || ''}
                    onChange={(e: any) =>
                      setNlpBillData((nlpBillData: BillData) => ({ ...nlpBillData, amount: e.target.value }))
                    }
                  />
                </div>
                <div className="form-control w-full mt-1">
                  <label className="label pt-0 pb-1">
                    <span className="label-text text-sm font-semibold">Category</span>
                  </label>
                  <select
                    placeholder="Select a category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="select select-bordered border-base-content select-primary focus:border-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category: CategoryModel) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                    {tempCategory && (
                      <option key={tempCategory.id} value={tempCategory.id}>
                        {tempCategory.name}
                      </option>
                    )}
                  </select>
                  {tempCategory && (
                    <div className="alert shadow-sm mt-3 text-sm">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="stroke-info flex-shrink-0 w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span>
                          This category was added automatically. If it's correct, it will be added to your categories.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col mt-2 items-end w-full justify-end">
                  <div className="form-control">
                    <label className="label cursor-pointer flex flex-row items-center gap-3">
                      <input
                        type="checkbox"
                        id="paid"
                        className="toggle toggle-sm toggle-primary"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                      />
                      <span className="label-text text-sm font-semibold">Already Paid?</span>
                    </label>
                  </div>

                  {checked && (
                    <div className="flex flex-row items-end gap-2 w-full">
                      <FormInput
                        id="paidDate"
                        type="date"
                        htmlFor="paidDate"
                        autoComplete="true"
                        placeholder="Paid Date"
                        labelText="Paid Date"
                        required={true}
                        errors={errors}
                        {...register('paidDate')}
                      />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="input-file"
                  className="w-full p-4 mt-2 rounded-box hover:border-primary hover:border-solid cursor-pointer border border-base-content/40 border-dashed"
                >
                  <div className="flex flex-row items-center justify-center gap-2">
                    <input id="input-file" className="hidden" type="file" />
                    <CloudArrowUpIcon className="h-6 w-6" />
                    <h1 className="text-regular font-semibold">Upload file</h1>
                  </div>
                </label>
              </div>
              <div className="modal-action flex flex-row items-center justify-between">
                <div className="form-control w-32">
                  <label className="label cursor-pointer flex flex-row items-center gap-3">
                    <span className="label-text text-sm font-semibold whitespace-nowrap">Add another</span>
                    <input
                      type="checkbox"
                      id="add-another"
                      className="toggle toggle-sm toggle-primary"
                      checked={addAnother}
                      onChange={(e) => setAddAnother(e.target.checked)}
                    />
                  </label>
                </div>
                <div className="flex flex-row w-full items-center justify-end gap-2">
                  <label htmlFor="add-bill-modal" className="btn btn-ghost rounded-xl">
                    Cancel
                  </label>
                  <button className="btn btn-primary rounded-xl">
                    <ClipLoadingIndicator loading={loading} />
                    {!loading && 'Save'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </label>
      </label>
    </>
  );
};
