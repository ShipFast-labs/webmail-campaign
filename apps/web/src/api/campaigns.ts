const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "PAUSED" | "COMPLETED" | "CANCELLED";

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  status: CampaignStatus;
  templateId: string | null;
  targetListId: string | null;
  scheduledAt: string | null;
  createdAt: string;
}

export interface CreateCampaignPayload {
  name: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  templateId: string;
  targetListId: string;
  scheduledAt?: string | null; 
}

// In-memory mock data
let mockCampaigns: Campaign[] = [
  {
    id: "camp-1",
    name: "Welcome Series - Aug 2026",
    subject: "Welcome to our platform!",
    fromName: "Acme Corp",
    fromEmail: "hello@acme.com",
    status: "COMPLETED",
    templateId: "tpl-1",
    targetListId: "list-1",
    scheduledAt: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "camp-2",
    name: "Weekly Newsletter - Issue #42",
    subject: "This week's updates",
    fromName: "Acme Corp",
    fromEmail: "newsletter@acme.com",
    status: "SCHEDULED",
    templateId: "tpl-2",
    targetListId: "list-2",
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export const campaignsApi = {
  listCampaigns: async () => {
    await delay(600);
    return mockCampaigns;
  },

  getCampaign: async (id: string) => {
    await delay(400);
    const campaign = mockCampaigns.find((c) => c.id === id);
    if (!campaign) throw new Error("Campaign not found");
    return campaign;
  },

  createCampaign: async (payload: CreateCampaignPayload) => {
    await delay(800);
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      ...payload,
      status: payload.scheduledAt ? "SCHEDULED" : "COMPLETED", // Send now transitions to completed in mock
      scheduledAt: payload.scheduledAt ?? null,
      createdAt: new Date().toISOString(),
    };
    mockCampaigns = [newCampaign, ...mockCampaigns];
    return newCampaign;
  },
  
  sendNow: async (id: string) => {
    await delay(1000);
    const campaign = mockCampaigns.find((c) => c.id === id);
    if (!campaign) throw new Error("Campaign not found");
    
    // Simulate transitioning
    campaign.status = "COMPLETED";
    return campaign;
  },
  
  cancelCampaign: async (id: string) => {
    await delay(500);
    const campaign = mockCampaigns.find((c) => c.id === id);
    if (!campaign) throw new Error("Campaign not found");
    
    campaign.status = "CANCELLED";
    return campaign;
  },
};
