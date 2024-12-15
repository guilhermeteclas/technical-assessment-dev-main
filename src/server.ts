import express from 'express'; // Correct import of express
import router from './routes';

const app = express();
app.use(express.json());

app.use(router);

export default app.listen(3333, () => {
  console.info('OZtest is running in http://localhost:3333');
});
