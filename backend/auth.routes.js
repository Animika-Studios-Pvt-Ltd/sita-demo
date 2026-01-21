const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/drive"];

// Redirect user to Google's OAuth consent screen
router.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Important for refresh token
    scope: SCOPES,
    prompt: 'consent', // Force to get refresh token every time
  });
  res.redirect(authUrl);
});

// Callback route for Google OAuth
router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code parameter');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // TODO: Save tokens.refresh_token securely (e.g., DB or environment)
    console.log('Refresh token:', tokens.refresh_token);

    // For now, just respond success
    res.send('Auth successful! You can close this tab.');
  } catch (err) {
    console.error('Failed to exchange code for tokens:', err);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
