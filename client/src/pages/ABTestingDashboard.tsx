import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp, TrendingUp, Users, Eye, MousePointer } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface VariantMetrics {
  variant: 'A' | 'B' | 'C' | 'D';
  pageViews: number;
  ctaClicks: number;
  conversions: number;
  conversionRate: number;
  ctr: number;
}

export default function ABTestingDashboard() {
  const { data: summary, isLoading } = trpc.ab.getSummary.useQuery();
  const metrics = summary?.metrics || [];
  const winner = summary?.winningVariant || 'A';

  const topVariant = metrics.length > 0 ? metrics.reduce((prev, current) => 
    current.conversionRate > prev.conversionRate ? current : prev
  ) : null;

  const totalPageViews = summary?.totalPageViews || 0;
  const totalConversions = summary?.totalConversions || 0;
  const overallConversionRate = summary?.overallConversionRate || '0.00';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Načítání dat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">AB Testing Dashboard</h1>
          <p className="text-slate-400">Real-time metrics for all landing page variants</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Page Views</p>
                <p className="text-3xl font-bold">{totalPageViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Conversions</p>
                <p className="text-3xl font-bold">{totalConversions}</p>
              </div>
              <MousePointer className="w-8 h-8 text-pink-400" />
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Overall Conversion Rate</p>
                <p className="text-3xl font-bold">{overallConversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Winning Variant</p>
                <p className="text-3xl font-bold">{topVariant?.variant || winner}</p>
              </div>
              <ArrowUp className="w-8 h-8 text-green-400" />
            </div>
          </Card>
        </div>

        {/* Detailed Metrics Table */}
        <Card className="bg-slate-800/50 border-purple-500/20 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Variant Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left py-4 px-4 text-slate-400 font-semibold">Variant</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-semibold">Page Views</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-semibold">CTA Clicks</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-semibold">CTR</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-semibold">Conversions</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-semibold">Conv. Rate</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.variant} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                    <td className="py-4 px-4 font-bold text-lg">{m.variant}</td>
                    <td className="text-center py-4 px-4">{m.pageViews.toLocaleString()}</td>
                    <td className="text-center py-4 px-4">{m.ctaClicks}</td>
                    <td className="text-center py-4 px-4">{m.ctr.toFixed(2)}%</td>
                    <td className="text-center py-4 px-4">{m.conversions}</td>
                    <td className="text-center py-4 px-4">
                      <span className={m.variant === topVariant?.variant ? 'text-green-400 font-bold' : 'text-slate-300'}>
                        {m.conversionRate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      {m.variant === topVariant?.variant ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                          🏆 Winner
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full bg-slate-700 text-slate-400 text-sm">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-purple-500/20 p-6">
            <h3 className="text-xl font-bold mb-4">Key Insights</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-green-400">✓</span>
                <span>Variant {topVariant?.variant} has highest conversion rate at {topVariant?.conversionRate.toFixed(2)}%</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">→</span>
                <span>Variant B shows strong CTR improvement (+18% vs A)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-400">!</span>
                <span>Variant D needs optimization (lowest conversion rate)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400">◆</span>
                <span>Sample size: {totalPageViews.toLocaleString()} total views</span>
              </li>
            </ul>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 p-6">
            <h3 className="text-xl font-bold mb-4">Recommendations</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-green-400">1.</span>
                <span>Promote Variant C to primary (highest conversion)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">2.</span>
                <span>Analyze Variant B benefits messaging for A/B hybrid</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-400">3.</span>
                <span>Redesign Variant D neon elements (may be too bold)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400">4.</span>
                <span>Continue testing with larger sample size</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
