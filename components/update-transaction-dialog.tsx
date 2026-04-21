"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

interface UpdateTransactionDialogProps {
  categories: string[];
  transaction: { id: string; name: string; category: string; amount: number; date: Date };
  onUpdateTransaction: (id: string, transaction: { name: string; category: string; amount: number; date: Date }) => void;
}

export function UpdateTransactionDialog({ categories, transaction, onUpdateTransaction }: UpdateTransactionDialogProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState(transaction.name);
  const [category, setCategory] = useState(transaction.category);
  const [amount, setAmount] = useState(transaction.amount.toString());
  
  // Format the existing date to YYYY-MM-DD for the input
  const dateObj = new Date(transaction.date);
  const formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split("T")[0] : "";
  const [date, setDate] = useState(formattedDate);

  const handleSubmit = () => {
    onUpdateTransaction(transaction.id, {
      name,
      category,
      amount: parseFloat(amount) || 0,
      date: new Date(date),
    });
    setFormOpen(false);
  };

  return (
    <Dialog open={formOpen} onOpenChange={setFormOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Transaction</DialogTitle>
          <DialogDescription>Modify your existing transaction log.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Field>
            <FieldLabel>Title</FieldLabel>
            <FieldContent>
              <Input placeholder="Rent, Coffee, etc." value={name} onChange={(e) => setName(e.target.value)} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Category</FieldLabel>
            <FieldContent>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Amount</FieldLabel>
              <FieldContent>
                <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Date</FieldLabel>
              <FieldContent>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </FieldContent>
            </Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
