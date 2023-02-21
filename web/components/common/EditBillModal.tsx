import { ClipboardDocumentIcon, CloudArrowUpIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MouseEventHandler, MouseEvent, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import fetchJson from '../../lib/fetchJson';
import { Bill } from '../../models/bill/bill';
import { FormInput } from './FormInput';
import { Spinner } from './Spinner';
import * as Ably from 'ably/promises';
import { configureAbly } from '@ably-labs/react-hooks';
import { CategoryModel } from '../../models/category';
import { Group } from '../../models/group/group';
import { format } from 'date-fns';
import classNames from 'classnames';

interface EditBillModalProps {
  userId?: number;
  loading?: boolean;
  bill: Bill;
  bills: Bill[] | undefined;
  mutateBills: (bills: Bill[]) => void;
  groups: Group[] | undefined;
  categories?: CategoryModel[];
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

export const EditBillModal: React.FC<EditBillModalProps> = ({
  groups,
  categories,
  userId,
  bill,
  bills,
  mutateBills,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      title: bill?.title,
      amount: bill?.amount,
      dueDate: bill?.dueDate ? format(new Date(bill?.dueDate), 'yyyy-MM-dd') : '',
      paidDate: bill?.paidDate ? format(new Date(bill?.paidDate), 'yyyy-MM-dd') : '',
      categoryId: bill?.category?.id,
      groupId: bill?.group?.id,
      paid: bill?.paid,
    },
  });

  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelPromise | null>(null);
  const [checked, setChecked] = useState(bill?.paid);
  const [editing, setEditing] = useState(false);
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
      title: `${bill?.user.name} edited a bill`,
      message: `${bill?.title} - ${bill?.amount}`,
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

      mutateBills(bills?.map((billItem: Bill) => (bill?.id === billItem.id ? newBill : billItem)) || []);
      const billResponse: Bill = await fetchJson(`/api/bills/user/${userId}/bill/${bill?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBill),
      });

      if (billResponse) {
        mutateBills([
          ...(bills || [])?.map((billItem: Bill) => {
            if (billItem?.id === bill.id) {
              return billResponse;
            }
            return billItem;
          }),
        ]);
      }
      const modal = document.getElementById('edit-bill-modal') as any;
      if (modal) modal.checked = false;
      setEditing(false);
      resetBill(billResponse);
      publishFromClient(billResponse);
      toast.success('Bill edited successfully');
    } catch (error) {
      console.error(error);
      toast.error('There was an error editing your bill. Please try again later.');
    }
  };

  const resetBill = (bill: Bill) => {
    reset({
      title: bill.title,
      amount: bill.amount,
      dueDate: bill?.dueDate ? format(new Date(bill?.dueDate), 'yyyy-MM-dd') : '',
      paidDate: bill?.paidDate ? format(new Date(bill?.paidDate), 'yyyy-MM-dd') : '',
      categoryId: bill?.category?.id,
      groupId: bill?.group?.id,
      paid: bill?.paid,
    });
  };

  useEffect(() => {
    resetBill(bill);
  }, [bill]);
  return (
    <>
      <input ref={closeRef} type="checkbox" id="edit-bill-modal" className="modal-toggle" />
      <label htmlFor="edit-bill-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className={classNames(
                  'btn btn-outline btn-base-content border rounded-box p-1.5',
                  editing ? 'btn-primary' : ''
                )}
              >
                <PencilIcon className="h-8 w-8" />
              </button>
              <h1 className="text-2xl font-semibold">View Bill</h1>
              {editing && <span className="text-xs">(Currently editing Bill)</span>}
            </div>
            <span className="text-base-content text-sm font-normal">
              View or edit your bill details. (You can click on the Pencil to edit your bill)
            </span>
          </div>
          <div className="divider my-1.5"></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-start justify-center space-y-3">
              <FormInput
                id="title"
                type="text"
                readOnly={!editing}
                defaultValue={bill?.title}
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
              <div className="flex flex-row gap-3 w-full">
                <FormInput
                  id="dueDate"
                  type="date"
                  readOnly={!editing}
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
                <FormInput
                  id="amount"
                  type="number"
                  defaultValue={bill?.amount?.toString()}
                  readOnly={!editing}
                  htmlFor="amount"
                  autoComplete="true"
                  placeholder="Amount"
                  labelText="Amount"
                  errors={errors}
                  {...register('amount')}
                />
              </div>
              <div className="form-control w-full">
                <label className="label pt-0 pb-1">
                  <span className="label-text text-sm font-semibold">Category</span>
                </label>
                {editing && (
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
                )}
                {!editing && (
                  <input
                    readOnly={true}
                    defaultValue={bill?.category?.name}
                    className="input input-bordered border-base-content input-primary focus:border-none focus:ring-base-content cursor-default focus:border-transparent focus:outline-none focus:ring-1"
                  />
                )}
              </div>
              <div className="form-control w-full">
                <label className="label pt-0 pb-1">
                  <span className="label-text text-sm font-semibold">Group</span>
                </label>
                {editing && (
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
                )}
                {!editing && (
                  <input
                    readOnly={true}
                    defaultValue={bill?.group?.name}
                    className="input input-bordered border-base-content input-primary focus:border-none focus:ring-base-content cursor-default focus:border-transparent focus:outline-none focus:ring-1"
                  />
                )}
              </div>
              <div className="flex flex-col items-end w-full justify-end">
                <div className="form-control">
                  <label className="label cursor-pointer flex flex-row items-center gap-3">
                    <input
                      type="checkbox"
                      id="paid"
                      readOnly={!editing}
                      className="toggle toggle-sm toggle-primary"
                      checked={!editing ? bill?.paid : checked}
                      onChange={(e) => editing && setChecked(e.target.checked)}
                    />
                    <span className="label-text text-sm font-semibold">Already Paid?</span>
                  </label>
                </div>

                {checked && (
                  <div className="flex flex-row items-end gap-2 w-full">
                    <FormInput
                      id="paidDate"
                      type="date"
                      readOnly={!editing}
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
                onClick={(e) => {
                  if (!editing) {
                    e.preventDefault();
                  }
                }}
                htmlFor="input-file"
                className={classNames('w-full p-4 rounded-box border border-base-content/40 border-dashed', {
                  'cursor-pointer hover:border-primary hover:border-solid': editing,
                })}
              >
                <div className="flex flex-row items-center justify-center gap-2">
                  <input id="input-file" className="hidden" type="file" />
                  <CloudArrowUpIcon className="h-6 w-6" />
                  <h1 className="text-regular font-semibold">Upload file</h1>
                </div>
              </label>
            </div>
            <div className="modal-action flex flex-row items-center justify-end">
              <div className="flex flex-row items-center justify-end gap-2">
                <label
                  onClick={() => {
                    reset();
                    setEditing(false);
                  }}
                  htmlFor="edit-bill-modal"
                  className="btn btn-ghost rounded-xl"
                >
                  Cancel
                </label>
                {editing && isDirty && (
                  <button className="btn btn-primary rounded-xl" disabled={Object.entries(errors)?.length > 0}>
                    {loading && <Spinner className=" h-4 w-4 border-b-2 border-white bg-primary mr-3"></Spinner>}
                    Save
                  </button>
                )}
              </div>
            </div>
          </form>
        </label>
      </label>
    </>
  );
};
