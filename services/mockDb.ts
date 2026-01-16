import { Lead, LeadStatus, LeadSource, PaginatedResponse, LeadFilters, DashboardStats } from '../types';

// --- SEED DATA GENERATOR ---
const generateDummyLeads = (count: number): Lead[] => {
  const leads: Lead[] = [];
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const companies = ['TechCorp', 'Innovate', 'GlobalSol', 'NetWorks', 'AlphaStream', 'BlueSky', 'RapidScale'];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const statusKeys = Object.values(LeadStatus);
    const sourceKeys = Object.values(LeadSource);

    // Random date within last year
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));

    leads.push({
      _id: `lead_${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com`,
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      company: company,
      status: statusKeys[Math.floor(Math.random() * statusKeys.length)],
      source: sourceKeys[Math.floor(Math.random() * sourceKeys.length)],
      createdAt: date.toISOString(),
      notes: `Generated dummy lead #${i + 1} for testing purposes.`
    });
  }
  return leads;
};

// Initialize DB in memory
let db: Lead[] = generateDummyLeads(500);

// --- SIMULATED BACKEND API ---

export const MockAPI = {
  getLeads: async (filters: LeadFilters): Promise<PaginatedResponse<Lead>> => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 400));

    let filtered = [...db];

    // 1. Search (Name/Email)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(q) || 
        l.email.toLowerCase().includes(q)
      );
    }

    // 2. Filter Status
    if (filters.status && filters.status !== 'All') {
      filtered = filtered.filter(l => l.status === filters.status);
    }

    // 3. Filter Source
    if (filters.source && filters.source !== 'All') {
      filtered = filtered.filter(l => l.source === filters.source);
    }

    // 4. Sorting
    filtered.sort((a, b) => {
      const valA = a[filters.sortBy];
      const valB = b[filters.sortBy];

      if (valA === undefined || valB === undefined) return 0;

      if (valA < valB) return filters.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // 5. Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / filters.limit);
    const startIndex = (filters.page - 1) * filters.limit;
    const data = filtered.slice(startIndex, startIndex + filters.limit);

    return {
      data,
      total,
      page: filters.page,
      totalPages
    };
  },

  getLeadById: async (id: string): Promise<Lead | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return db.find(l => l._id === id);
  },

  getStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const totalLeads = db.length;
    const convertedLeads = db.filter(l => l.status === LeadStatus.Converted).length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Status Distribution
    const statusCounts = db.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors: Record<string, string> = {
      [LeadStatus.New]: '#3b82f6', // Blue
      [LeadStatus.Contacted]: '#eab308', // Yellow
      [LeadStatus.Converted]: '#22c55e', // Green
      [LeadStatus.Lost]: '#94a3b8' // Slate
    };

    const leadsByStatus = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status],
      color: colors[status] || '#cbd5e1'
    }));

    // Source Distribution
    const sourceCounts = db.reduce((acc, curr) => {
      acc[curr.source] = (acc[curr.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const leadsBySource = Object.keys(sourceCounts).map(source => ({
      name: source,
      value: sourceCounts[source]
    }));

    return {
      totalLeads,
      convertedLeads,
      conversionRate,
      leadsByStatus,
      leadsBySource
    };
  }
};
