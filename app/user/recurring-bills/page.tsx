import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import { format } from "date-fns";

export default async function RecurringBills() {
  const user = await getSession();
  const recurringBills = await prisma.transaction.findMany({
    where: {
      userId: user?.user?.id,
      recurring: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const totalBills = recurringBills.reduce((acc, bill) => acc + bill.amount, 0);
  const paidBills = recurringBills
    .filter((bill) => new Date(bill.date) < new Date())
    .reduce((acc, bill) => acc + bill.amount, 0);
  const upcomingBills = recurringBills
    .filter((bill) => new Date(bill.date) >= new Date())
    .reduce((acc, bill) => acc + bill.amount, 0);
  const dueSoon = upcomingBills;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="col-span-1 space-y-6">
        <Card className="bg-black text-white">
          <CardHeader>
            <CardTitle>Total bills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${totalBills.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Paid bills</span>
              <span>${paidBills.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Upcoming</span>
              <span>${upcomingBills.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Due Soon</span>
              <span>${dueSoon.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Input placeholder="Search bills" className="max-w-xs" />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by Latest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill Title</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recurringBills.length > 0 ? (
                  recurringBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>{bill.name}</TableCell>
                      <TableCell>
                        {format(new Date(bill.date), "PPP")}
                      </TableCell>
                      <TableCell className="text-right">
                        ${bill.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline">Prev</Button>
              <Button variant="outline">Next</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
