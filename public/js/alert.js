function sendEmailAlert(drugName) {
    fetch('/send-email-alert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ drugName })
    })
    .then(response => {
        if (response.ok) {
            alert(`Email alert for ${drugName} has been sent to the admin.`);
        } else {
            alert('Failed to send email alert.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error sending alert. Please try again later.');
    });
}