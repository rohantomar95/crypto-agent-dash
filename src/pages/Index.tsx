
import React from 'react';
import Layout from '@/components/Layout';
import AgentRace from '@/components/AgentRace';
import TransactionTable from '@/components/TransactionTable';
import { useTradeData } from '@/hooks/useTradeData';

const Index = () => {
  const { agents } = useTradeData();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Agent Race - With smooth animations for transitions */}
        <div className="animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
          <AgentRace agents={agents} />
        </div>
        
        {/* Transaction Table */}
        <div className="animate-fade-in-right" style={{ animationDelay: '0.4s' }}>
          <TransactionTable agents={agents} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
