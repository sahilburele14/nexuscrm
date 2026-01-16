export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Converted = 'Converted',
  Lost = 'Lost'
}

export enum LeadSource {
  Website = 'Website',
  Ads = 'Ads',
  Referral = 'Referral',
  Social = 'Social'
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string; // ISO Date string
  notes?: string;
  company?: string;
  lastContacted?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  page: number;
  limit: number;
  sortBy: keyof Lead;
  sortOrder: 'asc' | 'desc';
}

export interface DashboardStats {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  leadsByStatus: { name: string; value: number; color: string }[];
  leadsBySource: { name: string; value: number }[];
}
