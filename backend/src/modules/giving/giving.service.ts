import { PrismaClient } from '@prisma/client';
import { CreateGivingInput } from './giving.validation';

const prisma = new PrismaClient();

export const createGiving = async (data: CreateGivingInput, userId: string) => {
  const result = await prisma.giving.create({
    data: {
      ...data,
      userId,
      status: 'CONFIRMED',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

export const getUserGivings = async (userId: string) => {
  const givings = await prisma.giving.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      category: true,
      amount: true,
      reference: true,
      note: true,
      service: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return givings;
};

export const getAllGivings = async (filters?: {
  type?: string;
  search?: string;
}) => {
  const givings = await prisma.giving.findMany({
    where: {
      ...(filters?.type && { category: filters.type }),
      ...(filters?.search && {
        user: {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      }),
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return givings;
};

export const getGivingSummary = async () => {
  const givings = await prisma.giving.findMany();

  const total = givings.reduce((sum, g) => sum + g.amount, 0);
  const titheTotal = givings
    .filter((g) => g.category === 'TITHE')
    .reduce((sum, g) => sum + g.amount, 0);
  const offeringTotal = givings
    .filter((g) => g.category !== 'TITHE')
    .reduce((sum, g) => sum + g.amount, 0);
  const count = givings.length;
  const titheCount = givings.filter((g) => g.category === 'TITHE').length;
  const offeringCount = count - titheCount;

  return {
    total,
    titheTotal,
    offeringTotal,
    count,
    titheCount,
    offeringCount,
  };
};
