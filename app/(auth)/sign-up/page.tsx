import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignUpForm from "@/components/auth/sign-up/SignUpForm";
import AuthCarousel from "@/components/auth/AuthCarousel";

export default async function SignUpPage() {
  const clerkUser = await currentUser();
  if (clerkUser) redirect("/");

  return (
    <main className="bg-muted flex min-h-screen w-full items-center justify-center p-4">
      <div className="flex h-[96vh] w-full overflow-hidden rounded-2xl border shadow-2xl">
        <aside
          aria-hidden="true"
          className="bg-card relative hidden w-1/2 shrink-0 flex-col overflow-hidden md:flex"
        >
          <div className="relative z-10 flex flex-1 flex-col">
            <AuthCarousel />
          </div>
        </aside>

        <section className="bg-card flex w-full flex-col overflow-y-auto px-10 py-10 md:w-1/2">
          {/* Mobile logo */}
          <div className="mb-7 flex items-center gap-2 md:hidden">
            <div className="bg-primary flex size-7 items-center justify-center rounded-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-3.5"
              >
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </div>
            <span className="text-card-foreground font-sans text-sm font-bold">
              Trash Bank
            </span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-card-foreground font-sans text-4xl leading-snug font-medium tracking-wide">
              Buat akun<span className="text-primary">.</span>
            </h1>
            <p className="text-muted-foreground mt-1.5 font-sans text-sm">
              Isi data diri dan upload KTP untuk mendaftar
            </p>
          </div>

          {/* Form */}
          <SignUpForm />

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground font-sans text-xs font-medium">
              atau
            </span>
            <div className="bg-border h-px flex-1" />
          </div>

          {/* Login link */}
          <p className="text-muted-foreground text-center font-sans text-sm">
            Sudah punya akun?{" "}
            <Link
              href="/sign-in"
              className="text-primary hover:text-primary/80 font-bold underline-offset-4 transition-colors hover:underline"
            >
              Masuk sekarang
            </Link>
          </p>

          {/* Footer */}
          <p className="text-muted-foreground/40 mt-6 text-center font-sans text-xs">
            © 2025 Trash Bank · Platform Pengelolaan Sampah Digital
          </p>
        </section>
      </div>
    </main>
  );
}
