"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle2, ShieldAlert, Loader2, Play } from "lucide-react";

export default function MaintenanceMode() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | 'approved' | 'blocked'>(null);

    const handleUpdate = () => {
        setLoading(true);
        setResult(null);
        // Simulate AI delay
        setTimeout(() => {
            setLoading(false);
            setResult(Math.random() > 0.5 ? 'approved' : 'blocked');
        }, 2500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Input Section */}
            <div className="border border-border rounded-xl p-8 bg-card shadow-sm">
                <h2 className="text-xl font-bold mb-4">System Maintenance & Updates</h2>
                <p className="text-muted-foreground mb-6">Upload patch files or manually trigger a system update. The AI will verify compatibility before applying changes.</p>

                <div className="space-y-6">

                    {/* File Upload Area */}
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-12 hover:bg-gray-100/50 transition-colors cursor-pointer group">
                        <div className="p-4 rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Upload Patch File</p>
                        <p className="text-xs text-muted-foreground mt-1">.ZIP, .TAR.GZ (Max 50MB)</p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-border" />
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or verify existing config</span>
                        </div>
                    </div>

                    <textarea
                        className="w-full min-h-[150px] p-4 rounded-lg border border-input bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter configuration parameters to validate..."
                    />

                    <Button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="w-full h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Verifying Integrity...
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-5 w-5 fill-current" />
                                Run System Update
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Result Panel */}
            {result && (
                <div className={`border-l-4 ${result === 'approved' ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500 bg-red-50/50'} rounded-lg p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-xl font-bold">
                            {result === 'approved' ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    <span className="text-green-700">Update Validated</span>
                                </>
                            ) : (
                                <>
                                    <ShieldAlert className="w-6 h-6 text-red-500" />
                                    <span className="text-red-700">Update Blocked</span>
                                </>
                            )}
                        </div>
                        <Badge variant={result === 'approved' ? 'success' : 'destructive'} className="text-sm px-3 py-1">
                            {result === 'approved' ? 'Integrity Check Passed' : 'Critical Errors Found'}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Dependency Check</h4>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${result === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="font-medium text-foreground">{result === 'approved' ? 'All Modules Compatible' : 'Version Mismatch Detected'}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Security Audit</h4>
                                <div className="space-y-2">
                                    {result === 'approved' ? (
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <CheckCircle2 className="w-4 h-4" />
                                            No vulnerabilities found
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-100/50 p-2 rounded border border-red-200/50">
                                            <ShieldAlert className="w-4 h-4" />
                                            Deprecated Package Warning (CVE-2024-992)
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Visual Progress Bar for Scan */}
                        <div>
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Code Coverage Scan</h4>
                            <div className="h-4 w-full bg-secondary rounded-full overflow-hidden mb-2">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${result === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: result === 'approved' ? '100%' : '65%' }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {result === 'approved'
                                    ? "Update is safe to deploy to production environment."
                                    : "Deployment halted due to critical security policy violation."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
