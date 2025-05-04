import { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// CREATE order + order_items
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  const {
    user_id,
    total_price,
    status,
    fullname,
    delivery_address,
    payment_method,
    items,
    store_id,
  } = req.body;

  if (
    !user_id ||
    total_price == null ||
    !status ||
    !fullname ||
    !delivery_address ||
    !payment_method ||
    !store_id ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    res
      .status(400)
      .json({ error: 'Missing required fields or empty items array' });
    return;
  }

  try {
    const connection = await databaseConnectionPromise;
    await connection.beginTransaction();

    const [orderResult]: any = await connection.query(
      `INSERT INTO orders ( user_id, total_price, status, created_at, fullname, delivery_address, payment_method, store_id)
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?) `,
      [
        user_id,
        total_price,
        status,
        fullname,
        delivery_address,
        payment_method,
        store_id,
      ],
    );

    const order_id = orderResult.insertId;

    for (const item of items) {
      const { product_id, quantity, price } = item;

      if (!product_id || quantity == null || price == null) {
        await connection.rollback();
        res.status(400).json({ error: 'Invalid item format' });
        return;
      }

      // Check stock
      const [stockRows]: any = await connection.query(
        'SELECT inventory FROM products WHERE product_id = ?',
        [product_id],
      );

      if (stockRows.length === 0 || stockRows[0].stock < quantity) {
        await connection.rollback();
        res.status(400).json({
          error: `Insufficient stock for product_id ${product_id}`,
        });
        return;
      }

      // Insert into order_items
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [order_id, product_id, quantity, price],
      );

      // Decrease product stock
      await connection.query(
        `UPDATE products SET inventory = inventory - ? WHERE product_id = ?`,
        [quantity, product_id],
      );
    }

    await connection.commit();

    res.json({
      message: 'Order and order items created successfully',
      order_id,
      status: 'success',
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order', details: error });
  }
});

// READ all orders with their items
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await databaseConnectionPromise;

    // Fetch all orders
    const [orders]: any = await connection.query('SELECT * FROM orders');

    // Fetch all order items
    const [items]: any = await connection.query(
      'SELECT order_items.*, products.product_name FROM order_items LEFT JOIN products ON products.product_id = order_items.product_id',
    );

    // Combine orders with their items
    const ordersWithItems = orders.map((order: any) => {
      const orderItems = items.filter(
        (item: any) => item.order_id === order.order_id,
      );
      return {
        ...order,
        items: orderItems,
      };
    });

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Fetch failed', details: error });
  }
});

// READ single order with items
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;

    const [order]: any = await connection.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [id],
    );
    if (order.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const [items]: any = await connection.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id],
    );

    res.json({
      ...order[0],
      items,
    });
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ error: 'Fetch failed', details: error });
  }
});

// UPDATE order only (not items)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    user_id,
    total_price,
    status,
    fullname,
    delivery_address,
    payment_method,
  } = req.body;

  try {
    const connection = await databaseConnectionPromise;

    const [result]: any = await connection.query(
      `UPDATE orders SET 
        user_id = ?, total_price = ?, status = ?, fullname = ?, 
        delivery_address = ?, payment_method = ? 
        WHERE order_id = ?`,
      [
        user_id,
        total_price,
        status,
        fullname,
        delivery_address,
        payment_method,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json({ message: 'Order updated successfully', status: 'success' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Update failed', details: error });
  }
});

router.put('/status/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const connection = await databaseConnectionPromise;
    await connection.query('UPDATE orders SET status = ? WHERE order_id = ?', [
      status,
      orderId,
    ]);
    res.json({ message: 'Order status updated successfully.' });
  } catch (error) {
    console.error('Update order status error:', error);
    res
      .status(500)
      .json({ error: 'Failed to update order status', details: error });
  }
});

// DELETE order and its items
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    await connection.beginTransaction();

    await connection.query('DELETE FROM order_items WHERE order_id = ?', [id]);
    const [result]: any = await connection.query(
      'DELETE FROM orders WHERE order_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await connection.commit();

    res.json({
      message: 'Order and items deleted successfully',
      status: 'success',
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Delete failed', details: error });
  }
});

export const ordersRouter = router;
