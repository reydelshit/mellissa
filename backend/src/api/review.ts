import { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// CREATE rating
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  const { rating, reviewText, user_id, product_id, fullname } = req.body;

  if (rating == null || !reviewText || !user_id || !product_id || !fullname) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      `INSERT INTO ratings (rating, reviewText, fullname, created_at, user_id, product_id)
         VALUES (?, ?, ?, NOW(), ?, ?)`,
      [rating, reviewText, fullname, user_id, product_id],
    );

    res.json({
      message: 'Rating submitted successfully',
      rating_id: result.insertId,
      status: 'success',
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ error: 'Failed to create rating', details: error });
  }
});

// READ all ratings
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const connection = await databaseConnectionPromise;
    const sqlQuery = `
          WITH ranked_reviews AS (
        SELECT
          r.rating_id,
          p.product_name AS productName,
          so.storeName AS storeName,
          r.fullname AS customerName,
          r.reviewText AS reviewText,
          r.rating AS rating,
          r.created_at AS createdAt,
          r.user_id,
          so.storeOwner_id,
          ROW_NUMBER() OVER (
            PARTITION BY r.user_id, so.storeOwner_id
            ORDER BY r.rating_id DESC
          ) AS rn
        FROM ratings r
        JOIN products p ON r.product_id = p.product_id
        JOIN store_owner so ON p.storeOwner_id = so.storeOwner_id
      )

      SELECT
        productName,
        storeName,
        customerName,
        reviewText,
        rating,
        createdAt
      FROM ranked_reviews
      WHERE rn = 1
      ORDER BY storeName, customerName;

      `;

    console.log(sqlQuery);

    const [data]: any = await connection.query(sqlQuery);

    res.json(data);
  } catch (err) {
    console.error('Fetch all ratings error:', err);
    res.status(500).json({ error: 'Database fetch failed', details: err });
  }
});

// READ single rating by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM ratings WHERE rating_id = ?',
      [id],
    );

    if (data.length === 0) {
      res.status(404).json({ error: 'Rating not found' });
      return;
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Fetch rating error:', err);
    res.status(500).json({ error: 'Fetch failed', details: err });
  }
});

// UPDATE rating
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { rating, reviewText, user_id, product_id } = req.body;

  if (rating == null || !reviewText || !user_id || !product_id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      `UPDATE ratings 
       SET rating = ?, reviewText = ?, user_id = ?, product_id = ? 
       WHERE rating_id = ?`,
      [rating, reviewText, user_id, product_id, id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Rating not found' });
      return;
    }

    res.json({
      message: 'Rating updated successfully',
      status: 'success',
    });
  } catch (err) {
    console.error('Update rating error:', err);
    res.status(500).json({ error: 'Update failed', details: err });
  }
});

// DELETE rating
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'DELETE FROM ratings WHERE rating_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Rating not found' });
      return;
    }

    res.json({
      message: 'Rating deleted successfully',
      status: 'success',
    });
  } catch (err) {
    console.error('Delete rating error:', err);
    res.status(500).json({ error: 'Delete failed', details: err });
  }
});

export const ratingRouter = router;
