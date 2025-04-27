
import { Router } from 'express';
import { databaseConnection } from '../../connections/DatabaseConnection';

const router = Router();

  

  // get all 
  router.get("/", (req, res) => {
    const query = "SELECT * FROM medreport";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });
  
  
  // specific  
  router.get("/:id", (req, res) => {
    const query = "SELECT * FROM medreport WHERE med_rep_id = ?"
    const id = req.params.id
    databaseConnection.query(query, id, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
  })
  
  
  
  
  //CREATE 
  router.post("/create", (req, res) => {
    const query = `
      INSERT INTO medreport (med_rep_id, studentId, remarks, recom, date, studentName, course, year) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.med_rep_id,
      req.body.studentId,
      req.body.remarks,
      req.body.recom,
      req.body.date,
      req.body.studentName,
      req.body.course,
      req.body.year

    ];

    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      return res.json({
        ...data,
        message: "Successfully added medreport",
        status: "success",
      });
    });
});

  
  
  // UPDATE  
  router.put("/update/:id", (req, res) => {
    const query = `
      UPDATE medreport 
      SET studentId = ?, 
          recom = ?, 
          remarks = ?, 
          studentName = ?, 
          course = ?,
          year = ?
      WHERE med_rep_id = ?
    `;

    const values = [
      req.body.studentId,
      req.body.recom,
      req.body.remarks,
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
        return res.status(404).json({ message: "medreport not found" });
      }

      return res.json({
        message: "Successfully updated medreport",
        status: "success"
      });
    });
});

  
  // DELETE  
  router.delete("/delete/:id", (req, res) => {
    const query = "DELETE FROM medreport WHERE med_rep_id = ?"
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
  
  

  

  export const transactionsMedReport = router;
  
  
  