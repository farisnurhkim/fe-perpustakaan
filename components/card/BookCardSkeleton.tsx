import React from 'react';

const BookCardSkeleton = ({ type = "admin" }: { type: "admin" | "member" }) => {
  return (
    <div className="flex flex-col bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden h-full">
      <div className="relative w-full aspect-3/4 bg-slate-800 animate-pulse" />

      <div className="p-4 flex flex-col flex-1">

        <div className="mb-3">
          <div className="h-6 w-20 bg-slate-800 rounded-md animate-pulse" />
        </div>

        <div className="mb-1 space-y-2">
          <div className="h-5 w-full bg-slate-800 rounded animate-pulse" />
          <div className="h-5 w-2/3 bg-slate-800 rounded animate-pulse" />
        </div>

        <div className="mt-2 mb-1">
          <div className="h-4 w-1/2 bg-slate-800 rounded animate-pulse" />
        </div>

        <div className="mt-1 mb-4">
          <div className="h-3 w-3/4 bg-slate-800 rounded animate-pulse" />
        </div>

        <div className="mt-auto flex justify-between items-center mb-4 pt-3 border-t border-slate-800">
          <div className="h-4 w-8 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-6 bg-slate-800 rounded animate-pulse" />
        </div>

        {type === "admin" && (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {type === "member" && (
          <div className='h-8 bg-slate-800 rounded-lg animate-pulse w-full'/>
        )}

      </div>
    </div>
  );
};

export default BookCardSkeleton;