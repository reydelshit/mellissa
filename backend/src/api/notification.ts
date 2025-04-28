import express, { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// Fetch all notifications
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await databaseConnectionPromise;
    const [data] = await connection.query(
      'SELECT * FROM notifications ORDER BY notification_id DESC',
    );
    res.json(data);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// Fetch a notification by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM notifications WHERE notification_id = ? ORDER BY created_at DESC',
      [id],
    );

    if (data.length === 0) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// Create a new notification
router.post('/create', async (req: Request, res: Response) => {
  const { title, message, receiver_id } = req.body;

  if (!title || !message || receiver_id === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'INSERT INTO notifications (title, message, receiver_id, created_at) VALUES (?, ?, ?, ?)',
      [title, message, receiver_id, createdAt],
    );
    res.json({
      message: 'Notification created successfully',
      status: 'success',
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Delete a notification by ID
router.delete('/delete/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'DELETE FROM notifications WHERE notification_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json({
      message: 'Notification deleted successfully',
      status: 'success',
    });
  } catch (err) {
    console.error('Database error:', err);
    res
      .status(500)
      .json({ error: 'Failed to delete notification', details: err });
  }
});

export const notificationRouter = router;
