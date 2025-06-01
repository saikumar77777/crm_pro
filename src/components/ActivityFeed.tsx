
import React from 'react';
import { Clock, User, DollarSign, FileText } from 'lucide-react';
import { useDeals } from '@/hooks/useDeals';
import { useContacts } from '@/hooks/useContacts';

const ActivityFeed = () => {
  const { deals } = useDeals();
  const { contacts } = useContacts();

  // Generate real activities from deals and contacts
  const getRecentActivities = () => {
    const activities = [];

    // Add deal activities
    deals.slice(0, 5).forEach(deal => {
      activities.push({
        id: `deal-${deal.id}`,
        type: 'deal',
        title: `Deal "${deal.name}" created`,
        description: `New deal worth ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(deal.value)} in ${deal.stage} stage`,
        time: new Date(deal.created_at).toLocaleDateString(),
        icon: DollarSign,
        color: 'text-emerald-400'
      });
    });

    // Add contact activities
    contacts.slice(0, 3).forEach(contact => {
      activities.push({
        id: `contact-${contact.id}`,
        type: 'contact',
        title: `New contact added`,
        description: `${contact.first_name} ${contact.last_name} from ${contact.company || 'Unknown Company'}`,
        time: new Date(contact.created_at).toLocaleDateString(),
        icon: User,
        color: 'text-blue-400'
      });
    });

    // Sort by creation date and return top 8
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);
  };

  const activities = getRecentActivities();

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">No recent activity</p>
        <p className="text-sm text-gray-500 mt-2">
          Create some deals or contacts to see activity here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activity.icon;
        return (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-crm-tertiary/30 transition-colors">
            <div className={`p-2 rounded-full bg-crm-tertiary ${activity.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium">{activity.title}</p>
              <p className="text-crm-text-secondary text-sm mt-1">{activity.description}</p>
              <div className="flex items-center mt-2 text-xs text-crm-text-secondary">
                <Clock className="w-3 h-3 mr-1" />
                {activity.time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
