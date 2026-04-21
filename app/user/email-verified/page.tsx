import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function EmailVerifiedPage() {
  return (
    <div className="flex w-full justify-center pt-20">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Email Verified!</CardTitle>
          <CardDescription>
            Your email has been successfully verified across our servers.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-4">
          <Button asChild>
            <Link href="/user">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
