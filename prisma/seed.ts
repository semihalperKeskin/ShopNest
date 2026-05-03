import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Kategori destekli seeding işlemi başlıyor...");

  // 1. Test Kullanıcısı
  const hashedPassword = await bcrypt.hash("123456", 10);
  await prisma.user.upsert({
    where: { email: "test@shopnest.com" },
    update: {},
    create: {
      email: "test@shopnest.com",
      name: "Test Kullanıcısı",
      password: hashedPassword,
    },
  });

  // Category.name unique olmadığı için upsert kullanamayız.
  async function getOrCreateCategory(name: string) {
    const existing = await prisma.category.findFirst({ where: { name } });
    if (existing) return existing;
    return prisma.category.create({ data: { name } });
  }

  // 2. Kategorileri Oluştur
  const categoryKask = await getOrCreateCategory("Kasklar");
  const categoryEldiven = await getOrCreateCategory("Eldivenler");
  const categoryAksesuar = await getOrCreateCategory("Aksesuarlar");

  // 3. Ürünleri Kategorilerle Birlikte Oluştur
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Piano Black Kapalı Kask",
        description: "Aerodinamik, piano black renkli, vizörlü güvenlik kaskı.",
        price: 4500.0,
        stock: 15,
        imageUrl: "https://picsum.photos/600/400?random=1",
        categoryId: categoryKask.id, // Kategoriye bağladık!
      },
      {
        name: "Deri Kışlık Eldiven",
        description: "Rüzgar ve su geçirmez motosiklet eldiveni.",
        price: 850.0,
        stock: 30,
        imageUrl: "https://picsum.photos/600/400?random=2",
        categoryId: categoryEldiven.id,
      },
      {
        name: "Alarmlı Disk Kilidi",
        description: "120dB sesli, kesilmez çelik disk kilidi.",
        price: 1200.0,
        stock: 20,
        imageUrl: "https://picsum.photos/600/400?random=3",
        categoryId: categoryAksesuar.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Kategoriler ve ${products.count} adet ürün eklendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
