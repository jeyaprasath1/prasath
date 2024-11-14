const express = require('express');
const router = express.Router();

router.get('/transit', (req, res) => {
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

module.exports = router;
