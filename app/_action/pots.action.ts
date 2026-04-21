"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createPot = async (data: {
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
  maxSpend: number;
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

  const pot = await prisma.pot.create({
    data: {
      userId: session.user.id,
      category: data.category,
      amount: data.amount,
      theme: data.theme,
      maxSpend: data.maxSpend,
    },
  });

  revalidatePath("/user/pots");
  return pot;
};

export const updatePot = async (
  id: string,
  data: {
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
    maxSpend?: number;
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
  }
) => {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingPot = await prisma.pot.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existingPot) {
    throw new Error("Pot not found");
  }

  const pot = await prisma.pot.update({
    where: { id },
    data,
  });

  revalidatePath("/user/pots");
  return pot;
};

export const deletePot = async (id: string) => {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingPot = await prisma.pot.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existingPot) {
    throw new Error("Pot not found");
  }

  const pot = await prisma.pot.delete({
    where: { id },
  });

  revalidatePath("/user/pots");
  return pot;
};

export const getPots = async () => {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  const pots = await prisma.pot.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return pots;
};
