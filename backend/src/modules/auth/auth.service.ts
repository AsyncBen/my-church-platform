import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../../utils/jwt";
import { RegisterInput, LoginInput } from "./auth.validation";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

export const registerUser = async (data: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Role is always MEMBER on self-registration — never trust client input
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone ?? null,
      role: "MEMBER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });

  return { user, token };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    // Generic message — don't reveal whether email exists
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });

  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, token };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};