import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileWarning, ShieldAlert, UserX } from "lucide-react";

const fraudStats = [
    { title: "Fraud Alerts Today", value: "3", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" },
    { title: "High Risk Vendors", value: "12", icon: UserX, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Duplicate Attempts", value: "8", icon: FileWarning, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { title: "Amount Anomalies", value: "5", icon: AlertCircle, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const flaggedInvoices = [
    { id: "INV-9921", vendor: "Unknown Supplier", amount: "$12,500", type: "First-Time Entity", risk: "High", status: "Blocked" },
    { id: "INV-8842", vendor: "Acme Corp", amount: "$540", type: "Duplicate (INV-8841)", risk: "Medium", status: "Review" },
    { id: "INV-7732", vendor: "Shell Inc", amount: "$94,000", type: "Amount Spike > 300%", risk: "Critical", status: "Investigating" },
    { id: "INV-6621", vendor: "Tech Solutions", amount: "$2,100", type: "Bank Account Change", risk: "High", status: "Blocked" },
];

export default function FraudMonitor() {
    return (
        <div className="space-y-8">

            {/* Top Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {fraudStats.map((stat, i) => (
                    <Card key={i} className="border-l-4 border-l-red-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Flagged Invoices Table */}
            <Card className="border-red-200 shadow-md">
                <CardHeader className="border-b border-border bg-red-50/30">
                    <CardTitle className="text-red-700 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" />
                        Active Threats
                    </CardTitle>
                </CardHeader>
                <div className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Fraud Pattern</TableHead>
                                <TableHead>Risk Score</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flaggedInvoices.map((inv) => (
                                <TableRow key={inv.id} className="bg-red-50/40 hover:bg-red-100/50 transition-colors border-b border-red-100">
                                    <TableCell className="font-medium text-red-900">{inv.id}</TableCell>
                                    <TableCell>{inv.vendor}</TableCell>
                                    <TableCell>{inv.amount}</TableCell>
                                    <TableCell className="font-medium text-red-600 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {inv.type}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                            {inv.risk} Risk
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-bold text-xs uppercase tracking-wider text-red-800">{inv.status}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
