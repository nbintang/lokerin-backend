import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const dummyPassword = await argon2.hash('Password123');

  console.log('🔄 Clearing existing data...');
  await prisma.jobApplication.deleteMany();
  await prisma.job.deleteMany();
  await prisma.recruiterProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('🌱 Seeding roles...');
  const roleNames = [
    // Tech Roles
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Mobile App Developer',
    'Software Engineer',
    'Data Scientist',
    'DevOps Engineer',
    'QA Engineer',
    'UI/UX Designer',
    'Machine Learning Engineer',
    'Cybersecurity Specialist',
    'Cloud Architect',
    'Database Administrator',
    'System Administrator',

    // Business & Management
    'Product Manager',
    'Project Manager',
    'Business Analyst',
    'Operations Manager',
    'General Manager',
    'Marketing Manager',
    'Sales Manager',
    'HR Manager',
    'Finance Manager',
    'Supply Chain Manager',

    // Sales & Marketing
    'Sales Representative',
    'Marketing Specialist',
    'Digital Marketing Specialist',
    'Content Marketing Manager',
    'Brand Manager',
    'Social Media Manager',
    'SEO Specialist',
    'Account Manager',

    // Finance & Accounting
    'Accountant',
    'Financial Analyst',
    'Tax Consultant',
    'Auditor',
    'Investment Analyst',
    'Treasury Analyst',

    // Human Resources
    'HR Generalist',
    'Talent Acquisition Specialist',
    'Training & Development Specialist',
    'Compensation & Benefits Analyst',
    'Employee Relations Specialist',

    // Customer Service & Support
    'Customer Service Representative',
    'Customer Success Manager',
    'Technical Support Specialist',
    'Call Center Agent',

    // Creative & Design
    'Graphic Designer',
    'Video Editor',
    'Content Writer',
    'Copywriter',
    'Photographer',
    'Art Director',

    // Education & Training
    'Teacher',
    'Corporate Trainer',
    'E-learning Developer',
    'Curriculum Developer',

    // Healthcare & Medical
    'Nurse',
    'Medical Doctor',
    'Pharmacist',
    'Medical Laboratory Technician',
    'Physiotherapist',

    // Legal & Compliance
    'Legal Counsel',
    'Compliance Officer',
    'Contract Specialist',
    'Paralegal',

    // Operations & Logistics
    'Logistics Coordinator',
    'Warehouse Manager',
    'Production Supervisor',
    'Quality Control Inspector',
    'Procurement Specialist',

    // Others
    'Administrative Assistant',
    'Executive Assistant',
    'Receptionist',
    'Security Officer',
    'Maintenance Technician',
  ];

  const roles = [];
  for (const name of roleNames) {
    roles.push(await prisma.role.create({ data: { name } }));
  }

  // Manual job descriptions for each role
  const descriptionsMap: Record<string, string[]> = {
    // Tech Roles
    'Frontend Developer': [
      'Mengembangkan antarmuka pengguna interaktif dengan React.js dan Tailwind CSS, memastikan aksesibilitas dan responsivitas.',
      'Membangun komponen UI yang reusable dan mengintegrasikan API GraphQL untuk dynamic content.',
      'Mengoptimalkan performa website dengan lazy loading dan code splitting menggunakan Next.js.',
    ],
    'Backend Developer': [
      'Merancang dan mengimplementasikan RESTful API dengan Node.js dan Express, menggunakan PostgreSQL untuk penyimpanan data.',
      'Mengoptimalkan performa backend dengan Redis dan job queue menggunakan Bull untuk proses asynchronous.',
      'Membangun microservices architecture dengan Docker dan implementasi CI/CD pipeline.',
    ],
    'Fullstack Developer': [
      'Mengembangkan fitur end-to-end: Next.js di frontend dan NestJS di backend, deployment ke AWS.',
      'Menulis unit/integration tests dengan Jest dan memonitor aplikasi menggunakan Grafana.',
      'Mengintegrasikan third-party APIs dan mengelola state management dengan Redux/Zustand.',
    ],
    'Mobile App Developer': [
      'Mengembangkan aplikasi cross-platform dengan React Native, integrasi Firebase untuk autentikasi dan analytics.',
      'Melakukan debugging pada perangkat nyata dan optimasi UI/UX pada berbagai ukuran layar.',
      'Implementasi push notifications dan offline data synchronization.',
    ],
    'Software Engineer': [
      'Membangun mikrolayanan menggunakan Golang dan Docker, implementasi CI/CD dengan GitHub Actions.',
      'Mendesain arsitektur sistem yang scalable serta menulis dokumentasi teknis.',
      'Melakukan code review dan mentoring junior developer dalam best practices.',
    ],
    'Data Scientist': [
      'Menganalisis data dengan Python, Pandas, dan scikit-learn untuk membangun model prediktif.',
      'Menerapkan pipeline ETL dan dashboard visualisasi di Power BI untuk reporting insights.',
      'Mengembangkan machine learning models dan deploy ke production menggunakan MLOps.',
    ],
    'DevOps Engineer': [
      'Mengelola infrastruktur AWS dengan Terraform, mengatur CI/CD pipeline dengan Jenkins.',
      'Memantau sistem dengan ELK stack dan menyiapkan auto-scaling group.',
      'Implementasi container orchestration dengan Kubernetes dan monitoring dengan Prometheus.',
    ],
    'QA Engineer': [
      'Menulis automated tests menggunakan Cypress dan Selenium, serta merancang test plans.',
      'Melakukan regression testing untuk memastikan stabilitas setiap rilis.',
      'Implementasi performance testing dan security testing untuk aplikasi web dan mobile.',
    ],
    'UI/UX Designer': [
      'Mendesain prototype interaktif menggunakan Figma dan melakukan user testing.',
      'Membuat wireframes serta user flow untuk meningkatkan kenyamanan pengguna.',
      'Melakukan user research dan usability testing untuk validasi design decisions.',
    ],
    'Machine Learning Engineer': [
      'Mengembangkan dan deploy machine learning models menggunakan TensorFlow dan PyTorch.',
      'Membangun data pipeline untuk training dan inference model di production.',
      'Mengoptimalkan model performance dan implementasi A/B testing untuk ML features.',
    ],
    'Cybersecurity Specialist': [
      'Melakukan penetration testing dan vulnerability assessment pada sistem perusahaan.',
      'Mengimplementasikan security protocols dan monitoring untuk deteksi ancaman.',
      'Menangani incident response dan recovery serta training security awareness.',
    ],
    'Cloud Architect': [
      'Merancang arsitektur cloud yang scalable dan cost-effective di AWS/Azure/GCP.',
      'Mengimplementasikan cloud migration strategy dan disaster recovery planning.',
      'Mengelola cloud governance dan compliance dengan security best practices.',
    ],
    'Database Administrator': [
      'Mengelola dan mengoptimalkan database PostgreSQL, MySQL, dan MongoDB.',
      'Melakukan backup, recovery, dan performance tuning database.',
      'Implementasi database security dan monitoring untuk high availability.',
    ],
    'System Administrator': [
      'Mengelola server Linux/Windows dan network infrastructure.',
      'Melakukan system monitoring, backup, dan maintenance rutin.',
      'Implementasi security patches dan troubleshooting system issues.',
    ],

    // Business & Management
    'Product Manager': [
      'Merancang roadmap produk dan berkolaborasi dengan tim engineering serta desain.',
      'Menulis PRD (Product Requirement Document) untuk fitur baru dan mengkoordinasikan sprint Agile.',
      'Melakukan market research dan competitor analysis untuk product strategy.',
    ],
    'Project Manager': [
      'Mengelola timeline proyek dan koordinasi antar tim menggunakan metodologi Agile/Scrum.',
      'Memonitor progress dan budget proyek serta melakukan risk management.',
      'Memfasilitasi meeting standup, retrospective, dan sprint planning.',
    ],
    'Business Analyst': [
      'Menganalisis kebutuhan bisnis dan membuat dokumentasi fungsional.',
      'Menyusun data insights untuk mendukung keputusan manajemen.',
      'Melakukan process improvement dan gap analysis untuk optimasi operasional.',
    ],
    'Operations Manager': [
      'Mengawasi operasional harian dan mengoptimalkan proses bisnis.',
      'Menyusun laporan operational KPI dan rekomendasi peningkatan efisiensi.',
      'Mengelola supply chain dan vendor relationship management.',
    ],
    'General Manager': [
      'Memimpin seluruh operasional perusahaan dan mengembangkan strategi bisnis.',
      'Mengelola P&L dan bertanggung jawab terhadap pencapaian target perusahaan.',
      'Melakukan strategic planning dan business development initiatives.',
    ],
    'Marketing Manager': [
      'Mengembangkan strategi marketing dan mengelola budget marketing campaigns.',
      'Memimpin tim marketing dan mengkoordinasikan dengan sales untuk lead generation.',
      'Melakukan brand management dan market positioning strategy.',
    ],
    'Sales Manager': [
      'Memimpin tim sales dan mengembangkan strategi penjualan untuk mencapai target.',
      'Mengelola key accounts dan melakukan negosiasi dengan klien enterprise.',
      'Melakukan sales forecasting dan territory management.',
    ],
    'HR Manager': [
      'Mengelola proses rekrutmen dan on-boarding karyawan baru.',
      'Menangani kebijakan SDM dan memastikan kepatuhan pada regulasi ketenagakerjaan.',
      'Mengembangkan program employee engagement dan performance management.',
    ],
    'Finance Manager': [
      'Mengelola cash flow dan financial planning serta budgeting perusahaan.',
      'Menyusun laporan keuangan dan melakukan financial analysis.',
      'Mengawasi tax compliance dan audit eksternal.',
    ],
    'Supply Chain Manager': [
      'Mengelola procurement dan vendor management untuk optimasi cost dan quality.',
      'Mengembangkan supply chain strategy dan inventory management.',
      'Melakukan risk assessment dan contingency planning untuk supply disruption.',
    ],

    // Sales & Marketing
    'Sales Representative': [
      'Mencapai target penjualan dengan menjalin relasi baik ke klien potensial.',
      'Menyusun proposal bisnis dan presentasi produk ke perusahaan partner.',
      'Melakukan prospecting dan lead qualification melalui cold calling dan networking.',
    ],
    'Marketing Specialist': [
      'Merancang kampanye pemasaran digital melalui media sosial dan Google Ads.',
      'Menganalisis data pemasaran untuk optimasi strategi dan ROI.',
      'Membuat content marketing dan email marketing campaigns.',
    ],
    'Digital Marketing Specialist': [
      'Mengelola strategi SEO/SEM dan social media marketing untuk brand awareness.',
      'Mengoptimalkan conversion rate dan mengelola marketing automation tools.',
      'Melakukan A/B testing untuk campaign optimization dan performance tracking.',
    ],
    'Content Marketing Manager': [
      'Mengembangkan content strategy dan editorial calendar untuk berbagai platform.',
      'Membuat blog posts, videos, dan infographics yang engaging dan SEO-friendly.',
      'Mengukur content performance dan melakukan content optimization.',
    ],
    'Brand Manager': [
      'Mengembangkan brand strategy dan memastikan konsistensi brand identity.',
      'Mengelola brand campaigns dan partnership untuk brand awareness.',
      'Melakukan brand monitoring dan reputation management.',
    ],
    'Social Media Manager': [
      'Mengelola akun media sosial perusahaan dan membuat content calendar.',
      'Melakukan community management dan customer engagement di platform digital.',
      'Menganalisis social media metrics dan trends untuk strategy improvement.',
    ],
    'SEO Specialist': [
      'Mengoptimalkan website untuk search engine ranking dan organic traffic.',
      'Melakukan keyword research dan competitive analysis.',
      'Implementasi technical SEO dan link building strategy.',
    ],
    'Account Manager': [
      'Mengelola relationship dengan existing clients dan memastikan customer satisfaction.',
      'Melakukan upselling dan cross-selling untuk revenue growth.',
      'Menangani escalation dan problem resolution untuk key accounts.',
    ],

    // Finance & Accounting
    Accountant: [
      'Menyiapkan laporan keuangan bulanan dan melakukan rekonsiliasi bank.',
      'Mengelola pembukuan dan memastikan kepatuhan pada standar akuntansi.',
      'Melakukan journal entries dan account reconciliation.',
    ],
    'Financial Analyst': [
      'Melakukan financial modeling dan forecasting untuk business planning.',
      'Menganalisis variance dan menyusun management reporting.',
      'Melakukan investment analysis dan budget monitoring.',
    ],
    'Tax Consultant': [
      'Mengelola tax compliance dan perencanaan pajak perusahaan.',
      'Menyiapkan SPT dan menangani tax audit dari otoritas pajak.',
      'Memberikan tax advisory untuk optimasi tax planning.',
    ],
    Auditor: [
      'Melakukan internal audit dan risk assessment untuk operational control.',
      'Menyusun audit findings dan recommendations untuk management.',
      'Memastikan compliance dengan regulatory requirements dan internal policies.',
    ],
    'Investment Analyst': [
      'Menganalisis investasi portfolio dan melakukan due diligence.',
      'Menyusun investment recommendations dan risk assessment.',
      'Melakukan market research dan financial valuation.',
    ],
    'Treasury Analyst': [
      'Mengelola cash management dan liquidity planning.',
      'Melakukan foreign exchange hedging dan interest rate risk management.',
      'Mengawasi banking relationships dan credit facilities.',
    ],

    // Human Resources
    'HR Generalist': [
      'Menangani end-to-end HR processes dari recruitment hingga employee relations.',
      'Melakukan HR administration dan payroll processing.',
      'Mengelola employee benefits dan performance evaluation.',
    ],
    'Talent Acquisition Specialist': [
      'Melakukan sourcing dan screening kandidat untuk berbagai posisi.',
      'Mengelola employer branding dan recruitment marketing.',
      'Melakukan interview dan assessment untuk candidate selection.',
    ],
    'Training & Development Specialist': [
      'Mengembangkan training programs dan learning curriculum.',
      'Melakukan training needs analysis dan competency mapping.',
      'Mengelola e-learning platform dan training evaluation.',
    ],
    'Compensation & Benefits Analyst': [
      'Melakukan salary benchmarking dan job evaluation.',
      'Mengelola compensation structure dan incentive programs.',
      'Menganalisis benefits utilization dan cost optimization.',
    ],
    'Employee Relations Specialist': [
      'Menangani employee grievances dan conflict resolution.',
      'Melakukan employee engagement surveys dan action planning.',
      'Memastikan compliance dengan labor laws dan regulations.',
    ],

    // Customer Service & Support
    'Customer Service Representative': [
      'Menangani keluhan pelanggan melalui telepon dan email dengan SOP yang tersusun.',
      'Memberikan solusi cepat dan meningkatkan kepuasan pelanggan.',
      'Melakukan follow-up dan escalation untuk complex issues.',
    ],
    'Customer Success Manager': [
      'Memastikan customer adoption dan success dengan produk/layanan perusahaan.',
      'Melakukan onboarding dan training untuk new customers.',
      'Mengidentifikasi upselling opportunities dan renewal management.',
    ],
    'Technical Support Specialist': [
      'Memberikan technical assistance dan troubleshooting untuk customer issues.',
      'Membuat knowledge base dan documentation untuk common problems.',
      'Berkoordinasi dengan engineering team untuk bug fixes dan improvements.',
    ],
    'Call Center Agent': [
      'Menangani inbound/outbound calls dan memberikan informasi produk/layanan.',
      'Melakukan data entry dan follow-up sesuai dengan SOP.',
      'Mencapai KPI call handling time dan customer satisfaction score.',
    ],

    // Creative & Design
    'Graphic Designer': [
      'Membuat desain visual untuk materi promosi menggunakan Adobe Creative Suite.',
      'Berkoordinasi dengan tim marketing untuk menggarap konten kreatif.',
      'Mengembangkan brand identity dan visual guidelines.',
    ],
    'Video Editor': [
      'Melakukan editing video untuk konten marketing dan corporate communication.',
      'Membuat motion graphics dan animasi menggunakan After Effects.',
      'Mengelola video assets dan memastikan quality standard.',
    ],
    'Content Writer': [
      'Menulis artikel SEO-friendly dan konten blog sesuai gaya perusahaan.',
      'Melakukan riset topik dan mengedit naskah sebelum publikasi.',
      'Membuat copywriting untuk marketing materials dan website.',
    ],
    Copywriter: [
      'Membuat copy yang persuasif untuk advertising dan marketing campaigns.',
      'Mengembangkan messaging strategy dan brand voice.',
      'Melakukan A/B testing untuk copy optimization.',
    ],
    Photographer: [
      'Mengambil foto produk dan corporate events untuk kebutuhan marketing.',
      'Melakukan photo editing dan retouching menggunakan Photoshop.',
      'Mengelola photo assets dan digital asset management.',
    ],
    'Art Director': [
      'Memimpin creative direction untuk campaign dan brand development.',
      'Berkolaborasi dengan designer dan copywriter untuk creative execution.',
      'Melakukan creative review dan quality control.',
    ],

    // Education & Training
    Teacher: [
      'Mengajar mata pelajaran sesuai kurikulum dan menyiapkan materi pembelajaran.',
      'Melakukan evaluasi berkala terhadap perkembangan siswa.',
      'Berpartisipasi dalam pengembangan kurikulum dan ekstrakurikuler.',
    ],
    'Corporate Trainer': [
      'Mengembangkan dan melaksanakan training program untuk karyawan.',
      'Melakukan training needs assessment dan evaluation.',
      'Membuat training materials dan e-learning content.',
    ],
    'E-learning Developer': [
      'Mengembangkan interactive learning modules menggunakan Articulate/Captivate.',
      'Melakukan instructional design dan learning experience optimization.',
      'Mengelola LMS (Learning Management System) dan content distribution.',
    ],
    'Curriculum Developer': [
      'Merancang kurikulum dan learning path untuk various subject matters.',
      'Melakukan content review dan quality assurance.',
      'Berkolaborasi dengan subject matter experts untuk content development.',
    ],

    // Healthcare & Medical
    Nurse: [
      'Memberikan perawatan langsung kepada pasien sesuai dengan standar medis.',
      'Melakukan monitoring vital signs dan administrasi obat.',
      'Berkoordinasi dengan dokter dan tim medis lainnya.',
    ],
    'Medical Doctor': [
      'Melakukan diagnosis dan treatment terhadap berbagai kondisi medis.',
      'Memberikan konsultasi medis dan health education kepada pasien.',
      'Melakukan medical examination dan interpretation hasil lab.',
    ],
    Pharmacist: [
      'Mengelola dispensing obat dan memberikan konsultasi farmasi.',
      'Melakukan drug interaction screening dan medication review.',
      'Memastikan compliance dengan regulasi farmasi dan quality control.',
    ],
    'Medical Laboratory Technician': [
      'Melakukan pemeriksaan laboratorium dan analisis sampel medis.',
      'Mengoperasikan peralatan lab dan memastikan quality control.',
      'Menyusun laporan hasil lab dan maintenance equipment.',
    ],
    Physiotherapist: [
      'Memberikan terapi fisik untuk rehabilitasi dan recovery pasien.',
      'Melakukan assessment dan menyusun treatment plan.',
      'Mengedukasi pasien tentang exercise dan injury prevention.',
    ],

    // Legal & Compliance
    'Legal Counsel': [
      'Memberikan legal advice dan menangani contract negotiation.',
      'Melakukan legal research dan compliance monitoring.',
      'Menangani dispute resolution dan litigation management.',
    ],
    'Compliance Officer': [
      'Memastikan kepatuhan perusahaan terhadap regulasi dan internal policies.',
      'Melakukan compliance audit dan risk assessment.',
      'Mengembangkan compliance training dan awareness programs.',
    ],
    'Contract Specialist': [
      'Mengelola contract lifecycle dari drafting hingga renewal.',
      'Melakukan contract review dan risk analysis.',
      'Bernegosiasi dengan vendors dan partners untuk contract terms.',
    ],
    Paralegal: [
      'Membantu legal counsel dalam research dan document preparation.',
      'Melakukan case management dan client communication.',
      'Menyiapkan legal documents dan filing dengan authorities.',
    ],

    // Operations & Logistics
    'Logistics Coordinator': [
      'Mengelola shipping dan delivery coordination untuk customer orders.',
      'Mengoptimalkan transportation routes dan cost efficiency.',
      'Berkoordinasi dengan suppliers dan logistics partners.',
    ],
    'Warehouse Manager': [
      'Mengelola warehouse operations dan inventory management.',
      'Mengoptimalkan storage layout dan picking efficiency.',
      'Memastikan safety procedures dan staff training.',
    ],
    'Production Supervisor': [
      'Mengawasi production line dan memastikan quality standards.',
      'Mengelola production scheduling dan resource allocation.',
      'Melakukan continuous improvement dan waste reduction.',
    ],
    'Quality Control Inspector': [
      'Melakukan quality inspection dan testing terhadap produk.',
      'Menyusun quality reports dan corrective action plans.',
      'Memastikan compliance dengan quality standards dan regulations.',
    ],
    'Procurement Specialist': [
      'Mengelola sourcing dan vendor selection untuk material procurement.',
      'Melakukan cost analysis dan contract negotiation.',
      'Mengawasi supplier performance dan relationship management.',
    ],

    // Others
    'Administrative Assistant': [
      'Memberikan dukungan administratif dan clerical support.',
      'Mengelola calendar dan appointment scheduling.',
      'Melakukan data entry dan document management.',
    ],
    'Executive Assistant': [
      'Memberikan high-level administrative support kepada executive team.',
      'Mengelola executive calendar dan travel arrangements.',
      'Melakukan meeting coordination dan project assistance.',
    ],
    Receptionist: [
      'Menyambut tamu dan mengarahkan ke person yang tepat.',
      'Menangani incoming calls dan message handling.',
      'Melakukan basic administrative tasks dan office maintenance.',
    ],
    'Security Officer': [
      'Mengawasi keamanan gedung dan asset perusahaan.',
      'Melakukan security patrol dan access control.',
      'Menangani emergency situations dan incident reporting.',
    ],
    'Maintenance Technician': [
      'Melakukan preventive maintenance dan repair equipment.',
      'Menangani facility maintenance dan troubleshooting.',
      'Memastikan safety compliance dan equipment optimization.',
    ],
  };

  console.log('🌱 Seeding users...');
  const users = [];

  // Create regular users (MEMBER role)
  for (let i = 0; i < 15; i++) {
    users.push(
      await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number({ style: 'human' }),
          password: dummyPassword,
          cvUrl: `https://res.cloudinary.com/da6hciwjn/image/upload/v1753782607/CV_Ezra_Raditya_Dwi_Anugrah_mvx8l0.pdf`,
          role: 'MEMBER',
          avatarUrl: faker.image.avatar(),
          isVerified: faker.datatype.boolean(0.8), // 80% verified
        },
      }),
    );
  }

  // Create some recruiters
  for (let i = 0; i < 5; i++) {
    users.push(
      await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number({ style: 'international' }),
          password: dummyPassword,
          role: 'RECRUITER',
          avatarUrl: faker.image.avatar(),
          isVerified: true,
        },
      }),
    );
  }

  // Create administrators
  for (let i = 0; i < 2; i++) {
    users.push(
      await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number({ style: 'international' }),
          password: dummyPassword,
          role: 'ADMINISTRATOR',
          avatarUrl: faker.image.avatar(),
          isVerified: true,
        },
      }),
    );
  }

  console.log('🌱 Seeding companies...');
  const companies = [];
  const companyTypes = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Media',
    'Telecommunications',
    'Transportation',
  ];

  for (let i = 0; i < 12; i++) {
    const owner = faker.helpers.arrayElement(
      users.filter((u) => u.role === 'RECRUITER' || u.role === 'ADMINISTRATOR'),
    );
    const companyType = faker.helpers.arrayElement(companyTypes);

    const company = await prisma.company.create({
      data: {
        name: faker.company.name(),
        description: `${faker.company.catchPhrase()} Perusahaan ${companyType} yang berfokus pada ${faker.company.buzzPhrase()}.`,
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
  }

  console.log('🌱 Seeding recruiter profiles...');
  const recruiters = users.filter((u) => u.role === 'RECRUITER');

  for (const recruiter of recruiters) {
    const company = faker.helpers.arrayElement(companies);
    const role = faker.helpers.arrayElement(roles);

    await prisma.recruiterProfile.create({
      data: {
        userId: recruiter.id,
        companyId: company.id,
        roleId: role.id,
        about: faker.lorem.paragraphs(2, '\n\n'),
      },
    });
  }

  console.log('🌱 Seeding jobs...');
  const jobs = [];

  for (let i = 0; i < 80; i++) {
    const company = faker.helpers.arrayElement(companies);
    const role = faker.helpers.arrayElement(roles);
    const description = faker.helpers.arrayElement(
      descriptionsMap[role.name] || [
        'Menjalankan tugas sesuai dengan job description dan requirement yang ditetapkan perusahaan.',
      ],
    );

    const cities = [
      'Jakarta',
      'Surabaya',
      'Bandung',
      'Medan',
      'Semarang',
      'Makassar',
      'Palembang',
      'Tangerang',
      'Depok',
      'Bekasi',
      'Bogor',
      'Yogyakarta',
    ];

    const salaryRanges = [
      '2000000 - 5000000',
      '4000000 - 7000000',
      '5000000 - 8000000',
      '6000000 - 1000000',
      '7000000 - 12000000',
      '8000000 - 15000000',
      '10000000 - 18000000',
      '12000000 - 20000000',
      '15000000 - 25000000',
      '20000000 - 35000000',
    ];

    const job = await prisma.job.create({
      data: {
        description,
        location: faker.helpers.arrayElement(cities),
        salaryRange: faker.helpers.arrayElement(salaryRanges),
        postedBy: company.createdBy,
        roleId: role.id,
        companyId: company.id,
      },
    });
    jobs.push(job);
  }

  console.log('🌱 Seeding job applications...');
  const memberUsers = users.filter((u) => u.role === 'MEMBER');
  const applicationStatuses: (
    | 'APPLIED'
    | 'REVIEWED'
    | 'REJECTED'
    | 'ACCEPTED'
  )[] = ['APPLIED', 'REVIEWED', 'REJECTED', 'ACCEPTED'];

  for (const user of memberUsers) {
    // Each user applies to 2-5 jobs
    const numApplications = faker.number.int({ min: 2, max: 5 });
    const appliedJobs = faker.helpers.arrayElements(jobs, numApplications);

    for (const job of appliedJobs) {
      // Weight the status distribution (more APPLIED than others)
      const statusWeights = [0.5, 0.25, 0.15, 0.1]; // APPLIED, REVIEWED, REJECTED, ACCEPTED
      const randomValue = Math.random();
      let status: 'APPLIED' | 'REVIEWED' | 'REJECTED' | 'ACCEPTED' = 'APPLIED';

      let cumulativeWeight = 0;
      for (let i = 0; i < applicationStatuses.length; i++) {
        cumulativeWeight += statusWeights[i];
        if (randomValue <= cumulativeWeight) {
          status = applicationStatuses[i];
          break;
        }
      }

      await prisma.jobApplication.create({
        data: {
          userId: user.id,
          jobId: job.id,
          status,
        },
      });
    }
  }

  console.log('🚀 Complete database seeding finished!');
  console.log(`📊 Seeded:`);
  console.log(`   - ${roles.length} roles`);
  console.log(
    `   - ${users.length} users (${memberUsers.length} members, ${recruiters.length} recruiters, 2 admins)`,
  );
  console.log(`   - ${companies.length} companies`);
  console.log(`   - ${recruiters.length} recruiter profiles`);
  console.log(`   - ${jobs.length} jobs`);
  console.log(`   - Multiple job applications with vafrious statuses`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
