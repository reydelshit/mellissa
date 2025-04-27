import { Router } from 'express';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();



// login user
router.post("/login", (req, res) => {
  const query = `SELECT * FROM store_owner WHERE email = ? AND password = ?`;

  const values = [
    req.body.email,
    req.body.password,
  ];

databaseConnection.query(query, values, (err, data: any[]) => {
  if (err) {
    console.error('SQL Error:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }

  if (data.length === 0) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

    return res.json({
      data,
      message: "Successfully login",
      status: "success",
    });
  });
});


// CREATE store owner
router.post("/create", (req, res) => {
  const { ownerName, storeName, email, phone, password, storeCategory, location, floor, size } = req.body;
  const query = `
    INSERT INTO store_owner 
    (ownerName, storeName, email, phone, password, storeCategory, location, floor, size, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  const values = [ownerName, storeName, email, phone, password, storeCategory, location, floor, size];

  databaseConnection.query(query, values, (err, result) => {
    console.error("❌ Database insert error:", err);
    if (err) return res.status(500).json({ error: "Database insert failed", err });
    res.json({
      message: "Store owner created successfully",
      status: "success",
      storeOwner_id: (result as any).insertId,
    });
  });
});

// READ all store owners
router.get("/", (req, res) => {
  const query = `SELECT * FROM store_owner ORDER BY created_at DESC`;

  databaseConnection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database fetch failed", err });
    res.json(results);
  });
});

// READ single store owner by ID
router.get("/:id", (req, res) => {
  const query = `SELECT * FROM store_owner WHERE storeName_id = ?`;
  const values = [req.params.id];

  databaseConnection.query(query, values, (err, results: any[]) => {
    if (err) return res.status(500).json({ error: "Fetch failed", err });
    res.json(results[0]);
  });
});

// UPDATE store owner
router.put("/:id", (req, res) => {
  const { ownerName, storeName, email, phone, password, storeCategory, location, floor, size } = req.body;
  const query = `
    UPDATE store_owner
    SET ownerName = ?, storeName = ?, email = ?, phone = ?, password = ?, storeCategory = ?, location = ?, floor = ?, size = ?
    WHERE storeName_id = ?
  `;
  const values = [ownerName, storeName, email, phone, password, storeCategory, location, floor, size, req.params.id];

  databaseConnection.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Update failed", err });
    res.json({ message: "Store owner updated successfully", status: "success" });
  });
});

// DELETE store owner
router.delete("/:id", (req, res) => {
  const query = `DELETE FROM store_owner WHERE storeName_id = ?`;
  const values = [req.params.id];

  databaseConnection.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Delete failed", err });
    res.json({ message: "Store owner deleted successfully", status: "success" });
  });
});

export const storeOwnerRouter = router;
