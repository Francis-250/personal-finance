import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BudgetsTable } from "@/components/budgets-table";
import { getBudgets } from "@/app/_action/budget.action";

const themes = [
  "PURPLE",
  "RED",
  "YELLOW",
  "NAVY",
  "TURQUOISE",
  "BROWN",
  "MAGENTA",
  "BLUE",
  "ARMY",
  "PINK",
  "YELLOWGREEN",
];

export default async function Budgets() {
  const initialBudgets = await getBudgets();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
          <p className="text-muted-foreground">Manage your budgets here.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Budgets</CardTitle>
          <CardDescription>A list of all budgets.</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetsTable initialBudgets={initialBudgets} themes={themes} />
        </CardContent>
      </Card>
    </div>
  );
}
