import { Router, Request, Response } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = Router();

// Set up multer storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/products');
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

// CREATE product
router.post(
  '/upload',
  upload.single('product_image'),
  async (req: Request, res: Response): Promise<void> => {
    const {
      product_name,
      price,
      description,
      category,
      inventory,
      storeOwner_id,
    } = req.body;

    const productImagePath = req.file
      ? `uploads/products/${req.file.filename}`
      : null;

    if (
      !product_name ||
      !price ||
      !description ||
      !category ||
      !inventory ||
      !storeOwner_id ||
      !productImagePath
    ) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    try {
      const connection = await databaseConnectionPromise;
      const [result]: any = await connection.query(
        `INSERT INTO products (product_name, price, description, category, inventory, created_at, storeOwner_id, product_image)
         VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)`,
        [
          product_name,
          price,
          description,
          category,
          inventory,
          storeOwner_id,
          productImagePath,
        ],
      );

      res.json({
        message: 'Product created successfully',
        product_id: result.insertId,
        status: 'success',
      });
    } catch (error) {
      console.error('Create product error:', error);
      res
        .status(500)
        .json({ error: 'Failed to create product', details: error });
    }
  },
);

// READ all products
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM products ORDER BY created_at DESC',
    );

    res.json(data);
  } catch (err) {
    console.error('Fetch all products error:', err);
    res.status(500).json({ error: 'Database fetch failed', details: err });
  }
});

// READ single product by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [data]: any = await connection.query(
      'SELECT * FROM products WHERE product_id = ?',
      [id],
    );

    if (data.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Fetch product error:', err);
    res.status(500).json({ error: 'Fetch failed', details: err });
  }
});

// UPDATE product
router.put(
  '/:id',
  upload.single('product_image'),
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
      product_name,
      price,
      description,
      category,
      inventory,
      storeOwner_id,
    } = req.body;

    const productImagePath = req.file
      ? `uploads/products/${req.file.filename}`
      : null;

    try {
      const connection = await databaseConnectionPromise;

      // Update query with proper placeholders
      let query = `
        UPDATE products 
        SET product_name = ?, price = ?, description = ?, category = ?, inventory = ?, storeOwner_id = ?
        ${productImagePath ? `, product_image = ?` : ''}
        WHERE product_id = ?
      `;

      // Parameters for the query
      let params = productImagePath
        ? [
            product_name,
            price,
            description,
            category,
            inventory,
            storeOwner_id,
            productImagePath,
            id, // Ensure this is passed last for WHERE clause
          ]
        : [
            product_name,
            price,
            description,
            category,
            inventory,
            storeOwner_id,
            id, // Ensure this is passed last for WHERE clause
          ];

      // Run the query
      const [result]: any = await connection.query(query, params);

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json({
        message: 'Product updated successfully',
        status: 'success',
      });
    } catch (err) {
      console.error('Update product error:', err);
      res.status(500).json({ error: 'Update failed', details: err });
    }
  },
);

// DELETE product
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      'DELETE FROM products WHERE product_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({
      message: 'Product deleted successfully',
      status: 'success',
    });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Delete failed', details: err });
  }
});

export const productRouter = router;
