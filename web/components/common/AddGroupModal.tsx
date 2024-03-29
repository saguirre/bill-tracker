import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import fetchJson from '../../lib/fetchJson';
import { Group } from '../../models/group/group';
import { ClipLoadingIndicator } from './ClipLoadingIndicator';
import { FormInput } from './FormInput';
import { Spinner } from './Spinner';

interface AddGroupModalProps {
  userId?: number;
  groups: Group[] | undefined;
  mutateGroups: (groups: Group[]) => void;
}

interface FormValues {
  name: string;
  adminId: number;
  userIds: number[];
}

export const AddGroupModal: React.FC<AddGroupModalProps> = ({ userId, groups, mutateGroups }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange' });
  const closeRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
      const newGroup = {
        ...data,
        adminId: userId,
      };

      setLoading(true);
      const groupResponse = await fetchJson(`/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup),
      });
      setLoading(false);

      if (groupResponse) {
        mutateGroups([groupResponse, ...(groups || [])]);
      }

      const modal = document.getElementById('add-group-modal') as any;
      if (modal) modal.checked = false;
      reset();
      toast.success('Group added successfully');
    } catch (error) {
      console.error(error);
      toast.error('There was an error adding your group. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input ref={closeRef} type="checkbox" id="add-group-modal" className="modal-toggle" />
      <label htmlFor="add-group-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <div className="border rounded-box p-1.5">
                <UserGroupIcon className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-semibold">Add Group</h1>
            </div>
            <span className="text-base-content text-sm font-normal">Fill out the details for your group.</span>
          </div>
          <div className="divider my-1.5"></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-start justify-center space-y-3">
              <FormInput
                id="name"
                type="text"
                htmlFor="name"
                autoComplete="true"
                placeholder="Group name"
                labelText="Name"
                required={true}
                errors={errors}
                {...register('name', {
                  required: 'Group name should not be empty',
                  maxLength: {
                    value: 50,
                    message: 'Group name should not be more than 50 characters',
                  },
                })}
              />
            </div>
            <div className="modal-action flex flex-row items-center justify-end">
              <label htmlFor="add-group-modal" className="btn btn-ghost rounded-xl">
                Cancel
              </label>
              <button className="btn btn-primary rounded-xl">
                <ClipLoadingIndicator loading={loading} />
                {!loading && 'Save'}
              </button>
            </div>
          </form>
        </label>
      </label>
    </>
  );
};
