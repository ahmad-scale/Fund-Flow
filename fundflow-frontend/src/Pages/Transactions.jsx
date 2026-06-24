import { useEffect, useState } from "react";
import {
    getTransactions,
    createTransaction,
    getUserAccounts,
} from "../services/Authapi";
import Layout from "../Components/Layout";
import { Link } from "react-router-dom";

export default function Transactions() {
    const [transactions, setTransactions] =
        useState([]);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [loading, setLoading] =
        useState(true);

    const [accounts, setAccounts] =
        useState([]);

    const [formData, setFormData] =
        useState({
            fromAccount: "",
            toAccount: "",
            amount: "",
        });

    useEffect(() => {
        async function loadTransactions() {
            try {
                setLoading(true);
                const data =
                    await getTransactions();

                console.log(data);

                setTransactions(
                    data.transactions

                );
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }

        loadTransactions();
    }, []);

    useEffect(() => {
        async function loadAccounts() {
            try {
                const data =
                    await getUserAccounts();

                setAccounts(data.accounts);
            } catch (error) {
                console.error(error);
            }
        }

        loadAccounts();
    }, []);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]:
                typeof e.target.value === "string"
                    ? e.target.value.trim()
                    : e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.fromAccount) {
            alert("Please select a source account");
            return;
        }

        if (!formData.toAccount) {
            alert("Please enter a destination account");
            return;
        }

        if (!formData.amount) {
            alert("Please enter an amount");
            return;
        }

        if (Number(formData.amount) <= 0) {
            alert("Amount must be greater than 0");
            return;
        }

        if (
            formData.fromAccount ===
            formData.toAccount
        ) {
            alert(
                "Source and destination accounts cannot be the same"
            );
            return;
        }

        try {
            await createTransaction({
                ...formData,
                amount: Number(
                    formData.amount
                ),
                idempotencyKey:
                    crypto.randomUUID(),
            });

            alert(
                "Transaction Created"
            );

            const data =
                await getTransactions();

            setTransactions(
                data.transactions
            );

            setFormData({
                fromAccount: "",
                toAccount: "",
                amount: "",
            });
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data
                    ?.message ||
                "Transaction Failed"
            );
        }
    }

    const filteredTransactions =
        transactions.filter(
            (transaction) => {

                const matchesSearch =
                    transaction.amount
                        .toString()
                        .includes(searchTerm) ||

                    transaction
                        .fromAccount?._id
                        ?.toLowerCase()
                        .includes(
                            searchTerm.toLowerCase()
                        ) ||

                    transaction
                        .toAccount?._id
                        ?.toLowerCase()
                        .includes(
                            searchTerm.toLowerCase()
                        );

                const matchesStatus =
                    statusFilter === "ALL" ||
                    transaction.status ===
                    statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );

    return (
        <Layout>
            <div className="min-h-screen p-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h1 className="text-3xl font-bold">
                        Transactions
                    </h1>

                    <div className="mt-4 flex flex-col md:flex-row gap-4">

                        <input
                            type="text"
                            placeholder="Search amount, account ID..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            className="border p-2 rounded flex-1"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="border p-2 rounded"
                        >
                            <option value="ALL">
                                All Statuses
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="FAILED">
                                Failed
                            </option>
                        </select>

                    </div>

                    <span className="bg-slate-200 px-3 py-1 rounded">
                        {filteredTransactions.length} Records
                    </span>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-xl p-4 md:p-6 mt-4 border"
                >
                    <h2 className="text-xl font-semibold mb-4">
                        Create Transaction
                    </h2>

                    <select
                        name="fromAccount"
                        value={formData.fromAccount}
                        onChange={handleChange}
                        className="border p-2 w-full mb-3"
                    >
                        <option value="">
                            Select Source Account
                        </option>

                        {accounts.map((account) => (
                            <option
                                key={account._id}
                                value={account._id}
                            >
                                {account._id}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="toAccount"
                        value={formData.toAccount}
                        onChange={handleChange}
                        placeholder="Destination Account ID"
                        className="border p-2 w-full mb-3"
                    />

                    <input
                        type="number"
                        min={1}
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Amount"
                        className="border p-2 w-full mb-3"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Send Money
                    </button>
                </form>

                {loading && (
                    <p className="mt-4">
                        Loading transactions...
                    </p>
                )}

                {!loading &&
                    filteredTransactions.length === 0 && (
                        <div className="mt-6 bg-white p-6 rounded-xl border">
                            <p className="font-medium">
                                No matching transactions found.
                            </p>

                            <p className="text-gray-500 mt-2">
                                Try changing your search term or filter.
                            </p>
                        </div>
                    )}
                    
                {!loading &&
                    transactions.length === 0 && (
                        <div className="mt-6 bg-white p-6 rounded-xl border">
                            <p>No transactions found.</p>

                            <p className="text-gray-500 mt-2">
                                Create your first transaction.
                            </p>
                        </div>
                    )}
                {!loading &&
                    filteredTransactions.map((transaction) => (
                        <div
                            key={transaction._id}
                            className="bg-white shadow-md rounded-xl p-5 mt-4 border"
                        >
                            <div className="flex justify-between">
                                <h2 className="font-semibold text-lg">
                                    Transaction
                                </h2>

                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                    {transaction.status}
                                </span>
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-500">
                                    Amount
                                </p>

                                <p className="text-xl md:text-2xl font-bold">
                                    ₹{transaction.amount}
                                </p>
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-500">
                                    From
                                </p>

                                <p className="break-all text-sm">
                                    {transaction.fromAccount?._id}
                                </p>
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-500">
                                    To
                                </p>

                                <p className="break-all text-sm">
                                    {transaction.toAccount?._id}
                                </p>
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-500">
                                    Date
                                </p>

                                <Link
                                    to={`/transactions/${transaction._id}`}
                                    className="inline-block mt-4 bg-slate-800 text-white px-4 py-2 rounded"
                                >
                                    View Details
                                </Link>

                                <p>
                                    {new Date(
                                        transaction.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </Layout>
    );
}