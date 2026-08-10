const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface DashboardKpi {
  totalSent: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  openRateTrend: number; // e.g. 5.2 means +5.2%
  clickRateTrend: number;
  bounceRateTrend: number;
  sentTrend: number;
}

export interface TimeSeriesData {
  date: string;
  opens: number;
  clicks: number;
  sends: number;
}

export interface CampaignAnalytics {
  campaignId: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalUnsubscribed: number;
}

export interface CampaignRecipient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: "SENT" | "DELIVERED" | "OPENED" | "CLICKED" | "BOUNCED" | "UNSUBSCRIBED" | "FAILED";
  updatedAt: string;
}

export interface BackendResponse<T> {
  data: T;
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }
}

// Mock Data
const mockDashboardKpi: DashboardKpi = {
  totalSent: 124500,
  openRate: 42.5,
  clickRate: 12.3,
  bounceRate: 1.2,
  sentTrend: 15.4,
  openRateTrend: 2.1,
  clickRateTrend: -0.5,
  bounceRateTrend: -0.2,
};

const mockTimeSeries: TimeSeriesData[] = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toISOString().split("T")[0],
    sends: Math.floor(Math.random() * 5000) + 1000,
    opens: Math.floor(Math.random() * 3000) + 500,
    clicks: Math.floor(Math.random() * 800) + 100,
  };
});

const mockCampaignAnalytics: CampaignAnalytics = {
  campaignId: "mock-1",
  totalSent: 50000,
  totalDelivered: 49500,
  totalOpened: 24500,
  totalClicked: 8200,
  totalBounced: 400,
  totalUnsubscribed: 100,
};

const mockRecipients: CampaignRecipient[] = Array.from({ length: 25 }).map((_, i) => {
  const statuses: CampaignRecipient["status"][] = ["DELIVERED", "OPENED", "CLICKED", "BOUNCED", "SENT"];
  return {
    id: `recip-${i}`,
    email: `subscriber${i}@example.com`,
    firstName: `John${i}`,
    lastName: `Doe${i}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    updatedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  };
});

export const analyticsApi = {
  getDashboardKpi: async (): Promise<DashboardKpi> => {
    await delay(600);
    return mockDashboardKpi;
  },
  
  getDashboardTimeSeries: async (): Promise<TimeSeriesData[]> => {
    await delay(800);
    return mockTimeSeries;
  },

  getCampaignAnalytics: async (campaignId: string): Promise<CampaignAnalytics> => {
    await delay(500);
    return { ...mockCampaignAnalytics, campaignId };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCampaignTimeSeries: async (_campaignId: string): Promise<TimeSeriesData[]> => {
    await delay(700);
    // Return last 7 days for campaign specific
    return mockTimeSeries.slice(-7);
  },

  getCampaignRecipients: async (campaignId: string, page = 0, size = 20): Promise<BackendResponse<CampaignRecipient[]>> => {
    await delay(400);
    return {
      data: mockRecipients.slice(0, size),
      pagination: {
        page,
        size,
        totalElements: 1250,
        totalPages: Math.ceil(1250 / size)
      }
    };
  }
};
