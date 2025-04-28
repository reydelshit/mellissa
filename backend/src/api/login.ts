import { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// LOGIN user
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password],
    );

    if (data.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = data[0];

    res.json({
      ...user,
      message: 'Successfully logged in',
      status: 'success',
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// CREATE user
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  const { fullname, email, password, role } = req.body;

  if (!fullname || !email || !password || !role) {
    res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'INSERT INTO users (fullname, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [fullname, email, password, role],
    );

    res.json({
      message: 'User created successfully',
      userId: result.insertId,
      status: 'success',
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database insert failed', details: err });
  }
});

// READ all users
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM users ORDER BY created_at DESC',
    );

    res.json(data);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database fetch failed', details: err });
  }
});

// READ single user by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM users WHERE user_id = ?',
      [id],
    );

    if (data.length === 0) {
      res.status(404).json({ error: 'User not found' });
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Fetch user failed', details: err });
  }
});

// UPDATE user
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { fullname, email, password, role } = req.body;

  if (!fullname || !email || !password || !role) {
    res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'UPDATE users SET fullname = ?, email = ?, password = ?, role = ? WHERE user_id = ?',
      [fullname, email, password, role, id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', status: 'success' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Update failed', details: err });
  }
});

// DELETE user
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'DELETE FROM users WHERE user_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', status: 'success' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Delete failed', details: err });
  }
});

export const userRouter = router;
