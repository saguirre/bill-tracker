import type { InferGetServerSidePropsType } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../lib/session';
import { User } from '../models/user/user';
import { Layout } from '../components/Layout';
import { useRef, useState } from 'react';
import { useKeyPress } from '../hooks/useKeyPress.hook';
import { AddGroupModal } from '../components/common/AddGroupModal';
import useGroups from '../lib/useGroups';
import { HorizontalAvatarGroup } from '../components/common/HorizontalAvatarGroup';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { AddMemberModal } from '../components/common/AddMemberModal';
import { Group } from '../models/group/group';
import { getCorrespondingThemeImage } from '../utils/get-page-image-by-theme';
import { useTheme } from 'next-themes';
import { RemoveItemButton } from '../components/common/RemoveItemButton';
import { toast } from 'react-toastify';

export default function Groups({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const addGroupRef = useRef<HTMLLabelElement>(null);
  const { groups, mutateGroups } = useGroups(user);
  const { theme } = useTheme();
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>();

  useKeyPress(() => {
    if (addGroupRef.current) {
      addGroupRef.current.click();
    }
  }, ['KeyA']);

  const isGroupAdmin = (group: Group) => {
    return group?.adminId === user?.id;
  };

  const removeGroup = async (group: Group) => {
    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        toast.success('Group deleted successfully!');
        mutateGroups(groups?.filter((b) => b.id !== group.id));
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error happened');
    }
  };

  return (
    <Layout showSearch={true} user={user}>
      <div className="flex flex-col items-center h-full px-12">
        <div className="h-full w-full bg-base-100 px-6">
          <div className="h-full flex flex-row w-full justify-between">
            <div className="flex flex-col w-full">
              <div className="flex flex-row items-center w-full">
                <div className="flex flex-col w-full items-start justify-start">
                  <h2 className="card-title text-xl">
                    Groups
                    <div className="badge">COMING SOON</div>
                  </h2>
                  <p className="text-sm">Review your groups</p>
                </div>
                <div className="flex flex-row w-full items-center justify-end gap-2 ">
                  <div className="flex flex-col items-center gap-1.5">
                    <label
                      ref={addGroupRef}
                      htmlFor="add-group-modal"
                      className="btn btn-accent flex flex-col items-center justify-center"
                    >
                      Add Group
                    </label>
                    <div className="flex flex-row items-center justify-center gap-1">
                      <span className="kbd kbd-sm">⌘</span>
                      <span className="kbd kbd-sm">A</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="divider my-1"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-2 w-full">
          {!groups ||
            (groups.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-1.5">
                <p className="text-sm text-base-content/60 -mb-28 mt-8">No Groups</p>
                <img src={getCorrespondingThemeImage('no_groups', theme)} alt="No Groups" className="w-96" />
              </div>
            ))}
          {groups && groups.length > 0 && (
            <div className="grid grid-cols-2 gap-4 w-full px-4 py-2">
              {groups?.map((group) => (
                <div
                  onClick={() => {
                    console.log(group);
                  }}
                  key={group.id}
                  className="relative pr-2 pt-2"
                >
                  <div className="card w-full border rounded-box cursor-pointer bg-base-100 hover:bg-base-200 hover:border-primary">
                    <div className="card-body">
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                          <h2 className="card-title">{group.name}</h2>
                        </div>
                        <div className="flex flex-row gap-3 items-center justify-between w-fit">
                          <div className="flex flex-row gap-1 items-center justify-end badge badge-lg badge-primary badge-outline h-8">
                            <p className="text-md font-bold">
                              {group.bills?.length === 0 ? 'No' : group.bills?.length}
                            </p>
                            <span className="text-md font-bold">Bills</span>
                          </div>
                        </div>
                      </div>
                      <div className="divider m-0" />
                      <div className="flex flex-row items-center justify-between w-full ">
                        <HorizontalAvatarGroup members={group.members} maxAvatars={3} showCount />
                        <div className="flex flex-row items-center w-fit gap-3">
                          <div className="flex flex-row w-fit gap-1 h-6 items-center justify-end badge badge-ghost badge-outline">
                            <DocumentTextIcon className="h-4 w-4" /> <p className="text-sm font-semibold">No Files</p>
                          </div>
                          <label
                            onClick={() => {
                              setSelectedGroup(group);
                            }}
                            htmlFor="add-member-modal"
                            className="btn btn-sm btn-secondary"
                          >
                            Add Member
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isGroupAdmin(group) && <RemoveItemButton onRemove={() => removeGroup(group)} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <AddGroupModal groups={groups} mutateGroups={mutateGroups} userId={user?.id} loading={false} />
      <AddMemberModal group={selectedGroup} mutateGroups={mutateGroups} />
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  const user = req.session.user;

  if (!user || !user?.isLoggedIn) {
    res.writeHead(301, { Location: '/signin' });
    res.end();
    return {
      props: {
        user: { isLoggedIn: false } as User,
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
}, sessionOptions);
