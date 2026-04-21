"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createBudget = async (data: {
  name: string;
  targetAmount: number;
  theme:
    | "PURPLE"
    | "RED"
    | "YELLOW"
    | "NAVY"
    | "TURQUOISE"
    | "BROWN"
    | "MAGENTA"
    | "BLUE"
    | "ARMY"
    | "PINK"
    | "YELLOWGREEN";
}) => {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { name, targetAmount, theme } = data;

  const budget = await prisma.budget.create({
    data: {
      userId: session.user.id,
      name,
      targetAmount,
      theme,
    },
  });

  revalidatePath("/user/budget");
  return budget;
};

export const updateBudget = async (
  id: string,
  data: {
    name?: string;
    targetAmount?: number;
    theme?:
      | "PURPLE"
      | "RED"
      | "YELLOW"
      | "NAVY"
      | "TURQUOISE"
      | "BROWN"
      | "MAGENTA"
      | "BLUE"
      | "ARMY"
      | "PINK"
      | "YELLOWGREEN";
  },
) => {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingBudget = await prisma.budget.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!existingBudget) {
    throw new Error("Budget not found");
  }

  const budget = await prisma.budget.update({
    where: { id },
    data,
  });

  revalidatePath("/user/budget");
  return budget;
};

export const deleteBudget = async (id: string) => {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingBudget = await prisma.budget.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!existingBudget) {
    throw new Error("Budget not found");
  }

  const budget = await prisma.budget.delete({
    where: { id },
  });

  revalidatePath("/user/budget");
  return budget;
};

export const getBudgets = async () => {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  const budgets = await prisma.budget.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return budgets;
};

export const getBudgetById = async (id: string) => {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const budget = await prisma.budget.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  return budget;
};
