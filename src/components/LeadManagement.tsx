
import React from 'react';
import { TrendingUp, Users, Target, Award, Star, Mail, Phone, Calendar } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  score: number;
  source: 'website' | 'referral' | 'social' | 'ads' | 'cold_outreach';
  assignedTo: string;
  avatar: string;
  status: 'new' | 'contacted' | 'qualified' | 'nurturing';
  lastActivity: string;
  value: number;
}

const LeadManagement = () => {
  const leads: Lead[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      company: 'Innovation Labs',
      score: 85,
      source: 'website',
      assignedTo: 'Sarah Wilson',
      avatar: 'SW',
      status: 'qualified',
      lastActivity: '2 hours ago',
      value: 50000
    },
    {
      id: '2',
      name: 'Rachel Green',
      company: 'StartupCo',
      score: 72,
      source: 'referral',
      assignedTo: 'Mike Johnson',
      avatar: 'MJ',
      status: 'nurturing',
      lastActivity: '1 day ago',
      value: 35000
    },
    {
      id: '3',
      name: 'James Wilson',
      company: 'TechVentures',
      score: 94,
      source: 'social',
      assignedTo: 'Sarah Wilson',
      avatar: 'SW',
      status: 'new',
      lastActivity: '30 minutes ago',
      value: 75000
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-crm-emerald bg-crm-emerald/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-crm-emerald to-emerald-400';
    if (score >= 60) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  const getSourceConfig = (source: string) => {
    const configs = {
      website: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Website' },
      referral: { color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Referral' },
      social: { color: 'text-pink-400', bg: 'bg-pink-500/20', label: 'Social' },
      ads: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Ads' },
      cold_outreach: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', label: 'Cold Outreach' }
    };
    return configs[source as keyof typeof configs];
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      new: { color: 'text-crm-status-lead', bg: 'bg-crm-status-lead/20', label: 'New' },
      contacted: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Contacted' },
      qualified: { color: 'text-crm-emerald', bg: 'bg-crm-emerald/20', label: 'Qualified' },
      nurturing: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Nurturing' }
    };
    return configs[status as keyof typeof configs];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-crm-text-white mb-2">
          Lead Management
        </h2>
        <p className="text-crm-text-secondary">
          Track and nurture leads through the sales funnel
        </p>
      </div>

      {/* Lead Scoring Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="crm-card p-6 border-l-4 border-crm-emerald">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-crm-emerald/20 rounded-lg">
              <Star className="w-6 h-6 text-crm-emerald" />
            </div>
            <span className="text-2xl font-bold text-crm-emerald">94</span>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Top Score</h4>
          <p className="text-sm text-crm-text-secondary">Highest lead score</p>
        </div>

        <div className="crm-card p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-amber-400">84</span>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Avg Score</h4>
          <p className="text-sm text-crm-text-secondary">Average lead score</p>
        </div>

        <div className="crm-card p-6 border-l-4 border-crm-electric">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-crm-electric/20 rounded-lg">
              <Users className="w-6 h-6 text-crm-electric" />
            </div>
            <span className="text-2xl font-bold text-crm-electric">28</span>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Active Leads</h4>
          <p className="text-sm text-crm-text-secondary">Currently managed</p>
        </div>

        <div className="crm-card p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-purple-400">68%</span>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Conversion</h4>
          <p className="text-sm text-crm-text-secondary">Lead to customer</p>
        </div>
      </div>

      {/* Lead List */}
      <div className="crm-card">
        <div className="p-6 border-b border-crm-tertiary">
          <h3 className="text-lg font-semibold text-crm-text-white">Recent Leads</h3>
        </div>
        
        <div className="divide-y divide-crm-tertiary">
          {leads.map((lead) => {
            const sourceConfig = getSourceConfig(lead.source);
            const statusConfig = getStatusConfig(lead.status);
            const scoreColor = getScoreColor(lead.score);
            const scoreGradient = getScoreGradient(lead.score);
            
            return (
              <div key={lead.id} className="p-6 hover:bg-crm-tertiary/20 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-crm-electric rounded-full flex items-center justify-center text-white font-medium">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium text-crm-text-white">{lead.name}</h4>
                      <p className="text-sm text-crm-text-secondary">{lead.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-mono font-bold text-crm-text-white">
                        {formatCurrency(lead.value)}
                      </p>
                      <p className="text-xs text-crm-text-secondary">Potential value</p>
                    </div>
                  </div>
                </div>

                {/* Lead Score Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-crm-text-secondary">Lead Score</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${scoreColor}`}>
                      {lead.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-crm-tertiary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${scoreGradient} transition-all duration-300`}
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                </div>

                {/* Tags and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceConfig.bg} ${sourceConfig.color}`}>
                      {sourceConfig.label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-crm-text-secondary">
                    <span className="text-xs">Assigned to {lead.assignedTo}</span>
                    <span className="text-xs">• {lead.lastActivity}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2 mt-4">
                  <button className="p-2 bg-crm-tertiary hover:bg-crm-electric text-crm-text-secondary hover:text-white rounded-lg transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-crm-tertiary hover:bg-crm-emerald text-crm-text-secondary hover:text-white rounded-lg transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-crm-tertiary hover:bg-amber-500 text-crm-text-secondary hover:text-white rounded-lg transition-colors">
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeadManagement;
