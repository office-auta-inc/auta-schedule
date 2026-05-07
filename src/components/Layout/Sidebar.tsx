export default function Sidebar() {
  return (
    <aside className="w-48 bg-white border-r border-gray-100 p-3 flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">マイカレンダー</p>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-indigo-50">
        <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
        <span className="text-sm text-gray-700">マイカレンダー</span>
      </div>
    </aside>
  )
}
