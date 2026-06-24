import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <div className="w-full md:w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8 text-center md:text-left">
        Fund Flow
      </h1>

      <div className="flex flex-col gap-6">
        <Link
          to="/dashboard"
          className="hover:text-blue-400"
        >
          Dashboard
        </Link>

        <Link
          to="/accounts"
          className="hover:text-blue-400"
        >
          Accounts
        </Link>

        <Link
          to="/transactions"
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