import { Request, Response } from 'express';
import User from '../models/User';
import Property from '../models/Property';

// GET /api/dashboard — combined data for the dashboard page
export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;

    // Run all queries in parallel
    const [allProperties, topPicks, user] = await Promise.all([
      Property.find({}).select('title priceUSD priceETH roi category status'),
      Property.find({ isTopPick: true, status: 'Market' }).limit(5),
      userId ? User.findById(userId).populate('nftCollection') : null,
    ]);

    const totalProperties  = allProperties.length;
    const marketProperties = allProperties.filter(p => p.status === 'Market').length;
    const ownedProperties  = allProperties.filter(p => p.status === 'Owned').length;
    const totalValueUSD    = allProperties.reduce((s, p) => s + p.priceUSD, 0);
    const avgROI           = totalProperties
      ? parseFloat((allProperties.reduce((s, p) => s + p.roi, 0) / totalProperties).toFixed(2))
      : 0;

    // Investment stats (mock Ether values derived from real data)
    const totalInvestmentETH = user
      ? (user.nftCollection as any[]).reduce((s: number, p: any) => s + (p.priceETH || 0), 0)
      : 0.56;
    const weeklyReturnsETH = parseFloat((totalInvestmentETH * 0.009).toFixed(4));
    const expensesETH      = parseFloat((totalInvestmentETH * 0.009).toFixed(4));

    // Distributions chart data (7-day mock wave)
    const distributions = [
      { label: '0',   value: 200 },
      { label: 'Mon', value: 225 },
      { label: 'Tue', value: 178 },
      { label: 'Wed', value: 160 },
      { label: 'Thu', value: 265 },
      { label: 'Fri', value: 220 },
      { label: 'Sat', value: 242 },
      { label: 'Sun', value: 258 },
    ];

    // User profile snapshot
    const profile = user
      ? {
          name:          user.name,
          email:         user.email,
          walletBalance: user.walletBalance,
          monthlyProfit: parseFloat((user.walletBalance * 0.027).toFixed(0)),
          ownedCount:    (user.nftCollection || []).length,
        }
      : null;

    res.json({
      stats: {
        totalProperties,
        marketProperties,
        ownedProperties,
        totalValueUSD,
        avgROI,
        totalInvestmentETH: parseFloat(totalInvestmentETH.toFixed(4)),
        weeklyReturnsETH,
        expensesETH,
      },
      topPicks,
      distributions,
      profile,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};
