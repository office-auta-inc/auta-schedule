import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-indigo-500 text-xl">📅</span>
        <h1 className="text-lg font-bold text-gray-800">auta-schedule</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{user?.email}</span>
        <button
          onClick={signOut}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          ログアウト
        </button>
      </div>
    </header>
  )
}
