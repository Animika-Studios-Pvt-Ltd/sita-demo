const express = require('express');
const router = express.Router();
const fileEditorController = require('./file-editor.controller');
// Add auth middleware here if needed (e.g. verifyAdmin)

router.get('/files/:fileKey', fileEditorController.readFile);
router.post('/files/:fileKey', fileEditorController.writeFile);

module.exports = router;
