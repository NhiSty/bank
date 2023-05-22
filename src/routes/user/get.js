
const { PrismaClient } = require('@prisma/client')
const express = require('express');

const router = express.Router();
const prisma = new PrismaClient();

router.get("/:id", async (req, res) => {
	try {

		const { id } = req.params

		const user = await prisma.user.findUnique({ where: { id } });

		if (!user) {
			return res.send({ status: 404, body: { message: 'Données incorrect' } });
		}

		return res.send({ status: 200, body: { user } });

	} catch (error) {
		return res.status(502).json({ error: "Something went wrong" });
	}
});

module.exports = router;