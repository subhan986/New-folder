export default function ReviewLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-8">
        {/* Back button skeleton */}
        <div className="h-4 w-24 bg-muted rounded"></div>
        
        {/* Video skeleton */}
        <div className="aspect-video bg-muted rounded-lg"></div>
        
        {/* Creator info skeleton */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-muted"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded"></div>
            <div className="h-3 w-24 bg-muted rounded"></div>
          </div>
        </div>
        
        {/* Products section skeleton */}
        <div>
          <div className="h-6 w-48 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
                <div className="h-3 w-1/2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* More videos section skeleton */}
        <div>
          <div className="h-6 w-48 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-video bg-muted rounded-lg"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-3 w-3/4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
