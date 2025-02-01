// Language data object to hold translations for different languages
const translations = {
    'en-US': {
        title: "MEDIX - Drug Tracking System",
        dashboard: "Dashboard",
        inventoryManagement: "Inventory Management",
        realTimeTracking: "Real-Time Tracking",
        orderProcessing: "Order Processing",
        orderCard: "Order Card",
        manufacture: "Manufacture",
        analyticsReports: "Analytics & Reports",
        settings: "Settings",
        logout: "Logout",
        totalStock: "Total Stock",
        inTransit: "In Transit",
        alerts: "Alerts",
        services: "Services",
        userNotifications: "User Notifications",
        stockLevels: "Stock Levels Over Time",
        notificationOrderShipped: "Order #12345 has been shipped.",
        notificationExpiredItems: "5 Expired Items in your inventory.",
        notificationNewOrder: "New order placed successfully!",
        viewOrder: "View Order",
        checkAlerts: "Check Alerts",
        goToOrderProcessing: "Go to Order Processing",
        totalCheck: "Total Check",
        transitCheck: "Transit Check",
        stockAlerts: "Stock Alerts",
        servicesText: "Order Tracking, Inventory Management"
    },
    'ta': {
        title: "மெடிக்ஸ் - மருந்துப் பதிவு அமைப்பு",
        dashboard: "டாஷ்போர்ட்",
        inventoryManagement: "கையிருப்புக்குழு மேலாண்மை",
        realTimeTracking: "உண்மைக் கால கண்காணிப்பு",
        orderProcessing: "அரிசி செயலாக்கம்",
        orderCard: "அரிசி அட்டை",
        complaint: "புகார்",
        analyticsReports: "அணுகுமுறை & அறிக்கைகள்",
        settings: "அமைப்புகள்",
        logout: "வெளியேறு",
        totalStock: "மொத்த கையிருப்பு",
        inTransit: "இந்நிலையில்",
        alerts: "எச்சரிக்கைகள்",
        services: "சேவைகள்",
        userNotifications: "பயனர் அறிவிப்புகள்",
        stockLevels: "கையிருப்பின் அளவுகள் காலப்பதிவில்",
        notificationOrderShipped: "அரிசி #12345 கப்பல் அனுப்பப்பட்டது.",
        notificationExpiredItems: "உங்கள் கையிருப்பில் 5 காலாவதியான பொருட்கள்.",
        notificationNewOrder: "புதிய ஆர்டரை வெற்றிகரமாக வைத்துள்ளது!",
        viewOrder: "ஆர்டரை பாருங்கள்",
        checkAlerts: "எச்சரிக்கைகளை சோதிக்கவும்",
        goToOrderProcessing: "ஆர்டரை செயலாக்கத்துக்கு செல்லவும்",
        totalCheck: "மொத்தம் சரிபார்க்க",
        transitCheck: "பரிமாற்ற சரிபார்க்க",
        stockAlerts: "கையிருப்பு எச்சரிக்கைகள்",
        servicesText: "ஆர்டரை கண்காணிக்கவும், கையிருப்புக்குழு மேலாண்மை"
    }
    // Add more languages here as needed
};

// Function to change the language of the page
function changeLanguage() {
    const selectedLanguage = document.getElementById('language-dropdown').value;

    // Update title
    document.title = translations[selectedLanguage].title;

    // Update dashboard header
    document.querySelector('.header h1').innerText = translations[selectedLanguage].title;

    // Update sidebar menu items
    document.querySelector('.sidebar ul li:nth-child(1) a').innerText = translations[selectedLanguage].dashboard;
    document.querySelector('.sidebar ul li:nth-child(2) a').innerText = translations[selectedLanguage].inventoryManagement;
    document.querySelector('.sidebar ul li:nth-child(3) a').innerText = translations[selectedLanguage].realTimeTracking;
    document.querySelector('.sidebar ul li:nth-child(4) a').innerText = translations[selectedLanguage].orderProcessing;
    document.querySelector('.sidebar ul li:nth-child(5) a').innerText = translations[selectedLanguage].orderCard;
    document.querySelector('.sidebar ul li:nth-child(6) a').innerText = translations[selectedLanguage].complaint;
    document.querySelector('.sidebar ul li:nth-child(7) a').innerText = translations[selectedLanguage].analyticsReports;
    document.querySelector('.sidebar ul li:nth-child(8) a').innerText = translations[selectedLanguage].settings;
    document.querySelector('.sidebar ul li:nth-child(9) a').innerText = translations[selectedLanguage].logout;

    // Update dashboard cards
    document.querySelector('.main-content h1').innerText = translations[selectedLanguage].dashboard;
    document.getElementById('totalStock').innerText = translations[selectedLanguage].totalStock + ": 2,345 Items";
    document.getElementById('shipments').innerText = translations[selectedLanguage].inTransit + ": 56 Shipments";
    document.getElementById('alerts').innerText = translations[selectedLanguage].alerts + ": 5 Expired Items";
    document.getElementById('services').innerText = translations[selectedLanguage].servicesText;

    // Update notifications
    const notifications = document.querySelectorAll('.notification-item');
    notifications[0].innerHTML = translations[selectedLanguage].notificationOrderShipped + ' <a href="/order" class="notification-link">' + translations[selectedLanguage].viewOrder + '</a>';
    notifications[1].innerHTML = translations[selectedLanguage].notificationExpiredItems + ' <a href="/alerts" class="notification-link">' + translations[selectedLanguage].checkAlerts + '</a>';
    notifications[2].innerHTML = translations[selectedLanguage].notificationNewOrder + ' <a href="/order" class="notification-link">' + translations[selectedLanguage].goToOrderProcessing + '</a>';

    // Update analytics section header
    document.querySelector('.analytics h2').innerText = translations[selectedLanguage].stockLevels;
}

// Initial call to set default language
changeLanguage();

// home.js
document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('stockChart').getContext('2d');

    const stockData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [{
            label: 'Stock Levels',
            data: [2000, 2200, 2100, 2300, 2400], // Replace with actual data
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: true,
        }]
    };

    const stockChart = new Chart(ctx, {
        type: 'line',
        data: stockData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Items'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Stock Levels Over Time'
                }
            }
        }
    });
});
