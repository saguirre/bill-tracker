import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DueDateLabel } from './DueDateLabel';
import { FormInput } from './FormInput';
import { Spinner } from './Spinner';

interface AddBillModalProps {
  loading: boolean;
}

interface FormValues {
  title: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export const AddBillModal: React.FC<AddBillModalProps> = ({ loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' });

  const [checked, setChecked] = useState(false);
  return (
    <>
      <input type="checkbox" id="add-bill-modal" className="modal-toggle" />
      <label htmlFor="add-bill-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <form>
            <div className="flex flex-col items-start justify-center space-y-2">
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
                  maxLength: {
                    value: 50,
                    message: 'Due Date should not be more than 50 characters',
                  },
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
                className="w-full focus:ring-primary"
                {...register('amount')}
              />
              <div className="form-control w-36">
                <label className="label cursor-pointer">
                  <span className="label-text text-sm font-semibold">Already Paid?</span>
                  <input
                    type="checkbox"
                    id="paid"
                    className="checkbox checkbox-primary focus:ring-0 focus:outline-none"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                </label>
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
