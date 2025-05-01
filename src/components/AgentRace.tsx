
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentData } from '@/hooks/useTradeData';
import { ArrowUp, ArrowDown, BarChart } from 'lucide-react';

interface AgentRaceProps {
  agents: AgentData[];
}

const AgentRace: React.FC<AgentRaceProps> = ({ agents }) => {
  const [sortedAgents, setSortedAgents] = useState<AgentData[]>([]);
  const [maxValue, setMaxValue] = useState(100000);
  const [prevValues, setPrevValues] = useState<{[key: number]: number}>({});
  const [prevPositions, setPrevPositions] = useState<{[key: number]: number}>({});
  const [positions, setPositions] = useState<{[key: number]: number}>({});
  
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
    
    // Update positions map for each agent
    const newPositions: {[key: number]: number} = {};
    sorted.forEach((agent, index) => {
      newPositions[agent.id] = index;
    });
    
    // On first render, initialize prev positions to current positions
    if (Object.keys(prevPositions).length === 0) {
      setPrevPositions(newPositions);
    }
    
    // Update sorted agents
    setSortedAgents(sorted);
    setPositions(newPositions);
    
    // After animation completes, update previous states
    const animationTimeout = setTimeout(() => {
      setPrevValues(agents.reduce((acc, agent) => {
        acc[agent.id] = agent.portfolioValue;
        return acc;
      }, {} as {[key: number]: number}));
      setPrevPositions(newPositions);
    }, 1000);
    
    return () => clearTimeout(animationTimeout);
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
  
  // Calculate if value is increasing or decreasing
  const getValueTrend = (agentId: number, currentValue: number) => {
    const prevValue = prevValues[agentId] || currentValue;
    if (currentValue > prevValue) return 'increase';
    if (currentValue < prevValue) return 'decrease';
    return 'neutral';
  };

  // Calculate position change
  const getPositionChange = (agentId: number, currentPosition: number) => {
    const prevPosition = prevPositions[agentId];
    
    if (prevPosition === undefined) return 'same';
    if (currentPosition < prevPosition) return 'up';
    if (currentPosition > prevPosition) return 'down';
    return 'same';
  };

  return (
    <Card className="glass-card overflow-hidden border-crypto-purple/30 shadow-neon">
      <CardHeader className="pb-2 bg-gradient-to-r from-crypto-purple/30 to-transparent flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-bold crypto-gradient-text flex items-center gap-2">
          <div className="h-2 w-2 bg-crypto-purple rounded-full animate-pulse-glow"></div>
          Agent Performance
        </CardTitle>
        <div className="bg-crypto-purple/20 rounded-full p-1.5">
          <BarChart size={16} className="text-crypto-purple" />
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2 bg-crypto-gray-dark/30 rounded-lg p-3 relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          {/* Agent List Container with fixed height for smooth transitions */}
          <div className="relative" style={{ height: `${sortedAgents.length * 40}px` }}>
            {agents.map(agent => {
              const progressPercentage = (agent.portfolioValue / maxValue) * 100;
              const trend = getValueTrend(agent.id, agent.portfolioValue);
              const position = positions[agent.id] || 0;
              const positionChange = getPositionChange(agent.id, position);
              const isProfit = agent.portfolioValue >= 100000;
              
              return (
                <div 
                  key={agent.id} 
                  className="absolute left-0 right-0 flex items-center gap-2 transition-transform duration-1000 ease-out"
                  style={{ 
                    transform: `translateY(${position * 40}px)`,
                  }}
                >
                  {/* Agent Name */}
                  <div className="w-[120px] text-right pr-2">
                    <div className="text-sm font-semibold truncate whitespace-normal">
                      {agent.name}
                    </div>
                  </div>
                  
                  {/* Bar Container */}
                  <div className="flex-1 relative h-7">
                    {/* Background Bar */}
                    <div className="absolute inset-y-0 left-0 right-0 bg-crypto-gray-dark/30 rounded-md"></div>
                    
                    {/* Value Bar */}
                    <div 
                      className="absolute inset-y-0 left-0 rounded-md transition-all duration-1000 ease-out flex items-center"
                      style={{ 
                        width: `${progressPercentage}%`,
                        backgroundColor: agent.color,
                        boxShadow: `0 0 15px ${agent.color}, 0 0 25px ${agent.color}80, 0 0 35px ${agent.color}40`,
                      }}
                    >
                      {/* Animated gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer"></div>
                      
                      {/* Agent indicator - small pill at the end */}
                      <div 
                        className={`absolute -right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full
                          flex items-center justify-center text-xs font-bold text-white
                          ${trend === 'increase' ? 'scale-110' : trend === 'decrease' ? 'scale-90' : ''}`}
                        style={{ 
                          backgroundColor: agent.color, 
                          transition: 'transform 0.3s ease',
                          boxShadow: `0 0 10px ${agent.color}, 0 0 15px ${agent.color}`
                        }}
                      >
                        {agent.id}
                      </div>
                    </div>
                    
                    {/* Value Text */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs font-bold">
                      {formatCurrency(agent.portfolioValue)}
                    </div>
                    
                    {/* Rank indicator */}
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex items-center justify-center font-mono text-xs">
                      #{position + 1}
                    </div>
                    
                    {/* Position Change Indicator */}
                    <div className={`absolute -right-7 top-1/2 -translate-y-1/2 flex items-center
                      ${isProfit ? 'text-crypto-green' : 'text-crypto-red'}`}
                    >
                      {positionChange === 'up' && <ArrowUp size={14} className="animate-bounce" />}
                      {positionChange === 'down' && <ArrowDown size={14} className="animate-bounce" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Scale marks at bottom */}
          <div className="mt-4 border-t border-white/10 pt-2 flex justify-between px-[120px] text-xs text-gray-400">
            <div>$0</div>
            <div>{formatCurrency(maxValue/4)}</div>
            <div>{formatCurrency(maxValue/2)}</div>
            <div>{formatCurrency(3*maxValue/4)}</div>
            <div>{formatCurrency(maxValue)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentRace;
