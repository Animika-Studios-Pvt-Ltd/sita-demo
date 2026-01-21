// uploadFileToDrive.js

const fs = require('fs');
const { google } = require('googleapis');
const mime = require('mime');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

async function uploadFileToDrive(filePath, fileName) {
  try {
    const mimeType = mime.getType(filePath); // Auto-detect type from path

    const fileMetadata = {
      name: fileName,
      parents: [FOLDER_ID],
    };

    const media = {
      mimeType,
      body: fs.createReadStream(filePath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });

    const fileId = file.data.id;

await driveService.permissions.create({
  fileId,
  requestBody: {
    role: "reader",
    type: "anyone",
  },
}, (err, res) => {
  if (err) {
    console.error('Permission creation error:', err);
  } else {
    console.log('Permission created:', res.data);
  }
});


    return {
      url: `https://drive.google.com/uc?id=${fileId}`, // or use fileId directly
      mimeType,
    };
  } catch (error) {
    console.error('Upload to Google Drive failed:', error);
    throw error;
  }
}

module.exports = { uploadFileToDrive };
