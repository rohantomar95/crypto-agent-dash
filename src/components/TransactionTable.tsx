import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentData, TradeAction } from '@/hooks/useTradeData';
import { ArrowUp, ArrowDown, Circle } from 'lucide-react';

interface TransactionTableProps {
  agents: AgentData[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ agents }) => {
  // Theme colors from the gradient in the image
  const themeColors = [
    '#9b87f5', // Purple
    '#8b93f7', // Purple-blue
    '#7ba0f9', // Blue-ish purple
    '#67abfb', // Light blue
    '#55b7fd', // Sky blue
  ];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Group transactions by timestamp
  const getGroupedTransactions = () => {
    // Get all unique timestamps
    const allTimestamps = agents.flatMap(agent => 
      agent.transactions.map(t => t.timestamp.getTime())
    );
    
    const uniqueTimestamps = [...new Set(allTimestamps)]
      .sort((a, b) => b - a); // Sort in descending order (newest first)
    
    // Create rows with transactions for each timestamp
    return uniqueTimestamps.map(timestamp => {
      const date = new Date(timestamp);
      const timeString = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      const priceAtTime = agents[0]?.transactions.find(
        t => t.timestamp.getTime() === timestamp
      )?.price || 0;
      
      return {
        timestamp,
        timeString,
        price: priceAtTime,
        agentTransactions: agents.map(agent => {
          const transaction = agent.transactions.find(
            t => t.timestamp.getTime() === timestamp
          );
          
          return {
            agent,
            transaction
          };
        })
      };
    });
  };
  
  // Get icon and style for trade action
  const getActionDetails = (action: TradeAction) => {
    switch (action) {
      case 'long':
        return {
          icon: <ArrowUp size={16} />,
          bgClass: 'from-green-500/20 to-green-500/5',
          borderClass: 'border-green-500/40',
          textClass: 'text-green-500'
        };
      case 'short':
        return {
          icon: <ArrowDown size={16} />,
          bgClass: 'from-red-500/20 to-red-500/5',
          borderClass: 'border-red-500/40',
          textClass: 'text-red-500'
        };
      case 'hold':
      default:
        return {
          icon: <Circle size={16} className="opacity-70" />,
          bgClass: 'from-gray-600/20 to-gray-600/5',
          borderClass: 'border-gray-600/20',
          textClass: 'text-gray-400'
        };
    }
  };
  
  const groupedTransactions = getGroupedTransactions();
  
  return (
    <Card className="glass-card border-[#9b87f5]/20 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-[#9b87f5]/20 to-transparent border-b border-[#9b87f5]/20">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
          <div className="h-2 w-2 bg-[#9b87f5] rounded-full animate-pulse"></div>
          Agent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Agent columns header */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-card/80 border-b border-white/5">
          {agents.map((agent, index) => {
            // Get the agent color from the theme colors
            const color = agent.color || themeColors[index % themeColors.length];
            
            return (
              <div 
                key={agent.id} 
                className="p-3 flex items-center gap-2 justify-center"
              >
                <div 
                  className="h-3 w-3 rounded-full animate-pulse" 
                  style={{ backgroundColor: color }}
                ></div>
                <h3 className="font-bold text-sm">{agent.name}</h3>
              </div>
            );
          })}
        </div>
        
        {/* Transaction rows */}
        <div className="max-h-[600px] overflow-y-auto scrollbar-none">
          {groupedTransactions.map((row, rowIndex) => (
            <div 
              key={row.timestamp} 
              className="grid grid-cols-5 gap-1 border-b border-white/5 relative animate-fade-in-right" 
              style={{ animationDelay: `${rowIndex * 0.05}s` }}
            >
              {/* Time indicator */}
              <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 -translate-x-full flex flex-col items-end pr-2 opacity-60">
                <span className="text-xs font-mono">{row.timeString}</span>
                <span className="text-xs font-mono text-muted-foreground">${Math.round(row.price)}</span>
              </div>
              
              {/* Agent transaction cells */}
              {row.agentTransactions.map(({ agent, transaction }, colIndex) => {
                if (!transaction) {
                  // Empty cell if no transaction at this time
                  return (
                    <div 
                      key={`${row.timestamp}-${agent.id}`} 
                      className="p-1 min-h-[120px]"
                    ></div>
                  );
                }
                
                const { icon, bgClass, borderClass, textClass } = getActionDetails(transaction.action);
                
                return (
                  <div 
                    key={`${row.timestamp}-${agent.id}`} 
                    className="p-1"
                  >
                    <div 
                      className={`h-full rounded-lg border ${borderClass} bg-gradient-to-b ${bgClass} backdrop-blur-sm animate-scale-in overflow-hidden`} 
                      style={{ animationDelay: `${rowIndex * 0.05 + colIndex * 0.03}s` }}
                    >
                      {/* Action indicator */}
                      <div className={`flex items-center justify-center gap-1 py-2 ${textClass} font-medium border-b ${borderClass}`}>
                        {icon} {transaction.action.toUpperCase()}
                      </div>
                      
                      {/* Transaction amount */}
                      <div className="p-3 flex flex-col items-center justify-center">
                        {transaction.amount > 0 && (
                          <>
                            <div className="text-xs text-muted-foreground">Amount</div>
                            <div className="text-sm font-mono font-bold">
                              {formatCurrency(transaction.amount)}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Agent balance */}
                      <div className="border-t border-white/5 p-2 bg-black/20">
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Cash:</span>
                            <span className="font-mono">{formatCurrency(agent.cashBalance)}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Tokens:</span>
                            <span className="font-mono">$0.00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
