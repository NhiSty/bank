
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

router.post("/:id/accounts/credit", async (req, res) => {
	try {

		const newUser = await prisma.user.create({
			data: {
			  email: 'elsa@prisma.io',
			  name: 'Elsa Prisma',
			},
		  })

		return res.send({ status: 200, body: { newUser } });

	} catch (error) {
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
