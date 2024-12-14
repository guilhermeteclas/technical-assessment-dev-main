import app from 'express';
import router from '../routes';

const server = app();
server.use(router);

export default server.listen(3333, () => {
  console.log("OZtest is running in http://localhost:3333");
});