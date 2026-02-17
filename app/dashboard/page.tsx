"use client";

import { MetricCards } from "@/components/dashboard/MetricCards";
import { Overview } from "@/components/dashboard/Overview";
import { DashboardTable } from "@/components/dashboard/DashboardTable";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">

            {/* 1. High Level Metrics */}
            <MetricCards />

            {/* 2. Charts Section */}
            <Overview />

            {/* 3. Recent Decisions Table */}
            <DashboardTable />
        </div>
    );
}
