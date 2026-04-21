"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface AddTransactionDialogProps {
  categories: string[];
  onAddTransaction: (transaction: {
    name: string;
    category: string;
    date: Date;
    amount: number;
    recurring: boolean;
  }) => void;
}

export function AddTransactionDialog({
  categories,
  onAddTransaction,
}: AddTransactionDialogProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [recurring, setRecurring] = useState(false);

  const handleSubmit = () => {
    onAddTransaction({
      name,
      category,
      amount: parseFloat(amount),
      date,
      recurring,
    });
    setFormOpen(false);
    setName("");
    setCategory("");
    setAmount("");
    setDate(new Date());
    setRecurring(false);
  };

  return (
    <>
      <Button variant="default" onClick={() => setFormOpen(true)}>
        Add New Transaction
      </Button>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Enter the details of your new transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel>Transaction Name</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="e.g. Urban Sevices Hub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={30}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {30 - name.length} characters left
                </p>
              </FieldContent>
              <FieldError />
            </Field>

            <Field>
              <FieldLabel>Transaction Date</FieldLabel>
              <FieldContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FieldContent>
              <FieldError />
            </Field>

            <Field>
              <FieldLabel>Category</FieldLabel>
              <FieldContent>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
              <FieldError />
            </Field>

            <Field>
              <FieldLabel>Amount</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  placeholder="e.g. $1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FieldContent>
              <FieldError />
            </Field>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={recurring}
                onCheckedChange={(checked) => setRecurring(checked as boolean)}
              />
              <label
                htmlFor="recurring"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Recurring
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
