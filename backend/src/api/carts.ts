import { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// CREATE cart item
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || quantity == null) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      `INSERT INTO carts (user_id, product_id, quantity)
       VALUES (?, ?, ?)`,
      [user_id, product_id, quantity],
    );

    res.json({
      message: 'Cart item added successfully',
      cart_id: result.insertId,
      status: 'success',
    });
  } catch (error) {
    console.error('Create cart item error:', error);
    res.status(500).json({ error: 'Failed to add to cart', details: error });
  }
});

// READ cart items by user
router.get(
  '/user/:userId',
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
      const connection = await databaseConnectionPromise;
      const [data]: any = await connection.query(
        'SELECT * FROM carts WHERE user_id = ?',
        [userId],
      );

      res.json(data);
    } catch (error) {
      console.error('Fetch user cart error:', error);
      res.status(500).json({ error: 'Fetch failed', details: error });
    }
  },
);

// DELETE cart item
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'DELETE FROM carts WHERE cart_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }

    res.json({ message: 'Cart item removed successfully', status: 'success' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ error: 'Delete failed', details: error });
  }
});

export const cartsRouter = router;
