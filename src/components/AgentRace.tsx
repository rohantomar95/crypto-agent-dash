
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentData, TradeAction } from '@/hooks/useTradeData';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, BarChart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AgentRaceProps {
  agents: AgentData[];
}

const AgentRace: React.FC<AgentRaceProps> = ({ agents }) => {
  const [sortedAgents, setSortedAgents] = useState<AgentData[]>([]);
  const [maxValue, setMaxValue] = useState(100000);
  const [prevValues, setPrevValues] = useState<{[key: number]: number}>({});
  const [prevPositions, setPrevPositions] = useState<{[key: number]: number}>({});
  const [positions, setPositions] = useState<{[key: number]: number}>({});
  const isMobile = useIsMobile();
  
  // Enhanced color palette with distinct dark and light shades
  const themeColors = [
    '#9b87f5', // Primary Purple
    '#7E69AB', // Secondary Purple
    '#6E59A5', // Tertiary Purple
    '#0EA5E9', // Ocean Blue
    '#33C3F0', // Sky Blue
  ];
  
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
      // Assign theme colors based on position
      const colorIndex = index % themeColors.length;
      agent.color = themeColors[colorIndex];
      
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
  }, [agents, prevValues, prevPositions]);
  
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

  // Calculate if the agent is net long or short based on transactions
  const getNetPosition = (agent: AgentData): 'long' | 'short' | 'neutral' => {
    if (!agent.transactions || agent.transactions.length === 0) return 'neutral';
    
    // Count long and short positions
    const positions = agent.transactions.reduce(
      (acc, transaction) => {
        if (transaction.action === 'long') acc.long += transaction.amount;
        else if (transaction.action === 'short') acc.short += transaction.amount;
        return acc;
      },
      { long: 0, short: 0 }
    );
    
    if (positions.long > positions.short) return 'long';
    if (positions.short > positions.long) return 'short';
    return 'neutral';
  };

  // Get latest transaction amount for display
  const getLatestAmount = (agent: AgentData): number => {
    if (!agent.transactions || agent.transactions.length === 0) return 0;
    return agent.transactions[0].amount;
  };

  return (
    <Card className="glass-card border-[#9b87f5]/20 bg-[#131624]/90">
      <CardHeader className="pb-2 bg-gradient-to-r from-[#9b87f5]/20 to-transparent flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
          <div className="h-2 w-2 bg-[#9b87f5] rounded-full animate-pulse-glow"></div>
          Agent Performance
        </CardTitle>
        <div className="bg-[#9b87f5]/20 rounded-full p-1.5">
          <BarChart size={16} className="text-[#9b87f5]" />
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2 bg-[#131624]/70 rounded-lg p-3 relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          {/* Agent List Container with fixed height for smooth transitions */}
          <div className="relative" style={{ height: `${sortedAgents.length * (isMobile ? 72 : 44)}px` }}>
            {agents.map((agent, index) => {
              const progressPercentage = (agent.portfolioValue / maxValue) * 100;
              const trend = getValueTrend(agent.id, agent.portfolioValue);
              const position = positions[agent.id] || 0;
              const positionChange = getPositionChange(agent.id, position);
              const isProfit = agent.portfolioValue >= 100000;
              const netPosition = getNetPosition(agent);
              const latestAmount = getLatestAmount(agent);
              
              // Get the agent color from the theme colors
              const color = agent.color || themeColors[position % themeColors.length];
              
              // Set the 4th agent as "Your Agent" (position 3)
              const isYourAgent = agent.name === "JealousDove3996";
              
              return (
                <div 
                  key={agent.id} 
                  className={`absolute left-0 right-0 transition-transform duration-1000 ease-out ${isMobile ? 'flex flex-col gap-1 py-2' : 'flex items-center gap-3'}`}
                  style={{ 
                    transform: `translateY(${position * (isMobile ? 72 : 44)}px)`,
                  }}
                >
                  {isMobile ? (
                    <>
                      {/* Mobile layout - stacked vertically */}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          {/* Rank indicator */}
                          <div className="min-w-[25px] text-center flex justify-center items-center font-mono text-xs text-gray-400">
                            #{position + 1}
                          </div>
                          
                          {/* Agent Name with Your Agent badge */}
                          <div className="text-left">
                            <div className="text-sm font-semibold truncate text-white flex items-center gap-1">
                              {agent.name}
                              {isYourAgent && (
                                <span className="bg-[#9b87f5] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1">
                                  Your Agent
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Position and Amount on same row under name */}
                      <div className="flex items-center justify-between w-full gap-2">
                        {/* Position indicator */}
                        <div className={`flex items-center justify-center ${
                          netPosition === 'long' ? 'bg-green-500' : 
                          netPosition === 'short' ? 'bg-red-500' : 
                          'bg-gray-500'
                        } text-white text-xs font-semibold px-2 py-1 rounded min-w-[50px]`}>
                          <span className="flex items-center gap-1">
                            {netPosition === 'long' && <TrendingUp size={12} />}
                            {netPosition === 'short' && <TrendingDown size={12} />}
                            {netPosition.toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Amount indicator */}
                        <div className="bg-[#1e293b] text-white text-xs font-mono px-2 py-1 rounded min-w-[80px] text-center">
                          {formatCurrency(latestAmount)}
                        </div>
                        
                        {/* Bar Container - Full width on mobile */}
                        <div className="flex-1 relative h-6">
                          {/* Background Bar */}
                          <div className="absolute inset-y-0 left-0 right-0 bg-[#1e293b]/50 rounded-md"></div>
                          
                          {/* Value Bar */}
                          <div 
                            className="absolute inset-y-0 left-0 rounded-md transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${progressPercentage}%`,
                              background: `linear-gradient(90deg, ${color}, ${color === '#9b87f5' ? '#33C3F0' : '#9b87f5'})`,
                            }}
                          >
                          </div>
                          
                          {/* Value Text - Prominent with background for contrast */}
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-sm font-bold z-10">
                            <span className="bg-[#131624]/95 px-2 py-0.5 rounded text-white backdrop-blur-sm shadow-md border border-white/10">
                              {formatCurrency(agent.portfolioValue)}
                            </span>
                          </div>
                          
                          {/* Position Change Indicator */}
                          <div className={`absolute -right-7 top-1/2 -translate-y-1/2 flex items-center
                            ${isProfit ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {positionChange === 'up' && <ArrowUp size={14} className="animate-bounce" />}
                            {positionChange === 'down' && <ArrowDown size={14} className="animate-bounce" />}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Desktop layout - horizontal with position and amount next to name */}
                      <div className="flex items-center gap-3">
                        {/* Rank indicator */}
                        <div className="min-w-[30px] text-center flex justify-center items-center font-mono text-xs text-gray-400">
                          #{position + 1}
                        </div>
                        
                        {/* Group: Agent Name + Your Agent badge + Position + Amount */}
                        <div className="flex items-center gap-3 w-[350px]">
                          {/* Agent Name with Your Agent badge */}
                          <div className="w-[150px] text-left">
                            <div className="text-sm font-semibold truncate text-white flex items-center gap-1">
                              {agent.name}
                              {isYourAgent && (
                                <span className="bg-[#9b87f5] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1">
                                  Your Agent
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Position indicator */}
                          <div className={`flex items-center justify-center ${
                            netPosition === 'long' ? 'bg-green-500' : 
                            netPosition === 'short' ? 'bg-red-500' : 
                            'bg-gray-500'
                          } text-white text-xs font-semibold px-2 py-1 rounded min-w-[70px]`}>
                            <span className="flex items-center gap-1">
                              {netPosition === 'long' && <TrendingUp size={12} />}
                              {netPosition === 'short' && <TrendingDown size={12} />}
                              {netPosition.toUpperCase()}
                            </span>
                          </div>
                          
                          {/* Amount indicator */}
                          <div className="bg-[#1e293b] text-white text-xs font-mono px-2 py-1 rounded min-w-[80px] text-center">
                            {formatCurrency(latestAmount)}
                          </div>
                        </div>
                        
                        {/* Bar Container */}
                        <div className="flex-1 relative h-6">
                          {/* Background Bar */}
                          <div className="absolute inset-y-0 left-0 right-0 bg-[#1e293b]/50 rounded-md"></div>
                          
                          {/* Value Bar */}
                          <div 
                            className="absolute inset-y-0 left-0 rounded-md transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${progressPercentage}%`,
                              background: `linear-gradient(90deg, ${color}, ${color === '#9b87f5' ? '#33C3F0' : '#9b87f5'})`,
                            }}
                          >
                          </div>
                          
                          {/* Value Text - More prominent with background for contrast */}
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-sm font-bold z-10">
                            <span className="bg-[#131624]/95 px-2 py-0.5 rounded text-white backdrop-blur-sm shadow-md border border-white/10">
                              {formatCurrency(agent.portfolioValue)}
                            </span>
                          </div>
                          
                          {/* Position Change Indicator */}
                          <div className={`absolute -right-7 top-1/2 -translate-y-1/2 flex items-center
                            ${isProfit ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {positionChange === 'up' && <ArrowUp size={14} className="animate-bounce" />}
                            {positionChange === 'down' && <ArrowDown size={14} className="animate-bounce" />}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Scale marks at bottom */}
          <div className="mt-6 border-t border-white/10 pt-2 flex justify-between px-[120px] text-xs text-gray-400">
            <div>$0</div>
            <div className="hidden sm:block">{formatCurrency(maxValue/4)}</div>
            <div>{formatCurrency(maxValue/2)}</div>
            <div className="hidden sm:block">{formatCurrency(3*maxValue/4)}</div>
            <div>{formatCurrency(maxValue)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentRace;
