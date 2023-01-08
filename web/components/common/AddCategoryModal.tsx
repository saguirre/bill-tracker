import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import fetchJson from '../../lib/fetchJson';
import { CategoryModel } from '../../models/category';
import { FormInput } from './FormInput';
import { Spinner } from './Spinner';

interface AddCategoryModalProps {
  userId?: number;
  loading: boolean;
  categories: CategoryModel[] | undefined;
  mutateCategories: (categories: CategoryModel[]) => void;
}

interface FormValues {
  name: string;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  userId,
  categories,
  mutateCategories,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange' });
  const [addAnother, setAddAnother] = useState(false);
  const [checked, setChecked] = useState(false);
  const closeRef = useRef<HTMLInputElement>(null);

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
      const newCategory: CategoryModel = {
        ...data,
      };

      mutateCategories([...(categories || []), { id: (categories?.length || 0) + 1, ...newCategory }]);
      const categoryResponse = await fetchJson(`/api/categories/user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      if (categoryResponse) {
        mutateCategories([
          ...(categories || [])?.map((category: CategoryModel) => {
            if (category.id === newCategory.id) {
              return categoryResponse;
            }
            return category;
          }),
        ]);
      }
      const modal = document.getElementById('add-category-modal') as any;
      if (!addAnother) {
        if (modal) modal.checked = false;
        setChecked(false);
      }
      reset();
      toast.success('Category added successfully');
    } catch (error) {
      console.error(error);
      toast.error('There was an error adding your category. Please try again later.');
    }
  };

  return (
    <>
      <input ref={closeRef} type="checkbox" id="add-category-modal" className="modal-toggle" />
      <label htmlFor="add-category-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <div className="border rounded-box p-1.5">
                <ClipboardDocumentIcon className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-semibold">Add Category</h1>
            </div>
            <span className="text-base-content text-sm font-normal">Fill out the details for your category.</span>
          </div>
          <div className="divider my-1.5"></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-start justify-center space-y-3">
              <FormInput
                id="name"
                type="text"
                htmlFor="name"
                autoComplete="true"
                placeholder="Category name"
                labelText="Name"
                required={true}
                errors={errors}
                {...register('name', {
                  required: 'Category name should not be empty',
                  maxLength: {
                    value: 50,
                    message: 'Category name should not be more than 50 characters',
                  },
                })}
              />
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
                <label htmlFor="add-category-modal" className="btn btn-ghost rounded-xl">
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
