import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/designs');
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

// ✅ Get all designs
router.get('/', async (req, res) => {
  try {
    const db = await databaseConnectionPromise;
    const [data] = await db.query('SELECT * FROM save_design');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// ✅ Get a design by ID
router.get('/designs/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const db = await databaseConnectionPromise;
    const [rows]: any = await db.query(
      `SELECT * FROM save_design WHERE id = ?`,
      [id],
    );

    if (rows.length > 0) {
      res.json({ status: 'success', design: rows[0] });
    } else {
      res.status(404).json({ status: 'error', message: 'Design not found' });
    }
  } catch (error) {
    console.error('Error fetching design:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch design' });
  }
});

router.put(
  '/update-suggestions/:id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { isSuggestion } = req.body;

      if (isSuggestion === undefined) {
        res.status(400).json({ error: 'Missing isSuggestion value' });
        return;
      }

      const db = await databaseConnectionPromise;
      const [result]: any = await db.query(
        'UPDATE save_design SET isSuggestion = ? WHERE saveDesignID = ?',
        [isSuggestion, id],
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Design not found' });
        return;
      }

      res.json({
        message: 'Suggestion status updated successfully',
        status: 'success',
      });
    } catch (err) {
      console.error('Error updating suggestion:', err);
      res
        .status(500)
        .json({ status: 'error', message: 'Failed to update suggestion' });
    }
  },
);

router.post(
  '/create',
  upload.single('design_image'),
  async (req: Request, res: Response): Promise<void> => {
    const { designName, designData, user_id, isSuggestion } = req.body;
    const designImage = req.file
      ? `uploads/designs/${req.file.filename}`
      : null;

    if (!designName || !designData || !designImage) {
      res
        .status(400)
        .json({ status: 'error', message: 'Missing required fields' });
      return;
    }

    try {
      const db = await databaseConnectionPromise;
      const [result]: any = await db.query(
        `INSERT INTO save_design (designName, designPath, designData, created_at, user_id, isSuggestion) VALUES (?, ?, ?, NOW(), ?, ?)`,
        [designName, designImage, designData, user_id, isSuggestion],
      );

      res.json({ status: 'success', saveDesignID: result.insertId });
    } catch (error) {
      console.error('Error saving design:', error);
      res
        .status(500)
        .json({ status: 'error', message: 'Failed to save design' });
    }
  },
);

router.put(
  '/update/:id',
  upload.single('design_image'),
  async (req: Request, res: Response) => {
    const { designName, designData, user_id, isSuggestion } = req.body;
    const { id } = req.params;
    const designImage = req.file
      ? `uploads/designs/${req.file.filename}`
      : null;

    if (!designName || !designData) {
      res
        .status(400)
        .json({ status: 'error', message: 'Missing required fields' });
      return;
    }

    try {
      const db = await databaseConnectionPromise;
      let query = `
        UPDATE save_design 
        SET designName = ?, designData = ?, user_id = ?, isSuggestion = ?
        WHERE saveDesignID = ?
      `;
      let values = [designName, designData, user_id, isSuggestion, id];

      if (designImage) {
        query = `
          UPDATE save_design 
          SET designName = ?, designPath = ?, designData = ?, user_id = ?, isSuggestion = ?
          WHERE saveDesignID = ?
        `;
        values = [
          designName,
          designImage,
          designData,
          user_id,
          isSuggestion,
          id,
        ];
      }

      await db.query(query, values);
      res.json({ status: 'success', message: 'Design updated successfully' });
    } catch (error) {
      console.error('Error updating design:', error);
      res
        .status(500)
        .json({ status: 'error', message: 'Failed to update design' });
    }
  },
);

router.delete(
  '/delete/:id',
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const db = await databaseConnectionPromise;
      const [results]: any = await db.query(
        'SELECT designPath FROM save_design WHERE saveDesignID = ?',
        [id],
      );

      if (results.length === 0) {
        res.status(404).json({ error: 'Design not found' });
        return;
      }

      const filePath = path.join(__dirname, '../', results[0].designPath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      await db.query('DELETE FROM save_design WHERE saveDesignID = ?', [id]);

      res.json({ message: 'Design deleted successfully', status: 'success' });
    } catch (error) {
      console.error('Error deleting design:', error);
      res
        .status(500)
        .json({ status: 'error', message: 'Failed to delete design' });
    }
  },
);

export const designRouter = router;
