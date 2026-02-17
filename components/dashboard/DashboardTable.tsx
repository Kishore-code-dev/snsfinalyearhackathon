import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const decisions = [
    {
        invoice: "INV-001",
        vendor: "Acme Corp",
        amount: "$1,200.00",
        status: "Approved",
        confidence: "99%",
        fraud: "None",
        date: "2 mins ago",
    },
    {
        invoice: "INV-002",
        vendor: "Globex Inc",
        amount: "$250.00",
        status: "Review",
        confidence: "65%",
        fraud: "Price Anomaly",
        date: "15 mins ago",
    },
    {
        invoice: "INV-003",
        vendor: "Soylent Corp",
        amount: "$5,000.00",
        status: "Blocked",
        confidence: "99%",
        fraud: "Duplicate Invoice",
        date: "1 hour ago",
    },
    {
        invoice: "INV-004",
        vendor: "Initech",
        amount: "$320.00",
        status: "Approved",
        confidence: "95%",
        fraud: "None",
        date: "2 hours ago",
    },
    {
        invoice: "INV-005",
        vendor: "Umbrella Corp",
        amount: "$12,450.00",
        status: "Review",
        confidence: "78%",
        fraud: "High Value",
        date: "3 hours ago",
    },
];

export function DashboardTable() {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <h3 className="text-lg font-semibold text-foreground">Recent AI Decisions</h3>
                <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Decision</TableHead>
                            <TableHead>Confidence</TableHead>
                            <TableHead>Fraud Flag</TableHead>
                            <TableHead className="text-right">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {decisions.map((decision) => (
                            <TableRow key={decision.invoice}>
                                <TableCell className="font-medium text-foreground">{decision.invoice}</TableCell>
                                <TableCell className="text-muted-foreground">{decision.vendor}</TableCell>
                                <TableCell className="text-muted-foreground">{decision.amount}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            decision.status === "Approved" ? "success" :
                                                decision.status === "Blocked" ? "destructive" :
                                                    "warning"
                                        }
                                        className="font-normal"
                                    >
                                        {decision.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full",
                                                    parseInt(decision.confidence) > 90 ? "bg-green-500" :
                                                        parseInt(decision.confidence) > 70 ? "bg-yellow-500" : "bg-red-500"
                                                )}
                                                style={{ width: decision.confidence }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{decision.confidence}</span>
                                    </div>
                                </TableCell>
                                <TableCell className={cn("text-xs font-medium", decision.fraud !== "None" ? "text-destructive" : "text-muted-foreground")}>
                                    {decision.fraud}
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">{decision.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
