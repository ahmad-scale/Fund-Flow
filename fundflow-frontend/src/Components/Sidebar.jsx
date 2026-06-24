import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen = false, onNavigate }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onNavigate?.();
    navigate("/login");
  }

  return (
    <div
      className={`fixed left-0 top-0 z-40 min-h-screen w-64 bg-slate-900 p-6 text-white shadow-2xl transition-transform duration-300 ease-out md:static md:translate-x-0 md:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <h1 className="text-2xl font-bold mb-8 text-center md:text-left">
        Fund Flow
      </h1>

      <div className="flex flex-col gap-6">
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="hover:text-blue-400"
        >
          Dashboard
        </Link>

        <Link
          to="/accounts"
          onClick={onNavigate}
          className="hover:text-blue-400"
        >
          Accounts
        </Link>

        <Link
          to="/transactions"
          onClick={onNavigate}
          className="hover:text-blue-400"
        >
          Transactions
        </Link>

        <button
          onClick={handleLogout}
          className="text-left hover:text-red-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
