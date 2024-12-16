import express from 'express'; // Express
import router from './routes'; // Rotas
import i18nextMiddleware from 'i18next-http-middleware'; // Internacionalização
import i18n from './i18n'; // Internacionalização

const app = express();
app.use(express.json());
app.use(i18nextMiddleware.handle(i18n));

//routes.ts
app.use(router);

export default app.listen(3333, () => {
  console.info('OZtest is running in http://localhost:3333');
});
