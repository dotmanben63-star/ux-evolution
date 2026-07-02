import React from 'react';
import { Item } from '@/types';
import { Card, CardContent } from './ui/card';
import { Package, Hash, Star, DollarSign } from 'lucide-react';

interface StatsDashboardProps {
  items: Item[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ items }) => {
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const avgRating = items.length > 0 
    ? items.reduce((sum, item) => sum + item.rating, 0) / items.length 
    : 0;
  
  const categories = [...new Set(items.map(i => i.category))];
  const tags = [...new Set(items.flatMap(i => i.tags))];

  const stats = [
    {
      label: 'Total Items',
      value: items.length,
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Collection Value',
      value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      label: 'Avg. Rating',
      value: avgRating.toFixed(1),
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      label: 'Unique Tags',
      value: tags.length,
      icon: Hash,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <Card key={idx} className="border-none bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
