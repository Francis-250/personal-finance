import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PotsTable } from "@/components/pots-table";
import { getPots } from "@/app/_action/pots.action";

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

export default async function Pots() {
  const initialPots = await getPots();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pots</h2>
          <p className="text-muted-foreground">
            Manage your pots here.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pots</CardTitle>
          <CardDescription>A list of all pots.</CardDescription>
        </CardHeader>
        <CardContent>
          <PotsTable
            initialPots={initialPots}
            categories={categories}
            themes={themes}
          />
        </CardContent>
      </Card>
    </div>
  );
}
