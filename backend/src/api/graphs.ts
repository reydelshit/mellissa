import { Router } from 'express';
import { databaseConnectionPromise } from '../connections/DBConnection';

const router = Router();

router.get('/monthly-stats/orders', async (req, res): Promise<void> => {
  try {
    // SQL query to aggregate order data by month
    const query = `
        SELECT 
          DATE_FORMAT(created_at, '%b') AS month,
          DATE_FORMAT(created_at, '%m') AS month_num,
          COUNT(*) AS orderCount,
          SUM(total_price) AS totalRevenue,
          ROUND(AVG(total_price), 2) AS avgOrderValue
        FROM orders
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
        GROUP BY month, month_num
        ORDER BY month_num ASC
      `;

    const connection = await databaseConnectionPromise;
    const [rows] = await connection.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching monthly order stats:', error);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

/**
 * GET /api/ratings/monthly-stats
 * Returns monthly review statistics (count, average rating)
 */
router.get('/monthly-stats/ratings', async (req, res): Promise<void> => {
  try {
    // SQL query to aggregate review data by month
    const query = `
        SELECT 
          DATE_FORMAT(created_at, '%b') AS month,
          DATE_FORMAT(created_at, '%m') AS month_num,
          COUNT(*) AS reviewCount,
          ROUND(AVG(rating), 1) AS avgRating
        FROM ratings
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
        GROUP BY month, month_num
        ORDER BY month_num ASC
      `;

    const connection = await databaseConnectionPromise;
    const [rows] = await connection.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching monthly review stats:', error);
    res.status(500).json({ error: 'Failed to fetch review statistics' });
  }
});

router.get('/monthly-stats/customers', async (req, res): Promise<void> => {
  try {
    const query = `
      SELECT 
        DATE_FORMAT(created_at, '%b') AS month,
        DATE_FORMAT(created_at, '%m') AS month_num,
        COUNT(*) AS customerCount
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
      GROUP BY month, month_num
      ORDER BY month_num ASC
    `;

    const connection = await databaseConnectionPromise;
    const [rows] = await connection.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({ error: 'Failed to fetch customer statistics' });
  }
});

export const graphsRouter = router;
