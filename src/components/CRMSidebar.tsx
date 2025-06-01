
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Handshake, 
  Bell, 
  BarChart3, 
  Settings,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const CRMSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Handshake, label: 'Deals', path: '/deals' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    signOut();
    navigate('/auth');
  };

  const handleBackToDeals = () => {
    navigate('/deals');
  };

  const isOnDealDetailsPage = location.pathname.startsWith('/deals/') && location.pathname !== '/deals';

  return (
    <div className="w-64 bg-crm-secondary h-screen flex flex-col border-r border-crm-tertiary">
      {/* Header */}
      <div className="p-6 border-b border-crm-tertiary">
        <h2 className="text-xl font-bold text-white">CRM Dashboard</h2>
        <p className="text-sm text-crm-text-secondary">Sales & Customer Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-crm-tertiary/50 ${
                    isActive 
                      ? 'bg-crm-electric text-white shadow-lg' 
                      : 'text-crm-text-secondary hover:text-crm-text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-crm-tertiary space-y-3">
        {/* Back to Deals Button - Only show on deal detail pages */}
        {isOnDealDetailsPage && (
          <Button
            onClick={handleBackToDeals}
            variant="outline"
            className="w-full bg-crm-electric/20 border-crm-electric/50 text-white hover:bg-crm-electric/30 hover:border-crm-electric transition-all duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Deals</span>
          </Button>
        )}
        
        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-red-600/20 border-red-600/50 text-white hover:bg-red-600/30 hover:border-red-600 transition-all duration-200 font-medium"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default CRMSidebar;
