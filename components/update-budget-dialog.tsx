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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

interface UpdateBudgetDialogProps {
  themes: string[];
  budget: { id: string; name: string; targetAmount: number; theme: string };
  onUpdateBudget: (
    id: string,
    budget: { name: string; targetAmount: number; theme: string },
  ) => void;
}

export function UpdateBudgetDialog({
  themes,
  budget,
  onUpdateBudget,
}: UpdateBudgetDialogProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [targetAmount, setTargetAmount] = useState(
    budget.targetAmount.toString(),
  );
  const [theme, setTheme] = useState(budget.theme);

  const handleSubmit = () => {
    onUpdateBudget(budget.id, {
      name: budget.name,
      targetAmount: parseFloat(targetAmount) || 0,
      theme,
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
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Update Budget</DialogTitle>
          <DialogDescription>
            Modify your existing budget limit.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
