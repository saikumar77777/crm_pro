
import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string;
  subValue?: string;
  gradient?: string;
  accentColor?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  subValue,
  gradient,
  accentColor,
  icon,
  trend,
  trendValue
}) => {
  const cardStyle = gradient ? { background: gradient } : {};
  const borderColor = accentColor || '#3b82f6';
  
  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };
  
  const getTrendColor = () => {
    if (trend === 'up') return 'text-crm-emerald';
    if (trend === 'down') return 'text-red-400';
    return 'text-crm-text-secondary';
  };

  return (
    <div 
      className="crm-card crm-card-hover p-6 relative overflow-hidden"
      style={{
        ...cardStyle,
        borderLeft: `4px solid ${borderColor}`
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-crm-text-secondary text-sm font-medium uppercase tracking-wide">
            {title}
          </h3>
          <div className="flex items-baseline mt-2">
            <span className="text-2xl font-semibold text-crm-text-white">
              {value}
            </span>
            {subValue && (
              <span className="text-crm-text-secondary text-sm ml-2">
                {subValue}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            {icon}
          </div>
        )}
      </div>
      
      {trendValue && (
        <div className={`flex items-center text-sm ${getTrendColor()}`}>
          <span className="mr-1">{getTrendIcon()}</span>
          <span className="font-medium">{trendValue}</span>
          <span className="text-crm-text-secondary ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default MetricsCard;
