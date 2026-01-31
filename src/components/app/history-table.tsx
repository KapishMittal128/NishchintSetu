'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Notification } from '@/hooks/use-app-state';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type HistoryTableProps = {
  data: Notification[];
};

export function HistoryTable({ data }: HistoryTableProps) {
    const sortedData = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead className="text-right">Risk Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((notification) => {
            const riskLevel = notification.riskScore > 75 ? 'High' : notification.riskScore > 50 ? 'Medium' : 'Low';
            return (
                 <TableRow key={notification.timestamp}>
                    <TableCell className="font-medium">{format(new Date(notification.timestamp), "PPP 'at' p")}</TableCell>
                    <TableCell className="text-right">
                         <Badge 
                            variant="destructive"
                            className={cn(
                                "text-white",
                                riskLevel === 'High' && "bg-destructive/90",
                                riskLevel === 'Medium' && "bg-warning/90",
                            )}
                         >
                            {notification.riskScore}
                        </Badge>
                    </TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  );
}
