import { Request, Response } from 'express';
import User from '../models/User';
import Property from '../models/Property';

export const getUserPortfolio = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user._id).populate('nftCollection');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const nfts = user.nftCollection as any[];
    const totalInvestedUSD = nfts.reduce((sum: number, p: any) => sum + (p.priceUSD || 0), 0);
    const avgROI = nfts.length > 0 ? nfts.reduce((sum: number, p: any) => sum + (p.roi || 0), 0) / nfts.length : 0;
    const estimatedReturns = totalInvestedUSD * (avgROI / 100);

    res.json({
      profile: {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        walletBalance: user.walletBalance,
      },
      portfolio: {
        totalInvestedUSD,
        estimatedReturns: parseFloat(estimatedReturns.toFixed(2)),
        totalProperties: nfts.length,
        avgROI: parseFloat(avgROI.toFixed(2)),
        weeklyData: [42, 68, 55, 79, 65, 88, 73],
        distributionData: [
          { name: 'Mansions', value: nfts.filter((p: any) => p.category === 'Mansion').length || 1 },
          { name: 'Villas', value: nfts.filter((p: any) => p.category === 'Villa').length || 2 },
          { name: 'Apartments', value: nfts.filter((p: any) => p.category === 'Apartment').length || 3 },
          { name: 'Commercial', value: nfts.filter((p: any) => p.category === 'Commercial').length || 1 },
        ],
      },
      ownedNFTs: nfts,
      activityLogs: user.activityLogs.slice(-10).reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching portfolio' });
  }
};

export const purchaseProperty = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.status !== 'Market') return res.status(400).json({ message: 'Property is not available for purchase' });

    const user = await User.findById((req as any).user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.walletBalance < property.priceUSD) return res.status(400).json({ message: 'Insufficient wallet balance' });

    user.walletBalance -= property.priceUSD;
    user.nftCollection.push(property._id as any);
    user.activityLogs.push({ action: `Purchased "${property.title}"`, propertyId: property._id as any, amount: property.priceUSD } as any);
    await user.save();

    property.status = 'Owned';
    property.owner = user._id as any;
    await property.save();

    res.json({ message: `Successfully purchased "${property.title}"!`, walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Server error processing purchase' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, avatarUrl } = req.body;
    const user = await User.findById((req as any).user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    await user.save();

    res.json({ message: 'Profile updated', name: user.name, avatarUrl: user.avatarUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById((req as any).user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await (user as any).matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error changing password' });
  }
};
