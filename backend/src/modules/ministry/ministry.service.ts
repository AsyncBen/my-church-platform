import { PrismaClient } from '@prisma/client';
import { broadcastMinistryMessage } from '../../sockets/ministry.events';
import { Server as SocketServer } from 'socket.io';

const prisma = new PrismaClient();

export const getAllGroups = async () => {
  return prisma.ministryGroup.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      accent: true,
      imageUrl: true,
      createdAt: true,
      _count: {
        select: {
          members: true,
          messages: true,
        },
      },
    },
  });
};

export const getGroupById = async (groupId: string) => {
  const group = await prisma.ministryGroup.findUnique({
    where: { id: groupId },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  if (!group) {
    throw new Error('Group not found');
  }

  return group;
};

export const joinGroup = async (groupId: string, userId: string) => {
  // Verify group exists
  const group = await prisma.ministryGroup.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new Error('Group not found');
  }

  await prisma.ministryMember.upsert({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
    update: {},
    create: {
      groupId,
      userId,
    },
  });

  return { joined: true };
};

export const leaveGroup = async (groupId: string, userId: string) => {
  await prisma.ministryMember.deleteMany({
    where: {
      groupId,
      userId,
    },
  });

  return { left: true };
};

export const getGroupMessages = async (groupId: string) => {
  // Verify group exists
  const group = await prisma.ministryGroup.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new Error('Group not found');
  }

  return prisma.ministryMessage.findMany({
    where: { groupId },
    orderBy: {
      createdAt: 'asc',
    },
    take: 50,
    include: {
      user: {
        select: {
          name: true,
          role: true,
        },
      },
    },
  });
};

export const sendMessage = async (
  groupId: string, 
  text: string, 
  userId: string, 
  io?: SocketServer
) => {
  // Check if user is a member of the group
  const membership = await prisma.ministryMember.findFirst({
    where: {
      groupId,
      userId,
    },
  });

  if (!membership) {
    throw new Error('You must join this group to send messages');
  }

  const message = await prisma.ministryMessage.create({
    data: {
      groupId,
      userId,
      text,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  // Broadcast message to group room if io instance is available
  if (io && typeof broadcastMinistryMessage === 'function') {
    try {
      broadcastMinistryMessage(io as any, groupId, {
        id: message.id,
        text: message.text,
        createdAt: message.createdAt.toISOString(),
        user: {
          name: message.user.name || 'Unknown',
        },
      });
    } catch (error) {
      console.error('Failed to broadcast ministry message:', error);
    }
  }

  return message;
};

export const getUserGroups = async (userId: string) => {
  return prisma.ministryMember.findMany({
    where: { userId },
    include: {
      group: true,
    },
  });
};

export const isGroupMember = async (groupId: string, userId: string): Promise<boolean> => {
  const membership = await prisma.ministryMember.findFirst({
    where: {
      groupId,
      userId,
    },
  });

  return !!membership;
};