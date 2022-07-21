import prisma from './prisma';
import users from './users';
import groups from './groups';

const memberships = {
  // Add a user to a group
  add: async (directoryGroupId: string, directoryUserId: string) => {
    const user = await users.get(directoryUserId);
    const group = await groups.get(directoryGroupId);

    if (user === null || group === null) {
      return;
    }

    return await prisma.userGroup.create({
      data: {
        userId: user.id,
        groupId: group.id,
      },
    });
  },

  // Remove a user from a group
  remove: async (directoryGroupId: string, directoryUserId: string) => {
    const user = await users.get(directoryUserId);
    const group = await groups.get(directoryGroupId);

    if (user === null || group === null) {
      return;
    }

    return await prisma.userGroup.delete({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: group.id,
        },
      },
    });
  },
};

export default memberships;
