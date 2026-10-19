export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-slate-500">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></span>
        </div>
        <p className="text-sm font-medium animate-pulse">Loading Workspace...</p>
      </div>
    </div>
  );
}
