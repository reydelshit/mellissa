import { Router } from 'express';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();

// login user
router.post("/login", (req, res) => {
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

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



// CREATE user
router.post("/create", (req, res) => {
  const { fullname, email, password, role } = req.body;
  const query = `
    INSERT INTO users (fullname, email, password, role, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  const values = [fullname, email, password, role];

  databaseConnection.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Database insert failed", err });
    res.json({
      message: "User created successfully",
      status: "success",
      user_id: (result as any).insertId,
    });
  });
});

// READ all users
router.get("/", (req, res) => {
  const query = `SELECT * FROM users ORDER BY created_at DESC`;

  databaseConnection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database fetch failed", err });
    res.json(results);
  });
});

// READ single user by ID
router.get("/:id", (req, res) => {
  const query = `SELECT * FROM users WHERE user_id = ?`;
  const values = [req.params.id];

  databaseConnection.query(query, values, (err, results: any[]) => {
    if (err) return res.status(500).json({ error: "Fetch user failed", err });
    res.json(results[0]);
  });
});

// UPDATE user
router.put("/:id", (req, res) => {
  const { fullname, email, password, role } = req.body;
  const query = `
    UPDATE users
    SET fullname = ?, email = ?, password = ?, role = ?
    WHERE user_id = ?
  `;
  const values = [fullname, email, password, role, req.params.id];

  databaseConnection.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Update failed", err });
    res.json({ message: "User updated successfully", status: "success" });
  });
});

// DELETE user
router.delete("/:id", (req, res) => {
  const query = `DELETE FROM users WHERE user_id = ?`;
  const values = [req.params.id];

  databaseConnection.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Delete failed", err });
    res.json({ message: "User deleted successfully", status: "success" });
  });
});

export const userRouter = router;
