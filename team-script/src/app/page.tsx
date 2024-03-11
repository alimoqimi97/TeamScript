import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  }
  return (
    <main className="flex min-h-screen justify-center items-center">
      Home page
    </main>
  );
}
