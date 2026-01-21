const { google } = require('googleapis');

// Replace with your actual credentials
const CLIENT_ID = '1010540065764-nclmkuqj2j71n3uepsmpokokilck9h69.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:5000/oauth2callback';


const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// 👇 The scope for Drive file access
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent', // <-- Important: ensures refresh_token is returned
});

console.log('Authorize this app by visiting this url:\n', authUrl);

// After visiting the URL and granting access,
// Google will redirect you to http://localhost:3000/oauth2callback?code=XXXX

// Paste the code below after you get it:
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\nEnter the code from that page here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Successfully generated tokens:\n');
    console.log(JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.error('❌ Error retrieving access token', error.message);
  }
  rl.close();
});
