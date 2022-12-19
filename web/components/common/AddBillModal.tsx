import { XMarkIcon } from '@heroicons/react/24/solid';
import { useForm } from 'react-hook-form';
import { CategoryModel } from '../../models/category';
import { Frequency } from '../../types/frequency.type';

interface AddBillModalProps {
  loading: boolean;
}

interface FormValues {
  title: string;
  amount: number;
  dueDate: Date;
  billFrequency: Frequency;
  billCategory: CategoryModel;
  notes: string;
  billImage: File;
}
export const AddBillModal: React.FC<AddBillModalProps> = ({ loading }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const closeModal = () => {
    // setValue('name', '');
    // setValue('amount', '');
    // setValue('dueDate', '');
    // setValue('billFrequency', '');
    // setValue('billCategory', '');
    // setValue('notes', '');
    // setValue('billImage', '');
  };

  return (
    <>
      <input type="checkbox" id="add-bill-modal" className="modal-toggle" />
      <label className="modal cursor-pointer">
        <div className="modal-box">
          <div className="modal-header flex flex-row justify-between items-center">
            <h2 className="modal-title text-2xl uppercase font-bold">Add Bill</h2>
            <label htmlFor="add-bill-modal" className="btn btn-ghost btn-circle">
              <XMarkIcon className="h-6 w-6" />
            </label>
          </div>
          <div className="modal-body">
            <form
              onSubmit={handleSubmit((data) => {
                console.log(data);
              })}
            >
              <div className="form-control">
                <label className="label flex flex-col items-start gap-1">
                  <span className="label-text font-semibold">Title</span>
                  <input type="date" placeholder="Due Date" className="input input-bordered" />

                  {errors.title && <span className="text-error">{errors.title.message}</span>}

                  <span className="text-error"></span>
                </label>
              </div>
              <div className="flex flex-row items-center w-full">
                <div className="form-control">
                  <label className="label flex flex-col items-start gap-1">
                    <span className="label-text font-semibold">Due Date</span>
                    <input type="date" placeholder="Due Date" className="input input-bordered" />
                    {errors.dueDate && <span className="text-error">{errors.dueDate.message}</span>}

                    <span className="text-error"></span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label flex flex-col items-start gap-1">
                    <span className="label-text font-semibold">Amount</span>
                    <input type="number" placeholder="Amount" className="input input-bordered" />
                    {errors.amount && <span className="text-error">{errors.amount.message}</span>}

                    <span className="text-error"></span>
                  </label>
                </div>
              </div>

              <div className="form-control">
                <label className="label flex flex-col items-start gap-1">
                  <span className="label-text font-semibold">Frequency</span>
                  <select className="select select-bordered w-full max-w-xs">
                    <option value="">Select Frequency</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                  {errors.billFrequency && <span className="text-error">{errors.billFrequency.message}</span>}

                  <span className="text-error"></span>
                </label>
              </div>
              <div className="form-control">
                <label className="label flex flex-col items-start gap-1">
                  <span className="label-text font-semibold">Category</span>
                  <select className="select select-bordered w-full max-w-xs">
                    <option disabled defaultValue={''}>
                      Select Category
                    </option>
                    <option value="FOOD">Food</option>

                    <option value="UTILITIES">Utilities</option>
                    <option value="TRANSPORTATION">Transportation</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                    <option value="HEALTH">Health</option>
                    <option value="OTHER">Other</option>
                  </select>

                  {errors.billCategory && <span className="text-error">{errors.billCategory.message}</span>}

                  <span className="text-error"></span>
                </label>
              </div>
              <div className="form-control">
                <label className="label flex flex-col items-start gap-1">
                  <span className="label-text font-semibold">Notes</span>
                  <textarea className="textarea h-24 textarea-bordered" placeholder="Notes"></textarea>

                  <span className="text-error"></span>
                </label>
              </div>
              <div className="form-control">
                <label className="label flex flex-col items-start gap-1">
                  <span className="label-text font-semibold">Bill File or Image</span>
                  <input type="file" className="file-input file-input-bordered w-full max-w-xs" />

                  <span className="text-error"></span>
                </label>
              </div>
            </form>
          </div>
          <div className="modal-footer gap-3 pt-3 flex flex-row w-full justify-end items-center">
            <label htmlFor="add-bill-modal" className="btn btn-ghost w-40" onClick={closeModal}>
              Cancel
            </label>
            <button type="button" className="btn btn-primary w-40" onClick={handleSubmit(onSubmit)}>
              Save
            </button>
          </div>
        </div>
      </label>
    </>
  );
};
