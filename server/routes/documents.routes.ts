import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Process the uploaded file
  res.status(200).send('File uploaded successfully.');
});

export default router;
