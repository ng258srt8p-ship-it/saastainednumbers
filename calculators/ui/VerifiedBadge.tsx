interface VerifiedBadgeProps {
  source: string;
  sourceUrl: string;
  date: string;
}

export function VerifiedBadge({ source, sourceUrl, date }: VerifiedBadgeProps) {
  return (
    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
      <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7 11.5l-3-3 1-1 2 2 4-4 1 1-5 5z" />
      </svg>
      <span>
        Verified:{" "}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {source}
        </a>
        , {date}
      </span>
    </div>
  );
}
