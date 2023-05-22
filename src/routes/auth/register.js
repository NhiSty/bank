const { PrismaClient } = require('@prisma/client')
const express = require('express');
const validator = require('validator');
const argon2 = require('argon2');

const prisma = new PrismaClient()

const router = express.Router();

router.post("/", async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!validator.isEmail(email) || !password) {
            return res.status(400).json({ error: "Veuillez spécifier un email correcte" });
        }

        const user = await prisma.user.create({
            data: {
                email,
                password: await argon2.hash(password),
            }
        });

        if (user) {
            return res.status(200).json({
                data: user,
            });
        }



        return res.status(502).json({ error: ["No data found"] });


    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }

});


module.exports = router;
