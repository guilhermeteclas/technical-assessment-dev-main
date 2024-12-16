import express from 'express'; //Express
import router from './routes';

const app = express();
app.use(express.json());

//routes.ts
app.use(router);

export default app.listen(3333, () => {
  console.info('OZtest is running in http://localhost:3333');
});
