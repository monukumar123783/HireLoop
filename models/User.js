import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Clerk user id
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  resume: { type: String, default: '' },
  image: { type: String, required: true },
});

export default mongoose.model('User', userSchema);