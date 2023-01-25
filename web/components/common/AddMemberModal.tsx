import { MinusIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import fetchJson from '../../lib/fetchJson';
import { Group } from '../../models/group/group';
import { emailRegex } from '../../utils/regex-utils';
import { FormInput } from './FormInput';

interface AddMemberModalProps {
  group?: Group;
  mutateGroups: (groups?: Group[]) => void;
}
type FormValues = {
  emails: { email: string }[];
};

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ group, mutateGroups }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onChange', defaultValues: { emails: [{ email: '' }] } });
  const { fields, append, remove } = useFieldArray({
    name: 'emails',
    control,
  });
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
      await fetchJson(`/api/groups/${group?.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.emails),
      });
      const modal = document.getElementById('add-member-modal') as any;
      if (modal) modal.checked = false;
      mutateGroups();
      reset();
      toast.success('Members invited successfully');
    } catch (error) {
      console.error(error);
      toast.error('There was an error inviting members. Please try again later.');
    }
  };

  return (
    <>
      <input ref={closeRef} type="checkbox" id="add-member-modal" className="modal-toggle" />
      <label htmlFor="add-member-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <div className="border rounded-box p-1.5">
                <UserGroupIcon className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-semibold">Invite Members</h1>
            </div>
            <span className="text-base-content text-sm font-normal">
              Invite members to your group by filling out their emails and sending an invitation!
            </span>
          </div>
          <div className="divider my-1.5"></div>
          {group && group.groupInvite && group.groupInvite.length > 0 && (
            <div className="flex flex-col w-full gap-2 mb-2">
              <label className="flex flex-row items-center text-sm font-semibold">Pending Invites</label>
              <div className="flex flex-grid grid-cols-2 w-full flex-wrap gap-2 pb-3">
                {group.groupInvite.map((invite) => (
                  <div key={invite.id} className="badge h-7 badge-info badge-outline w-fit whitespace-nowrap">
                    {invite.email}
                  </div>
                ))}
              </div>
            </div>
          )}
          {group && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-start justify-center space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-row items-center gap-3 justify-end w-full">
                    <FormInput
                      id="email"
                      type="email"
                      labelText={index == 0 ? 'Add member' : ''}
                      htmlFor="email"
                      errors={errors}
                      placeholder="steve.jobs@microsoft.com"
                      {...register(`emails.${index}.email` as const, {
                        required: 'Email is required',
                        pattern: {
                          value: emailRegex,
                          message: 'Email is not valid',
                        },
                        maxLength: {
                          value: 50,
                          message: 'Email should not exceed 50 characters',
                        },
                      })}
                      autoComplete="email"
                    />
                    {index === 0 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          append({ email: '' });
                        }}
                        className="btn-sm btn-circle btn-primary px-4 flex flex-col items-center justify-center mt-5"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    )}
                    {index > 0 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          remove(index);
                        }}
                        className="btn-sm btn-circle btn-outline btn-error px-3 flex flex-col items-center justify-center"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-action flex flex-row items-center justify-end">
                <label htmlFor="add-member-modal" className="btn btn-ghost rounded-xl">
                  Cancel
                </label>
                <button className="btn btn-primary rounded-xl">Send</button>
              </div>
            </form>
          )}
          {!group && (
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-base-content text-sm font-normal">You need to create a group first!</span>
              <label htmlFor="add-member-modal" className="btn btn-ghost rounded-xl">
                Cancel
              </label>
            </div>
          )}
        </label>
      </label>
    </>
  );
};
