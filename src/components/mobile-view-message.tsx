
export function MobileViewMessage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4 md:hidden">
      <div className="max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight">Mobile View Coming Soon</h2>
        <p className="mt-2 text-muted-foreground">
          We're working on bringing NerdSpace to mobile devices. Please use a larger screen device for the best experience.
        </p>
      </div>
    </div>
  );
} 