
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, DollarSign, Users, Calendar } from 'lucide-react';

const ReportsAnalytics = () => {
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, target: 50000 },
    { month: 'Feb', revenue: 52000, target: 50000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 55000 },
    { month: 'May', revenue: 58000, target: 55000 },
    { month: 'Jun', revenue: 67000, target: 60000 }
  ];

  const performanceData = [
    { name: 'Sarah Wilson', deals: 24, revenue: 320000 },
    { name: 'Mike Johnson', deals: 18, revenue: 245000 },
    { name: 'Emma Davis', deals: 15, revenue: 180000 },
    { name: 'Tom Smith', deals: 12, revenue: 150000 }
  ];

  const pipelineData = [
    { name: 'Prospecting', value: 35, color: '#a78bfa' },
    { name: 'Qualification', value: 25, color: '#22d3ee' },
    { name: 'Proposal', value: 20, color: '#fbbf24' },
    { name: 'Negotiation', value: 15, color: '#fb923c' },
    { name: 'Closed Won', value: 5, color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-crm-text-white mb-2">
          Reports & Analytics
        </h2>
        <p className="text-crm-text-secondary">
          Executive dashboard with key performance insights
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="crm-card p-6 border-l-4 border-crm-emerald">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-crm-emerald/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-crm-emerald" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-crm-emerald text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5%
              </div>
            </div>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Total Revenue</h4>
          <p className="text-2xl font-bold text-crm-text-white">$895,000</p>
          <p className="text-sm text-crm-text-secondary">This quarter</p>
        </div>

        <div className="crm-card p-6 border-l-4 border-crm-electric">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-crm-electric/20 rounded-lg">
              <Target className="w-6 h-6 text-crm-electric" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-crm-electric text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.2%
              </div>
            </div>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Conversion Rate</h4>
          <p className="text-2xl font-bold text-crm-text-white">24.8%</p>
          <p className="text-sm text-crm-text-secondary">Lead to customer</p>
        </div>

        <div className="crm-card p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-red-400 text-sm">
                <TrendingDown className="w-4 h-4 mr-1" />
                -3.1%
              </div>
            </div>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Active Deals</h4>
          <p className="text-2xl font-bold text-crm-text-white">127</p>
          <p className="text-sm text-crm-text-secondary">In pipeline</p>
        </div>

        <div className="crm-card p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center text-crm-emerald text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15.7%
              </div>
            </div>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Avg Deal Size</h4>
          <p className="text-2xl font-bold text-crm-text-white">$47,200</p>
          <p className="text-sm text-crm-text-secondary">This month</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Target */}
        <div className="crm-card p-6">
          <h3 className="text-lg font-semibold text-crm-text-white mb-6">
            Revenue vs Target
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline Distribution */}
        <div className="crm-card p-6">
          <h3 className="text-lg font-semibold text-crm-text-white mb-6">
            Pipeline Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pipelineData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pipelineData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-crm-text-secondary">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="crm-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-crm-text-white mb-6">
            Team Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#cbd5e1" />
              <YAxis dataKey="name" type="category" stroke="#cbd5e1" width={100} />
              <Bar dataKey="deals" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Table */}
      <div className="crm-card">
        <div className="p-6 border-b border-crm-tertiary">
          <h3 className="text-lg font-semibold text-crm-text-white">Sales Performance Details</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-crm-tertiary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-crm-text-secondary uppercase tracking-wider">
                  Sales Rep
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-crm-text-secondary uppercase tracking-wider">
                  Deals Closed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-crm-text-secondary uppercase tracking-wider">
                  Revenue Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-crm-text-secondary uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-crm-text-secondary uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-crm-tertiary">
              {performanceData.map((rep, index) => {
                const conversionRate = (rep.deals / 30 * 100).toFixed(1);
                const performance = ((rep.revenue / 350000) * 100).toFixed(0);
                
                return (
                  <tr key={rep.name} className="hover:bg-crm-tertiary/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-crm-electric rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          {rep.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-crm-text-white font-medium">{rep.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-crm-text-white font-mono">
                      {rep.deals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-crm-text-white font-mono">
                      ${rep.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-crm-text-white">
                      {conversionRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-crm-tertiary rounded-full h-2 mr-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-crm-electric to-crm-emerald"
                            style={{ width: `${performance}%` }}
                          />
                        </div>
                        <span className="text-crm-text-white text-sm">{performance}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
