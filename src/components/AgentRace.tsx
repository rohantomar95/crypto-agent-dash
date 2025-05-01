
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentData } from '@/hooks/useTradeData';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface AgentRaceProps {
  agents: AgentData[];
}

const AgentRace: React.FC<AgentRaceProps> = ({ agents }) => {
  const [sortedAgents, setSortedAgents] = useState<AgentData[]>([]);
  const [maxValue, setMaxValue] = useState(100000);
  const [prevValues, setPrevValues] = useState<{[key: number]: number}>({});
  
  // Calculate max portfolio value and sort agents by portfolio value
  useEffect(() => {
    if (!agents.length) return;
    
    // Store previous values for animation comparison
    const newPrevValues: {[key: number]: number} = {};
    agents.forEach(agent => {
      newPrevValues[agent.id] = prevValues[agent.id] || agent.portfolioValue;
    });
    
    // Find max portfolio value for scaling
    const max = Math.max(...agents.map(agent => agent.portfolioValue));
    setMaxValue(Math.max(max, 100000)); // Ensure min scale of 100k
    
    // Sort agents by portfolio value
    const sorted = [...agents].sort((a, b) => b.portfolioValue - a.portfolioValue);
    setSortedAgents(sorted);
    
    // Update previous values after a delay to allow for animation
    setTimeout(() => {
      setPrevValues(agents.reduce((acc, agent) => {
        acc[agent.id] = agent.portfolioValue;
        return acc;
      }, {} as {[key: number]: number}));
    }, 1000);
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

  // Calculate if value is increasing or decreasing
  const getValueTrend = (agentId: number, currentValue: number) => {
    const prevValue = prevValues[agentId] || currentValue;
    if (currentValue > prevValue) return 'increase';
    if (currentValue < prevValue) return 'decrease';
    return 'neutral';
  };

  return (
    <Card className="glass-card overflow-hidden border-crypto-purple/30">
      <CardHeader className="pb-2 bg-gradient-to-r from-crypto-purple/20 to-transparent">
        <CardTitle className="text-lg font-bold crypto-gradient-text flex items-center gap-2">
          <div className="h-2 w-2 bg-crypto-purple rounded-full animate-pulse"></div>
          Agent Performance Race
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {sortedAgents.map((agent, index) => {
            // Calculate progress width as percentage of max value
            const progressPercentage = (agent.portfolioValue / maxValue) * 100;
            const trend = getValueTrend(agent.id, agent.portfolioValue);
            
            // Determine if profit or loss
            const isProfit = agent.profitLoss >= 0;
            
            return (
              <div key={agent.id} className="space-y-2" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full relative ${index === 0 ? 'animate-pulse-glow' : ''}`} 
                         style={{ backgroundColor: agent.color }}>
                      {index === 0 && (
                        <div className="absolute -inset-1 rounded-full animate-ping opacity-30"
                             style={{ backgroundColor: agent.color }}></div>
                      )}
                    </div>
                    <span className="font-semibold">{agent.name}</span>
                    {index === 0 && <span className="text-xs bg-crypto-purple/20 px-2 py-0.5 rounded-full">LEADING</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`${isProfit ? 'text-crypto-green' : 'text-crypto-red'} flex items-center`}>
                      {isProfit ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                      {formatProfitLoss(agent.portfolioValue)}
                    </span>
                    <span className={`font-mono transition-all duration-500 ${
                      trend === 'increase' ? 'text-crypto-green scale-110' : 
                      trend === 'decrease' ? 'text-crypto-red scale-90' : ''
                    }`}>
                      {formatCurrency(agent.portfolioValue)}
                    </span>
                  </div>
                </div>
                
                <div className="h-8 w-full bg-secondary/30 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden flex items-center px-3 ${
                      trend === 'increase' ? 'animate-pulse-once' : ''
                    }`}
                    style={{ 
                      width: `${Math.max(progressPercentage, 5)}%`, 
                      backgroundColor: agent.color,
                      boxShadow: `0 0 20px ${agent.color}40`,
                    }}
                  >
                    {progressPercentage > 15 && (
                      <div className="absolute left-3 text-xs font-semibold text-white mix-blend-difference flex items-center gap-1">
                        {trend === 'increase' && <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>}
                        {formatCurrency(agent.portfolioValue)}
                      </div>
                    )}
                    
                    {/* Animated gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                  
                  {/* Position indicator */}
                  <div className="absolute top-0 right-0 bg-crypto-gray-dark/70 text-xs px-2 rounded-bl-lg rounded-tr-lg font-mono">
                    #{index + 1}
                  </div>
                </div>
                
                {/* Last action indicator */}
                <div className="flex justify-end items-center text-xs">
                  <div className="flex items-center gap-1 px-2 py-1 bg-secondary/30 rounded-full">
                    <span className="text-muted-foreground">Last:</span>
                    <span className={`font-mono uppercase ${
                      agent.lastAction === 'long' ? 'text-crypto-green' : 
                      agent.lastAction === 'short' ? 'text-crypto-red' : 
                      'text-muted-foreground'
                    }`}>
                      {agent.lastAction}
                      {agent.lastAction !== 'hold' && agent.lastAmount > 0 && 
                        <span className="ml-1">${agent.lastAmount.toFixed(0)}</span>}
                    </span>
                  </div>
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
