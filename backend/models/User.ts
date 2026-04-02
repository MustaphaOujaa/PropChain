import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
  amount: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'PropChain User' },
  avatarUrl: { type: String, default: '' },
  walletBalance: { type: Number, default: 250000 },
  nftCollection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  activityLogs: [activityLogSchema],
}, { timestamps: true });

userSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) { next(); return; }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('User', userSchema);
