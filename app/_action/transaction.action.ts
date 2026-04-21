"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createTransaction = async (data: {
  name: string;
  category:
    | "ENTERTAINMENT"
    | "BILLS"
    | "GROCERIES"
    | "DINING_OUT"
    | "TRANSPORTATION"
    | "PERSONAL_CARE"
    | "EDUCATION"
    | "LIFESTYLE"
    | "SHOPPING"
    | "GENERAL";
  amount: number;
  date: Date;
  recurring?: boolean;
}) => {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: session.user.id,
      name: data.name,
      category: data.category,
      amount: data.amount,
      date: data.date,
      recurring: data.recurring || false,
    },
  });

  revalidatePath("/user/transactions");
  revalidatePath("/user/recurring-bills");
  revalidatePath("/user/reports");
  revalidatePath("/user");
  return transaction;
};

export const updateTransaction = async (
  id: string,
  data: {
    name?: string;
    category?:
      | "ENTERTAINMENT"
      | "BILLS"
      | "GROCERIES"
      | "DINING_OUT"
      | "TRANSPORTATION"
      | "PERSONAL_CARE"
      | "EDUCATION"
      | "LIFESTYLE"
      | "SHOPPING"
      | "GENERAL";
    amount?: number;
    date?: Date;
    recurring?: boolean;
  },
) => {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingTransaction = await prisma.transaction.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existingTransaction) {
    throw new Error("Transaction not found");
  }

  const transaction = await prisma.transaction.update({
    where: { id },
    data,
  });

  revalidatePath("/user/transactions");
  revalidatePath("/user/recurring-bills");
  revalidatePath("/user/reports");
  revalidatePath("/user");
  return transaction;
};

export const deleteTransaction = async (id: string) => {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingTransaction = await prisma.transaction.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existingTransaction) {
    throw new Error("Transaction not found");
  }

  const transaction = await prisma.transaction.delete({
    where: { id },
  });

  revalidatePath("/user/transactions");
  revalidatePath("/user/recurring-bills");
  revalidatePath("/user/reports");
  revalidatePath("/user");
  return transaction;
};

export const getTransactions = async () => {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  return transactions;
};
