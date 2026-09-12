import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignInForm from "@/components/auth/sign-in/SignInForm";
import AuthCarousel from "@/components/auth/AuthCarousel";

export default async function SignInPage() {
  const clerkUser = await currentUser();
  if (clerkUser) redirect("/");

  return (
    <main className="bg-muted flex min-h-screen w-full items-center justify-center p-4">
      <div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl border shadow-2xl md:h-[96vh] md:flex-row">
        <section className="bg-card flex w-full flex-col justify-center px-6 py-10 sm:px-12 md:w-1/2 md:px-16 lg:px-28">
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
            <span className="text-card-foreground font-semi font-sans text-lg">
              Trash Bank
            </span>
          </div>

          {/* Heading — font-bold (700), not black */}
          <div className="mb-7">
            <h1 className="text-card-foreground font-sans text-4xl leading-snug font-medium tracking-wide">
              Selamat datang
              <span className="text-primary font-semibold">!</span>
            </h1>
            <p className="text-muted-foreground mt-1.5 font-sans text-sm">
              Masuk untuk mengelola setoran dan poin Anda
            </p>
          </div>

          {/* Form */}
          <SignInForm />

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground font-sans text-xs font-medium">
              atau
            </span>
            <div className="bg-border h-px flex-1" />
          </div>

          {/* Register */}
          <p className="text-muted-foreground text-center font-sans text-sm">
            Belum punya akun?{" "}
            <Link
              href="/sign-up"
              className="text-primary hover:text-primary/80 font-bold underline-offset-4 transition-colors hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>

          {/* Footer */}
          <p className="text-muted-foreground/40 mt-8 text-center font-sans text-xs">
            © 2025 Trash Bank · Platform Pengelolaan Sampah Anorganik
          </p>
        </section>
        <aside
          aria-hidden="true"
          className="bg-card relative hidden shrink-0 flex-col overflow-hidden md:flex md:w-1/2"
        >
          <div className="relative z-10 flex flex-1 flex-col">
            <AuthCarousel />
          </div>
        </aside>
      </div>
    </main>
  );
}
