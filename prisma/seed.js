const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient();


async function main() {
  await prisma.user.create({
    data: {
      email: 'test@gmail.com',
      name: 'M.Test',
      accounts: {
        create: {
          libelle: "compte famille",
          money: 500,
        }
      }
    }
  });
}
main()
    .catch((e) => {

      // eslint-disable-next-line no-console
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })





