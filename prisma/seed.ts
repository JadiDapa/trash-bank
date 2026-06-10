import {
  Gender,
  MasyarakatStatus,
  DepositTicketStatus,
  VoucherTicketStatus,
  UserRole,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const GRAMMAGE_TO_POINT_RATE = 10; // 10g = 1 point
const POINTS_TO_VOUCHER_RATE = 500; // 500 points = 1 voucher

const KTP_PLACEHOLDER =
  "https://placehold.co/800x500/e2e8f0/64748b/png?text=KTP";
const IMG_BASE = "https://placehold.co/800x400";

function pts(grammage: number) {
  return grammage / GRAMMAGE_TO_POINT_RATE;
}

async function completeDeposit(
  masyarakatId: number,
  adminId: number,
  estimated: number,
  actual: number,
  date: Date,
) {
  const pointsEarned = pts(actual);
  await prisma.depositTicket.create({
    data: {
      masyarakatId,
      adminId,
      status: DepositTicketStatus.COMPLETED,
      estimatedGrammage: estimated,
      actualGrammage: actual,
      pointsEarned,
      createdAt: date,
      updatedAt: date,
    },
  });
  await prisma.masyarakat.update({
    where: { id: masyarakatId },
    data: {
      points: { increment: pointsEarned },
      totalGrammage: { increment: actual },
    },
  });
}

async function completeVoucher(
  masyarakatId: number,
  adminId: number,
  serial: string,
  date: Date,
) {
  await prisma.voucherTicket.create({
    data: {
      masyarakatId,
      adminId,
      status: VoucherTicketStatus.COMPLETED,
      pointsUsed: POINTS_TO_VOUCHER_RATE,
      voucherSerial: serial,
      createdAt: date,
      updatedAt: date,
    },
  });
  await prisma.masyarakat.update({
    where: { id: masyarakatId },
    data: { points: { decrement: POINTS_TO_VOUCHER_RATE } },
  });
}

async function main() {
  console.log("Seeding database...");

  // Clean slate (order respects FK constraints)
  await prisma.voucherTicket.deleteMany();
  await prisma.depositTicket.deleteMany();
  await prisma.education.deleteMany();
  await prisma.masyarakat.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  // ── Settings ──────────────────────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      grammageToPointRate: GRAMMAGE_TO_POINT_RATE,
      pointsToVoucherRate: POINTS_TO_VOUCHER_RATE,
    },
    create: {
      id: 1,
      grammageToPointRate: GRAMMAGE_TO_POINT_RATE,
      pointsToVoucherRate: POINTS_TO_VOUCHER_RATE,
    },
  });
  console.log("✓ Settings (10g = 1 poin, 500 poin = 1 voucher)");

  // ── Super Admin ───────────────────────────────────────────────────────────
  const superAdmin = await prisma.user.create({
    data: { clerkId: "seed_super_admin", role: UserRole.SUPER_ADMIN },
  });
  console.log("✓ Super Admin");

  // ── Admins ────────────────────────────────────────────────────────────────
  const adminUser1 = await prisma.user.create({
    data: { clerkId: "seed_admin_1", role: UserRole.ADMIN },
  });
  const admin1 = await prisma.admin.create({
    data: {
      userId: adminUser1.id,
      bankName: "Bank Sampah Hijau Lestari",
      bankAddress: "Jl. Srijaya Negara No. 5, Bukit Lama",
      bankArea: "Ilir Barat I, Palembang",
      operatingHours: "Senin–Jumat 08.00–16.00, Sabtu 08.00–12.00",
      phone: "0711-555-001",
      description: "Bank sampah yang fokus pada daur ulang plastik dan kertas.",
    },
  });

  const adminUser2 = await prisma.user.create({
    data: { clerkId: "seed_admin_2", role: UserRole.ADMIN },
  });
  const admin2 = await prisma.admin.create({
    data: {
      userId: adminUser2.id,
      bankName: "Bank Sampah Mandiri Jaya",
      bankAddress: "Jl. Demang Lebar Daun No. 22, Bukit Besar",
      bankArea: "Bukit Besar, Palembang",
      operatingHours: "Senin–Sabtu 07.00–15.00",
      phone: "0711-555-002",
      description:
        "Melayani penerimaan sampah rumah tangga dan industri kecil.",
    },
  });
  console.log("✓ Admins (2)");

  // ── Masyarakat ────────────────────────────────────────────────────────────
  const masDefs = [
    {
      clerkId: "seed_mas_1",
      name: "Budi Santoso",
      nik: "1671011501900001",
      gender: Gender.LAKI_LAKI,
      phone: "081234567890",
      email: "budi.santoso@gmail.com",
      address: "Jl. Demang Lebar Daun No. 45, Bukit Besar, Palembang",
      status: MasyarakatStatus.APPROVED,
    },
    {
      clerkId: "seed_mas_2",
      name: "Siti Rahayu",
      nik: "1671016003920001",
      gender: Gender.PEREMPUAN,
      phone: "082345678901",
      email: "siti.rahayu@gmail.com",
      address: "Jl. Srijaya Negara No. 12, Bukit Lama, Palembang",
      status: MasyarakatStatus.APPROVED,
    },
    {
      clerkId: "seed_mas_3",
      name: "Ahmad Fauzi",
      nik: "1671010807880001",
      gender: Gender.LAKI_LAKI,
      phone: "083456789012",
      email: "ahmad.fauzi@gmail.com",
      address: "Jl. Veteran No. 78, Ilir Barat I, Palembang",
      status: MasyarakatStatus.APPROVED,
    },
    {
      clerkId: "seed_mas_4",
      name: "Dewi Kusuma",
      nik: "1671016506950001",
      gender: Gender.PEREMPUAN,
      phone: "085678901234",
      email: "dewi.kusuma@gmail.com",
      address: "Jl. Kol. H. Barlian No. 23, Sukarami, Palembang",
      status: MasyarakatStatus.APPROVED,
    },
    {
      clerkId: "seed_mas_5",
      name: "Rudi Hermawan",
      nik: "1671011211910001",
      gender: Gender.LAKI_LAKI,
      phone: "087890123456",
      email: "rudi.hermawan@gmail.com",
      address: "Jl. R. Sukamto No. 5, Ilir Timur II, Palembang",
      status: MasyarakatStatus.APPROVED,
    },
    {
      clerkId: "seed_mas_6",
      name: "Nur Hidayah",
      nik: "1671017004980001",
      gender: Gender.PEREMPUAN,
      phone: "081345678901",
      email: "nur.hidayah@gmail.com",
      address: "Jl. Yos Sudarso No. 88, Ilir Timur I, Palembang",
      status: MasyarakatStatus.WAITING,
    },
    {
      clerkId: "seed_mas_7",
      name: "Agus Setiawan",
      nik: "1671010309850001",
      gender: Gender.LAKI_LAKI,
      phone: "082456789012",
      email: "agus.setiawan@gmail.com",
      address: "Jl. Sultan Muhammad Mansyur No. 34, Bukit Kecil, Palembang",
      status: MasyarakatStatus.WAITING,
    },
    {
      clerkId: "seed_mas_8",
      name: "Rina Wulandari",
      nik: "1671015802930001",
      gender: Gender.PEREMPUAN,
      phone: "083567890123",
      email: "rina.wulandari@gmail.com",
      address: "Jl. Kapten A. Rivai No. 67, Ilir Barat II, Palembang",
      status: MasyarakatStatus.REJECTED,
      rejectedReason:
        "Foto KTP tidak jelas dan tidak sesuai dengan identitas yang diberikan.",
    },
    {
      clerkId: "seed_mas_9",
      name: "Hendra Wijaya",
      nik: "1671012208890001",
      gender: Gender.LAKI_LAKI,
      phone: "085789012345",
      email: "hendra.wijaya@gmail.com",
      address: "Jl. Rajawali No. 15, Gandus, Palembang",
      status: MasyarakatStatus.APPROVED,
    },
    {
      clerkId: "seed_mas_10",
      name: "Lestari Ningsih",
      nik: "1671014712960001",
      gender: Gender.PEREMPUAN,
      phone: "087901234567",
      email: "lestari.ningsih@gmail.com",
      address: "Jl. Merdeka No. 99, Sako, Palembang",
      status: MasyarakatStatus.APPROVED,
    },
  ] as const;

  const mas: Record<string, { id: number }> = {};
  for (const d of masDefs) {
    const user = await prisma.user.create({
      data: { clerkId: d.clerkId, role: UserRole.MASYARAKAT },
    });
    const m = await prisma.masyarakat.create({
      data: {
        userId: user.id,
        name: d.name,
        nik: d.nik,
        address: d.address,
        gender: d.gender,
        phone: d.phone,
        email: d.email,
        ktpImageUrl: KTP_PLACEHOLDER,
        status: d.status,
        rejectedReason: "rejectedReason" in d ? d.rejectedReason : null,
      },
    });
    mas[d.clerkId] = m;
  }
  console.log("✓ Masyarakat (10)");

  // ── Deposit Tickets ───────────────────────────────────────────────────────
  // Budi Santoso — 2 selesai, 1 pending
  // Points: (4800 + 2950) / 10 = 775
  await completeDeposit(
    mas["seed_mas_1"].id,
    admin1.id,
    5000,
    4800,
    new Date("2026-04-10"),
  );
  await completeDeposit(
    mas["seed_mas_1"].id,
    admin1.id,
    3000,
    2950,
    new Date("2026-04-25"),
  );
  await prisma.depositTicket.create({
    data: {
      masyarakatId: mas["seed_mas_1"].id,
      adminId: admin1.id,
      status: DepositTicketStatus.PENDING,
      estimatedGrammage: 2000,
      createdAt: new Date("2026-05-20"),
      updatedAt: new Date("2026-05-20"),
    },
  });

  // Siti Rahayu — 2 selesai, 1 pending  (+ 1 voucher redeemed later)
  // Points before voucher: (9800 + 7500) / 10 = 1730
  await completeDeposit(
    mas["seed_mas_2"].id,
    admin1.id,
    10000,
    9800,
    new Date("2026-03-05"),
  );
  await completeDeposit(
    mas["seed_mas_2"].id,
    admin1.id,
    8000,
    7500,
    new Date("2026-04-02"),
  );
  await prisma.depositTicket.create({
    data: {
      masyarakatId: mas["seed_mas_2"].id,
      adminId: admin1.id,
      status: DepositTicketStatus.PENDING,
      estimatedGrammage: 5000,
      createdAt: new Date("2026-05-28"),
      updatedAt: new Date("2026-05-28"),
    },
  });

  // Ahmad Fauzi — 1 selesai, 1 ditolak
  // Points: 6800 / 10 = 680
  await completeDeposit(
    mas["seed_mas_3"].id,
    admin2.id,
    7000,
    6800,
    new Date("2026-04-18"),
  );
  await prisma.depositTicket.create({
    data: {
      masyarakatId: mas["seed_mas_3"].id,
      adminId: admin2.id,
      status: DepositTicketStatus.REJECTED,
      estimatedGrammage: 2000,
      createdAt: new Date("2026-05-01"),
      updatedAt: new Date("2026-05-01"),
    },
  });

  // Dewi Kusuma — 3 selesai, 1 dibatalkan (+ 1 voucher redeemed later)
  // Points before voucher: (14500 + 9900 + 8000) / 10 = 3240
  await completeDeposit(
    mas["seed_mas_4"].id,
    admin1.id,
    15000,
    14500,
    new Date("2026-02-14"),
  );
  await completeDeposit(
    mas["seed_mas_4"].id,
    admin1.id,
    10000,
    9900,
    new Date("2026-03-20"),
  );
  await completeDeposit(
    mas["seed_mas_4"].id,
    admin1.id,
    8000,
    8000,
    new Date("2026-04-30"),
  );
  await prisma.depositTicket.create({
    data: {
      masyarakatId: mas["seed_mas_4"].id,
      adminId: admin1.id,
      status: DepositTicketStatus.CANCELLED,
      estimatedGrammage: 3000,
      createdAt: new Date("2026-05-10"),
      updatedAt: new Date("2026-05-10"),
    },
  });

  // Rudi Hermawan — belum ada deposit (baru approve)

  // Hendra Wijaya — 1 selesai, 1 dibatalkan
  // Points: 3900 / 10 = 390
  await completeDeposit(
    mas["seed_mas_9"].id,
    admin2.id,
    4000,
    3900,
    new Date("2026-05-05"),
  );
  await prisma.depositTicket.create({
    data: {
      masyarakatId: mas["seed_mas_9"].id,
      adminId: admin2.id,
      status: DepositTicketStatus.CANCELLED,
      estimatedGrammage: 2000,
      createdAt: new Date("2026-05-15"),
      updatedAt: new Date("2026-05-15"),
    },
  });

  // Lestari Ningsih — 2 selesai (+ 1 voucher pending later)
  // Points: (5800 + 5000) / 10 = 1080
  await completeDeposit(
    mas["seed_mas_10"].id,
    admin2.id,
    6000,
    5800,
    new Date("2026-04-08"),
  );
  await completeDeposit(
    mas["seed_mas_10"].id,
    admin2.id,
    5000,
    5000,
    new Date("2026-05-12"),
  );

  console.log("✓ Deposit Tickets");

  // ── Voucher Tickets ───────────────────────────────────────────────────────
  // Siti Rahayu — 1 voucher selesai → poin: 1730 - 500 = 1230
  await completeVoucher(
    mas["seed_mas_2"].id,
    admin1.id,
    "VCH-20260415-XK9PAQ",
    new Date("2026-04-15"),
  );

  // Dewi Kusuma — 1 voucher selesai → poin: 3240 - 500 = 2740
  await completeVoucher(
    mas["seed_mas_4"].id,
    admin1.id,
    "VCH-20260325-M7BRNZ",
    new Date("2026-03-25"),
  );

  // Lestari Ningsih — 1 voucher pending (poin belum dipotong) → poin tetap 1080
  await prisma.voucherTicket.create({
    data: {
      masyarakatId: mas["seed_mas_10"].id,
      adminId: admin2.id,
      status: VoucherTicketStatus.PENDING,
      pointsUsed: POINTS_TO_VOUCHER_RATE,
      createdAt: new Date("2026-05-30"),
      updatedAt: new Date("2026-05-30"),
    },
  });

  console.log("✓ Voucher Tickets");

  // ── Education ─────────────────────────────────────────────────────────────
  const articles = [
    {
      title: "Mengenal Jenis Sampah yang Bisa Didaur Ulang",
      imageUrl: `${IMG_BASE}/4CAF50/ffffff/png?text=Daur+Ulang`,
      description:
        "Sampah daur ulang adalah sampah yang masih bisa diolah kembali menjadi bahan baru. Jenis-jenis sampah yang bisa didaur ulang antara lain plastik, kertas, logam, dan kaca.\n\nPlastik merupakan salah satu jenis sampah yang paling banyak ditemukan. Botol plastik, kantong plastik, dan wadah makanan plastik dapat didaur ulang menjadi berbagai produk baru. Kertas bekas, kardus, dan koran juga bisa didaur ulang menjadi kertas baru atau bahan kemasan.\n\nLogam seperti kaleng aluminium, besi tua, dan tembaga sangat mudah untuk didaur ulang dan prosesnya lebih hemat energi dibanding memproduksi logam baru. Kaca dari botol dan wadah kaca juga bisa dilebur dan dibentuk ulang menjadi produk kaca baru.",
    },
    {
      title: "Manfaat Bank Sampah bagi Lingkungan dan Masyarakat",
      imageUrl: `${IMG_BASE}/2196F3/ffffff/png?text=Bank+Sampah`,
      description:
        "Bank sampah adalah sebuah inovasi pengelolaan sampah yang tidak hanya bermanfaat bagi lingkungan, tetapi juga memberikan nilai ekonomi bagi masyarakat.\n\nDengan adanya bank sampah, masyarakat bisa menabung sampah mereka dan mendapatkan poin yang bisa ditukarkan dengan uang atau kebutuhan sehari-hari. Hal ini mendorong masyarakat untuk lebih aktif dalam memilah dan mengumpulkan sampah.\n\nDari sisi lingkungan, bank sampah membantu mengurangi volume sampah yang berakhir di tempat pembuangan akhir (TPA). Ini sangat penting karena TPA yang penuh dapat menyebabkan pencemaran tanah dan air tanah, serta menghasilkan gas metana yang berkontribusi pada pemanasan global.",
    },
    {
      title: "Cara Memilah Sampah Rumah Tangga dengan Benar",
      imageUrl: `${IMG_BASE}/FF9800/ffffff/png?text=Pilah+Sampah`,
      description:
        "Memilah sampah di rumah adalah langkah pertama dan paling penting dalam pengelolaan sampah yang baik. Dengan pemilahan yang benar, sampah bisa lebih mudah untuk didaur ulang atau diolah.\n\nBuat tiga tempat sampah terpisah: tempat sampah organik (sisa makanan, daun), tempat sampah anorganik (plastik, kertas, kaca, logam), dan tempat sampah B3 (baterai, lampu bekas, obat kedaluwarsa).\n\nPastikan sampah anorganik dalam kondisi bersih sebelum dibuang ke bank sampah. Bilas botol plastik, kaleng, dan wadah makanan agar tidak ada sisa makanan yang bisa menimbulkan bau atau mengundang hama.",
    },
    {
      title: "Bahaya Sampah Plastik dan Cara Mengatasinya",
      imageUrl: `${IMG_BASE}/F44336/ffffff/png?text=Bahaya+Plastik`,
      description:
        "Sampah plastik menjadi salah satu masalah lingkungan paling serius di dunia saat ini. Plastik dapat bertahan di lingkungan selama ratusan tahun dan sulit untuk terurai secara alami.\n\nKetika plastik masuk ke lautan, ia dapat memecah menjadi partikel-partikel kecil yang disebut mikroplastik. Mikroplastik ini kemudian masuk ke rantai makanan laut dan akhirnya bisa sampai ke tubuh manusia melalui konsumsi ikan dan makanan laut.\n\nUntuk mengatasi masalah ini, kita bisa mulai dari hal kecil: membawa tas belanja sendiri, menggunakan botol minum yang bisa diisi ulang, menghindari sedotan plastik sekali pakai, dan memilih produk dengan kemasan ramah lingkungan.",
    },
    {
      title: "Tips Mengurangi Sampah Organik di Rumah",
      imageUrl: `${IMG_BASE}/8BC34A/ffffff/png?text=Kompos+Organik`,
      description:
        "Sampah organik seperti sisa makanan, kulit buah, dan daun-daunan sebenarnya bisa dimanfaatkan kembali melalui proses pengomposan. Kompos yang dihasilkan dapat menjadi pupuk alami yang sangat bermanfaat untuk tanaman.\n\nCara membuat kompos di rumah sangat mudah. Siapkan wadah atau tempat kompos di sudut halaman. Masukkan sisa makanan, daun kering, dan bahan organik lainnya secara bergantian. Tambahkan tanah atau starter kompos untuk mempercepat proses dekomposisi.\n\nSelain mengompos, kita juga bisa mengurangi sampah organik dengan cara merencanakan belanja dengan baik sehingga tidak ada makanan yang terbuang, menyimpan bahan makanan dengan tepat agar lebih tahan lama, dan mengolah sisa makanan menjadi hidangan baru yang kreatif.",
    },
  ];

  for (const article of articles) {
    await prisma.education.create({
      data: { userId: superAdmin.id, ...article },
    });
  }
  console.log("✓ Edukasi Lingkungan (5)");

  console.log("\nSeeding selesai!");
  console.log("─────────────────────────────────────────────");
  console.log("Ringkasan data:");
  console.log("  Settings  : grammageToPointRate=10, pointsToVoucherRate=500");
  console.log("  Admin     : 2 (Hijau Lestari, Mandiri Jaya)");
  console.log(
    "  Masyarakat: 10 (6 approved, 2 waiting, 1 rejected, 1 approved-baru)",
  );
  console.log(
    "  Deposit   : 12 tiket (7 selesai, 2 pending, 1 ditolak, 2 dibatalkan)",
  );
  console.log("  Voucher   : 3 tiket (2 selesai, 1 pending)");
  console.log("  Edukasi   : 5 artikel");
  console.log("─────────────────────────────────────────────");
  console.log("CATATAN: clerkId 'seed_*' adalah placeholder dev,");
  console.log("bukan akun Clerk sungguhan.");
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
