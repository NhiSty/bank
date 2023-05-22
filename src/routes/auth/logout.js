
const express = require('express');

const router = express.Router();



router.get("/", async (req, res) => {
    return res.clearCookie('token').send({ status: 200, body: { message: 'Déconnexion réussie' } });
});

module.exports = router;