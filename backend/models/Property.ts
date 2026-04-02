import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  priceUSD: { type: Number, required: true },
  priceETH: { type: Number, required: true },
  roi: { type: Number, required: true },  // percentage e.g. 12.5
  category: {
    type: String,
    enum: ['Mansion', 'Villa', 'Apartment', 'Commercial', 'Penthouse'],
    default: 'Villa',
  },
  location: { type: String, default: 'Unknown' },
  beds: { type: Number, default: 3 },
  baths: { type: Number, default: 2 },
  sqft: { type: Number, default: 1500 },
  status: {
    type: String,
    enum: ['Market', 'Owned', 'Pending'],
    default: 'Market',
  },
  isTopPick: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  description: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);
