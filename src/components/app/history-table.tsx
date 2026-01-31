'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
          <TableHead className="text-center">Risk Score</TableHead>
          <TableHead className="text-right">Transcript</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((notification) => {
            const riskLevel = notification.riskScore > 75 ? 'High' : notification.riskScore > 50 ? 'Medium' : 'Low';
            return (
                 <TableRow key={notification.timestamp}>
                    <TableCell className="font-medium">{format(new Date(notification.timestamp), "PPP 'at' p")}</TableCell>
                    <TableCell className="text-center">
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
                    <TableCell className="text-right">
                        {notification.transcript ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">View</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Conversation Transcript</DialogTitle>
                                        <DialogDescription>
                                            Recorded on {format(new Date(notification.timestamp), "PPP 'at' p")}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4 max-h-96 overflow-y-auto p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-foreground">{notification.transcript}</p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                    </TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  );
}
