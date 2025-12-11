'use client';

import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
    dailySales: { date: string; amount: number }[]; // Last 7 days
    monthlySales: { month: string; amount: number }[]; // Jan-Dec
    totalRevenue: number;
}

export function RevenueAnalytics({ dailySales, monthlySales, totalRevenue }: AnalyticsProps) {
    const [period, setPeriod] = useState<'day' | 'month'>('day');

    const data = period === 'day' ? dailySales : monthlySales;
    const items = period === 'day' ? dailySales : monthlySales;

    // Find highest value for scale or highlight
    const maxVal = Math.max(...items.map(d => d.amount), 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-gold-500" />
                        Sales Performance
                    </h2>
                    <p className="text-sm text-green-600">Updated revenue statistics.</p>
                </div>

                <div className="flex bg-green-50 rounded-lg p-1">
                    <button
                        onClick={() => setPeriod('day')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${period === 'day'
                            ? 'bg-white text-green-800 shadow-sm'
                            : 'text-green-600 hover:text-green-800'
                            }`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => setPeriod('month')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${period === 'month'
                            ? 'bg-white text-green-800 shadow-sm'
                            : 'text-green-600 hover:text-green-800'
                            }`}
                    >
                        Monthly (This Year)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Summary Card (Left) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 bg-green-900 rounded-xl text-white">
                        <p className="text-green-300 text-sm font-medium mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-bold font-mono">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue)}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 text-xs bg-green-800/50 p-2 rounded w-fit">
                            <Calendar className="w-3 h-3" />
                            <span>Lifetime Sales</span>
                        </div>
                    </div>

                    <div className="p-6 border border-green-100 rounded-xl">
                        <p className="text-gray-500 text-sm font-medium mb-1">Highest ({period === 'day' ? 'Daily' : 'Monthly'})</p>
                        <h3 className="text-2xl font-bold text-green-800 font-mono">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(maxVal)}
                        </h3>
                    </div>
                </div>

                {/* Chart Area (Right) */}
                <div className="lg:col-span-3 h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey={period === 'day' ? 'date' : 'month'}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#1c4835', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#1c4835', fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f0fdf4' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                            />
                            <Bar
                                dataKey="amount"
                                fill="#166534"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                                activeBar={{ fill: '#ca8a04' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
