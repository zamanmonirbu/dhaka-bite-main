export default function ReferencesLoading() {
  return (
    <div className="min-h-screen bg-green-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-80 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white h-screen shadow-sm">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Referral Link Skeleton */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-20 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Users List Skeleton */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                      <div>
                        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="w-40 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full animate-pulse mb-1"></div>
                        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
