import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, '../uploads/orders');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '../uploads/orders');

    if (file.fieldname === 'payment_proof') {
      uploadPath = path.join(__dirname, '../uploads/payment_proof');
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Get all orders
router.get('/', async (req, res) => {
  try {
    const db = await databaseConnectionPromise;
    const [data] = await db.query('SELECT * FROM orders');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
});

router.get('/orders/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const db = await databaseConnectionPromise;
    const [rows]: any = await db.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [id],
    );

    if (rows.length > 0) {
      res.json({ status: 'success', order: rows[0] });
    } else {
      res.status(404).json({ status: 'error', message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch order' });
  }
});

router.put(
  '/update/order-status/:id',
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    try {
      const connection = await databaseConnectionPromise;
      const [result]: any = await connection.query(
        'UPDATE orders SET status = ? WHERE order_id = ?',
        [status, id], // Correct field mapping
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      res.json({
        message: 'Order status updated successfully',
        status: 'success',
      });
    } catch (err) {
      console.error('SQL Error:', err);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  },
);

router.post(
  '/create',
  upload.fields([
    { name: 'tshirtDesignPath', maxCount: 1 },
    { name: 'payment_proof', maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    const {
      size_bust,
      size_waist,
      size_shoulder,
      fabric,
      totalPrice,
      quantity,
      payment_method,
      user_id,
      fullname,
      shipping_address,
      phone_number,
      status,
    } = req.body;

    let tshirtDesignPath = null;
    if (
      req.files &&
      !Array.isArray(req.files) &&
      'tshirtDesignPath' in req.files
    ) {
      tshirtDesignPath = `uploads/orders/${
        (req.files['tshirtDesignPath'] as Express.Multer.File[])[0].filename
      }`;
    }

    let payment_proof = '';
    if (
      req.files &&
      !Array.isArray(req.files) &&
      'payment_proof' in req.files
    ) {
      payment_proof = `uploads/payment_proof/${
        (req.files['payment_proof'] as Express.Multer.File[])[0].filename
      }`;
    }

    try {
      const db = await databaseConnectionPromise;
      const [result]: any = await db.query(
        `INSERT INTO orders (size_bust, size_waist, size_shoulder, fabric, totalPrice, quantity, payment_method, user_id, created_at, tshirtDesignPath, payment_proof, status, fullname, shipping_address, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
        [
          size_bust,
          size_waist,
          size_shoulder,
          fabric,
          totalPrice,
          quantity,
          payment_method,
          user_id,
          tshirtDesignPath,
          payment_proof,
          status,
          fullname,
          shipping_address,
          phone_number,
        ],
      );

      res.json({ status: 'success', order_id: result.insertId });
    } catch (error) {
      console.error('Error creating order:', error);
      res
        .status(500)
        .json({ status: 'error', message: 'Failed to create order' });
    }
  },
);

router.put(
  '/update/:id',
  upload.single('tshirtDesignPath'),
  async (req: Request, res: Response) => {
    const {
      size_bust,
      size_waist,
      size_shoulder,
      fabric,
      totalPrice,
      quantity,
      payment_method,
      user_id,
      fullname,
      shipping_address,
      phone_number,
      status,
    } = req.body;
    const { id } = req.params;
    const tshirtDesignPath = req.file
      ? `uploads/orders/${req.file.filename}`
      : null;

    if (
      !size_bust ||
      !size_waist ||
      !size_shoulder ||
      !fabric ||
      !totalPrice ||
      !quantity ||
      !payment_method ||
      !fullname ||
      !shipping_address ||
      !phone_number ||
      !status
    ) {
      res
        .status(400)
        .json({ status: 'error', message: 'Missing required fields' });
      return;
    }

    try {
      const db = await databaseConnectionPromise;
      let query = `UPDATE orders SET size_bust = ?, size_waist = ?, size_shoulder = ?, fabric = ?, totalPrice = ?, quantity = ?, payment_method = ?, user_id = ?, status = ?, fullname = ?, shipping_address = ?, phone_number = ? WHERE order_id = ?`;
      let values = [
        size_bust,
        size_waist,
        size_shoulder,
        fabric,
        totalPrice,
        quantity,
        payment_method,
        user_id,
        status,
        fullname,
        shipping_address,
        phone_number,
        id,
      ];

      if (tshirtDesignPath) {
        query = `UPDATE orders SET size_bust = ?, size_waist = ?, size_shoulder = ?, fabric = ?, totalPrice = ?, quantity = ?, payment_method = ?, user_id = ?, tshirtDesignPath = ?, status = ?, fullname = ?, shipping_address = ?, phone_number = ? WHERE order_id = ?`;
        values = [
          size_bust,
          size_waist,
          size_shoulder,
          fabric,
          totalPrice,
          quantity,
          payment_method,
          user_id,
          tshirtDesignPath,
          status,
          fullname,
          shipping_address,
          phone_number,
          id,
        ];
      }

      await db.query(query, values);
      res.json({ status: 'success', message: 'Order updated successfully' });
    } catch (error) {
      console.error('Error updating order:', error);
      res
        .status(500)
        .json({ status: 'error', message: 'Failed to update order' });
    }
  },
);

// ✅ Delete an order
router.delete('/delete/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const db = await databaseConnectionPromise;
    const [results]: any = await db.query(
      'SELECT tshirtDesignPath FROM orders WHERE order_id = ?',
      [id],
    );

    if (results.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const filePath = path.join(__dirname, '../', results[0].tshirtDesignPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.query('DELETE FROM orders WHERE order_id = ?', [id]);
    res.json({ message: 'Order deleted successfully', status: 'success' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to delete order' });
  }
});

export const ordersRouter = router;
