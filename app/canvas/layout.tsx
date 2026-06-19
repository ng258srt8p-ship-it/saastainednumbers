/**
 * Canvas layout — fills the main content area.
 */
export default function CanvasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {children}
    </div>
  );
}
