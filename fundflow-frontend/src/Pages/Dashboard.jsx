import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardData } from "../services/Authapi";
import Layout from "../Components/Layout";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    async function loadDashboard() {
      try {
        setLoading(true);
        const data = await getDashboardData();

        console.log(data);

        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <Layout>
      {loading && (
        <p className="text-lg">
          Loading dashboard...
        </p>
      )}
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg w-full max-w-6xl">

          <h1 className="text-2xl md:text-4xl font-bold text-blue-600">
            Fund Flow Dashboard
          </h1>
          {user && (
            <p className="mt-4 text-lg">
              Welcome, {user.name}
            </p>
          )}
          {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

              <div className="bg-white shadow-md rounded-xl p-6">
                <h2 className="text-gray-500">
                  Total Accounts
                </h2>

                <p className="text-3xl font-bold">
                  {dashboardData.totalAccounts}
                </p>
              </div>

              <div className="bg-white shadow-md rounded-xl p-6">
                <h2 className="text-gray-500">
                  Total Balance
                </h2>

                <p className="text-3xl font-bold">
                  ₹{dashboardData.totalBalance}
                </p>
              </div>

              <div className="bg-white shadow-md rounded-xl p-6">
                <h2 className="text-gray-500">
                  Transactions
                </h2>

                <p className="text-3xl font-bold">
                  {dashboardData.recentTransactions.length}
                </p>
              </div>

            </div>

          )}
          <div className="mt-8 flex flex-col md:flex-row gap-4">

            <Link
              to="/accounts"
              className="bg-blue-600 text-white px-4 py-2 rounded text-center"
            >
              View Accounts
            </Link>

            <Link
              to="/transactions"
              className="bg-green-600 text-white px-4 py-2 rounded text-center"
            >
              View Transactions
            </Link>

          </div>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
}