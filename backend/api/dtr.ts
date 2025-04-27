
import { Router } from 'express';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();

// Get all DTR records
router.get("/", (req, res) => {
    const query = "SELECT * FROM dtr";
  
    databaseConnection.query(query, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
  // Get specific DTR record by ID
  router.get("/:id", (req, res) => {
    const query = "SELECT * FROM dtr WHERE volunteer_id = ?";
    const id = req.params.id;
    databaseConnection.query(query, id, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
  // Add DTR record
  router.post("/create", (req, res) => {
    const query = `
      INSERT INTO dtr ( date, timeInMorning, timeOutMorning, timeInAfternoon, timeOutAfternoon, volunteer_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
      req.body.date,
      req.body.timeInMorning,
      req.body.timeOutMorning,
      req.body.timeInAfternoon,
      req.body.timeOutAfternoon,
      req.body.volunteer_id
    ];
  
    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      return res.json({
        ...data,
        message: "Successfully added DTR record",
        status: "success",
      });
    });
  });
  
  // Update DTR record
  router.put("/update/:id", (req, res) => {
    const query = `
      UPDATE dtr 
      SET date = ?, 
          timeInMorning = ?, 
          timeOutMorning = ?, 
          timeInAfternoon = ?, 
          timeOutAfternoon = ?
      WHERE dtr_id = ?
    `;
  
    const values = [
      req.body.date,
      req.body.timeInMorning,
      req.body.timeOutMorning,
      req.body.timeInAfternoon,
      req.body.timeOutAfternoon,
      req.params.id
    ];
  
    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database update failed' });
      }
      
      if ((data as any).affectedRows === 0) {
        return res.status(404).json({ message: "DTR record not found" });
      }
  
      return res.json({
        message: "Successfully updated DTR record",
        status: "success"
      });
    });
  });
  
  // Delete DTR record
  router.delete("/delete/:id", (req, res) => {
    const query = "DELETE FROM dtr WHERE dtr_id = ?";
    const id = req.params.id;
  
    databaseConnection.query(query, id, (err, data) => {
      if (err) return res.json(err);
      return res.json({
        ...data,
        message: "Successfully deleted DTR record",
        status: "success",
      });
    });
  });
  
  

  export const dtrRouter = router;
  
  
  