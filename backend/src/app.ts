import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Backend is running'));

app.use(errorHandler);

export default app;
