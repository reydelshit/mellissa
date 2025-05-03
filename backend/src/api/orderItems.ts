import { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// CREATE order item
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  const { order_id, product_id, quantity, price } = req.body;

  if (!order_id || !product_id || quantity == null || price == null) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [order_id, product_id, quantity, price],
    );

    res.json({
      message: 'Order item created successfully',
      order_item_id: result.insertId,
      status: 'success',
    });
  } catch (error) {
    console.error('Create order item error:', error);
    res
      .status(500)
      .json({ error: 'Failed to create order item', details: error });
  }
});

// READ all order items
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query('SELECT * FROM order_items');

    res.json(data);
  } catch (error) {
    console.error('Fetch order items error:', error);
    res.status(500).json({ error: 'Fetch failed', details: error });
  }
});

// DELETE order item
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'DELETE FROM order_items WHERE order_item_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Order item not found' });
      return;
    }

    res.json({ message: 'Order item deleted successfully', status: 'success' });
  } catch (error) {
    console.error('Delete order item error:', error);
    res.status(500).json({ error: 'Delete failed', details: error });
  }
});

export const orderItemsRouter = router;
