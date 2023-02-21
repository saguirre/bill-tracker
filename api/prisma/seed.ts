import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const saveUser = async (userToSave: Prisma.UserCreateInput) => {
  const createdUser = await prisma.user.create({
    data: { ...userToSave },
  });
  return createdUser;
};

const generateUser = async () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  const user: Prisma.UserCreateInput = {
    email: faker.internet.email(
      firstName.toLowerCase(),
      lastName.toLowerCase(),
      faker.company.name().split(' ').join('').toLowerCase() + '.com',
    ),
    password: await bcrypt.hash('password', 10),
    name: `${firstName} ${lastName}`,
  };
  return user;
};

async function main() {
  try {
    await prisma.bill.deleteMany({}); // Remove for production
    await prisma.user.deleteMany({}); // Remove for production
    const personalUser = {
      email: 'saguirrews@gmail.com',
      password: await bcrypt.hash('123456', 10),
      name: 'Santiago Aguirre',
    };

    const users = await Promise.all(
      Array.from({ length: 10 }).map(async () => {
        return await generateUser();
      }),
    );

    users.push(personalUser);
    const savedUsers = await Promise.all(
      users.map(async (user) => {
        return await saveUser(user);
      }),
    );

    const baseCategories = [
      'Food',
      'Rent',
      'Electricity',
      'Gas',
      'Transportation',
      'Health',
      'Insurance',
      'Entertainment',
      'Education',
      'Other',
    ];

    await Promise.all(
      baseCategories.map(async (name) => {
        return await prisma.category.create({
          data: {
            name,
          },
        });
      }),
    );

    await Promise.all(
      savedUsers.map(async (user) => {
        baseCategories.forEach(async (name) => {
          return await prisma.category.create({
            data: {
              name,
              user: { connect: { id: user.id } },
            },
          });
        });
      }),
    );

    const bills = await Promise.all(
      savedUsers.map(async (user) => {
        const category = await prisma.category.findFirst({
          where: {
            userId: user.id,
          },
        });
        return await prisma.bill.create({
          data: {
            title: faker.commerce.productName(),
            amount: faker.datatype.number({ min: 100, max: 10000 }),
            paid: faker.datatype.boolean(),
            dueDate: faker.date.future(),
            category: { connect: { id: category.id } },
            user: { connect: { id: user.id } },
          },
        });
      }),
    );
  } catch (e) {
    console.error(e);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
