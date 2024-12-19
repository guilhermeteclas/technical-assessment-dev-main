import mongoose from 'mongoose';
import { ENV } from './utils';

const init = async function () {
  await mongoose.connect(ENV.MONGO_URI);
};
export default init();
