"use server";

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserService } from "@/servers/services/user.service";
import { MasyarakatService } from "@/servers/services/masyarakat.service";
import { AdminService } from "@/servers/services/admin.service";

export async function getCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const user = await UserService.getByClerkId(clerkUser.id);
  if (!user) redirect("/sign-in");

  return user;
}

export async function getCurrentMasyarakat() {
  const user = await getCurrentUser();
  if (user.role !== "MASYARAKAT" || !user.masyarakat) redirect("/sign-in");
  return user.masyarakat;
}

export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN" || !user.admin) redirect("/sign-in");
  return user.admin;
}

export async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (user.role !== "SUPER_ADMIN") redirect("/");
  return user;
}

export async function registerMasyarakat(data: {
  nik: string;
  password: string;
  name: string;
  address: string;
  gender: "LAKI_LAKI" | "PEREMPUAN";
  phone: string;
  email: string;
  ktpImageUrl: string;
}) {
  const client = await clerkClient();

  const clerkUser = await client.users.createUser({
    username: data.nik,
    password: data.password,
  });

  const user = await UserService.create(clerkUser.id, "MASYARAKAT");

  await MasyarakatService.create(user.id, {
    nik: data.nik,
    name: data.name,
    address: data.address,
    gender: data.gender,
    phone: data.phone,
    email: data.email,
    ktpImageUrl: data.ktpImageUrl,
  });
}
