import { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// CREATE promotion
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    startDate,
    endDate,
    discountType,
    discount,
    description,
    storeOwner_id,
    status,
  } = req.body;

  if (
    !title ||
    !startDate ||
    !endDate ||
    !discountType ||
    discount == null ||
    !description ||
    !storeOwner_id ||
    !status
  ) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      `INSERT INTO promotions (title, startDate, endDate, discountType, discount, description, storeOwner_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        startDate,
        endDate,
        discountType,
        discount,
        description,
        storeOwner_id,
        status,
      ],
    );

    res.json({
      message: 'Promotion created successfully',
      promotion_id: result.insertId,
      status: 'success',
    });
  } catch (error) {
    console.error('Create promotion error:', error);
    res
      .status(500)
      .json({ error: 'Failed to create promotion', details: error });
  }
});

// READ all promotions
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM promotions ORDER BY startDate DESC',
    );

    res.json(data);
  } catch (err) {
    console.error('Fetch all promotions error:', err);
    res.status(500).json({ error: 'Database fetch failed', details: err });
  }
});

// READ single promotion by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM promotions WHERE promotion_id = ?',
      [id],
    );

    if (data.length === 0) {
      res.status(404).json({ error: 'Promotion not found' });
      return;
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Fetch promotion error:', err);
    res.status(500).json({ error: 'Fetch failed', details: err });
  }
});

// UPDATE promotion
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    title,
    startDate,
    endDate,
    discountType,
    discount,
    description,
    storeOwner_id,
    status,
  } = req.body;

  try {
    const connection = await databaseConnectionPromise;

    const [result]: any = await connection.query(
      `UPDATE promotions 
       SET title = ?, startDate = ?, endDate = ?, discountType = ?, discount = ?, description = ?, storeOwner_id = ?, status = ? 
       WHERE promotion_id = ?`,
      [
        title,
        startDate,
        endDate,
        discountType,
        discount,
        description,
        storeOwner_id,
        status,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Promotion not found' });
      return;
    }

    res.json({
      message: 'Promotion updated successfully',
      status: 'success',
    });
  } catch (err) {
    console.error('Update promotion error:', err);
    res.status(500).json({ error: 'Update failed', details: err });
  }
});

// DELETE promotion
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'DELETE FROM promotions WHERE promotion_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Promotion not found' });
      return;
    }

    res.json({
      message: 'Promotion deleted successfully',
      status: 'success',
    });
  } catch (err) {
    console.error('Delete promotion error:', err);
    res.status(500).json({ error: 'Delete failed', details: err });
  }
});

export const promotionRouter = router;
