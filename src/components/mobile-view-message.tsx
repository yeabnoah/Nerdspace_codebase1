
export function MobileViewMessage() {
  return (
    <div className="fixed inset-0 z-50 w-fit dark:bg-black flex items-center justify-center bg-background p-4 md:hidden">
      <div className="max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="text-3xl tracking-tight font-instrument">Mobile View Coming Soon</h2>
        <p className="mt-2 text-muted-foreground">
          We&apos;re working on bringing NerdSpace to mobile devices. Please use a larger screen device for the best experience.
        </p>
      </div>
    </div>
  );
} 