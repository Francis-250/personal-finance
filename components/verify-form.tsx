"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function VerifyForm({
  email,
  role,
}: {
  email: string;
  role: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleResend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: `/${role === "ADMIN" ? "admin" : "user"}/email-verified`,
    });
    if (error) {
      toast.error(error.message || "Something went wrong");
      setLoading(false);
      return;
    } else {
      toast.success("Verification email sent");
      setLoading(false);
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Resend a verification link to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResend} className="space-y-4">
            <FieldGroup>
              <Field>
                <Button type="submit">
                  {loading ? "Loading..." : "Resend Verification Email"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
