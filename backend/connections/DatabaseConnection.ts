import mysql from 'mysql2';

const databaseConnection: mysql.Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'reydelocon',
    database: 'store-locator',
  });
  
  
  databaseConnection.connect((err) => {
   if(err) return console.log(err);
  
   return console.log('Database connected');
  })

  export { databaseConnection };