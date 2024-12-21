export const STATUS = {
  OK: 200,
  CREATED: 201,
  UPDATED: 201,
  NOT_FOUND: 400,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  DEFAULT_ERROR: 418,
  INTERNAL_SERVER_ERROR: 500,
};

export const ENV = {
  MONGO_URI:
    'mongodb://root:mongo@127.0.0.1:27017/oz-tech-test?authSource=admin',
  SECRET: '6c2fa7d7bbdda28acafdbe60fb9870ed5300dc456b93cd6758658de57e9c21fa',
  SALT: 10,
};

//openssl rand -hex 32 (gerar chave)
