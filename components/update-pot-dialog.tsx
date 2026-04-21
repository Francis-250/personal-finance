"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

interface UpdatePotDialogProps {
  categories: string[];
  themes: string[];
  pot: { id: string; category: string; amount: number; maxSpend: number; theme: string };
  onUpdatePot: (id: string, pot: { category: string; amount: number; maxSpend: number; theme: string }) => void;
}

export function UpdatePotDialog({ categories, themes, pot, onUpdatePot }: UpdatePotDialogProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [category, setCategory] = useState(pot.category);
  const [amount, setAmount] = useState(pot.amount.toString());
  const [maxSpend, setMaxSpend] = useState(pot.maxSpend.toString());
  const [theme, setTheme] = useState(pot.theme);

  const handleSubmit = () => {
    onUpdatePot(pot.id, {
      category,
      amount: parseFloat(amount) || 0,
      maxSpend: parseFloat(maxSpend) || 0,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Pot</DialogTitle>
          <DialogDescription>Modify your existing pot.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          <Field>
            <FieldLabel>Theme</FieldLabel>
            <FieldContent>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Current Amount</FieldLabel>
              <FieldContent>
                <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Max Target</FieldLabel>
              <FieldContent>
                <Input type="number" placeholder="0.00" value={maxSpend} onChange={(e) => setMaxSpend(e.target.value)} />
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
