import { ClipboardDocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import fetchJson from '../../lib/fetchJson';
import { Bill } from '../../models/bill/bill';
import { FormInput } from './FormInput';
import { Spinner } from './Spinner';

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
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange' });

  const [checked, setChecked] = useState(false);

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
      if (modal) modal.checked = false;

      toast.success('Bill added successfully');
    } catch (error) {
      console.log(error);
      toast.error('There was an error adding your bill. Please try again later.');
    }
  };

  return (
    <>
      <input type="checkbox" id="add-bill-modal" className="modal-toggle" />
      <label htmlFor="add-bill-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <ClipboardDocumentIcon className="h-8 w-8" />
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
            </div>
            <div className="modal-action">
              <label htmlFor="add-bill-modal" className="btn btn-ghost rounded-xl">
                Cancel
              </label>
              <button className="btn btn-primary rounded-xl">
                {loading && <Spinner className=" h-4 w-4 border-b-2 border-white bg-primary mr-3"></Spinner>}
                Save
              </button>
            </div>
          </form>
        </label>
      </label>
    </>
  );
};
