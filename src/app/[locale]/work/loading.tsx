export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
