import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionsTable } from "@/components/transactions-table";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/get-session";

const categories = [
  "ENTERTAINMENT",
  "BILLS",
  "GROCERIES",
  "DINING_OUT",
  "TRANSPORTATION",
  "PERSONAL_CARE",
  "EDUCATION",
  "LIFESTYLE",
  "SHOPPING",
  "GENERAL",
];

export default async function Transactions() {
  const user = await getSession();
  const transactions = await prisma.transaction.findMany({
    orderBy: {
      date: "desc",
    },
    where: {
      userId: user?.user?.id,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            Manage your transactions here.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>A list of all transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsTable
            initialTransactions={transactions}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
