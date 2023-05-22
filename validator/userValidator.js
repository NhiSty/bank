const { PrismaClient } = require('@prisma/client');

function DoNotHaveFiveAccount(id) {
	const prisma = new PrismaClient();
	const user = prisma.user.findUnique({ where: { id }, include: { accounts: true } });

	return user.accounts.length === 5;
}

async function addMoneyToAccount(user, accountId, money) {
	const prisma = new PrismaClient();

	const account = await prisma.account.findUnique({ where: { id: accountId } });

	if (!account) {
		return { status: 404, body: { message: 'Données incorrect' } };
	}

	if (user.accounts.filter((acc) => acc.id === accountId).length === 0) {
		return { status: 404, body: { message: 'This is not your account !' } };
	}

	if (account.money + money > 1000) {
		// add enought money to reach 1000 and return the rest
		const rest = account.money + money - 1000;
		account.money = 1000;
		await prisma.account.update({ where: { id: accountId }, data: { money: account.money } });

		return { status: 200, body: { message: 'You have reach the limit of 1000€', rest } };

	}

	account.money += money;
	await prisma.account.update({ where: { id: accountId }, data: { money: account.money } });

	return { status: 200, body: { message: `You added money to your account, your new balance is ${account.money}` } };


}

module.exports = { DoNotHaveFiveAccount, addMoneyToAccount };
