import { cn } from "@/lib/utils"

export function LoadingSpinner({ className, size = "default" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div
      className={cn(
        "border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin",
        sizeClasses[size],
        className
      )}
    />
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-3">
        <LoadingSpinner size="lg" />
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <LoadingSpinner />
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  )
}
