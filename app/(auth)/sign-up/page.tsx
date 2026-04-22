import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AuthHeader from "@/components/auth/AuthHeader";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import SignUpForm from "@/components/auth/sign-up/SignUpForm";

export default async function SignUpPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) redirect("/");

  return (
    <main className="bg-muted mx-auto flex max-h-screen w-full max-w-sm flex-col gap-2 py-2">
      <ScrollArea className="bg-background relative flex h-screen w-full flex-col items-center justify-center space-y-2 p-4 py-12 md:rounded-2xl md:border">
        <AuthHeader
          title="Daftar Sekarang!"
          subtitle="Sebelum melangkah lebih lanjut, silahkan daftar terlebih dahulu!"
        />
        <SignUpForm />
        <p className="mt-4 text-center lg:mt-6">
          Sudah memiliki akun?{" "}
          <Link className="text-primary underline" href="/sign-up">
            Masuk Sekarang!
          </Link>
        </p>
      </ScrollArea>
    </main>
  );
}
