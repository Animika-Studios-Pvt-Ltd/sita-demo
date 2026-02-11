const axios = require('axios');

async function testContactForm() {
    try {
        const response = await axios.post('http://localhost:5000/api/contact', {
            name: 'Test User',
            email: 'test@example.com',
            mobile: '1234567890',
            message: 'This is a test message from the verification script.'
        });

        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testContactForm();
