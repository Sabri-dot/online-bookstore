const multer = require('multer');
const path = require('path');

// Konfigurimi i storage - ku ruhen file-t dhe si emërtohen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'pdfs'));
  },
  filename: (req, file, cb) => {
    // Emri unik me timestamp + emri origjinal
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filter për lejimin vetëm të PDF-ve
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Lejohen vetëm file PDF'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
