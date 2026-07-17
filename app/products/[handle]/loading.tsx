export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-[1440px] animate-pulse px-4 md:px-8">
      <div className="py-4">
        <div className="h-3 w-48 bg-khaki/20" />
      </div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div className="grid gap-2 lg:grid-cols-2">
          <div className="col-span-2 aspect-[4/5] bg-khaki/20" />
          <div className="hidden aspect-[4/5] bg-khaki/20 lg:block" />
          <div className="hidden aspect-[4/5] bg-khaki/20 lg:block" />
        </div>
        <div>
          <div className="h-7 w-3/4 bg-khaki/20" />
          <div className="mt-3 h-5 w-24 bg-khaki/20" />
          <div className="mt-8 h-9 w-2/3 bg-khaki/20" />
          <div className="mt-6 flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-11 w-16 bg-khaki/20" />
            ))}
          </div>
          <div className="mt-8 h-12 w-full bg-khaki/20" />
          <div className="mt-3 h-12 w-full bg-khaki/20" />
        </div>
      </div>
    </div>
  );
}
