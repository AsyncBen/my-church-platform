import { PrismaClient } from "@prisma/client";
import { CreateSermonNoteInput, UpdateSermonNoteInput } from "./sermon-note.validation";

const prisma = new PrismaClient();

export const createSermonNote = async (userId: string, data: CreateSermonNoteInput) => {
  return prisma.sermonNote.create({
    data: {
      userId,
      sermonId: data.sermonId,
      title: data.title,
      scripture: data.scripture,
      content: data.content,
    },
  });
};

export const getUserSermonNotes = async (userId: string, sermonId?: string) => {
  return prisma.sermonNote.findMany({
    where: {
      userId,
      ...(sermonId && { sermonId }),
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const getSermonNoteById = async (noteId: string, userId: string) => {
  const note = await prisma.sermonNote.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};

export const updateSermonNote = async (noteId: string, userId: string, data: UpdateSermonNoteInput) => {
  const note = await prisma.sermonNote.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return prisma.sermonNote.update({
    where: { id: noteId },
    data,
  });
};

export const deleteSermonNote = async (noteId: string, userId: string) => {
  const note = await prisma.sermonNote.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  await prisma.sermonNote.delete({
    where: { id: noteId },
  });

  return { message: "Note deleted successfully" };
};