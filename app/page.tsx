import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role === "admin") {
    redirect("/admin");
  } else if (session.user.role === "user") {
    redirect("/user");
  } else {
    redirect("/auth/login");
  }

  return <div>Home</div>;
}
