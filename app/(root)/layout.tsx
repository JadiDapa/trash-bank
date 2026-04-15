import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  return (
    <section className="bg-muted w-full">
      <main className="bg-muted mx-auto flex max-h-screen w-full max-w-sm flex-col gap-2 py-2">
        {children}
      </main>
    </section>
  );
}
