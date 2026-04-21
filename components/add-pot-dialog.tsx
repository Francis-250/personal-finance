"use client";

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
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddPotDialogProps {
  categories: string[];
  themes: string[];
  onAddPot: (pot: {
    category: string;
    amount: number;
    theme: string;
    maxSpend: number;
  }) => void;
}

export function AddPotDialog({
  categories,
  themes,
  onAddPot,
}: AddPotDialogProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [theme, setTheme] = useState("");
  const [maxSpend, setMaxSpend] = useState("");

  const handleSubmit = () => {
    onAddPot({
      category,
      amount: parseFloat(amount) || 0,
      theme,
      maxSpend: parseFloat(maxSpend) || 0,
    });
    setFormOpen(false);
    setCategory("");
    setAmount("");
    setTheme("");
    setMaxSpend("");
  };

  return (
    <>
      <Button variant="default" onClick={() => setFormOpen(true)}>
        Add Pot
      </Button>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Pot</DialogTitle>
            <DialogDescription>
              Add a new pot to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel>Category</FieldLabel>
              <FieldContent>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
              <FieldError />
            </Field>

            <Field>
              <FieldLabel>Theme</FieldLabel>
              <FieldContent>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
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
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FieldContent>
              <FieldError />
            </Field>

            <Field>
              <FieldLabel>Max Spend</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={maxSpend}
                  onChange={(e) => setMaxSpend(e.target.value)}
                />
              </FieldContent>
              <FieldError />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Save Pot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
