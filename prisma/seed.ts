import { UserRole } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("Start seeding...");

  // 1. Seed EOS Users
  const eosUsers = [
    {
      name: "Administrator",
      username: "administrator",
      role: UserRole.ADMIN,
    },
  ];

  for (const user of eosUsers) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: user,
    });
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
