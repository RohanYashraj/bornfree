export default function CollectionLoading() {
  return (
    <div className="mx-auto max-w-[1440px] animate-pulse px-4 md:px-8">
      <div className="pt-6">
        <div className="h-3 w-32 bg-khaki/20" />
      </div>
      <div className="flex items-baseline gap-4 py-6">
        <div className="h-10 w-64 bg-khaki/20 md:h-12" />
        <div className="h-3 w-16 bg-khaki/20" />
      </div>
      <div className="flex items-center justify-between border-b border-border-spec py-3">
        <div className="h-9 w-24 bg-khaki/20" />
        <div className="h-9 w-32 bg-khaki/20" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 py-8 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] bg-khaki/20" />
            <div className="mt-3 h-4 w-3/4 bg-khaki/20" />
            <div className="mt-2 h-4 w-1/4 bg-khaki/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
