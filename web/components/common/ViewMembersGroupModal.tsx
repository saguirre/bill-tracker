import { MinusIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import fetchJson from '../../lib/fetchJson';
import { Group } from '../../models/group/group';
import { emailRegex } from '../../utils/regex-utils';
import { FormInput } from './FormInput';

interface ViewMembersModalProps {
  group?: Group;
  mutateGroups: (groups?: Group[]) => void;
}
type FormValues = {
  emails: { email: string }[];
};

export const ViewMembersModal: React.FC<ViewMembersModalProps> = ({ group, mutateGroups }) => {
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
      const modal = document.getElementById('view-members-modal') as any;
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
      <input ref={closeRef} type="checkbox" id="view-members-modal" className="modal-toggle" />
      <label htmlFor="view-members-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <div className="border rounded-box p-1.5">
                <UserGroupIcon className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-semibold">{group?.name}'s Members</h1>
            </div>
            <span className="text-base-content text-sm font-normal">View {group?.name}'s members.</span>
          </div>
          <div className="divider my-1.5"></div>
          {group && group.groupInvite && group.groupInvite.length > 0 && (
            <div className="flex flex-col w-full gap-2 mb-2">
              <label className="flex flex-row items-center text-sm font-semibold">Members</label>
              <div className="flex flex-grid grid-cols-2 w-full flex-wrap gap-2 pb-3">
                {group?.members &&
                  group?.members?.map((member) => (
                    <div
                      key={member.user?.id}
                      className="rounded-lg border border-secondary px-3 py-2 flex flex-row items-center gap-2 text-secondary"
                    >
                      {member?.user?.avatar && (
                        <img src={member?.user?.avatar} alt="avatar" className="rounded-full h-10 w-10" />
                      )}
                      {!member?.user?.avatar && (
                        <img
                          src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                          alt="avatar"
                          className="rounded-full h-10 w-10"
                        />
                      )}
                      {member.user?.name}
                    </div>
                  ))}
              </div>
            </div>
          )}
          {group && (
            <div className="modal-action flex flex-row w-full items-center justify-end">
              <label htmlFor="view-members-modal" className="btn btn-ghost border border-base-content rounded-xl">
                Cancel
              </label>
            </div>
          )}
          {!group && (
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-base-content text-sm font-normal">You need to create a group first!</span>
              <label htmlFor="view-members-modal" className="btn btn-ghost rounded-xl">
                Cancel
              </label>
            </div>
          )}
        </label>
      </label>
    </>
  );
};
