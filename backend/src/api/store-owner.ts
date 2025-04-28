import { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// LOGIN store owner
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM store_owner WHERE email = ? AND password = ?',
      [email, password],
    );

    if (data.length === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const owner = data[0];

    res.json({
      data: owner,
      message: 'Successfully logged in',
      status: 'success',
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database query failed', details: err });
  }
});

// CREATE store owner
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  const {
    ownerName,
    storeName,
    email,
    phone,
    password,
    storeCategory,
    location,
    floor,
    size,
  } = req.body;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      `INSERT INTO store_owner 
      (ownerName, storeName, email, phone, password, storeCategory, location, floor, size, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        ownerName,
        storeName,
        email,
        phone,
        password,
        storeCategory,
        location,
        floor,
        size,
      ],
    );

    res.json({
      message: 'Store owner created successfully',
      status: 'success',
      storeOwner_id: result.insertId,
    });
  } catch (err) {
    console.error('Database insert error:', err);
    res.status(500).json({ error: 'Database insert failed', details: err });
  }
});

// READ all store owners
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM store_owner ORDER BY created_at DESC',
    );

    res.json(data);
  } catch (err) {
    console.error('Database fetch error:', err);
    res.status(500).json({ error: 'Database fetch failed', details: err });
  }
});

// READ single store owner by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM store_owner WHERE storeName_id = ?',
      [id],
    );

    if (data.length === 0) {
      res.status(404).json({ error: 'Store owner not found' });
      return;
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Database fetch error:', err);
    res.status(500).json({ error: 'Fetch failed', details: err });
  }
});

// UPDATE store owner
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    ownerName,
    storeName,
    email,
    phone,
    storeCategory,
    openingHours,
    description,
  } = req.body;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      `UPDATE store_owner
       SET ownerName = ?, storeName = ?, email = ?, phone = ?, storeCategory = ?, openingHours = ?, description = ?
       WHERE storeOwner_id = ?`,
      [
        ownerName,
        storeName,
        email,
        phone,
        storeCategory,
        openingHours,
        description,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Store owner not found' });
      return;
    }

    res.json({
      message: 'Store owner updated successfully',
      status: 'success',
    });
  } catch (err) {
    console.error('Database update error:', err);
    res.status(500).json({ error: 'Update failed', details: err });
  }
});

// DELETE store owner
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'DELETE FROM store_owner WHERE storeName_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Store owner not found' });
      return;
    }

    res.json({
      message: 'Store owner deleted successfully',
      status: 'success',
    });
  } catch (err) {
    console.error('Database delete error:', err);
    res.status(500).json({ error: 'Delete failed', details: err });
  }
});

export const storeOwnerRouter = router;
