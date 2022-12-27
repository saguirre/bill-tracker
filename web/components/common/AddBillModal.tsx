import { ClipboardDocumentIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
import { getServiceUrl } from '../../lib/httpHelpers';

interface AddBillModalProps {
  userId?: number;
  loading: boolean;
  bills: Bill[] | undefined;
  mutateBills: (bills: Bill[]) => void;
}

interface FormValues {
  title: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  paid: boolean;
}

export const AddBillModal: React.FC<AddBillModalProps> = ({ userId, bills, mutateBills, loading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange' });
  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelPromise | null>(null);
  const [addAnother, setAddAnother] = useState(false);
  const [checked, setChecked] = useState(false);
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

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      const newBill: Bill = {
        ...data,
        paid: checked,
        paidDate: data.paidDate ? new Date(data.paidDate) : undefined,
        dueDate: new Date(data.dueDate),
      };

      mutateBills([...(bills || []), { id: (bills?.length || 0) + 1, ...newBill }]);
      const billResponse = await fetchJson(`/api/bills/user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBill),
      });

      if (billResponse) {
        mutateBills([
          ...(bills || [])?.map((bill: Bill) => {
            if (bill.id === newBill.id) {
              return billResponse;
            }
            return bill;
          }),
        ]);
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
    }
  };

  return (
    <>
      <input ref={closeRef} type="checkbox" id="add-bill-modal" className="modal-toggle" />
      <label htmlFor="add-bill-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <div className="border rounded-box p-1.5">
                <ClipboardDocumentIcon className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-semibold">Add Bill</h1>
            </div>
            <span className="text-base-content text-sm font-normal">Fill out the details for your Bill.</span>
          </div>
          <div className="divider my-1.5"></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-start justify-center space-y-3">
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
              <div className="flex flex-row gap-3 w-full">
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
              {checked && <div className="divider my-1"></div>}

              <div className="flex flex-row w-full items-center justify-end gap-3">
                {!checked && (
                  <div className="form-control w-32">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        id="paid"
                        className="checkbox checkbox-sm checkbox-primary focus:ring-0 focus:outline-none"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                      />
                      <span className="label-text text-sm font-semibold">Already Paid?</span>
                    </label>
                  </div>
                )}

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
                    <button
                      className="btn btn-circle btn-ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setChecked(false);
                      }}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>
              <label
                htmlFor="input-file"
                className="w-full p-4 rounded-box hover:border-primary hover:border-solid cursor-pointer border border-base-content/40 border-dashed"
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
                <label className="label cursor-pointer">
                  <span className="label-text text-sm font-semibold">Add another</span>
                  <input
                    type="checkbox"
                    id="add-another"
                    className="checkbox checkbox-sm checkbox-primary focus:ring-0 focus:outline-none"
                    checked={addAnother}
                    onChange={(e) => setAddAnother(e.target.checked)}
                  />
                </label>
              </div>
              <div className='flex flex-row items-center justify-end gap-2'>
                <label htmlFor="add-bill-modal" className="btn btn-ghost rounded-xl">
                  Cancel
                </label>
                <button className="btn btn-primary rounded-xl">
                  {loading && <Spinner className=" h-4 w-4 border-b-2 border-white bg-primary mr-3"></Spinner>}
                  Save
                </button>
              </div>
            </div>
          </form>
        </label>
      </label>
    </>
  );
};
