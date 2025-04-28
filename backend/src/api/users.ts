import express, { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [username, password],
    );

    if (data.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const user = data[0];

    res.json({ ...user });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await databaseConnectionPromise;
    const [data] = await connection.query('SELECT * FROM users');
    res.json(data);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

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
      return;
    }
    res.json(data[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

router.post('/create', async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    const connection = await databaseConnectionPromise; // Await the connection
    const [result]: any = await connection.query(
      'INSERT INTO users (firstName, lastName, email, password, created_at) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, password, createdAt],
    );
    res.json({
      message: 'User created successfully',
      userId: result.insertId,
      status: 'success',
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put(
  '/update/:id',
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    try {
      const connection = await databaseConnectionPromise;
      const [result]: any = await connection.query(
        'UPDATE users SET firstName = ?, lastName = ?, email = ?, password = ? WHERE user_id = ?',
        [firstName, lastName, email, password, id],
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ message: 'User updated successfully', status: 'success' });
    } catch (err) {
      console.error('SQL Error:', err);
      res.status(500).json({ error: 'Failed to update user' });
    }
  },
);

router.delete(
  '/delete/:id',
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const connection = await databaseConnectionPromise;
      const [result]: any = await connection.query(
        'DELETE FROM users WHERE user_id = ?',
        [id],
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ message: 'User deleted successfully', status: 'success' });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Failed to delete user', details: err });
    }
  },
);

export const userRouterUsers = router;
