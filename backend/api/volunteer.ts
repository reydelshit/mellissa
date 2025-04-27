
import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();


  
  // get all volunteer
  router.get("/", (req, res) => {
    const query = "SELECT * FROM volunteer";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });
  
  
  // specific volunteer 
  router.get("/:id", (req, res) => {
    const query = "SELECT * FROM volunteer WHERE volunteer_id = ?"
    const id = req.params.id
    databaseConnection.query(query, id, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
  })
  
  
  
  
  //ADD volunteer
  router.post("/create", (req, res) => {
    const query = `
      INSERT INTO volunteer (volunteer_id, student_name, course, year, email, student_id, phone_number, password, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ? , ?)
    `;
  
    const created_at = new Date();
    const values = [
      req.body.volunteer_id,
      req.body.student_name,
      req.body.course,
      req.body.year,
      req.body.email,
      req.body.student_id,
      req.body.phone_number,
      req.body.password,
      created_at
    ];
  
    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      return res.json({
        ...data,
        message: "Successfully added volunteer",
        status: "success",
      });
    });
  });
  
  
  
  // UPDATE volunteer 
  router.put("/update/:id", (req, res) => {
    const query = `
      UPDATE volunteer 
      SET  student_id = ?, 
           student_name = ?, 
          course = ?, 
          year = ?,
          email = ?, 
          phone_number = ?
      WHERE volunteer_id = ?
    `;
  
    const values = [
      req.body.student_id,
      req.body.student_name,
      req.body.course,
      req.body.year,
      req.body.email,
      req.body.phone_number,
      req.params.id
    ];
  
    databaseConnection.query(query, values, (err, data) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Database update failed' });
      }
      if ((data as any).affectedRows === 0) {
        return res.status(404).json({ message: "Volunteer not found" });
      }

      console.log(values)
  
      return res.json({
        message: "Successfully updated volunteer information",
        status: "success"
      });
    });
  });
  
  
  // DELETE STUDENT 

  router.delete("/delete/:id", (req, res) => {
    const query = "DELETE FROM volunteer WHERE volunteer_id = ?"
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
  
  
 

  export const volunteerRouter = router;
  
  
  