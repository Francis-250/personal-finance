"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { AddPotDialog } from "./add-pot-dialog";
import { Trash2 } from "lucide-react";
import { CategoryType, ThemeColor } from "@prisma/client";
import { createPot, deletePot, updatePot } from "@/app/_action/pots.action";
import { UpdatePotDialog } from "./update-pot-dialog";

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

interface Pot {
  id: string;
  category: string;
  amount: number;
  theme: string;
  maxSpend: number;
}

interface PotsTableProps {
  initialPots: Pot[];
  categories: string[];
  themes: string[];
}

export function PotsTable({ initialPots, categories, themes }: PotsTableProps) {
  const [pots, setPots] = useState(initialPots);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterTheme, setFilterTheme] = useState("all");

  const filteredPots = pots
    .filter((pot) => {
      const matchesSearch = pot.category
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesTheme = filterTheme === "all" || pot.theme === filterTheme;

      return matchesSearch && matchesTheme;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amount-high":
          return b.amount - a.amount;
        case "amount-low":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  const handleAddPot = async (newPot: Omit<Pot, "id">) => {
    try {
      const pot = await createPot({
        category: newPot.category as CategoryType,
        amount: newPot.amount,
        theme: newPot.theme as ThemeColor,
        maxSpend: newPot.maxSpend,
      });
      setPots([{
        id: pot.id,
        category: pot.category,
        amount: pot.amount,
        theme: pot.theme,
        maxSpend: pot.maxSpend
      }, ...pots]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePot = async (id: string) => {
    const prev = [...pots];
    setPots(pots.filter((p) => p.id !== id));
    try {
      await deletePot(id);
    } catch (e) {
      console.error(e);
      setPots(prev);
    }
  };

  const handleUpdatePot = async (id: string, updatedPot: { category: string; amount: number; maxSpend: number; theme: string }) => {
    try {
      const pot = await updatePot(id, {
        category: updatedPot.category as CategoryType,
        amount: updatedPot.amount,
        maxSpend: updatedPot.maxSpend,
        theme: updatedPot.theme as ThemeColor
      });
      setPots(pots.map((p) => p.id === id ? { ...p, category: pot.category, amount: pot.amount, maxSpend: pot.maxSpend, theme: pot.theme } : p));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search by category..."
          className="flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

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

          <AddPotDialog
            categories={categories}
            themes={themes}
            onAddPot={handleAddPot}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Theme</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Max Spend</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPots.map((pot) => (
            <TableRow key={pot.id}>
              <TableCell className="font-medium">
                {pot.category.replace(/_/g, " ")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      themeColors[pot.theme] || "bg-gray-500"
                    }`}
                  />
                  <span>{pot.theme}</span>
                </div>
              </TableCell>
              <TableCell>${pot.amount.toFixed(2)}</TableCell>
              <TableCell>${pot.maxSpend.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <UpdatePotDialog
                    categories={categories}
                    themes={themes}
                    pot={pot}
                    onUpdatePot={handleUpdatePot}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePot(pot.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredPots.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No pots found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
