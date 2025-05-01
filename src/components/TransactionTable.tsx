
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
  
  // Get icon for trade action
  const getActionIcon = (action: TradeAction) => {
    switch (action) {
      case 'long':
        return <span className="inline-block w-4 h-4 text-crypto-green">↗</span>;
      case 'short':
        return <span className="inline-block w-4 h-4 text-crypto-red">↘</span>;
      case 'hold':
        return <span className="inline-block w-4 h-4 text-muted-foreground">―</span>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold crypto-gradient-text">
          Agent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="w-[120px]">Agent</TableHead>
                <TableHead className="text-center">Action</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Time</TableHead>
                <TableHead className="text-right">Portfolio Value</TableHead>
                <TableHead className="text-right">Cash Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.flatMap(agent => 
                agent.transactions.map((transaction, index) => (
                  <TableRow 
                    key={transaction.id} 
                    className={index === 0 ? "animate-fade-in-right" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 w-2 rounded-full" 
                          style={{ backgroundColor: agent.color }}
                        />
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {getActionIcon(transaction.action)}
                        <span 
                          className={`ml-1 font-mono uppercase text-xs ${
                            transaction.action === 'long' ? 'text-crypto-green' : 
                            transaction.action === 'short' ? 'text-crypto-red' : 
                            'text-muted-foreground'
                          }`}
                        >
                          {transaction.action}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {transaction.amount > 0 ? formatCurrency(transaction.amount) : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(transaction.price)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {transaction.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(agent.portfolioValue)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(agent.cashBalance)}
                    </TableCell>
                  </TableRow>
                ))
              ).slice(0, 10)} {/* Show only 10 most recent transactions */}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
