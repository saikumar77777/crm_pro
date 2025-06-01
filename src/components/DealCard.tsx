
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Mail, Phone, Calendar, AlertTriangle, User, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  daysInStage: number;
  lastActivity: string;
  activities: {
    type: 'email' | 'call' | 'meeting' | 'followup' | 'overdue';
    count: number;
  }[];
  isOverdue?: boolean;
  probability?: number;
}

interface DealCardProps {
  deal: Deal;
  stageColor: string;
  onUpdate?: (id: string, updates: any) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, stageColor, onUpdate }) => {
  const navigate = useNavigate();

  const getPriorityConfig = (priority: Deal['priority']) => {
    const configs = {
      critical: {
        color: '#f87171',
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        glowClass: 'animate-pulse shadow-red-500/30',
        label: 'Critical'
      },
      high: {
        color: '#fb923c',
        bgColor: 'bg-orange-500/20',
        textColor: 'text-orange-400',
        glowClass: '',
        label: 'High'
      },
      medium: {
        color: '#fbbf24',
        bgColor: 'bg-amber-500/20',
        textColor: 'text-amber-400',
        glowClass: '',
        label: 'Medium'
      },
      low: {
        color: '#34d399',
        bgColor: 'bg-emerald-500/20',
        textColor: 'text-emerald-400',
        glowClass: '',
        label: 'Low'
      }
    };
    return configs[priority];
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      email: <Mail className="w-3 h-3 text-blue-400" />,
      call: <Phone className="w-3 h-3 text-emerald-400" />,
      meeting: <Calendar className="w-3 h-3 text-purple-400" />,
      followup: <AlertTriangle className="w-3 h-3 text-amber-400" />,
      overdue: <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
    };
    return icons[type as keyof typeof icons] || <User className="w-3 h-3" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDaysInStage = (days: number) => {
    if (days === 0) return 'New in stage';
    if (days === 1) return '1 day in stage';
    return `${days} days in stage`;
  };

  const formatLastActivity = (activity: string) => {
    if (!activity || activity === 'No recent activity') {
      return 'No recent activity';
    }
    return activity;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Navigating to deal:', deal.id);
    navigate(`/deals/${deal.id}`);
  };

  const handleEditDeal = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit deal:', deal.id);
  };

  const handleDeleteDeal = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete deal:', deal.id);
  };

  const priorityConfig = getPriorityConfig(deal.priority);
  const isOverdue = deal.daysInStage > 10 || deal.activities.some(a => a.type === 'overdue');
  const probability = deal.probability || 0;

  return (
    <div 
      onClick={handleCardClick}
      className={`crm-card crm-card-hover p-4 border-l-4 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        priorityConfig.glowClass
      } ${isOverdue ? 'border-red-500 bg-gradient-to-r from-crm-secondary to-red-900/20' : ''}`}
      style={{ borderLeftColor: stageColor }}
    >
      {/* Header with Priority and Actions */}
      <div className="flex items-center justify-between mb-3">
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide transition-all duration-200 hover:scale-105 ${priorityConfig.bgColor} ${priorityConfig.textColor}`}
        >
          {priorityConfig.label}
        </span>
        <div className="flex items-center space-x-2">
          {isOverdue && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 animate-pulse">
              Overdue
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-crm-text-secondary hover:text-crm-text-white transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-crm-tertiary border-crm-tertiary">
              <DropdownMenuItem 
                onClick={handleEditDeal}
                className="text-crm-text-white hover:bg-crm-secondary"
              >
                Edit Deal
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDeleteDeal}
                className="text-red-400 hover:bg-crm-secondary"
              >
                Delete Deal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Deal Info */}
      <div className="mb-4">
        <h4 className="font-medium text-crm-text-white mb-1 line-clamp-2 transition-colors duration-200 hover:text-crm-electric">
          {deal.name}
        </h4>
        <p className="text-sm text-crm-text-secondary">{deal.company}</p>
      </div>

      {/* Value */}
      <div className="mb-4">
        <p className="font-mono text-lg font-bold text-crm-text-white transition-all duration-200 hover:text-crm-emerald">
          {formatCurrency(deal.value)}
        </p>
      </div>

      {/* Activities */}
      {deal.activities.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            {deal.activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-1 transition-transform duration-200 hover:scale-110">
                {getActivityIcon(activity.type)}
                <span className="text-xs text-crm-text-secondary">
                  {activity.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time in Stage & Last Activity */}
      <div className="flex items-center justify-between text-xs text-crm-text-secondary mb-3">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatDaysInStage(deal.daysInStage)}</span>
        </div>
        <span className="transition-colors duration-200 hover:text-crm-text-white">
          {formatLastActivity(deal.lastActivity)}
        </span>
      </div>

      {/* Probability Progress Indicator */}
      <div className="pt-3 border-t border-crm-tertiary">
        <div className="flex items-center justify-between text-xs text-crm-text-secondary mb-2">
          <span>Win Probability</span>
          <span className="font-medium text-crm-text-white">{probability}%</span>
        </div>
        <div className="w-full bg-crm-tertiary rounded-full h-2 overflow-hidden">
          <div 
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{ 
              backgroundColor: stageColor,
              width: `${probability}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DealCard;
