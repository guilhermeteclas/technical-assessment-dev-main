import mongoose from 'mongoose';

const env = {
  MONGO_URI:
    'mongodb://root:mongo@127.0.0.1:27017/oz-tech-test?authSource=admin',
};

const init = async function () {
  await mongoose.connect(env.MONGO_URI);
};

export default init();
