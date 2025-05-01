
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentData } from '@/hooks/useTradeData';

interface AgentRaceProps {
  agents: AgentData[];
}

const AgentRace: React.FC<AgentRaceProps> = ({ agents }) => {
  const [sortedAgents, setSortedAgents] = useState<AgentData[]>([]);
  const [maxValue, setMaxValue] = useState(100000);
  
  // Calculate max portfolio value and sort agents by portfolio value
  useEffect(() => {
    if (!agents.length) return;
    
    // Find max portfolio value for scaling
    const max = Math.max(...agents.map(agent => agent.portfolioValue));
    setMaxValue(Math.max(max, 100000)); // Ensure min scale of 100k
    
    // Sort agents by portfolio value
    const sorted = [...agents].sort((a, b) => b.portfolioValue - a.portfolioValue);
    setSortedAgents(sorted);
  }, [agents]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format profit/loss percentage
  const formatProfitLoss = (amount: number, initialValue: number = 100000) => {
    const percentage = ((amount / initialValue) * 100) - 100;
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold crypto-gradient-text">
          Agent Performance Race
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAgents.map((agent) => {
            // Calculate progress width as percentage of max value
            const progressPercentage = (agent.portfolioValue / maxValue) * 100;
            
            // Determine if profit or loss
            const isProfit = agent.profitLoss >= 0;
            
            return (
              <div key={agent.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: agent.color }} />
                    <span className="font-semibold">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={isProfit ? 'text-crypto-green' : 'text-crypto-red'}>
                      {formatProfitLoss(agent.profitLoss)}
                    </span>
                    <span className="font-mono">{formatCurrency(agent.portfolioValue)}</span>
                  </div>
                </div>
                
                <div className="h-5 w-full bg-secondary/30 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden flex items-center px-2"
                    style={{ 
                      width: `${Math.max(progressPercentage, 5)}%`, 
                      backgroundColor: agent.color,
                      '--race-progress': `${progressPercentage}%` 
                    } as React.CSSProperties}
                  >
                    {progressPercentage > 15 && (
                      <div className="absolute left-2 text-xs font-semibold text-white mix-blend-difference">
                        {formatCurrency(agent.portfolioValue)}
                      </div>
                    )}
                    
                    {/* Animated gradient effect */}
                    <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse-glow" />
                  </div>
                </div>
                
                {/* Last action indicator */}
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span className="mr-1">Last action:</span>
                  <span className={`font-mono ${
                    agent.lastAction === 'long' ? 'text-crypto-green' : 
                    agent.lastAction === 'short' ? 'text-crypto-red' : 
                    'text-muted-foreground'
                  }`}>
                    {agent.lastAction.toUpperCase()}
                    {agent.lastAction !== 'hold' && agent.lastAmount > 0 && 
                      ` ($${agent.lastAmount.toFixed(0)})`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentRace;
