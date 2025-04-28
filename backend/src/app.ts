import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import routes from './routes';
import path from 'path';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api', routes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express + TypeScript API');
});

// console.log('Available routes:');
// routes.stack.forEach((route) => console.log(route.route?.path));

app.listen(PORT, () => {
  console.log(`Server running on http://${process.env.DB_HOST}:${PORT}`);
});
