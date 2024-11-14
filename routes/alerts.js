const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.get('/alerts', (req, res) => {
    const drugs = [
        { name: "Paracetamol", stock: 15, threshold: 20 },
        { name: "Ibuprofen", stock: 50, threshold: 30 },
        { name: "Amoxicillin", stock: 5, threshold: 10 },
        { name: "Insulin", stock: 60, threshold: 50 }
    ];
    res.render('alerts', { drugs });
});

router.post('/send-email-alert', (req, res) => {
    const { drugName } = req.body;
    // Email alert logic
});

module.exports = router;
