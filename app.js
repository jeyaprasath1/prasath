

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const http = require('http');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const socketIoclient = require('socket.io-client');
dotenv.config(); // Load environment variables from .env

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
require('dotenv').config();

let orders = {
    '12345': { id: '12345', customer: 'John Doe', product: 'Laptop', status: 'In Transit', location: { lat: 51.505, lng: -0.09 } },
    // other orders...
};

io.on('connection', (socket) => {
    console.log('New client connected');

    // Sending location updates for an order every 5 seconds (for example)
    setInterval(() => {
        orders['12345'].location = {
            lat: orders['12345'].location.lat + 0.001, // sample update
            lng: orders['12345'].location.lng + 0.001,
        };
        socket.emit('locationUpdate', { orderId: '12345', location: orders['12345'].location });
    }, 5000);

    socket.on('disconnect', () => console.log('Client disconnected'));
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Define a schema and model for Student
const studentSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    resetToken: String,
    resetTokenExpiration: Date
});


const Student = mongoose.model('Student', studentSchema);
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' },
});
const User = mongoose.model('User', userSchema);
// Set up view engine and middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
    }
});

// Routes
app.get('/index', (req, res) => {
    res.render('index'); // Render landing page
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password'); // Render forgot-password.ejs view
});

// Route to handle the forgot password request
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(404).send('No user found with this email.');
        }

        // Generate a reset token
        const token = crypto.randomBytes(32).toString('hex');

        // Save the token and expiration time to the user
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send the reset email
        const resetUrl = `http://localhost:4000/forgot-password/${token}`;
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        });

        res.send('Password reset email sent. Please check your inbox.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request.');
    }
});
app.post('/setting', async (req, res) => {
    const { username, password, confirmPassword, email, role } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await Student.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists.');
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match.');
        }

        // Hash the password and create a new Student
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({ username, password: hashedPassword, email, role });

        // Save the new student to the database
        await newStudent.save();
        res.send("Registration successful! Please <a href='/login'>login</a>.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user.");
    }
});

// Route to render the reset password page
app.get('/forgot-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await Student.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).send('Invalid or expired token.');
        }

        res.render('reset-password', { token }); // Render reset-password.ejs with the token
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request.');
    }
});

// Route to handle registration
app.post('/register', async (req, res) => {
    const { uname1, upswd1, confirmPassword, email } = req.body;

    try {
        const existingUser = await Student.findOne({ username: uname1 });
        if (existingUser) {
            return res.status(400).send('Username already exists.');
        }

        if (upswd1 !== confirmPassword) {
            return res.status(400).send('Passwords do not match.');
        }

        const hashedPassword = await bcrypt.hash(upswd1, 10);
        const newStudent = new Student({ username: uname1, password: hashedPassword, email });

        await newStudent.save();
        res.send("Registration successful! Please <a href='/login'>login</a>.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user.");
    }
});

// Route for handling login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Student.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid username or password.');
        }

        // If login is successful, redirect to home page
        res.redirect('/home'); // Redirects to the home route
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in.");
    }
});

// Route to handle the password reset
app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await Student.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).send('Invalid or expired token.');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined; // Clear the token
        user.resetTokenExpiration = undefined; // Clear the expiration time
        await user.save();

        res.send('Password has been reset successfully. You can now <a href="/login">login</a>.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error resetting password.');
    }
});
app.post('/setting', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).send("User account created successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding user.");
    }
});


// Route to serve the home page
app.get('/home', (req, res) => {
    const user = { username: 'John Doe' }; // Example data
    res.render('home', { user }); // Render home.ejs with user data
});

// Route to serve the inventory management page
app.get('/inventory', (req, res) => {
    const inventoryData = {
        excessStock: '10%',
        replenishmentEfficiency: '90%',
        acknowledgmentID: '#ACK654321',
        patientsProcessed: '200',
        lowStockAlerts: '3 Items',
    };
    res.render('inventory', { inventoryData });
});

// Route to serve the stock page
app.get('/stock', (req, res) => {
    const medicines = [
        { name: 'Paracetamol', batchNo: 'BCH001', expiryDate: '12/2025', stock: 50 },
        { name: 'Amoxicillin', batchNo: 'BCH002', expiryDate: '06/2024', stock: 30 },
        { name: 'Cetrizine', batchNo: 'BCH003', expiryDate: '09/2023', stock: 20 },
    ];

    res.render('stock', { medicines });
});

// Medical transit tracking route
app.get('/transit', (req, res) => {
    const transitData = {
        shipmentID: '#MED12345',
        origin: 'New York, NY',
        destination: 'Boston, MA',
        status: 'In Transit',
        eta: '3:30 PM, Oct 24',
        currentLocation: 'On Route to Boston, MA',
        vehicleID: '#TRUCK7890',
        driver: 'John Doe',
        lastUpdated: '2:30 PM, Oct 24'
    };
    
    res.render('transit', { transitData });
});

// Stock alert route
app.get('/alerts', (req, res) => {
    const drugs = [
        { name: "Paracetamol", stock: 15, threshold: 20 },
        { name: "Ibuprofen", stock: 50, threshold: 30 },
        { name: "Amoxicillin", stock: 5, threshold: 10 },
        { name: "Insulin", stock: 60, threshold: 50 }
    ];

    res.render('alerts', { drugs });
});

// Route to send stock alert email notifications
app.post('/send-email-alert', (req, res) => {
    const { drugName } = req.body;

    // Send an email alert if stock is low
    transporter.sendMail({
        to: process.env.ADMIN_EMAIL, // Replace with the admin email
        subject: `Stock Alert: Low stock for ${drugName}`,
        text: `The stock for ${drugName} is running low. Please replenish soon.`,
    }, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email');
        }
        res.json({ message: 'Email alert sent successfully.' });
    });
});

// Route for logging out
app.get('/logout', (req, res) => {
    res.redirect('logout'); // Redirect to login page on logout
});

// Add services route
app.get('/services', (req, res) => {
    res.render('services'); // Render services.ejs
});

// Order tracking route
app.get('/order-tracking', (req, res) => {
    res.render('order-tracking'); // Render order-tracking.ejs
});

app.get('/realtime', (req, res) => {
    res.render('realtime');
     // Render real-time tracking page
});
app.get('/order', (req, res) => {
    res.render('order');
     // Render real-time tracking page
});
app.get('/card', (req, res) => {
    res.render('card');
     // Render real-time tracking page
});
app.get('/analytics', (req, res) => {
    res.render('analytics');
     // Render real-time tracking page
});
app.get('/setting', (req, res) => {
    res.render('setting');
     // Render real-time tracking page
});
app.get('/complaint', (req, res) => {
    res.render('complaint');
     // Render real-time tracking page
});

// Start the server
// இந்த வரியை மாற்றவும்:
// app.listen(4000, () => {

// இப்படி மாற்றவும்:
server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});

