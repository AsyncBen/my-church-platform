import { PrismaClient } from "@prisma/client";
import { CreatePrayerInput } from "./prayer.validation";

const prisma = new PrismaClient();

export const createPrayer = async (data: CreatePrayerInput, userId: string) => {
  const prayer = await prisma.prayer.create({
    data: {
      text: data.text,
      category: data.category || "Personal",
      isAnonymous: data.isAnonymous || false,
      userId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    ...prayer,
    user: prayer.isAnonymous ? { name: "Anonymous" } : prayer.user,
  };
};

export const getAllPrayers = async () => {
  const prayers = await prisma.prayer.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      text: true,
      category: true,
      isAnonymous: true,
      prayerCount: true,
      createdAt: true,
      userId: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return prayers.map((prayer) => ({
    ...prayer,
    user: prayer.isAnonymous ? { name: "Anonymous" } : prayer.user,
  }));
};

export const prayForRequest = async (id: string) => {
  const prayer = await prisma.prayer.update({
    where: { id },
    data: {
      prayerCount: {
        increment: 1,
      },
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    ...prayer,
    user: prayer.isAnonymous ? { name: "Anonymous" } : prayer.user,
  };
};

export const deletePrayer = async (id: string, userId: string) => {
  const prayer = await prisma.prayer.findUnique({
    where: { id },
  });

  if (!prayer) {
    throw new Error("Prayer request not found");
  }

  if (prayer.userId !== userId) {
    throw new Error("Not authorized");
  }

  await prisma.prayer.delete({
    where: { id },
  });

  return prayer;
};