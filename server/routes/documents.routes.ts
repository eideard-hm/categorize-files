import { Router } from 'express';
import multer from 'multer';

import { documentController } from '../controllers/document.controller';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    const ok = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ].includes(file.mimetype);
    if (ok) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  },
});

router.post('/upload', upload.single('file'), documentController.handleUpload);

export default router;
