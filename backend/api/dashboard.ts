
import { Router } from 'express';
import { databaseConnection } from '../connections/DatabaseConnection';

const router = Router();

  
  //pie chart
  router.get("/pie-chart", (req, res) => {
    const query = "SELECT illness AS label, COUNT(illness) AS value FROM prescription GROUP BY illness ORDER BY value DESC LIMIT 3";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });

  //graph dispensed
  router.get("/dispensed", (req, res) => {
    const query = "SELECT inventory.itemName AS name, SUM(dispensed.quantity) AS total FROM dispensed INNER JOIN inventory ON inventory.inventory_id = dispensed.inventory_id GROUP BY inventory.itemName ORDER BY total DESC LIMIT 8;";
  
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });


   //graph dispensed
   router.get("/visits", (req, res) => {
    const query = `
         SELECT 
                YEAR(CURDATE()) AS CurrentYear,
                MONTHNAME(CURDATE()) AS MonthName,
                WEEK(medreport.date) - WEEK(DATE_SUB(medreport.date, INTERVAL DAY(medreport.date) - 1 DAY)) + 1 AS WeekOfMonth,
                daynames.name AS name,
                COALESCE(COUNT(medreport.date), 0) AS total
            FROM 
                (SELECT 'Monday' AS name UNION ALL
                SELECT 'Tuesday' UNION ALL
                SELECT 'Wednesday' UNION ALL
                SELECT 'Thursday' UNION ALL
                SELECT 'Friday' UNION ALL
                SELECT 'Saturday' UNION ALL
                SELECT 'Sunday') AS daynames
            LEFT JOIN 
                medreport 
            ON 
                DAYNAME(medreport.date) = daynames.name
                AND WEEK(medreport.date) = WEEK(CURDATE())
                AND MONTH(medreport.date) = MONTH(CURDATE())
                AND YEAR(medreport.date) = YEAR(CURDATE())
            GROUP BY 
                daynames.name
            ORDER BY 
                FIELD(daynames.name, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

            `;
    databaseConnection.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data); 
    });
  });
  
  


  export const dashboardRouter = router;
  
  
  