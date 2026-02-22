import VisualControlCenter from "@/components/dashboard/VisualControlCenter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vision Control | VERTIXA AI",
    description: "Institutional Visual Monitoring & Forensic Grid",
};

export default function VisionPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                    Forensic Vision Hub
                </h1>
                <p className="text-muted-foreground">
                    Real-time neural monitoring and anomaly detection for physical assets and documents.
                </p>
            </div>

            <VisualControlCenter />
        </div>
    );
}
