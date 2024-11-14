const express = require('express');
const router = express.Router();

router.get('/stock', (req, res) => {
    const medicines = [
        { name: 'Paracetamol', batchNo: 'BCH001', expiryDate: '12/2025', stock: 50 },
        { name: 'Amoxicillin', batchNo: 'BCH002', expiryDate: '06/2024', stock: 30 },
        { name: 'Cetrizine', batchNo: 'BCH003', expiryDate: '09/2023', stock: 20 },
    ];
    res.render('stock', { medicines });
});

module.exports = router;
