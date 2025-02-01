const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

router.post('/send-email', (req, res) => {
    const { drugName } = req.body;

    // Ensure environment variables are being loaded
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(500).json({ success: false, message: 'Environment variables not set' });
    }

    // Configure the transporter using environment variables
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Gmail as the service
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS  // Your email password or app-specific password
        },
        logger: true,  // Enable logging for debugging
        debug: true,   // Enable debugging output for more detailed information
        tls: {
            rejectUnauthorized: false // For handling SSL/TLS issues (optional)
        }
    });

    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'prasathdhanam66@gmail.com', // Change to your recipient email
        subject: `Low Stock Alert: ${drugName}`,
        text: `The stock for ${drugName} is critically low. Please take immediate action.`
    };

    // Send the email and handle potential errors
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error while sending email:', error.message);
            return res.status(500).json({ success: false, message: `Failed to send email: ${error.message}` });
        }
        console.log('Email sent successfully:', info);
        res.json({ success: true, message: 'Email sent successfully.', info });
    });
});

module.exports = router;
