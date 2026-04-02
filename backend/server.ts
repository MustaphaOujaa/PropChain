import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import Property from './models/Property';

import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/user', userRoutes);

app.get('/', (_req, res) => res.json({ message: 'PropChain API running ✓', version: '2.0' }));

// ── Rich Seed Data ────────────────────────────────────────────────────────────
const SEED_PROPERTIES = [
  {
    title: 'Villa Del Lago', category: 'Villa', location: 'Miami, FL',
    priceUSD: 875000, priceETH: 273.44, roi: 14.2, beds: 5, baths: 4, sqft: 4200,
    status: 'Market', isTopPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
    description: 'Stunning lakefront villa with panoramic views, private pool, and smart home systems.',
  },
  {
    title: 'Roma Avenue', category: 'Mansion', location: 'Beverly Hills, CA',
    priceUSD: 1250000, priceETH: 390.63, roi: 12.5, beds: 7, baths: 6, sqft: 6800,
    status: 'Market', isTopPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
    description: 'Iconic Beverly Hills mansion with grand entrance, movie theater, and resort-style pool.',
  },
  {
    title: 'Atlas Penthouse', category: 'Penthouse', location: 'New York, NY',
    priceUSD: 2100000, priceETH: 656.25, roi: 11.8, beds: 4, baths: 4, sqft: 3800,
    status: 'Market', isTopPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1628745277895-3d3a1b6df47b?w=800&auto=format&fit=crop',
    description: 'Sky-high Manhattan penthouse with 360° city views, private rooftop, and concierge service.',
  },
  {
    title: 'Germanrin Heights', category: 'Villa', location: 'Dallas, TX',
    priceUSD: 640000, priceETH: 200.0, roi: 15.3, beds: 4, baths: 3, sqft: 3500,
    status: 'Market', isTopPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    description: 'Modern Texas villa with open-plan living, infinity pool, and private tennis court.',
  },
  {
    title: 'Sunrise Apartments', category: 'Apartment', location: 'Chicago, IL',
    priceUSD: 320000, priceETH: 100.0, roi: 9.5, beds: 2, baths: 2, sqft: 1200,
    status: 'Market', isTopPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
    description: 'High-rise apartment with stunning lake views and premium amenities.',
  },
  {
    title: 'Marina Blue Flats', category: 'Apartment', location: 'San Diego, CA',
    priceUSD: 485000, priceETH: 151.56, roi: 10.7, beds: 3, baths: 2, sqft: 1650,
    status: 'Market', isTopPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
    description: 'Coastal apartment steps from the marina with modern finishes and ocean breezes.',
  },
  {
    title: 'The Grand Manor', category: 'Mansion', location: 'Scottsdale, AZ',
    priceUSD: 3200000, priceETH: 1000.0, roi: 8.9, beds: 10, baths: 9, sqft: 12000,
    status: 'Market', isTopPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop',
    description: 'Ultra-luxury desert estate with golf course access, spa, and exhibition garage.',
  },
  {
    title: 'Cobalt Tower Suite', category: 'Penthouse', location: 'Seattle, WA',
    priceUSD: 1800000, priceETH: 562.5, roi: 13.1, beds: 3, baths: 3, sqft: 3200,
    status: 'Market', isTopPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop',
    description: 'Iconic Seattle penthouse with Space Needle views and private elevator access.',
  },
  {
    title: 'Avondale Commercial Hub', category: 'Commercial', location: 'Austin, TX',
    priceUSD: 950000, priceETH: 296.88, roi: 17.4, beds: 0, baths: 0, sqft: 8500,
    status: 'Market', isTopPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop',
    description: 'Prime commercial property in booming Austin tech district with long-term tenants.',
  },
  {
    title: 'Casa Bonita', category: 'Villa', location: 'Miami Beach, FL',
    priceUSD: 760000, priceETH: 237.5, roi: 16.0, beds: 4, baths: 3, sqft: 3900,
    status: 'Pending', isTopPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop',
    description: 'Spanish-style villa with tropical garden, heated pool, and Art Deco interior.',
  },
  {
    title: 'The Orion Residences', category: 'Apartment', location: 'Las Vegas, NV',
    priceUSD: 290000, priceETH: 90.63, roi: 12.0, beds: 2, baths: 1, sqft: 1100,
    status: 'Market', isTopPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&auto=format&fit=crop',
    description: 'Modern Vegas high-rise with strip views, rooftop pool, and 24h concierge.',
  },
  {
    title: 'Hillside Manor', category: 'Mansion', location: 'Nashville, TN',
    priceUSD: 1450000, priceETH: 453.13, roi: 11.2, beds: 6, baths: 5, sqft: 7200,
    status: 'Market', isTopPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
    description: 'Grand Nashville estate with rolling hill views, wine cellar, and guest house.',
  },
];

app.post('/api/seed', async (_req, res) => {
  try {
    const existing = await Property.countDocuments();
    if (existing >= SEED_PROPERTIES.length) {
      return res.json({ message: 'Already seeded', count: existing });
    }
    await Property.deleteMany({});
    await Property.insertMany(SEED_PROPERTIES);
    res.json({ message: `Seeded ${SEED_PROPERTIES.length} properties successfully!` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed', details: String(err) });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 PropChain API running on http://localhost:${PORT}`);
  console.log(`   Seed the DB: POST http://localhost:${PORT}/api/seed\n`);
});
