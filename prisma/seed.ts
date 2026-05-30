import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({ where: { email }, data: { role: "admin" } });
    console.log(`✔ User ${email} promoted to admin`);
    return;
  }

  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });
  console.log(`✔ Admin created — email: admin@example.com  password: admin123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
