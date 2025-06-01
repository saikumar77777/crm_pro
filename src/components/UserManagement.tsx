
import React from 'react';
import { Shield, Users, Settings, Crown, Star, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales_rep';
  status: 'active' | 'inactive';
  avatar: string;
  performance: number;
  dealsWon: number;
  lastActive: string;
  permissions: string[];
}

const UserManagement = () => {
  const users: User[] = [
    {
      id: '1',
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      role: 'admin',
      status: 'active',
      avatar: 'SW',
      performance: 95,
      dealsWon: 24,
      lastActive: 'Online now',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'manager',
      status: 'active',
      avatar: 'MJ',
      performance: 88,
      dealsWon: 18,
      lastActive: '2 hours ago',
      permissions: ['manage_team', 'view_reports', 'edit_deals']
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@company.com',
      role: 'sales_rep',
      status: 'active',
      avatar: 'ED',
      performance: 82,
      dealsWon: 15,
      lastActive: '30 minutes ago',
      permissions: ['create_deals', 'edit_contacts', 'view_pipeline']
    }
  ];

  const getRoleConfig = (role: string) => {
    const configs = {
      admin: { 
        color: 'text-red-400', 
        bg: 'bg-red-500/20', 
        label: 'Admin',
        icon: <Crown className="w-4 h-4" />,
        border: 'border-red-500'
      },
      manager: { 
        color: 'text-amber-400', 
        bg: 'bg-amber-500/20', 
        label: 'Manager',
        icon: <Star className="w-4 h-4" />,
        border: 'border-amber-500'
      },
      sales_rep: { 
        color: 'text-crm-electric', 
        bg: 'bg-crm-electric/20', 
        label: 'Sales Rep',
        icon: <Users className="w-4 h-4" />,
        border: 'border-crm-electric'
      }
    };
    return configs[role as keyof typeof configs];
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-crm-emerald bg-crm-emerald/20';
    if (performance >= 70) return 'text-amber-400 bg-amber-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getPerformanceGradient = (performance: number) => {
    if (performance >= 90) return 'from-crm-emerald to-emerald-400';
    if (performance >= 70) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-crm-text-white mb-2">
          User Management
        </h2>
        <p className="text-crm-text-secondary">
          Manage team members, roles, and permissions
        </p>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="crm-card p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Crown className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-2xl font-bold text-red-400">1</span>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Administrators</h4>
          <p className="text-sm text-crm-text-secondary">Full system access</p>
        </div>

        <div className="crm-card p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Star className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-amber-400">1</span>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Managers</h4>
          <p className="text-sm text-crm-text-secondary">Team leadership</p>
        </div>

        <div className="crm-card p-6 border-l-4 border-crm-electric">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-crm-electric/20 rounded-lg">
              <Users className="w-6 h-6 text-crm-electric" />
            </div>
            <span className="text-2xl font-bold text-crm-electric">1</span>
          </div>
          <h4 className="font-medium text-crm-text-white mb-1">Sales Reps</h4>
          <p className="text-sm text-crm-text-secondary">Direct sales team</p>
        </div>
      </div>

      {/* User List */}
      <div className="crm-card">
        <div className="p-6 border-b border-crm-tertiary">
          <h3 className="text-lg font-semibold text-crm-text-white">Team Members</h3>
        </div>
        
        <div className="divide-y divide-crm-tertiary">
          {users.map((user) => {
            const roleConfig = getRoleConfig(user.role);
            const performanceColor = getPerformanceColor(user.performance);
            const performanceGradient = getPerformanceGradient(user.performance);
            
            return (
              <div key={user.id} className={`p-6 hover:bg-crm-tertiary/20 transition-colors border-l-4 ${roleConfig.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${roleConfig.bg} rounded-full flex items-center justify-center text-white font-medium relative`}>
                      {user.avatar}
                      {user.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-crm-emerald rounded-full border-2 border-crm-secondary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-crm-text-white">{user.name}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${roleConfig.bg} ${roleConfig.color}`}>
                          {roleConfig.icon}
                          <span>{roleConfig.label}</span>
                        </div>
                      </div>
                      <p className="text-sm text-crm-text-secondary">{user.email}</p>
                      <p className="text-xs text-crm-text-secondary">{user.lastActive}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="text-center">
                        <p className="font-bold text-crm-text-white">{user.dealsWon}</p>
                        <p className="text-xs text-crm-text-secondary">Deals Won</p>
                      </div>
                      <div className="text-center">
                        <p className={`font-bold ${performanceColor.split(' ')[0]}`}>{user.performance}%</p>
                        <p className="text-xs text-crm-text-secondary">Performance</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-crm-text-secondary">Performance Score</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${performanceColor}`}>
                      {user.performance}%
                    </span>
                  </div>
                  <div className="w-full bg-crm-tertiary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${performanceGradient} transition-all duration-300`}
                      style={{ width: `${user.performance}%` }}
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-crm-text-white">Permissions</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Create Deals', 'Edit Contacts', 'View Reports', 'Manage Team'].map((permission, index) => {
                      const hasPermission = user.permissions.includes('all') || 
                        (user.role === 'manager' && index < 3) || 
                        (user.role === 'sales_rep' && index < 2);
                      
                      return (
                        <div key={permission} className={`flex items-center space-x-2 p-2 rounded-lg ${hasPermission ? 'bg-crm-emerald/20' : 'bg-crm-tertiary'}`}>
                          {hasPermission ? (
                            <CheckCircle className="w-4 h-4 text-crm-emerald" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-xs ${hasPermission ? 'text-crm-emerald' : 'text-crm-text-secondary'}`}>
                            {permission}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
