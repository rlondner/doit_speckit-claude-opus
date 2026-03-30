"use client";

interface DemoBannerProps {
  onReset: () => void;
}

export function DemoBanner({ onReset }: DemoBannerProps) {
  const handleReset = () => {
    if (window.confirm("Reset demo data? This will restore the original seed goals and discard all changes.")) {
      onReset();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-8">
      <div className="flex items-center gap-2">
        <span className="text-amber-700 font-semibold text-sm">Demo Mode</span>
        <span className="text-amber-600 text-sm">— data is stored locally and not synced to any server.</span>
      </div>
      <button
        onClick={handleReset}
        className="shrink-0 rounded-md bg-amber-200 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-300 active:bg-amber-400 min-h-[44px] min-w-[44px] transition-colors"
      >
        Reset Demo Data
      </button>
    </div>
  );
}
