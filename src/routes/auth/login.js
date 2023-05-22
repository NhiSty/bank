
const { PrismaClient } = require('@prisma/client')
const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const router = express.Router();
const prisma = new PrismaClient();


router.post("/", async (req, res) => {
	try {

		const { email, password } = req.body


		if (!email || !password) {
			return res.send({ status: 401, body: { message: 'Vous devez indiquer un email et un mot de passe !' } });
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({ error: "Données incorrect" });
		}


		const user = await prisma.user.findUnique({ where: { email } });

		if (!process.env.JWT_SECRET) {
			return res.send({ status: 500, body: { message: 'Server error occured' } });
		}

		if (!user) {
			return res.send({ status: 404, body: { message: 'Données incorrect' } });
		}

		try {
			if (!(await argon2.verify(user.password, password))) {
				return res.send({ status: 404, body: { message: 'Données incorrect' } });
			}
		} catch (error) {
			return res.send({ status: 404, body: { message: 'Données incorrect' } });
		}

		const { ...body } = user;


		const sign = jwt.sign(body, process.env.JWT_SECRET);

		return res.cookie('token', sign, { httpOnly: false, secure: false }, { expires: new Date(Date.now() + 9999999) }).send({ status: 200, body: { user, token: sign } });

	} catch (error) {
		return res.status(502).json({ error: "Something went wrong" });
	}

});

module.exports = router;