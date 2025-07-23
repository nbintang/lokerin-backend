import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Mobile App Developer',
    'Software Engineer',
  ];

  // Pastikan roles tersedia di DB
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  const allRoles = await prisma.role.findMany({
    where: { name: { in: roles } },
  });

  const companies = await prisma.company.findMany();

  if (companies.length === 0) {
    throw new Error('No companies found. Seed companies first.');
  }

  // Tambah 50 job khusus developer aplikasi
  for (let i = 0; i < 50; i++) {
    const randomCompany = faker.helpers.arrayElement(companies);

    await prisma.job.create({
      data: {
        title: faker.helpers.arrayElement(roles),
        description: faker.lorem.paragraphs(2),
        location: faker.location.city(),
        salaryRange: `${faker.number.int({ min: 8, max: 15 })}M - ${faker.number.int({ min: 16, max: 30 })}M`,
        postedBy: randomCompany.createdBy,
        roleId: faker.helpers.arrayElement(allRoles).id,
        companyId: randomCompany.id,
      },
    });
  }

  console.log('🚀 Developer job seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding developer jobs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
