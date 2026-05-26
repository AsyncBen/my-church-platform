import { PrismaClient } from "@prisma/client";
import { CreateEventInput } from "./event.validation";

const prisma = new PrismaClient();

export const createEvent = async (data: CreateEventInput) => {
  const event = await prisma.event.create({
    data: {
      title: data.title,
      date: data.date,
      time: data.time,
      type: data.type,
      accent: data.accent || "#1B3A7A",
    },
  });

  return event;
};

export const getAllEvents = async () => {
  const events = await prisma.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return events;
};

export const deleteEvent = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  await prisma.event.delete({
    where: { id },
  });

  return event;
};