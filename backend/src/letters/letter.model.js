const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileName: String,
  fileUrl: String,          
  downloadUrl: String,      
  driveFileId: String,    
  suspended: { type: Boolean, default: false },  
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Letter', letterSchema);
