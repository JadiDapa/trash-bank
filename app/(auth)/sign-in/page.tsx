import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/sign-in/SignInForm";
import AuthHeader from "@/components/auth/AuthHeader";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentUser } from "@clerk/nextjs/server";

export default async function SignInPage() {
  const clerkUser = await currentUser();

  if (clerkUser?.id) redirect("/");

  return (
    <main className="bg-muted mx-auto flex max-h-screen w-full max-w-sm flex-col gap-2 py-2">
      <ScrollArea className="bg-background relative flex h-screen w-full flex-col items-center justify-center space-y-4 p-4 py-36 md:rounded-2xl md:border">
        <AuthHeader
          title="Ayo Masuk!"
          subtitle="Sebelum melangkah lebih lanjut, silahkan masuk terlebih dahulu!"
        />
        <SignInForm />
        <p className="mt-4 text-center lg:mt-6">
          Belum memiliki akun?{" "}
          <Link className="text-primary underline" href="/sign-up">
            Daftar Sekarang!
          </Link>
        </p>
      </ScrollArea>
    </main>
  );
}
