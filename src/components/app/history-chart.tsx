'use client';

import { Notification } from '@/hooks/use-app-state';
import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type HistoryChartProps = {
  data: Notification[];
};

export function HistoryChart({ data }: HistoryChartProps) {
  const chartData = data.map(n => ({
    timestamp: new Date(n.timestamp),
    riskScore: n.riskScore,
  }));

  return (
     <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="timestamp"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => format(value, 'MMM d, p')}
        />
        <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          labelFormatter={(value) => format(new Date(value), 'PPP p')}
        />
        <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <Area 
            type="monotone" 
            dataKey="riskScore" 
            stroke="hsl(var(--destructive))"
            fill="url(#colorRisk)"
            fillOpacity={0.6}
            strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
