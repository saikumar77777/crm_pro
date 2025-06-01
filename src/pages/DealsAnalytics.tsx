
import React from 'react';
import CRMSidebar from '../components/CRMSidebar';
import DealsAnalytics from '../components/DealsAnalytics';

const DealsAnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-crm-primary flex">
      <CRMSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Deals Analytics</h1>
            <p className="text-crm-text-secondary">Analyze your sales performance and trends</p>
          </div>

          {/* Analytics Content */}
          <DealsAnalytics />
        </div>
      </div>
    </div>
  );
};

export default DealsAnalyticsPage;
