import express, { Request, Response } from 'express';
import routes from './routes';
import { config } from 'dotenv';

config();

const app = express();

const port = process.env.PORT || 3003;

app.get('', (req: Request, res: Response) => {
    res.send('Api works');
});

app.use(routes);

app.listen(port, () => {
    console.log(`App is running in port ${port}`);
});