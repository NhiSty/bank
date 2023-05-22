
const { PrismaClient } = require('@prisma/client')
// eslint-disable-next-line import/extensions
const express = require('express');
const {DoNotHaveFiveAccount, addMoneyToAccount} = require('../../../validator/userValidator')

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

		const { id,money,accountId } = req.body


		const user = await prisma.user.findUnique({ where: { id },include: { accounts: true } });

		const value = await addMoneyToAccount(user, accountId, money)

		console.log(value)

		return res.send({ status: 200, body:  value});

	} catch (error) {
		return res.status(502).json({ error: "Something went wrong" });
	}
});

module.exports = router;
