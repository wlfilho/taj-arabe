export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9f3ea]">
      <div className="h-16 w-full border-b border-[#efe3d2] bg-[#fdf7ef]" />
      <main className="flex-1 py-10 sm:py-16">
        <div className="container-responsive space-y-10">
          <div className="space-y-4">
            <div className="h-9 w-64 animate-pulse rounded-full bg-[#eadccb]" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded-full bg-[#f0e1cb]" />
          </div>
          <div className="space-y-4">
            <div className="h-12 w-full max-w-xl animate-pulse rounded-full bg-[#eadccb]" />
            <div className="flex gap-3 overflow-hidden">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-9 w-28 animate-pulse rounded-full bg-[#eadccb]"
                />
              ))}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="flex h-40 animate-pulse flex-col rounded-3xl border border-[#e7dccd] bg-white/70 shadow-sm"
              >
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="h-6 w-2/3 rounded-full bg-[#eadccb]" />
                  <div className="h-4 w-full rounded-full bg-[#f0e1cb]" />
                  <div className="mt-auto flex items-center justify-between">
                    <div className="h-5 w-24 rounded-full bg-[#eadccb]" />
                    <div className="h-9 w-20 rounded-full bg-[#d8c2a7]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
