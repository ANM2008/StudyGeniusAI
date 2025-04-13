import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  // You can add any UI inside Loading, including a skeleton.
  return (
    <div className="container py-10">
      <div className="mb-8 flex justify-between items-center">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="shadow-md">
            <div className="p-6">
              <Skeleton className="h-6 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[250px] mb-4" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
