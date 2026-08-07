import type { ApiResponse } from "./auth";

export interface AudienceList {
  id: string;
  workspaceId: string;
  name: string;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListContact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  addedAt: string;
}

// Mock Data
let mockLists: AudienceList[] = [
  {
    id: "list-1",
    workspaceId: "ws-1",
    name: "Newsletter Subscribers",
    contactCount: 1520,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "list-2",
    workspaceId: "ws-1",
    name: "VIP Customers",
    contactCount: 345,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockListContacts: Record<string, ListContact[]> = {
  "list-1": [
    { id: "c1", email: "alice@example.com", firstName: "Alice", lastName: "Smith", status: "ACTIVE", addedAt: new Date().toISOString() },
    { id: "c2", email: "bob@example.com", firstName: "Bob", lastName: "Johnson", status: "ACTIVE", addedAt: new Date().toISOString() },
  ],
  "list-2": [
    { id: "c3", email: "charlie@example.com", firstName: "Charlie", lastName: "Brown", status: "ACTIVE", addedAt: new Date().toISOString() },
  ]
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const listApi = {
  getLists: async (): Promise<ApiResponse<AudienceList[]>> => {
    await delay(600);
    return { success: true, message: null, data: [...mockLists] };
  },

  getList: async (id: string): Promise<ApiResponse<AudienceList>> => {
    await delay(400);
    const list = mockLists.find(l => l.id === id);
    if (!list) throw new Error("List not found");
    return { success: true, message: null, data: list };
  },

  createList: async (name: string): Promise<ApiResponse<AudienceList>> => {
    await delay(800);
    const newList: AudienceList = {
      id: `list-${Date.now()}`,
      workspaceId: "ws-1",
      name,
      contactCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLists.unshift(newList);
    mockListContacts[newList.id] = [];
    return { success: true, message: null, data: newList };
  },

  updateList: async (id: string, name: string): Promise<ApiResponse<AudienceList>> => {
    await delay(600);
    const list = mockLists.find(l => l.id === id);
    if (!list) throw new Error("List not found");
    list.name = name;
    list.updatedAt = new Date().toISOString();
    return { success: true, message: null, data: list };
  },

  deleteList: async (id: string): Promise<ApiResponse<void>> => {
    await delay(600);
    mockLists = mockLists.filter(l => l.id !== id);
    delete mockListContacts[id];
    return { success: true, message: null, data: undefined as any };
  },

  getListContacts: async (listId: string): Promise<ApiResponse<ListContact[]>> => {
    await delay(500);
    return { success: true, message: null, data: mockListContacts[listId] || [] };
  },

  addContactsToList: async (listId: string, contactIds: string[]): Promise<ApiResponse<void>> => {
    await delay(800);
    const list = mockLists.find(l => l.id === listId);
    if (list) {
      list.contactCount += contactIds.length;
      list.updatedAt = new Date().toISOString();
      
      // In a real app we'd fetch full contact details from the DB. 
      // Mocking it by pushing dummy shapes:
      contactIds.forEach(cId => {
        if (!mockListContacts[listId]) mockListContacts[listId] = [];
        mockListContacts[listId].push({
          id: cId,
          email: `contact-${cId}@example.com`,
          firstName: "Added",
          lastName: "Contact",
          status: "ACTIVE",
          addedAt: new Date().toISOString(),
        });
      });
    }
    return { success: true, message: null, data: undefined as any };
  },

  removeContactFromList: async (listId: string, contactId: string): Promise<ApiResponse<void>> => {
    await delay(600);
    if (mockListContacts[listId]) {
      mockListContacts[listId] = mockListContacts[listId].filter(c => c.id !== contactId);
    }
    const list = mockLists.find(l => l.id === listId);
    if (list && list.contactCount > 0) {
      list.contactCount -= 1;
      list.updatedAt = new Date().toISOString();
    }
    return { success: true, message: null, data: undefined as any };
  }
};
