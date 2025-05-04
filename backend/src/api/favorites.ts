import { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await databaseConnectionPromise;
    const [data] = await connection.query(`
      SELECT 
        store_owner.*, 
        favorite.favorites_id, 
        favorite.user_id, 
        favorite.store_id, 
        favorite.created_at AS favorite_created_at
      FROM favorite
      INNER JOIN store_owner 
        ON favorite.store_id = store_owner.storeOwner_id
    `);

    res.json(data);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// CREATE favorite item (with duplicate check)
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  const { user_id, store_id } = req.body;

  if (!user_id || !store_id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const connection = await databaseConnectionPromise;

    // First check if favorite already exists
    const [existing]: any = await connection.query(
      `SELECT favorites_id FROM favorite WHERE user_id = ? AND store_id = ?`,
      [user_id, store_id],
    );

    if (existing.length > 0) {
      res
        .status(400)
        .json({ error: 'This store is already in your favorites' });
      return;
    }

    const [result]: any = await connection.query(
      `INSERT INTO favorite (user_id, store_id, created_at)
       VALUES (?, ?, NOW())`,
      [user_id, store_id],
    );

    res.json({
      message: 'Favorite added successfully',
      favorites_id: result.insertId,
      status: 'success',
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string };

      if (dbError.code === 'ER_DUP_ENTRY') {
        res
          .status(400)
          .json({ error: 'This store is already in your favorites' });
        return;
      }
    }

    console.error('Create favorite error:', error);
    res
      .status(500)
      .json({ error: 'Failed to add to favorites', details: error });
  }
});

// DELETE favorite by user_id and store_id
router.delete('/', async (req: Request, res: Response): Promise<void> => {
  const { user_id, store_id } = req.body;

  if (!user_id || !store_id) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'DELETE FROM favorite WHERE user_id = ? AND store_id = ?',
      [user_id, store_id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Favorite item not found' });
      return;
    }

    res.json({ message: 'Favorite removed successfully', status: 'success' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Delete failed', details: error });
  }
});

export const favoritesRouter = router;
