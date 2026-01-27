const http = require('http');

const bookingId = '69785c06184673351d678dac'; // Assuming this is the correct ID
const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/events/test-email/${bookingId}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
