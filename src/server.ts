import express from 'express'; // Express
import router from './routes'; // Rotas
import i18nextMiddleware from 'i18next-http-middleware'; // Internacionalização
import i18n from './i18n'; // Internacionalização
import session from 'express-session'; // Session
import MongoStore from 'connect-mongo'; // Session
import swaggerUi from 'swagger-ui-express'; // api-docs
import swaggerDocument from './swagger-output.json'; // api-docs

import { ENV } from './utils';

const app = express();
app.use(express.json());
app.use(i18nextMiddleware.handle(i18n));

// Session
app.use(
  session({
    secret: ENV.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: ENV.MONGO_URI,
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  }),
);

// Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'OZtest API',
  }),
);

//routes.ts
app.use(router);

export default app.listen(3333, () => {
  console.info('OZtest is running in http://localhost:3333');
});
