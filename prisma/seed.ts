import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();
async function main() {
  const dummyPassword = await argon2.hash('Password123');
  console.log('🔄 Clearing existing data...');
  // Hapus semua data sesuai dependensi
  await prisma.jobApplication.deleteMany();
  await prisma.job.deleteMany();
  await prisma.cV.deleteMany();
  await prisma.recruiterProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Seed Roles (Job Titles) including non-tech positions
  console.log('🌱 Seeding roles...');
  const roleNames = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Mobile App Developer',
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'DevOps Engineer',
    'QA Engineer',
    'Accountant',
    'Marketing Specialist',
    'Sales Representative',
    'HR Manager',
    'Teacher',
    'Customer Service Representative',
    'Graphic Designer',
    'Operations Manager',
    'Content Writer',
    'Business Analyst',
  ];
  const roles = [];
  for (const name of roleNames) {
    roles.push(await prisma.role.create({ data: { name } }));
  }

  // Seed Users
  console.log('🌱 Seeding users...');
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push(
      await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number({ style: 'national' }),
          password: dummyPassword,
          role: 'MEMBER',
          isVerified: faker.datatype.boolean(),
        },
      }),
    );
  }

  // Seed Companies and Recruiter Profiles
  console.log('🌱 Seeding companies and recruiter profiles...');
  const companies = [];
  for (let i = 0; i < 5; i++) {
    const owner = faker.helpers.arrayElement(users);
    const company = await prisma.company.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        website: faker.internet.url(),
        createdBy: owner.id,
        logoUrl: faker.image.urlLoremFlickr({
          category: 'business',
          width: 200,
          height: 200,
        }),
      },
    });
    companies.push(company);

    // Buat recruiter profile untuk sebagian user
    if (faker.datatype.boolean()) {
      await prisma.recruiterProfile.create({
        data: {
          userId: owner.id,
          companyName: company.name,
          position: faker.company.catchPhrase(),
          website: company.website,
          about: faker.lorem.paragraph(),
        },
      });
    }
  }

  // Seed CVs
  console.log('🌱 Seeding CVs...');
  for (const user of users) {
    const predictedRole = faker.helpers.arrayElement(roles);
    await prisma.cV.create({
      data: {
        userId: user.id,
        fileUrl: `https://example.com/cvs/${user.id}.pdf`,
        extracted: faker.lorem.paragraphs(2),
        predictedRoleId: predictedRole.id,
      },
    });
  }

  // Deskripsi manual per role, termasuk non-tech
  const descriptionsMap: Record<string, string[]> = {
    'Frontend Developer': [
      'Mengembangkan antarmuka pengguna interaktif dengan React.js dan Tailwind CSS, memastikan aksesibilitas dan responsivitas.',
      'Membangun komponen UI yang reusable dan mengintegrasikan API GraphQL untuk dynamic content.',
    ],
    'Backend Developer': [
      'Merancang dan mengimplementasikan RESTful API dengan Node.js dan Express, menggunakan PostgreSQL untuk penyimpanan data.',
      'Mengoptimalkan performa backend dengan Redis dan job queue menggunakan Bull untuk proses asynchronous.',
    ],
    'Fullstack Developer': [
      'Mengembangkan fitur end-to-end: Next.js di frontend dan NestJS di backend, deployment ke AWS.',
      'Menulis unit/integration tests dengan Jest dan memonitor aplikasi menggunakan Grafana.',
    ],
    'Mobile App Developer': [
      'Mengembangkan aplikasi cross-platform dengan React Native, integrasi Firebase untuk autentikasi dan analytics.',
      'Melakukan debugging pada perangkat nyata dan optimasi UI/UX pada berbagai ukuran layar.',
    ],
    'Software Engineer': [
      'Membangun mikrolayanan menggunakan Golang dan Docker, implementasi CI/CD dengan GitHub Actions.',
      'Mendesain arsitektur sistem yang scalable serta menulis dokumentasi teknis.',
    ],
    'Data Scientist': [
      'Menganalisis data dengan Python, Pandas, dan scikit-learn untuk membangun model prediktif.',
      'Menerapkan pipeline ETL dan dashboard visualisasi di Power BI untuk reporting insights.',
    ],
    'Product Manager': [
      'Merancang roadmap produk dan berkolaborasi dengan tim engineering serta desain.',
      'Menulis PRD (Product Requirement Document) untuk fitur baru dan mengkoordinasikan sprint Agile.',
    ],
    'UX Designer': [
      'Mendesain prototype interaktif menggunakan Figma dan melakukan user testing.',
      'Membuat wireframes serta user flow untuk meningkatkan kenyamanan pengguna.',
    ],
    'DevOps Engineer': [
      'Mengelola infrastruktur AWS dengan Terraform, mengatur CI/CD pipeline dengan Jenkins.',
      'Memantau sistem dengan ELK stack dan menyiapkan auto-scaling group.',
    ],
    'QA Engineer': [
      'Menulis automated tests menggunakan Cypress dan Selenium, serta merancang test plans.',
      'Melakukan regression testing untuk memastikan stabilitas setiap rilis.',
    ],
    Accountant: [
      'Menyiapkan laporan keuangan bulanan dan melakukan rekonsiliasi bank.',
      'Mengelola pembukuan dan memastikan kepatuhan pada standar akuntansi.',
    ],
    'Marketing Specialist': [
      'Merancang kampanye pemasaran digital melalui media sosial dan Google Ads.',
      'Menganalisis data pemasaran untuk optimasi strategi dan ROI.',
    ],
    'Sales Representative': [
      'Mencapai target penjualan dengan menjalin relasi baik ke klien potensial.',
      'Menyusun proposal bisnis dan presentasi produk ke perusahaan partner.',
    ],
    'HR Manager': [
      'Mengelola proses rekrutmen dan on-boarding karyawan baru.',
      'Menangani kebijakan SDM dan memastikan kepatuhan pada regulasi ketenagakerjaan.',
    ],
    Teacher: [
      'Mengajar mata pelajaran sesuai kurikulum dan menyiapkan materi pembelajaran.',
      'Melakukan evaluasi berkala terhadap perkembangan siswa.',
    ],
    'Customer Service Representative': [
      'Menangani keluhan pelanggan melalui telepon dan email dengan SOP yang tersusun.',
      'Memberikan solusi cepat dan meningkatkan kepuasan pelanggan.',
    ],
    'Graphic Designer': [
      'Membuat desain visual untuk materi promosi menggunakan Adobe Creative Suite.',
      'Berkoordinasi dengan tim marketing untuk menggarap konten kreatif.',
    ],
    'Operations Manager': [
      'Mengawasi operasional harian dan mengoptimalkan proses bisnis.',
      'Menyusun laporan operational KPI dan rekomendasi peningkatan efisiensi.',
    ],
    'Content Writer': [
      'Menulis artikel SEO-friendly dan konten blog sesuai gaya perusahaan.',
      'Melakukan riset topik dan mengedit naskah sebelum publikasi.',
    ],
    'Business Analyst': [
      'Menganalisis kebutuhan bisnis dan membuat dokumentasi fungsional.',
      'Menyusun data insights untuk mendukung keputusan manajemen.',
    ],
  };

  // Seed Jobs
  console.log('🌱 Seeding jobs...');
  for (let i = 0; i < 50; i++) {
    const company = faker.helpers.arrayElement(companies);
    const role = faker.helpers.arrayElement(roles);
    const description = faker.helpers.arrayElement(descriptionsMap[role.name]);

    await prisma.job.create({
      data: {
        title: role.name,
        description,
        location: faker.location.city(),
        salaryRange: `${faker.number.int({ min: 4, max: 8 })}M - ${faker.number.int({ min: 9, max: 15 })}M`,
        postedBy: company.createdBy,
        roleId: role.id,
        companyId: company.id,
      },
    });
  }

  // Seed Job Applications
  console.log('🌱 Seeding job applications...');
  const allJobs = await prisma.job.findMany();
  for (const user of users.slice(0, 5)) {
    const appliedJobs = faker.helpers.arrayElements(allJobs, 3);
    for (const job of appliedJobs) {
      await prisma.jobApplication.create({
        data: { userId: user.id, jobId: job.id, status: 'APPLIED' },
      });
    }
  }

  console.log('🚀 Full database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
