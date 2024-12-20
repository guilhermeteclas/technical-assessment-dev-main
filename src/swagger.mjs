import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'OZtest API Documentation',
    version: '1.0.0',
    description: 'Documentação completa da API.',
  },
  schemes: ['http'],
  host: 'localhost:3333',
  basePath: '/',
  tags: [
    { name: 'Users' },
    { name: 'Regions' },
    { name: 'Auth' },
  ],
};

const outputFile = './swagger-output.json';
const routes = ['./src/server.ts'];

swaggerAutogen()(outputFile, routes, doc);
//swaggerAutogen({ language: 'pt-BR' })(outputFile, routes, doc);