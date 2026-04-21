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

interface AddBudgetDialogProps {
  themes: string[];
  onAddBudget: (budget: {
    name: string;
    targetAmount: number;
    theme: string;
  }) => void;
}

export function AddBudgetDialog({ themes, onAddBudget }: AddBudgetDialogProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [theme, setTheme] = useState("");

  const handleSubmit = () => {
    onAddBudget({
      name,
      targetAmount: parseFloat(targetAmount) || 0,
      theme,
    });
    setFormOpen(false);
    setName("");
    setTargetAmount("");
    setTheme("");
  };

  return (
    <>
      <Button variant="default" onClick={() => setFormOpen(true)}>
        Add Budget
      </Button>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
            <DialogDescription>
              Add a new budget to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Budget name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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
              <FieldLabel>Target Amount</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
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
              Save Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
