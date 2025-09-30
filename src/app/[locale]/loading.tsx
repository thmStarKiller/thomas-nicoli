export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-4 w-4 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
