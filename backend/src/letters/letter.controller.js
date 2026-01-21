const fs = require('fs');
const Letter = require('./letter.model');
const { google } = require('googleapis');

// Load env variables from .env
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// OAuth2 Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
});


// Upload to Google Drive
async function uploadFileToDrive(filePath, fileName) {
  await oauth2Client.getAccessToken();
  const driveService = google.drive({ version: 'v3', auth: oauth2Client });


  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID],
  };

  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(filePath),
  };

  const response = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  const fileId = response.data.id;

  // Make the file public
  await driveService.permissions.create({
    fileId: fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // Return both view and download URLs
  return {
    viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
    downloadUrl: `https://drive.google.com/uc?id=${fileId}&export=download`,
    fileId,
  };
}

// Controller for uploading
const uploadLetter = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filePath = file.path;
    const fileName = file.originalname;

    const { viewUrl, downloadUrl, fileId } = await uploadFileToDrive(filePath, fileName);

    const letter = new Letter({
      title,
      fileUrl: viewUrl,         // used for viewing
      downloadUrl,              // new field for downloading
      fileName,
      driveFileId: fileId,      // optional: for deletion or tracking
    });

    await letter.save();

    // Optionally delete file after upload to save space
    fs.unlinkSync(filePath);

    res.status(201).json({ success: true, letter });
  } catch (error) {
    console.error('Upload to Google Drive failed:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

// Controller for getting all letters
const getAllLetters = async (req, res) => {
  try {
    const letters = await Letter.find().sort({ uploadedAt: -1 });
    res.status(200).json(letters);
  } catch (error) {
    console.error('Fetching letters failed:', error);
    res.status(500).json({ message: 'Failed to fetch letters' });
  }
};
const toggleSuspendLetter = async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) return res.status(404).json({ message: 'Letter not found' });

    letter.suspended = !letter.suspended;
    await letter.save();

    res.status(200).json({ message: `Letter ${letter.suspended ? 'suspended' : 'unsuspended'}`, letter });
  } catch (error) {
    console.error('Toggle suspend failed:', error);
    res.status(500).json({ message: 'Toggle suspend failed' });
  }
};

module.exports = {
  uploadLetter,
  getAllLetters,
  toggleSuspendLetter,
};
