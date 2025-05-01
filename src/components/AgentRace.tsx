
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentData } from '@/hooks/useTradeData';
import { ArrowUp, ArrowDown, Car, Building, Network, ChevronRight } from 'lucide-react';

interface AgentRaceProps {
  agents: AgentData[];
}

// Visualization modes
type VisualizationMode = 'bars' | 'race' | 'tower' | 'network';

const AgentRace: React.FC<AgentRaceProps> = ({ agents }) => {
  const [sortedAgents, setSortedAgents] = useState<AgentData[]>([]);
  const [maxValue, setMaxValue] = useState(100000);
  const [prevValues, setPrevValues] = useState<{[key: number]: number}>({});
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('race');
  
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
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  // Calculate if value is increasing or decreasing
  const getValueTrend = (agentId: number, currentValue: number) => {
    const prevValue = prevValues[agentId] || currentValue;
    if (currentValue > prevValue) return 'increase';
    if (currentValue < prevValue) return 'decrease';
    return 'neutral';
  };

  // Switch to next visualization mode
  const cycleVisualizationMode = () => {
    const modes: VisualizationMode[] = ['race', 'bars', 'tower', 'network'];
    const currentIndex = modes.indexOf(visualizationMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizationMode(modes[nextIndex]);
  };

  // Get visualization mode icon
  const getVisualizationIcon = () => {
    switch (visualizationMode) {
      case 'race': return <Car size={16} />;
      case 'bars': return <ChevronRight size={16} />;
      case 'tower': return <Building size={16} />;
      case 'network': return <Network size={16} />;
    }
  };

  return (
    <Card className="glass-card overflow-hidden border-crypto-purple/30">
      <CardHeader className="pb-2 bg-gradient-to-r from-crypto-purple/20 to-transparent flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-bold crypto-gradient-text flex items-center gap-2">
          <div className="h-2 w-2 bg-crypto-purple rounded-full animate-pulse"></div>
          Agent Performance
        </CardTitle>
        <button 
          onClick={cycleVisualizationMode}
          className="bg-crypto-purple/20 hover:bg-crypto-purple/40 transition-colors rounded-full p-1.5 group"
          title="Change visualization"
        >
          <div className="transition-transform group-hover:rotate-180">
            {getVisualizationIcon()}
          </div>
        </button>
      </CardHeader>
      <CardContent className="p-3">
        {visualizationMode === 'race' && (
          <div className="space-y-2 bg-crypto-gray-dark/20 rounded-lg p-2 relative overflow-hidden">
            {/* Racing track markings */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 z-0"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            {/* Start/Finish line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-crypto-purple via-transparent to-crypto-purple"></div>
            <div className="absolute right-8 top-0 bottom-0 w-1 bg-gradient-to-b from-crypto-green via-transparent to-crypto-green"></div>
            
            {sortedAgents.map((agent, index) => {
              const progressPercentage = (agent.portfolioValue / maxValue) * 100;
              const trend = getValueTrend(agent.id, agent.portfolioValue);
              const isProfit = agent.profitLoss >= 0;
              
              return (
                <div 
                  key={agent.id} 
                  className="flex items-center gap-3 animate-fade-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 flex flex-col items-center justify-center">
                    <div className={`text-xs font-mono ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      #{index + 1}
                    </div>
                    {index < 3 && <div className="text-xs">{'🏆🥈🥉'[index]}</div>}
                  </div>
                  
                  <div className="flex-1 relative">
                    {/* Racing car with position track */}
                    <div className="h-6 relative">
                      {/* Car */}
                      <div 
                        className="absolute top-0 h-5 transition-all duration-1000 ease-out"
                        style={{ 
                          left: `${Math.max(progressPercentage - 5, 0)}%`,
                          filter: `drop-shadow(0 0 8px ${agent.color}80)`, 
                        }}
                      >
                        <div 
                          className={`w-6 h-5 flex items-center justify-center rounded transition-transform ${
                            trend === 'increase' ? 'scale-110' : trend === 'decrease' ? 'scale-90' : ''
                          }`}
                          style={{ backgroundColor: agent.color }}
                        >
                          <span className="text-xs font-bold text-white">{agent.id}</span>
                        </div>
                        
                        {/* Speed trail */}
                        {index === 0 && (
                          <div className="absolute top-1/2 right-6 -translate-y-1/2 w-12 h-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/80 animate-shimmer opacity-50"></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Name and value */}
                      <div className="absolute right-0 -top-4 text-[10px] font-semibold opacity-70">
                        {agent.name}
                      </div>
                      <div className="absolute right-0 -bottom-4 font-mono text-[10px] flex items-center gap-1">
                        <span className={isProfit ? 'text-crypto-green' : 'text-crypto-red'}>
                          {formatProfitLoss(agent.portfolioValue)}
                        </span>
                        {formatCurrency(agent.portfolioValue)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {visualizationMode === 'bars' && (
          <div className="space-y-2">
            {sortedAgents.map((agent, index) => {
              const progressPercentage = (agent.portfolioValue / maxValue) * 100;
              const trend = getValueTrend(agent.id, agent.portfolioValue);
              const isProfit = agent.profitLoss >= 0;
              
              return (
                <div key={agent.id} className="space-y-0.5" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full relative ${index === 0 ? 'animate-pulse-glow' : ''}`} 
                           style={{ backgroundColor: agent.color }}>
                        {index === 0 && (
                          <div className="absolute -inset-1 rounded-full animate-ping opacity-30"
                               style={{ backgroundColor: agent.color }}></div>
                        )}
                      </div>
                      <span className="font-semibold text-xs">{agent.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`${isProfit ? 'text-crypto-green' : 'text-crypto-red'} flex items-center text-[10px]`}>
                        {isProfit ? <ArrowUp size={10} className="mr-0.5" /> : <ArrowDown size={10} className="mr-0.5" />}
                        {formatProfitLoss(agent.portfolioValue)}
                      </span>
                      <span className={`font-mono text-[10px] transition-all duration-500 ${
                        trend === 'increase' ? 'text-crypto-green scale-105' : 
                        trend === 'decrease' ? 'text-crypto-red scale-95' : ''
                      }`}>
                        {formatCurrency(agent.portfolioValue)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-3 w-full bg-secondary/30 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden flex items-center ${
                        trend === 'increase' ? 'animate-pulse-once' : ''
                      }`}
                      style={{ 
                        width: `${Math.max(progressPercentage, 3)}%`, 
                        backgroundColor: agent.color,
                        boxShadow: `0 0 10px ${agent.color}40`,
                      }}
                    >
                      {/* Animated gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                    
                    {/* Position indicator */}
                    <div className="absolute top-0 right-0 bg-crypto-gray-dark/70 text-[8px] px-1 rounded-bl-sm rounded-tr-sm font-mono">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {visualizationMode === 'tower' && (
          <div className="space-y-1 bg-gradient-to-b from-crypto-gray-dark/10 to-crypto-gray-dark/30 rounded-lg p-2">
            {sortedAgents.map((agent, index) => {
              const floor = sortedAgents.length - index;
              const trend = getValueTrend(agent.id, agent.portfolioValue);
              const isProfit = agent.profitLoss >= 0;
              
              return (
                <div 
                  key={agent.id}
                  className={`transition-all duration-700 ease-in-out p-1.5 rounded-md relative group ${
                    index === 0 ? 'bg-crypto-purple/20 animate-glow' : 'hover:bg-crypto-gray-dark/20'
                  }`}
                  style={{ 
                    transform: `translateZ(${floor * 5}px)`,
                    marginBottom: '2px',
                  }}
                >
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          index === 0 ? 'animate-pulse-glow' : ''
                        }`}
                        style={{ backgroundColor: agent.color }}
                      >
                        {floor}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs">{agent.name}</span>
                        <span className="text-[8px] opacity-70">Floor {floor}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-xs">
                        {formatCurrency(agent.portfolioValue)}
                      </span>
                      <span className={`${isProfit ? 'text-crypto-green' : 'text-crypto-red'} flex items-center text-[10px]`}>
                        {formatProfitLoss(agent.portfolioValue)}
                        {trend === 'increase' ? <ArrowUp size={10} className="ml-0.5" /> : 
                         trend === 'decrease' ? <ArrowDown size={10} className="ml-0.5" /> : null}
                      </span>
                    </div>
                  </div>
                  
                  {/* Floor divider */}
                  <div className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  
                  {/* Elevator indicator */}
                  <div 
                    className={`absolute -right-1 top-1/2 -translate-y-1/2 h-3 w-1 rounded-l-sm ${
                      trend === 'increase' ? 'bg-crypto-green animate-pulse' : 
                      trend === 'decrease' ? 'bg-crypto-red animate-pulse' : 'bg-gray-500'
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        )}
        
        {visualizationMode === 'network' && (
          <div className="h-[200px] relative bg-crypto-gray-dark/10 rounded-lg p-2 overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            
            {/* Network nodes */}
            {sortedAgents.map((agent, index) => {
              const progressPercentage = (agent.portfolioValue / maxValue);
              const nodeSize = Math.max(20, 30 * progressPercentage);
              const isProfit = agent.profitLoss >= 0;
              
              // Calculate positions in circular layout
              const angleStep = (2 * Math.PI) / sortedAgents.length;
              const angle = index * angleStep;
              
              // For first place agent, center; others in circle
              const xPos = index === 0 ? 
                '50%' : 
                `calc(50% + ${Math.sin(angle) * 70}px)`;
              
              const yPos = index === 0 ? 
                '50%' : 
                `calc(50% + ${Math.cos(angle) * 70}px)`;
              
              return (
                <React.Fragment key={agent.id}>
                  {/* Connection lines to first place */}
                  {index > 0 && (
                    <svg className="absolute inset-0 w-full h-full z-0 overflow-visible">
                      <line 
                        x1="50%" 
                        y1="50%" 
                        x2={xPos} 
                        y2={yPos}
                        stroke={agent.color}
                        strokeOpacity="0.3"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />
                    </svg>
                  )}
                  
                  {/* Node */}
                  <div 
                    className={`absolute rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-out z-10 
                      ${index === 0 ? 'animate-float animate-glow' : 'hover:scale-110'}`}
                    style={{ 
                      width: `${nodeSize}px`,
                      height: `${nodeSize}px`,
                      backgroundColor: `${agent.color}`,
                      boxShadow: `0 0 ${nodeSize/2}px ${agent.color}50`,
                      left: xPos,
                      top: yPos,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="font-bold text-xs text-white">{agent.id}</div>
                    {index === 0 && <div className="text-[8px] text-white">LEADER</div>}
                  </div>
                  
                  {/* Label */}
                  <div 
                    className="absolute text-[10px] px-1.5 py-0.5 rounded-sm bg-crypto-gray-dark/80 font-semibold z-20"
                    style={{
                      left: `calc(${xPos} + ${index === 0 ? 0 : Math.sin(angle) * 20}px)`,
                      top: `calc(${yPos} + ${nodeSize/2 + 5}px)`,
                      transform: 'translate(-50%, 0)',
                    }}
                  >
                    {agent.name}
                    <span className={`ml-1 ${isProfit ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {formatProfitLoss(agent.portfolioValue)}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentRace;
