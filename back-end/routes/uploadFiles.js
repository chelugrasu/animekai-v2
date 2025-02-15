const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

// Create multer storage for header photos
const headerPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'src', 'assets', 'headerPhotos');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Create multer storage for poster photos
const posterPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'src', 'assets', 'posterPhotos');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Create multer instances for header and poster photos
const headerPhotoUpload = multer({ storage: headerPhotoStorage });
const posterPhotoUpload = multer({ storage: posterPhotoStorage });

// Handle file uploads for header photos
router.post('/headerPhotos', headerPhotoUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  return res.status(200).send('Header photo uploaded successfully');
});

// Handle file uploads for poster photos
router.post('/posterPhotos', posterPhotoUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  return res.status(200).send('Poster photo uploaded successfully');
});

module.exports = router;
