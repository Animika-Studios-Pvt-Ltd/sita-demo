const fs = require('fs').promises;
const path = require('path');

// Whitelist allowed files for editing
// PATHS ARE RELATIVE TO THE BACKEND ROOT (where package.json is)
// we need to step out of backend to reach frontend
const ALLOWED_FILES = {
    'about': path.join(__dirname, '../../../frontend/src/pages/about/About.jsx'),
    'home': path.join(__dirname, '../../../frontend/src/pages/homepage/Homepage.jsx'),
    'contact': path.join(__dirname, '../../../frontend/src/pages/contact/Contact.jsx'),
    'privacy': path.join(__dirname, '../../../frontend/src/pages/privacy and disclaimer/PrivacyPolicy.jsx'),
    'disclaimer': path.join(__dirname, '../../../frontend/src/pages/privacy and disclaimer/Disclaimer.jsx'),
    // Services
    'ayurveda': path.join(__dirname, '../../../frontend/src/pages/services/Ayurveda-Nutrition.jsx'),
    'kosha': path.join(__dirname, '../../../frontend/src/pages/services/Kosha-Counseling.jsx'),
    'release': path.join(__dirname, '../../../frontend/src/pages/services/Release-Karmic-Patterns.jsx'),
    'soul': path.join(__dirname, '../../../frontend/src/pages/services/Soul-Curriculum.jsx'),
    'yoga': path.join(__dirname, '../../../frontend/src/pages/services/Yoga-Therapy.jsx'),
    // Sita Factor
    'consult-sita': path.join(__dirname, '../../../frontend/src/pages/sita factor/ConsultSita.jsx'),
    'engage-sita': path.join(__dirname, '../../../frontend/src/pages/sita factor/EngageSita.jsx'),
    'study-sita': path.join(__dirname, '../../../frontend/src/pages/sita factor/StudyWithSita.jsx'),
    // Workshops
    'corporate-training': path.join(__dirname, '../../../frontend/src/pages/workshops/Corporate-Training.jsx'),
    'group-sessions': path.join(__dirname, '../../../frontend/src/pages/workshops/Group-Sessions.jsx'),
    'private-sessions': path.join(__dirname, '../../../frontend/src/pages/workshops/Private-Sessions.jsx'),
    'shakthi-leadership': path.join(__dirname, '../../../frontend/src/pages/workshops/Shakthi-Leadership.jsx'),
    'teacher-training': path.join(__dirname, '../../../frontend/src/pages/workshops/Teacher-Training.jsx'),
};

exports.readFile = async (req, res) => {
    try {
        const { fileKey } = req.params;

        if (!ALLOWED_FILES[fileKey]) {
            return res.status(400).json({ message: 'Invalid file key' });
        }

        const filePath = ALLOWED_FILES[fileKey];
        const content = await fs.readFile(filePath, 'utf8');

        res.status(200).json({ content });
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ message: 'Failed to read file', error: error.message });
    }
};

exports.writeFile = async (req, res) => {
    try {
        const { fileKey } = req.params;
        const { content } = req.body;

        if (!ALLOWED_FILES[fileKey]) {
            return res.status(400).json({ message: 'Invalid file key' });
        }

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const filePath = ALLOWED_FILES[fileKey];

        // Write file
        await fs.writeFile(filePath, content, 'utf8');

        res.status(200).json({ message: 'File saved successfully' });
    } catch (error) {
        console.error('Error writing file:', error);
        res.status(500).json({ message: 'Failed to save file', error: error.message });
    }
};
