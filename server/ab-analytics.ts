import { getDb } from "./db";

export interface VariantMetrics {
  variant: 'A' | 'B' | 'C' | 'D';
  pageViews: number;
  ctaClicks: number;
  formSubmits: number;
  conversions: number;
  conversionRate: number;
  ctr: number;
}

export async function getABTestMetrics(): Promise<VariantMetrics[]> {
  // TODO: Query from abTestEvents table when schema is updated
  // For now, return mock data structure
  const variants: Record<'A' | 'B' | 'C' | 'D', VariantMetrics> = {
    A: { variant: 'A', pageViews: 1240, ctaClicks: 89, formSubmits: 12, conversions: 12, conversionRate: 0.97, ctr: 7.18 },
    B: { variant: 'B', pageViews: 1156, ctaClicks: 98, formSubmits: 15, conversions: 15, conversionRate: 1.30, ctr: 8.48 },
    C: { variant: 'C', pageViews: 1089, ctaClicks: 102, formSubmits: 18, conversions: 18, conversionRate: 1.65, ctr: 9.37 },
    D: { variant: 'D', pageViews: 1203, ctaClicks: 76, formSubmits: 8, conversions: 8, conversionRate: 0.67, ctr: 6.32 },
  };

  return Object.values(variants);
}

export async function getWinningVariant(): Promise<'A' | 'B' | 'C' | 'D'> {
  const metrics = await getABTestMetrics();
  return metrics.reduce((prev, current) => 
    current.conversionRate > prev.conversionRate ? current : prev
  ).variant;
}

export async function getABTestSummary() {
  const metrics = await getABTestMetrics();
  const totalPageViews = metrics.reduce((sum, m) => sum + m.pageViews, 0);
  const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0);
  const overallConversionRate = totalPageViews > 0 
    ? ((totalConversions / totalPageViews) * 100).toFixed(2)
    : '0.00';

  return {
    totalPageViews,
    totalConversions,
    overallConversionRate,
    winningVariant: await getWinningVariant(),
    metrics,
  };
}
