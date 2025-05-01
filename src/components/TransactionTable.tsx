
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentData, TradeAction } from '@/hooks/useTradeData';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TransactionTableProps {
  agents: AgentData[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ agents }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Get icon and style for trade action
  const getActionDetails = (action: TradeAction) => {
    switch (action) {
      case 'long':
        return {
          icon: <ArrowUp size={16} />,
          bgClass: 'bg-crypto-green/20',
          textClass: 'text-crypto-green',
          borderClass: 'border-crypto-green/30'
        };
      case 'short':
        return {
          icon: <ArrowDown size={16} />,
          bgClass: 'bg-crypto-red/20',
          textClass: 'text-crypto-red',
          borderClass: 'border-crypto-red/30'
        };
      case 'hold':
      default:
        return {
          icon: <span className="inline-block w-4 h-[2px] bg-muted-foreground"></span>,
          bgClass: 'bg-muted/20',
          textClass: 'text-muted-foreground',
          borderClass: 'border-muted/30'
        };
    }
  };

  // Group transactions by agent
  const transactionsByAgent = agents.reduce((acc, agent) => {
    agent.transactions.forEach(transaction => {
      acc.push({
        ...transaction,
        agent: {
          id: agent.id,
          name: agent.name,
          color: agent.color,
          portfolioValue: agent.portfolioValue,
          cashBalance: agent.cashBalance
        }
      });
    });
    return acc;
  }, [] as Array<any>).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  
  return (
    <Card className="glass-card border-crypto-purple/30">
      <CardHeader className="pb-2 bg-gradient-to-r from-crypto-purple/20 to-transparent">
        <CardTitle className="text-lg font-bold crypto-gradient-text flex items-center gap-2">
          <div className="h-2 w-2 bg-crypto-purple rounded-full animate-pulse"></div>
          Agent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {transactionsByAgent.map((transaction, index) => {
            const { icon, bgClass, textClass, borderClass } = getActionDetails(transaction.action);
            
            return (
              <div 
                key={transaction.id} 
                className={`glass-card border ${borderClass} rounded-lg overflow-hidden animate-fade-in-right`} 
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Agent info */}
                  <div className="p-4 md:w-1/4 flex items-center space-x-3">
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: `${transaction.agent.color}30` }}
                    >
                      <div className="h-3 w-3 rounded-full animate-pulse" style={{ backgroundColor: transaction.agent.color }}></div>
                    </div>
                    <div>
                      <div className="font-bold">{transaction.agent.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.timestamp.toLocaleTimeString([], {
                          hour: '2-digit', 
                          minute: '2-digit', 
                          second: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action details */}
                  <div className={`${bgClass} flex-1 p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <div className={`${textClass} flex items-center gap-1 font-mono uppercase`}>
                        {icon} {transaction.action}
                      </div>
                      {transaction.amount > 0 && (
                        <div className="bg-background/50 px-2 py-1 rounded-md text-sm font-mono">
                          {formatCurrency(transaction.amount)}
                        </div>
                      )}
                      <div className="text-sm">@ {formatCurrency(transaction.price)}</div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium">Portfolio: {formatCurrency(transaction.agent.portfolioValue)}</div>
                      <div className="text-xs text-muted-foreground">Cash: {formatCurrency(transaction.agent.cashBalance)}</div>
                    </div>
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

export default TransactionTable;
