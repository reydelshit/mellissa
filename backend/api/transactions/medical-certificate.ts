
import { Router } from 'express';
import { databaseConnection } from '../../connections/DatabaseConnection';

const router = Router();

  

  // get all 
  router.get("/", (req, res) => {
    const query = "SELECT * FROM medcert";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });
  
  
  // specific  
  router.get("/:id", (req, res) => {
    const query = "SELECT * FROM medcert WHERE med_cert_id = ?"
    const id = req.params.id
    databaseConnection.query(query, id, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
  })
  
  
  
  
  //CREATE 
  router.post("/create", (req, res) => {
    const query = `
      INSERT INTO medcert (med_cert_id, studentId, studentName, gender, address, age, diagnosis, ref_reason, referenceClassification, reffered, date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.med_cert_id,
      req.body.studentId,
      req.body.studentName,
      req.body.gender,
      req.body.address,
      req.body.age,
      req.body.diagnosis,
      req.body.ref_reason,
      req.body.referenceClassification,
      req.body.reffered,
      req.body.date
    ];

    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      return res.json({
        ...data,
        message: "Successfully added medcert",
        status: "success",
      });
    });
});


  
  
  // UPDATE  
  router.put("/update/:id", (req, res) => {
    const query = `
      UPDATE medcert 
      SET studentId = ?, 
          studentName = ?,
          gender = ?, 
          address = ?, 
          age = ?, 
          diagnosis = ?, 
          ref_reason = ?, 
          referenceClassification = ?, 
          reffered = ?
      WHERE med_cert_id = ?
    `;

    const values = [
      req.body.studentId,
      req.body.studentName,
      req.body.gender,
      req.body.address,
      req.body.age,
      req.body.diagnosis,
      req.body.ref_reason,
      req.body.referenceClassification,
      req.body.reffered,
      req.params.id
    ];

    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database update failed' });
      }

      if ((data as any).affectedRows === 0) {
        return res.status(404).json({ message: "medcert not found" });
      }

      return res.json({
        message: "Successfully updated medcert",
        status: "success"
      });
    });
});


  
  // DELETE  
  router.delete("/delete/:id", (req, res) => {
    const query = "DELETE FROM medcert WHERE med_cert_id = ?"
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
  
  

  

  export const transactionsMedicalCert = router;
  
  
  