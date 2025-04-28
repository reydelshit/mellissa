import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// Set up multer storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/gallery');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// **UPLOAD Media (POST)**
router.post(
  '/upload',
  upload.single('media_image'), // Handles the file upload
  async (req: Request, res: Response): Promise<void> => {
    const { mediaName, storeOwner_id } = req.body;
    const mediaImage = req.file ? `uploads/gallery/${req.file.filename}` : null;

    if (!mediaName || !mediaImage || !storeOwner_id) {
      res
        .status(400)
        .json({ status: 'error', message: 'Missing required fields' });
      return;
    }

    try {
      const db = await databaseConnectionPromise;
      const [result]: any = await db.query(
        `INSERT INTO media_gallery (path, pathName, storeOwner_id, created_at) VALUES (?, ?, ?, NOW())`,
        [mediaImage, mediaName, storeOwner_id],
      );

      res.json({
        status: 'success',
        mediaId: result.insertId,
        mediaPath: mediaImage,
      });
    } catch (error) {
      console.error('Error saving media:', error);
      res
        .status(500)
        .json({ status: 'error', message: 'Failed to save media' });
    }
  },
);

// **GET All Media (GET)**
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await databaseConnectionPromise;
    const [data]: any = await db.query(
      `SELECT * FROM media_gallery ORDER BY created_at DESC`,
    );

    res.json({ status: 'success', media: data });
  } catch (error) {
    console.error('Error fetching media gallery:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch media gallery' });
  }
});

// **DELETE Media (DELETE)**
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const db = await databaseConnectionPromise;

    // First, fetch the file path to delete from the folder
    const [data]: any = await db.query(
      `SELECT path FROM media_gallery WHERE media_id = ?`,
      [id],
    );

    if (data.length === 0) {
      res.status(404).json({ status: 'error', message: 'Media not found' });
      return;
    }

    const filePath = path.join(__dirname, '../', data[0].path);

    // Delete file from filesystem
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Now delete from the database
    const [result]: any = await db.query(
      `DELETE FROM media_gallery WHERE media_id = ?`,
      [id],
    );

    if (result.affectedRows === 0) {
      res
        .status(404)
        .json({ status: 'error', message: 'Media not found in database' });
      return;
    }

    res.json({ status: 'success', message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to delete media' });
  }
});

export const mediaGalleryRouter = router;
