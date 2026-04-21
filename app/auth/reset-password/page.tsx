import ResetForm from "@/components/reset-form";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-red-500">Invalid or missing reset token</p>
      </div>
    );
  }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ResetForm token={token} />
      </div>
    </div>
  );
}
