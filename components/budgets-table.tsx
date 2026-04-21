"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddBudgetDialog } from "./add-budget-dialog";
import { Trash2 } from "lucide-react";
import { ThemeColor } from "@prisma/client";
import {
  createBudget,
  deleteBudget,
  updateBudget,
} from "@/app/_action/budget.action";
import { UpdateBudgetDialog } from "./update-budget-dialog";

const themeColors: Record<string, string> = {
  PURPLE: "bg-purple-500",
  RED: "bg-red-500",
  YELLOW: "bg-yellow-500",
  NAVY: "bg-blue-900",
  TURQUOISE: "bg-teal-400",
  BROWN: "bg-amber-800",
  MAGENTA: "bg-fuchsia-500",
  BLUE: "bg-blue-500",
  ARMY: "bg-green-800",
  PINK: "bg-pink-500",
  YELLOWGREEN: "bg-lime-500",
};

interface Budget {
  id: string;
  name: string;
  targetAmount: number;
  theme: string;
}

interface BudgetsTableProps {
  initialBudgets: Budget[];
  themes: string[];
}

export function BudgetsTable({ initialBudgets, themes }: BudgetsTableProps) {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [sortBy, setSortBy] = useState("latest");
  const [filterTheme, setFilterTheme] = useState("all");

  const filteredBudgets = budgets
    .filter((budget) => {
      const matchesTheme =
        filterTheme === "all" || budget.theme === filterTheme;
      return matchesTheme;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amount-high":
          return b.targetAmount - a.targetAmount;
        case "amount-low":
          return a.targetAmount - b.targetAmount;
        default:
          return 0;
      }
    });

  const handleAddBudget = async (newBudget: Omit<Budget, "id">) => {
    try {
      const budget = await createBudget({
        name: newBudget.name,
        targetAmount: newBudget.targetAmount,
        theme: newBudget.theme as ThemeColor,
      });
      setBudgets([
        {
          id: budget.id,
          name: budget.name,
          targetAmount: budget.targetAmount,
          theme: budget.theme,
        },
        ...budgets,
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    const prev = [...budgets];
    setBudgets(budgets.filter((b) => b.id !== id));
    try {
      await deleteBudget(id);
    } catch (error) {
      console.error(error);
      setBudgets(prev);
    }
  };

  const handleUpdateBudget = async (
    id: string,
    updatedBudget: { name: string; targetAmount: number; theme: string },
  ) => {
    try {
      const budget = await updateBudget(id, {
        name: updatedBudget.name,
        targetAmount: updatedBudget.targetAmount,
        theme: updatedBudget.theme as ThemeColor,
      });
      setBudgets(
        budgets.map((b) =>
          b.id === id
            ? {
                ...b,
                name: budget.name,
                targetAmount: budget.targetAmount,
                theme: budget.theme,
              }
            : b,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                <SelectItem value="amount-low">Amount: Low to High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={filterTheme} onValueChange={setFilterTheme}>
            <SelectTrigger className="w-55">
              <SelectValue placeholder="Filter by Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter by Theme</SelectLabel>
                <SelectItem value="all">All Themes</SelectItem>
                {themes.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <AddBudgetDialog themes={themes} onAddBudget={handleAddBudget} />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Theme</TableHead>
            <TableHead>Target Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBudgets.map((budget) => (
            <TableRow key={budget.id}>
              <TableCell>{budget.name}</TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      themeColors[budget.theme] || "bg-gray-500"
                    }`}
                  />
                  <span>{budget.theme}</span>
                </div>
              </TableCell>
              <TableCell>${budget.targetAmount.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <UpdateBudgetDialog
                    themes={themes}
                    budget={budget}
                    onUpdateBudget={handleUpdateBudget}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBudget(budget.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredBudgets.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No budgets found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
