"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

const dataLine = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
];

const dataPie = [
    { name: "Approved", value: 0, color: "#3b82f6" },
    { name: "Review", value: 0, color: "#facc15" },
    { name: "Blocked", value: 0, color: "#ef4444" },
];

const dataBar = [
    { name: "Duplicate", value: 0 },
    { name: "Rate Variance", value: 0 },
    { name: "Missing PO", value: 0 },
    { name: "New Vendor", value: 0 },
    { name: "Amount Spike", value: 0 },
];

export function Overview() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

            {/* Line Chart */}
            <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Invoices Processed</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dataLine}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold mb-4 self-start text-foreground">Decision Breakdown</h3>
                <div className="h-[300px] w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataPie}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataPie.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-foreground">1,240</div>
                            <div className="text-xs text-muted-foreground">Decisions</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bar Chart (Fraud Types) */}
            <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Fraud Tactics Detected</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataBar}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
