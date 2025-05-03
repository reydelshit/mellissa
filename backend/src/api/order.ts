import { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// CREATE order
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  const { user_id, total_amount, status, created_at } = req.body;

  if (!user_id || total_amount == null || !status || !created_at) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      `INSERT INTO orders (user_id, total_amount, status, created_at)
       VALUES (?, ?, ?, ?)`,
      [user_id, total_amount, status, created_at],
    );

    res.json({
      message: 'Order created successfully',
      order_id: result.insertId,
      status: 'success',
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order', details: error });
  }
});

// READ all orders
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query('SELECT * FROM orders');

    res.json(data);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Fetch failed', details: error });
  }
});

// READ order by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [id],
    );

    if (data.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ error: 'Fetch failed', details: error });
  }
});

export const ordersRouter = router;
