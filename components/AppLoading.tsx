import { Sun } from './Icons';
export function AppLoadingSplash() {
  return (
    <div className="bg-cream/85 fixed inset-0 z-[60] grid place-items-center backdrop-blur-sm">
      <AppLoadingIndicator />
    </div>
  );
}
export function AppLoadingIndicator() {
  return (
    <div role="status" className="text-muted flex flex-col items-center gap-4 py-16">
      <Sun className="animate-pulse text-[#e9b900]" />
      <span className="text-sm">Getting things ready…</span>
    </div>
  );
}
