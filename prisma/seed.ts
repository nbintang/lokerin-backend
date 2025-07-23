import { PrismaClient, RoleType } from '@prisma/client';
import * as argon2 from 'argon2';
const prisma = new PrismaClient();

async function main() {
  // Seed Role ENUMs are already handled by enum (no need to insert to DB)

  // Seed Roles table (Role model used in CV & Job)
  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Data Analyst',
    'Product Manager',
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  // Seed Admin User
  const password = await argon2.hash('password');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@example.com',
      phone: '081234567890',
      password,
      role: RoleType.ADMINISTRATOR,
      isVerified: true,
      avatarUrl: 'https://example.com/avatar.jpg',
      createdAt: new Date(),
    },
  });

  // Seed Recruiter Profile
  await prisma.recruiterProfile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      companyName: 'Example Corp',
      position: 'HR Manager',
      website: 'https://example.com',
      about: 'We are hiring awesome developers!',
      createdAt: new Date(),
    },
  });

  // Seed Company
  const company = await prisma.company.create({
    data: {
      name: 'Example Corp',
      description: 'A sample tech company.',
      website: 'https://example.com',
      logoUrl: 'https://example.com/logo.png',
      createdBy: adminUser.id,
      createdAt: new Date(),
    },
  });

  // Seed Job
  const backendRole = await prisma.role.findFirst({
    where: { name: 'Backend Developer' },
  });

  await prisma.job.create({
    data: {
      title: 'Backend Developer',
      description: 'Build APIs and microservices.',
      location: 'Remote',
      salaryRange: '10M - 20M',
      postedBy: adminUser.id,
      roleId: backendRole!.id,
      companyId: company.id,
      createdAt: new Date(),
    },
  });

  console.log('🌱 Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
