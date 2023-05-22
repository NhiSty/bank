
const { PrismaClient } = require('@prisma/client')
const express = require('express');

const router = express.Router();
const prisma = new PrismaClient();

router.get("/:id", async (req, res) => {
	try {

		const { id } = req.params

		const user = await prisma.user.findUnique({ where: { id },include: { accounts: true } });


		if (!user) {
			return res.send({ status: 404, body: { message: 'Données incorrect' } });
		}

		return res.send({ status: 200, body: { user } });

	} catch (error) {
		return res.status(502).json({ error: "Something went wrong" });
	}
});

router.post("/accounts/credit", async (req, res) => {
	try {

		const {idUser, idAccount, montant} = req.body;

		const user = await prisma.user.findUnique({ where: { id:idUser },include: { accounts: true } });

		const account = await prisma.account.findUnique({where: {id: idAccount}})

		const currentMoney = account.money

		const newMoney = currentMoney + montant

		const result = await prisma.account.update({
			where: {
				id: idAccount
			},
			data: {
				money: newMoney
			},
		})

		return res.json(result)

	} catch (error) {
		console.log(error)

		return res.status(502).json({ error: "Something went wrong" });
	}
});

module.exports = router;

router.get('/:id/accounts', async (req, res) => {
	try {
		const { id } = req.params

		const accounts = await prisma.account.findMany({ where: { userId: id } });

		if (accounts.length === 0) {
			return res.send({ status: 404, body: { message: 'Données incorrect' } });
		}

		return res.send({ status: 200, body: { accounts } });

	}
	catch (error) {
		return res.status(502).json({ error: "Something went wrong" });
	}
});
