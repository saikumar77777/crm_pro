
import React, { useState } from 'react';
import CRMSidebar from '../components/CRMSidebar';
import MetricsCard from '../components/MetricsCard';
import ActivityFeed from '../components/ActivityFeed';
import NotificationCenter from '../components/NotificationCenter';
import { useAuth } from '@/hooks/useAuth';
import { useContacts } from '@/hooks/useContacts';
import { useDeals } from '@/hooks/useDeals';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Users, DollarSign, TrendingUp, Target, Calendar, BarChart3, Zap } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'notifications'>('dashboard');
  const { user } = useAuth();
  const { contacts } = useContacts();
  const { deals } = useDeals();
  const { unreadCount } = useNotifications();

  // Calculate metrics from real data
  const totalRevenue = deals
    .filter(deal => deal.stage === 'closed-won')
    .reduce((sum, deal) => sum + deal.value, 0);

  const totalLeads = contacts.filter(contact => contact.status === 'lead').length;
  const totalCustomers = contacts.filter(contact => contact.status === 'customer').length;
  
  const pipelineValue = deals
    .filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.value, 0);

  const activeDeals = deals.filter(deal => !['closed-won', 'closed-lost'].includes(deal.stage)).length;
  const closedDeals = deals.filter(deal => deal.stage === 'closed-won').length;
  const lostDeals = deals.filter(deal => deal.stage === 'closed-lost').length;
  const totalDeals = deals.length;
  const conversionRate = totalDeals > 0 ? (closedDeals / totalDeals) * 100 : 0;

  // Quick stats for recent activity
  const recentDeals = deals.slice(0, 5);
  const highPriorityDeals = deals.filter(deal => deal.priority === 'critical' || deal.priority === 'high').length;

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'emerald',
      description: 'Closed deals revenue'
    },
    {
      title: 'Pipeline Value',
      value: `$${pipelineValue.toLocaleString()}`,
      change: '+15.3%',
      trend: 'up' as const,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'blue',
      description: 'Active deals value'
    },
    {
      title: 'Active Deals',
      value: activeDeals.toString(),
      change: '+3.1%',
      trend: 'up' as const,
      icon: <Target className="w-6 h-6" />,
      color: 'purple',
      description: 'In progress deals'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate.toFixed(1)}%`,
      change: '+2.3%',
      trend: 'up' as const,
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'orange',
      description: 'Deal close rate'
    }
  ];

  return (
    <div className="min-h-screen bg-crm-primary flex">
      <CRMSidebar />
      
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-crm-text-white mb-3 bg-gradient-to-r from-crm-electric to-crm-emerald bg-clip-text text-transparent">
              Welcome back, {user?.user_metadata?.first_name || 'User'}!
            </h1>
            <p className="text-crm-text-secondary text-lg">
              Here's your business performance at a glance
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                activeView === 'dashboard'
                  ? 'bg-gradient-to-r from-crm-electric to-crm-emerald text-white shadow-lg'
                  : 'text-crm-text-secondary hover:text-crm-text-white hover:bg-crm-tertiary'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('notifications')}
              className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium relative ${
                activeView === 'notifications'
                  ? 'bg-gradient-to-r from-crm-electric to-crm-emerald text-white shadow-lg'
                  : 'text-crm-text-secondary hover:text-crm-text-white hover:bg-crm-tertiary'
              }`}
            >
              <Bell className="w-4 h-4 mr-2 inline" />
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeView === 'dashboard' ? (
          <>
            {/* Enhanced Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
              {metrics.map((metric, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-crm-electric/20 to-crm-emerald/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative crm-card p-6 rounded-2xl border border-crm-tertiary hover:border-crm-electric/50 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${
                        metric.color === 'emerald' ? 'from-emerald-500/20 to-emerald-600/20' :
                        metric.color === 'blue' ? 'from-blue-500/20 to-blue-600/20' :
                        metric.color === 'purple' ? 'from-purple-500/20 to-purple-600/20' :
                        'from-orange-500/20 to-orange-600/20'
                      }`}>
                        <div className={`${
                          metric.color === 'emerald' ? 'text-emerald-400' :
                          metric.color === 'blue' ? 'text-blue-400' :
                          metric.color === 'purple' ? 'text-purple-400' :
                          'text-orange-400'
                        }`}>
                          {metric.icon}
                        </div>
                      </div>
                      <div className={`flex items-center text-sm font-medium ${
                        metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {metric.change}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-crm-text-secondary text-sm font-medium uppercase tracking-wide mb-2">
                        {metric.title}
                      </h3>
                      <p className="text-3xl font-bold text-crm-text-white mb-1">
                        {metric.value}
                      </p>
                      <p className="text-xs text-crm-text-secondary">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {/* Pipeline Overview with improved progress bars */}
              <div className="lg:col-span-2 crm-card p-6 rounded-2xl border border-crm-tertiary">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-crm-text-white flex items-center">
                    <Zap className="w-6 h-6 text-crm-electric mr-3" />
                    Pipeline Overview
                  </h2>
                  <span className="text-sm text-crm-text-secondary">
                    {totalDeals} total deals
                  </span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-crm-text-white font-medium">Active Deals</span>
                      <span className="text-crm-electric font-bold text-lg">{activeDeals}</span>
                    </div>
                    <div className="w-full bg-crm-tertiary rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 bg-gradient-to-r from-crm-electric to-blue-500 rounded-full transition-all duration-700 ease-out shadow-lg"
                        style={{ width: `${Math.max((activeDeals / Math.max(totalDeals, 1)) * 100, 2)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-crm-text-white font-medium">Won Deals</span>
                      <span className="text-emerald-400 font-bold text-lg">{closedDeals}</span>
                    </div>
                    <div className="w-full bg-crm-tertiary rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-lg"
                        style={{ width: `${Math.max((closedDeals / Math.max(totalDeals, 1)) * 100, 2)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-crm-text-white font-medium">Lost Deals</span>
                      <span className="text-red-400 font-bold text-lg">{lostDeals}</span>
                    </div>
                    <div className="w-full bg-crm-tertiary rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-700 ease-out shadow-lg"
                        style={{ width: `${Math.max((lostDeals / Math.max(totalDeals, 1)) * 100, 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="crm-card p-6 rounded-2xl border border-crm-tertiary">
                <h2 className="text-xl font-semibold text-crm-text-white mb-6 flex items-center">
                  <Target className="w-6 h-6 text-crm-electric mr-3" />
                  Quick Stats
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-crm-tertiary/30">
                    <div>
                      <p className="text-crm-text-white font-medium">High Priority</p>
                      <p className="text-xs text-crm-text-secondary">Critical & High deals</p>
                    </div>
                    <span className="text-2xl font-bold text-orange-400">{highPriorityDeals}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-crm-tertiary/30">
                    <div>
                      <p className="text-crm-text-white font-medium">Total Contacts</p>
                      <p className="text-xs text-crm-text-secondary">Leads & Customers</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-400">{contacts.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-crm-tertiary/30">
                    <div>
                      <p className="text-crm-text-white font-medium">Customers</p>
                      <p className="text-xs text-crm-text-secondary">Converted leads</p>
                    </div>
                    <span className="text-2xl font-bold text-emerald-400">{totalCustomers}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="crm-card p-8 rounded-2xl border border-crm-tertiary">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-r from-crm-electric/20 to-crm-emerald/20">
                  <Calendar className="w-6 h-6 text-crm-electric" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-crm-text-white">Recent Activity</h2>
                  <p className="text-crm-text-secondary">Latest updates across your pipeline</p>
                </div>
              </div>
              <ActivityFeed />
            </div>
          </>
        ) : (
          <NotificationCenter />
        )}
      </div>
    </div>
  );
};

export default Index;
