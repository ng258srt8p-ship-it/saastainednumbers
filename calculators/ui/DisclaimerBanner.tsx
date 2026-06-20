export function DisclaimerBanner() {
  return (
    <div className="mt-8 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          <p className="font-semibold mb-1">Not Financial Advice</p>
          <p>
            Results are for informational and educational purposes only and should not be
            considered financial, legal, tax, or investment advice. Always consult a qualified
            professional (certified financial planner, accountant, or attorney) who understands
            your specific situation before making any decision that could have financial, legal,
            or tax consequences. All calculations are performed locally in your browser and are
            never sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
