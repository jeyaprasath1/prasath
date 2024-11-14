const express = require('express');
const router = express.Router();

router.get('/inventory', (req, res) => {
    const inventoryData = {
        excessStock: '10%',
        replenishmentEfficiency: '90%',
        acknowledgmentID: '#ACK654321',
        patientsProcessed: '200',
        lowStockAlerts: '3 Items',
    };
    res.render('inventory', { inventoryData });
});

module.exports = router;
