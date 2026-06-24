import { useEffect, useState } from "react";
import {
    getUserAccounts,
    createAccount,
    getAccountBalance,
} from "../services/Authapi";
import Layout from "../Components/Layout";
import { Link } from "react-router-dom";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [balances, setBalances] = useState({});
    const [loading, setLoading] = useState(true);

    async function loadAccounts() {
        try {
            setLoading(true);
            const data = await getUserAccounts();

            console.log(data);

            setAccounts(data.accounts);

            const balanceData = {};

            for (const account of data.accounts) {
                const balanceResponse =
                    await getAccountBalance(account._id);

                balanceData[account._id] =
                    balanceResponse.balance;
            }

            setBalances(balanceData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAccounts();
    }, []);

    async function handleCreateAccount() {

        if (accounts.length >= 10) {
            alert(
                "Maximum account limit reached"
            );
            return;
        }
        try {
            await createAccount();

            await loadAccounts();

            alert("Account Created Successfully");
        } catch (error) {
            console.error(error);

            alert("Failed To Create Account");
        }
    }

    return (
        <Layout>
            {loading && (
                <p className="mt-4">
                    Loading accounts...
                </p>
            )}
            {!loading && accounts.length === 0 && (
                <div className="mt-6 bg-white p-6 rounded-xl border">
                    <p>No accounts found.</p>

                    <p className="text-gray-500 mt-2">
                        Create your first account to begin.
                    </p>
                </div>
            )}
            <div className="min-h-screen p-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h1 className="text-3xl font-bold">
                        Accounts
                    </h1>

                    <span className="bg-slate-200 px-3 py-1 rounded">
                        {accounts.length} Accounts
                    </span>
                </div>

                <button
                    onClick={handleCreateAccount}
                    className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 w-full md:w-auto"
                >
                    Create Account
                </button>

                {!loading &&
                    accounts.map((account) => (
                        <div
                            key={account._id}
                            className="bg-white shadow-md rounded-xl p-6 mt-4 border"
                        >
                            <h2 className="text-xl font-semibold">
                                Account
                            </h2>

                            <p className="text-gray-500 mt-2">
                                ID:
                            </p>

                            <p className="break-all text-sm">
                                {account._id}
                            </p>

                            <div className="mt-4">
                                <p className="text-gray-500">
                                    Balance
                                </p>

                                <p className="text-2xl md:text-3xl font-bold text-green-600">
                                    ₹{balances[account._id] ?? 0}
                                </p>

                                <Link
                                    to={`/ledger/${account._id}`}
                                    className="inline-block mt-4 bg-slate-800 text-white px-4 py-2 rounded"
                                >
                                    View Ledger
                                </Link>
                            </div>


                        </div>
                    ))}
            </div>
        </Layout>
    );
}
