import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { DollarSign, PiggyBank, Target, ArrowLeftRight } from "lucide-react";
import { ReportsChart } from "@/components/reports-chart";

export default async function ReportsPage() {
  const transactionsResult = await prisma.transaction.aggregate({
    _sum: { amount: true },
    _count: { id: true }
  });
  
  const potsResult = await prisma.pot.aggregate({
    _sum: { amount: true, maxSpend: true },
    _count: { id: true }
  });
  
  const budgetsResult = await prisma.budget.aggregate({
    _sum: { targetAmount: true },
    _count: { id: true }
  });

  const totalSpent = transactionsResult._sum.amount || 0;
  const totalPots = potsResult._sum.amount || 0;
  const totalBudgetTarget = budgetsResult._sum.targetAmount || 0;

  const groupedTransactions = await prisma.transaction.groupBy({
    by: ['category'],
    _sum: { amount: true },
  });

  const chartData = groupedTransactions.map(t => ({
    category: t.category.replace(/_/g, " "),
    amount: t._sum.amount || 0,
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Financial summary and analytics based on your activity.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {transactionsResult._count.id} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pots</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPots.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Saved in {potsResult._count.id} pots
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Targets</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgetTarget.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {budgetsResult._count.id} configured budgets
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Overview</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalBudgetTarget - totalSpent).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Remaining across all tracked budgets
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>
            A visual breakdown of your financial transactions by category.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2 pt-4">
          <div className="h-[400px]">
            <ReportsChart data={chartData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
