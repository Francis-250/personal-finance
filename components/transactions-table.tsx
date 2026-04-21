"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { AddTransactionDialog } from "./add-transaction-dialog";
import {  Trash2 } from "lucide-react";
import { CategoryType } from "@prisma/client";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/app/_action/transaction.action";
import { UpdateTransactionDialog } from "./update-transaction-dialog";

interface Transaction {
  id: string;
  name: string;
  category: string;
  date: Date;
  amount: number;
  recurring: boolean;
}

interface TransactionsTableProps {
  initialTransactions: Transaction[];
  categories: string[];
}

export function TransactionsTable({
  initialTransactions,
  categories,
}: TransactionsTableProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("date-desc");

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = transaction.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || transaction.category === filterCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount-asc":
          return a.amount - b.amount;
        case "amount-desc":
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

  const handleAddTransaction = async (
    newTransaction: Omit<Transaction, "id">,
  ) => {
    try {
      const transaction = await createTransaction({
        name: newTransaction.name,
        category: newTransaction.category as CategoryType,
        amount: newTransaction.amount,
        date: newTransaction.date,
        recurring: newTransaction.recurring,
      });
      setTransactions([
        {
          id: transaction.id,
          name: transaction.name,
          category: transaction.category,
          amount: transaction.amount,
          date: transaction.date,
          recurring: transaction.recurring,
        },
        ...transactions,
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTransaction = async (
    id: string,
    updatedTx: {
      name: string;
      category: string;
      amount: number;
      date: Date;
      recurring: boolean;
    },
  ) => {
    try {
      const transaction = await updateTransaction(id, {
        name: updatedTx.name,
        category: updatedTx.category as CategoryType,
        amount: updatedTx.amount,
        date: updatedTx.date,
        recurring: updatedTx.recurring,
      });
      setTransactions(
        transactions.map((t) =>
          t.id === id
            ? {
                ...t,
                name: transaction.name,
                category: transaction.category,
                amount: transaction.amount,
                date: transaction.date,
                recurring: transaction.recurring,
              }
            : t,
        ),
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Date (Newest first)</SelectItem>
            <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
            <SelectItem value="amount-desc">Amount (Highest first)</SelectItem>
            <SelectItem value="amount-asc">Amount (Lowest first)</SelectItem>
          </SelectContent>
        </Select>
        <AddTransactionDialog
          categories={categories}
          onAddTransaction={handleAddTransaction}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Recipient / Sender</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Transaction Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Recurring</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.name}</TableCell>
              <TableCell>{transaction.category.replace(/_/g, " ")}</TableCell>
              <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{transaction.recurring ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <UpdateTransactionDialog
                    transaction={transaction}
                    categories={categories}
                    onUpdateTransaction={handleUpdateTransaction}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredTransactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
