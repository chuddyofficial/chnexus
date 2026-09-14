import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateSecret, generateURI } from "otplib";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD environment variables before seeding.",
    );
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists — skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const totpSecret = generateSecret();

  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      role: "SUPERADMIN",
      totpSecret,
      totpEnabled: true,
    },
  });

  const otpauthUrl = generateURI({
    issuer: "CH Nexus Admin",
    label: email,
    secret: totpSecret,
  });

  console.log("\nAdmin account created:");
  console.log(`  Email: ${admin.email}`);
  console.log("\nScan this in your authenticator app (Google Authenticator, Authy, etc.):");
  console.log(`  ${otpauthUrl}`);
  console.log(`\nOr enter this secret manually: ${totpSecret}`);
  console.log(
    "\nSave this secret somewhere safe — it will not be shown again.\n",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
