"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreHorizontal } from "lucide-react";

export default function VendorManagement() {
    const [showModal, setShowModal] = useState(false);
    const [vendors, setVendors] = useState([
        { id: 1, name: "Acme Corp", email: "billing@acme.com", risk: "Low", invoices: 124, status: "Active" },
        { id: 2, name: "Global Supplies", email: "finance@global.net", risk: "Medium", invoices: 45, status: "Review" },
        { id: 3, name: "Suspicious LLC", email: "admin@sus-llc.xyz", risk: "High", invoices: 2, status: "Blocked" },
    ]);

    const handleAddVendor = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(false);
        // Add logic here
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Vendor Directory</h2>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Vendor
                </Button>
            </div>

            <div className="border rounded-lg bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vendor Name</TableHead>
                            <TableHead>Email Contact</TableHead>
                            <TableHead>Risk Profile</TableHead>
                            <TableHead>Total Invoices</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendors.map((vendor) => (
                            <TableRow key={vendor.id}>
                                <TableCell className="font-medium">{vendor.name}</TableCell>
                                <TableCell className="text-muted-foreground">{vendor.email}</TableCell>
                                <TableCell>
                                    <Badge variant={vendor.risk === "Low" ? "success" : vendor.risk === "Medium" ? "warning" : "destructive"}>
                                        {vendor.risk} Risk
                                    </Badge>
                                </TableCell>
                                <TableCell>{vendor.invoices}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${vendor.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        {vendor.status}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Basic Modal Implementation */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-background w-full max-w-md p-6 rounded-lg shadow-xl border animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold mb-4">Add New Vendor</h3>
                        <form onSubmit={handleAddVendor} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company Name</label>
                                <input className="w-full px-3 py-2 border rounded-md" placeholder="e.g. Initech Corp" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Billing Email</label>
                                <input className="w-full px-3 py-2 border rounded-md" type="email" placeholder="billing@company.com" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bank Account Number (IBAN)</label>
                                <input className="w-full px-3 py-2 border rounded-md" placeholder="US89 3704..." required />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Create Vendor</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
