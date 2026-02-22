import VisualControlCenter from "@/components/dashboard/VisualControlCenter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vision Control | XYLO AI",
    description: "Real-time AI Visual Monitoring System",
};

export default function VisionPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                    Visual Control Center
                </h1>
                <p className="text-muted-foreground">
                    Real-time object detection and safety monitoring powered by YOLOv8.
                </p>
            </div>

            <VisualControlCenter />
        </div>
    );
}
