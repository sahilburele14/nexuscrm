import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MockAPI } from '../services/mockDb';
import { generateEmailDraft } from '../services/geminiService';
import { Lead } from '../types';
import { Badge } from './ui/Badge';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<string>('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      if (id) {
        const data = await MockAPI.getLeadById(id);
        if (data) setLead(data);
        else navigate('/leads'); // Handle 404
        setLoading(false);
      }
    };
    fetchLead();
  }, [id, navigate]);

  const handleGenerateEmail = async () => {
    if (!lead) return;
    setGenerating(true);
    const text = await generateEmailDraft(lead);
    setDraft(text);
    setGenerating(false);
  };

  if (loading) return <div className="p-8 text-center"><i className="fa-solid fa-circle-notch fa-spin text-2xl text-primary-500"></i></div>;
  if (!lead) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/leads')} className="text-sm text-gray-500 hover:text-gray-900">
        <i className="fa-solid fa-arrow-left mr-1"></i> Back to Leads
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl mr-4">
             {lead.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-500">{lead.company}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Edit
          </button>
          <button className="px-4 py-2 bg-primary-600 rounded-lg text-sm font-medium text-white hover:bg-primary-700">
            Convert Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase">Email</label>
                <div className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                  <i className="fa-regular fa-envelope text-gray-400 mr-2"></i> {lead.email}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase">Phone</label>
                <div className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                  <i className="fa-solid fa-phone text-gray-400 mr-2"></i> {lead.phone}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase">Status</label>
                <div className="mt-1"><Badge type="status" value={lead.status} /></div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase">Source</label>
                <div className="mt-1"><Badge type="source" value={lead.source} /></div>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-xs text-gray-500 uppercase">Notes</label>
              <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {lead.notes}
              </p>
            </div>
          </div>

          {/* AI Email Drafter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-purple-500">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <i className="fa-solid fa-wand-magic-sparkles text-purple-500 mr-2"></i> 
                  AI Email Drafter
                </h2>
                <button 
                  onClick={handleGenerateEmail}
                  disabled={generating}
                  className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate Draft'}
                </button>
             </div>
             
             {draft ? (
               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                 <textarea 
                    className="w-full bg-transparent text-sm text-gray-800 focus:outline-none resize-none h-48"
                    value={draft}
                    readOnly
                 />
                 <div className="mt-2 flex justify-end">
                   <button 
                    onClick={() => navigator.clipboard.writeText(draft)}
                    className="text-xs text-gray-500 hover:text-gray-900 flex items-center"
                   >
                     <i className="fa-regular fa-copy mr-1"></i> Copy to clipboard
                   </button>
                 </div>
               </div>
             ) : (
               <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                 <p className="text-sm text-gray-500">Click "Generate Draft" to create a personalized outreach email using Gemini AI.</p>
               </div>
             )}
          </div>
        </div>

        {/* Timeline / Activity - Static for Demo */}
        <div className="space-y-6">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Activity Timeline</h2>
            <ul className="space-y-4">
              <li className="relative pl-6 pb-2 border-l-2 border-gray-200 last:border-0">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                <p className="text-xs text-gray-500 mb-1">Today</p>
                <p className="text-sm font-medium text-gray-900">Lead viewed via {lead.source}</p>
              </li>
              <li className="relative pl-6 pb-2 border-l-2 border-gray-200 last:border-0">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary-500 border-2 border-white"></div>
                <p className="text-xs text-gray-500 mb-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
                <p className="text-sm font-medium text-gray-900">Lead Created</p>
              </li>
            </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
