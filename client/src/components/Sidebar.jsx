import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-zinc-800 text-white h-screen hidden md:block">
      <div className="p-6 font-bold text-xl border-b border-zinc-700">
        Консультации
      </div>
      <nav className="p-4 space-y-3 text-sm">
        <Link to="/dashboard" className="block hover:text-blue-400">Панель</Link>
        <Link to="/profile" className="block hover:text-blue-400">Профиль</Link>
        <Link to="/specialist/1" className="block hover:text-blue-400">Специалист (пример)</Link>
        <Link to="/" className="block hover:text-blue-400">Выход</Link>
      </nav>
    </aside>
  );
}
