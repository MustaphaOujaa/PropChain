import { Request, Response } from 'express';
import Property from '../models/Property';

// Stable ETH mock rate: 1 ETH = $3,200
const ETH_RATE = 3200;

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { category, status, search } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const properties = await Property.find(filter).populate('owner', 'name avatarUrl email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching properties' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name avatarUrl email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTopPicks = async (req: Request, res: Response) => {
  try {
    const topPicks = await Property.find({ isTopPick: true, status: 'Market' }).limit(5);
    res.json(topPicks);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching top picks' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalProperties = await Property.countDocuments();
    const marketProperties = await Property.countDocuments({ status: 'Market' });
    const ownedProperties = await Property.countDocuments({ status: 'Owned' });
    const allProperties = await Property.find({});
    const totalValueUSD = allProperties.reduce((sum, p) => sum + p.priceUSD, 0);
    const avgROI = allProperties.reduce((sum, p) => sum + p.roi, 0) / (totalProperties || 1);

    res.json({ totalProperties, marketProperties, ownedProperties, totalValueUSD, avgROI: parseFloat(avgROI.toFixed(2)), ethRate: ETH_RATE });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
