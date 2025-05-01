
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CandlestickChart from '@/components/CandlestickChart';
import AgentRace from '@/components/AgentRace';
import TransactionTable from '@/components/TransactionTable';
import { useTradeData } from '@/hooks/useTradeData';

const Index = () => {
  const { agents, candles, latestCandle, showMarker } = useTradeData();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Candlestick Chart */}
        <div className="animate-fade-in-right" style={{ animationDelay: '0.1s' }}>
          <CandlestickChart 
            data={candles} 
            latestCandle={latestCandle}
            showMarker={showMarker}
          />
        </div>
        
        {/* Agent Race - Now with multiple visualization modes */}
        <div className="animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
          <AgentRace agents={agents} />
        </div>
        
        {/* Transaction Table */}
        <div className="animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
          <TransactionTable agents={agents} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
