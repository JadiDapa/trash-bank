import { getCurrentUser } from "@/app/action/auth.action";
import { redirect } from "next/navigation";
import WaitingClient from "@/components/waiting/WaitingClient";

export default async function WaitingPage() {
  const user = await getCurrentUser();

  if (user.role !== "MASYARAKAT") redirect("/");
  const masyarakat = user.masyarakat!;
  if (masyarakat.status === "APPROVED") redirect("/");

  return <WaitingClient masyarakat={masyarakat} />;
}
