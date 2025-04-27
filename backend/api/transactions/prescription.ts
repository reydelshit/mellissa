
import { Router } from 'express';
import { databaseConnection } from '../../connections/DatabaseConnection';

const router = Router();

  
  
  // get all 
  router.get("/", (req, res) => {
    const query = "SELECT * FROM prescription";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });
  
  
  // specific  
  router.get("/:id", (req, res) => {
    const query = "SELECT * FROM prescription WHERE prescription_id = ?"
    const id = req.params.id
    databaseConnection.query(query, id, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
  })
  
  
  
  
// CREATE 
router.post("/create", async (req, res) => {
  const { prescription_id, studentId, illness, prescrip, sig, quantity, date, studentName, course, year, inventory_id } = req.body;

  // Check for missing inventory_id or quantity
  if (inventory_id === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'Missing inventory_id or quantity' });
  }

  try {
    // Insert prescription query
    const queryInsertPrescription = `
      INSERT INTO prescription (prescription_id, studentId, illness, prescrip, sig, quantity, date, studentName, course, year) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const valuesInsertPrescription = [
      prescription_id,
      studentId,
      illness,
      prescrip,
      sig,
      quantity,
      date,
      studentName,
      course,
      year
    ];

    // Execute the insert prescription query
    databaseConnection.query(queryInsertPrescription, valuesInsertPrescription, (err, prescriptionResult) => {
      if (err) {
        console.error('SQL Error during prescription insert:', err);
        return res.status(500).json({ error: 'Failed to insert prescription data' });
      }

      // Update inventory quantity query
      const queryUpdateInventoryQuantity = "UPDATE inventory SET quantity = quantity - ? WHERE inventory_id = ?";
      const valuesUpdateInventoryQuantity = [quantity, inventory_id];

      databaseConnection.query(queryUpdateInventoryQuantity, valuesUpdateInventoryQuantity, (err, inventoryUpdateResult) => {
        if (err) {
          console.error('SQL Error during inventory update:', err);
          return res.status(500).json({ error: 'Failed to update inventory quantity' });
        }

        // Additional query: For example, inserting into a log table
        const queryInsertLog = `
          INSERT INTO dispensed (dispensed_id, inventory_id, quantity, created_at) 
          VALUES (?, ?, ?, ?)
        `;
        const valuesInsertLog = [
          null,
          inventory_id,
          quantity,
          new Date()
        ];

        databaseConnection.query(queryInsertLog, valuesInsertLog, (err, logResult) => {
          if (err) {
            console.error('SQL Error during log insert:', err);
            return res.status(500).json({ error: 'Failed to log action' });
          }

          // Successfully inserted prescription, updated inventory, and logged the action
          return res.json({
            message: "Successfully added prescription, updated inventory, and logged the action",
            prescriptionResult,
            inventoryUpdateResult,
            logResult,
            status: "success"
          });
        });
      });
    });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});


  
  
  // UPDATE  
  router.put("/update/:id", (req, res) => {
    const query = `
      UPDATE prescription 
      SET studentId = ?, 
          illness = ?, 
          prescrip = ?, 
          sig = ?, 
          quantity = ?, 
          studentName = ?, 
          course = ?
          year = ?
      WHERE prescription_id = ?
    `;

    const values = [
      req.body.studentId,
      req.body.illness,
      req.body.prescrip,
      req.body.sig,
      req.body.quantity,
      req.body.studentName,
      req.body.course,
      req.body.year,
      req.params.id
    ];

    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database update failed' });
      }

      if ((data as any).affectedRows === 0) {
        return res.status(404).json({ message: "Prescription not found" });
      }

      return res.json({
        message: "Successfully updated prescription",
        status: "success"
      });
    });
});

  
  // DELETE  
  router.delete("/delete/:id", (req, res) => {
    const query = "DELETE FROM prescription WHERE prescription_id = ?"
    const id = req.params.id
  
    databaseConnection.query(query, id, (err, data) => {
        if(err) return res.json(err)
        return res.json({
        ...data,
        message: "succesfully deleted",
        status: "success",
      })
    })
  })
  
  

  

  export const transactionsPrescription = router;
  
  
  