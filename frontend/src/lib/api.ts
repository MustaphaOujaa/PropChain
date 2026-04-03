import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('propchain_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string; name?: string }) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// ── Properties ────────────────────────────────────────────────────────────────
export interface Property {
  _id: string;
  title: string;
  imageUrl: string;
  priceUSD: number;
  priceETH: number;
  roi: number;
  category: 'Mansion' | 'Villa' | 'Apartment' | 'Commercial' | 'Penthouse';
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  status: 'Market' | 'Owned' | 'Pending';
  isTopPick: boolean;
  owner: { _id: string; name: string; avatarUrl: string; email: string } | null;
  description: string;
  createdAt: string;
}

export const propertyApi = {
  getAll: (params?: { category?: string; status?: string; search?: string }) =>
    api.get<Property[]>('/properties', { params }),
  getById: (id: string) => api.get<Property>(`/properties/${id}`),
  getTopPicks: () => api.get<Property[]>('/properties/top-picks'),
  getStats: () => api.get('/properties/stats'),
};

// ── User ─────────────────────────────────────────────────────────────────────
export interface PortfolioData {
  profile: { _id: string; email: string; name: string; avatarUrl: string; walletBalance: number };
  portfolio: {
    totalInvestedUSD: number;
    estimatedReturns: number;
    totalProperties: number;
    avgROI: number;
    weeklyData: number[];
    distributionData: { name: string; value: number }[];
  };
  ownedNFTs: Property[];
  activityLogs: { action: string; amount: number; timestamp: string }[];
}

export const userApi = {
  getPortfolio: () => api.get<PortfolioData>('/user/portfolio'),
  purchase: (propertyId: string) => api.post('/user/purchase', { propertyId }),
  deposit: (amount: number) => api.post('/user/deposit', { amount }),
  updateProfile: (data: { name?: string; avatarUrl?: string }) => api.put('/user/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => api.put('/user/password', data),
};

// ── Dashboard ─────────────────────────────────────────────
export interface DashboardData {
  stats: {
    totalProperties: number;
    marketProperties: number;
    ownedProperties: number;
    totalValueUSD: number;
    avgROI: number;
    totalInvestmentETH: number;
    weeklyReturnsETH: number;
    expensesETH: number;
  };
  topPicks: Property[];
  distributions: { label: string; value: number }[];
  profile: {
    name: string;
    email: string;
    walletBalance: number;
    monthlyProfit: number;
    ownedCount: number;
  } | null;
}

export const dashboardApi = {
  get: () => api.get<DashboardData>('/dashboard'),
};

export default api;
