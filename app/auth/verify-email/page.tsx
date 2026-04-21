import VerifyForm from "@/components/verify-form";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ email: string; role?: string }> }) {
  const params = await searchParams;
  const email = params?.email || "";
  const role = params?.role || "USER";

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <VerifyForm email={email} role={role} />
      </div>
    </div>
  );
}
