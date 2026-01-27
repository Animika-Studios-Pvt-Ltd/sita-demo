const http = require('http');

const data = JSON.stringify({
    bookingId: '69785c06184673351d678dac',
    rating: 5,
    comment: 'Automated Test Rating - Verification'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/events/rate',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
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

req.write(data);
req.end();
