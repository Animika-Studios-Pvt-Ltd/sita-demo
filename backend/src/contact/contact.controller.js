const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Initialize OAuth2 client for Gmail API
const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

// Create Gmail API client
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

/**
 * Send email using Gmail API (Reusing logic from emailService for consistency, but kept local to avoid circular deps if any)
 * ideally this should be imported from emailService if exported properly
 */
async function sendEmail({ to, subject, html, replyTo }) {
    try {
        const from = process.env.EMAIL_USER;
        const storeName = process.env.STORE_NAME || 'Sita Contact Form';

        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `From: ${storeName} <${from}>`,
            `To: ${to}`,
            `Subject: ${utf8Subject}`,
            replyTo ? `Reply-To: ${replyTo}` : '',
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=utf-8',
            '',
            html
        ];

        const message = messageParts.filter(part => part !== '').join('\n');

        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        return { success: true, messageId: result.data.id };
    } catch (error) {
        console.error('❌ Gmail API Error:', error.message);
        throw error;
    }
}

const submitContactForm = async (req, res) => {
    try {
        const { name, email, mobile, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required." });
        }

        const adminEmail = process.env.ADMIN_EMAIL;

        // Email to Admin
        const adminHtml = `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

        await sendEmail({
            to: adminEmail,
            subject: `New Contact Form Submission from ${name}`,
            html: adminHtml,
            replyTo: email
        });

        // Confirmation Email to User
        const userHtml = `
      <h3>Thank you for contacting us, ${name}!</h3>
      <p>We have received your message and will get back to you shortly.</p>
      <br>
      <p><strong>Your Message:</strong></p>
      <p>${message}</p>
    `;

        await sendEmail({
            to: email,
            subject: `We received your message - Sita`,
            html: userHtml
        });

        res.status(200).json({ message: "Message sent successfully!" });

    } catch (error) {
        console.error("Contact Form Error:", error);
        res.status(500).json({ message: "Failed to send message." });
    }
};

module.exports = {
    submitContactForm
};
