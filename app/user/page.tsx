import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import { DollarSign, Activity, Wallet, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReportsChart } from "@/components/reports-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Dashboard() {
  const session = await getSession();

  const transactions = await prisma.transaction.findMany({
    where: { userId: session?.user.id },
    orderBy: { date: "desc" },
  });

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const currentBalance = income + expenses;

  const transactionsResult = await prisma.transaction.aggregate({
    where: { userId: session?.user.id },
    _sum: { amount: true },
    _count: { id: true },
  });

  const potsResult = await prisma.pot.aggregate({
    where: { userId: session?.user.id },
    _sum: { amount: true },
  });

  const budgetsResult = await prisma.budget.aggregate({
    where: { userId: session?.user.id },
    _sum: { targetAmount: true },
  });

  const totalSpent = transactionsResult._sum.amount || 0;
  const totalPots = potsResult._sum.amount || 0;
  const totalBudgets = budgetsResult._sum.targetAmount || 0;

  const groupedTransactions = await prisma.transaction.groupBy({
    by: ["category"],
    _sum: { amount: true },
  });

  const chartData = groupedTransactions
    .map((t) => ({
      category: t.category.replace(/_/g, " "),
      amount: t._sum.amount || 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const recentTransactions = await prisma.transaction.findMany({
    take: 5,
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your financial activity.
          </p>
        </div>
      </div>

      {!session?.user?.emailVerified && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20">
          <CardHeader className="py-4">
            <CardTitle className="text-red-700 dark:text-red-400 text-lg">
              Please verify your email address
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-300">
              Your account features might be limited until you verify your
              email.
              <Link
                href={`/auth/verify-email?email=${encodeURIComponent(session?.user?.email || "")}&role=${session?.user?.role || "USER"}`}
                className="ml-2 font-semibold underline hover:text-red-800 dark:hover:text-red-200"
              >
                Go to Verification Page
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-black text-white">
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              ${currentBalance.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${income.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              ${Math.abs(expenses).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total lifetime expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Saved in Pots
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPots.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Liquid savings pool</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Budget Allocations
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgets.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Across all budgets</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>
              A visual breakdown of your transactions by category.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
            <div className="h-87.5">
              <ReportsChart data={chartData} />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your most recent financial activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="font-medium">{tx.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {tx.category.replace(/_/g, " ")} •{" "}
                        {tx.date.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${tx.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {recentTransactions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No recent activity
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
