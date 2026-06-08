import { trpc } from './trpc';

export type Variant = 'A' | 'B' | 'C' | 'D';

let cachedVariant: Variant | null = null;

export async function getVariant(): Promise<Variant> {
  if (cachedVariant) return cachedVariant;

  const stored = localStorage.getItem('ab_variant');
  if (stored && ['A', 'B', 'C', 'D'].includes(stored)) {
    cachedVariant = stored as Variant;
    return cachedVariant;
  }

  try {
    // Use fetch directly to avoid React hooks in non-component context
    const response = await fetch('/api/trpc/ab.getVariant');
    const json = await response.json();
    const variant = json.result?.data?.variant || 'A';
    cachedVariant = variant;
    localStorage.setItem('ab_variant', variant);
    return variant;
  } catch (error) {
    console.error('Failed to get AB variant:', error);
    return 'A'; // Fallback to variant A
  }
}

export async function trackEvent(event: string, metadata?: Record<string, any>) {
  const variant = await getVariant();
  try {
    await fetch('/api/trpc/ab.trackConversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        json: { variant, event, metadata },
      }),
    });
  } catch (error) {
    console.error('Failed to track AB event:', error);
  }
}
