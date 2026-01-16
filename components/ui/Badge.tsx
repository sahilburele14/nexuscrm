import React from 'react';
import { LeadStatus, LeadSource } from '../../types';

interface BadgeProps {
  type: 'status' | 'source';
  value: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case LeadStatus.New: return 'bg-blue-100 text-blue-800';
    case LeadStatus.Contacted: return 'bg-yellow-100 text-yellow-800';
    case LeadStatus.Converted: return 'bg-green-100 text-green-800';
    case LeadStatus.Lost: return 'bg-slate-100 text-slate-600';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getSourceColor = (source: string) => {
  switch (source) {
    case LeadSource.Website: return 'bg-indigo-100 text-indigo-700';
    case LeadSource.Ads: return 'bg-purple-100 text-purple-700';
    case LeadSource.Referral: return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const Badge: React.FC<BadgeProps> = ({ type, value }) => {
  const className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    type === 'status' ? getStatusColor(value) : getSourceColor(value)
  }`;

  return (
    <span className={className}>
      {value}
    </span>
  );
};
