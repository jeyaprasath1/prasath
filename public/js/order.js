const stripe = Stripe('your-public-key');
        const elements = stripe.elements();
        const card = elements.create('card');
        card.mount('#card-element');

        document.getElementById('payment-method').addEventListener('change', function() {
            const creditCardSection = document.getElementById('credit-card-section');
            const upiSection = document.getElementById('upi-section');
            const netbankingSection = document.getElementById('netbanking-section');

            creditCardSection.style.display = 'none';
            upiSection.style.display = 'none';
            netbankingSection.style.display = 'none';

            if (this.value === 'credit_card') {
                creditCardSection.style.display = 'block';
            } else if (this.value === 'upi') {
                upiSection.style.display = 'block';
            } else if (this.value === 'netbanking') {
                netbankingSection.style.display = 'block';
            }
        });

        document.getElementById('generate-qr').addEventListener('click', function() {
            const upiId = document.getElementById('upi-id').value;
            if (upiId) {
                document.getElementById('qr-code').innerHTML = '';
                const upiUri = `upi://pay?pa=${upiId}&pn=YourBusinessName&cu=INR`;
                new QRCode(document.getElementById('qr-code'), {
                    text: upiUri,
                    width: 128,
                    height: 128
                });
            } else {
                alert('Please enter a valid UPI ID');
            }
        });

        document.getElementById('order-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            // Add submission logic
            document.getElementById('success-message').style.display = 'block';
            setTimeout(() => {
                 window.location.href = 'home';
            }, 2000);
        });