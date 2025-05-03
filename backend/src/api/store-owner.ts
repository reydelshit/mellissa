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
    stall_no,
  } = req.body;

  try {
    const connection = await databaseConnectionPromise;
    const [result]: any = await connection.query(
      `INSERT INTO store_owner 
      (ownerName, storeName, email, phone, password, storeCategory, location, floor, size,   stall_no, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
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
        stall_no,
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
    const [rows]: any = await connection.query(`
      SELECT 
        store_owner.*, 
        media_gallery.media_id AS media_id,
        media_gallery.path AS media_path,
        media_gallery.pathName AS media_pathName,
        media_gallery.created_at AS media_created_at,
    
        products.product_id AS product_id,
        products.product_name AS product_name,
        products.price AS product_price,
        products.description AS product_description,
        products.category AS product_category,
        products.inventory AS product_inventory,
        products.created_at AS product_created_at,
        products.product_image AS product_image,
    
        promotions.promotion_id AS promotion_id,
        promotions.title AS promotion_title,
        promotions.startDate AS promotion_startDate,
        promotions.endDate AS promotion_endDate,
        promotions.discountType AS promotion_discountType,
        promotions.discount AS promotion_discount,
        promotions.description AS promotion_description,
        promotions.status AS promotion_status
    
      FROM store_owner 
      LEFT JOIN media_gallery ON media_gallery.storeOwner_id = store_owner.storeOwner_id 
      LEFT JOIN products ON products.storeOwner_id = store_owner.storeOwner_id
      LEFT JOIN promotions ON promotions.storeOwner_id = store_owner.storeOwner_id
      ORDER BY store_owner.created_at DESC;
    `);

    const storeOwnerMap = new Map();

    for (const row of rows) {
      const {
        storeOwner_id,
        media_id,
        media_path,
        media_pathName,
        media_created_at,

        product_id,
        product_name,
        product_price,
        product_description,
        product_category,
        product_inventory,
        product_created_at,
        product_image,

        promotion_id,
        promotion_title,
        promotion_startDate,
        promotion_endDate,
        promotion_discountType,
        promotion_discount,
        promotion_description,
        promotion_status,

        ...storeOwnerData
      } = row;

      if (!storeOwnerMap.has(storeOwner_id)) {
        storeOwnerMap.set(storeOwner_id, {
          storeOwner_id,
          ...storeOwnerData,
          media: [],
          products: [],
          promotions: [],
        });
      }

      const store = storeOwnerMap.get(storeOwner_id);

      if (media_id && !store.media.find((m: any) => m.media_id === media_id)) {
        store.media.push({
          media_id,
          path: media_path,
          pathName: media_pathName,
          created_at: media_created_at,
        });
      }

      if (
        product_id &&
        !store.products.find((p: any) => p.product_id === product_id)
      ) {
        store.products.push({
          product_id,
          product_name,
          price: product_price,
          description: product_description,
          category: product_category,
          inventory: product_inventory,
          created_at: product_created_at,
          product_image,
        });
      }

      if (
        promotion_id &&
        !store.promotions.find((p: any) => p.promotion_id === promotion_id)
      ) {
        store.promotions.push({
          promotion_id,
          title: promotion_title,
          startDate: promotion_startDate,
          endDate: promotion_endDate,
          discountType: promotion_discountType,
          discount: promotion_discount,
          description: promotion_description,
          status: promotion_status,
        });
      }
    }

    const result = Array.from(storeOwnerMap.values());

    res.json(result);
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
