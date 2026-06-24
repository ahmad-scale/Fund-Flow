import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Components/Layout";
import { getTransactionById } from "../services/Authapi";

export default function TransactionDetails() {

    const { transactionId } =
        useParams();

    const [transaction, setTransaction] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        setLoading(true);
        async function loadTransaction() {
            try {
                const data =
                    await getTransactionById(
                        transactionId
                    );

                console.log(data);

                setTransaction(
                    data.transaction
                );
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }

        loadTransaction();
    }, [transactionId]);

    return (
        <Layout>
            <div>

                <h1 className="text-3xl font-bold">
                    Transaction Details
                </h1>

                {loading && (
                    <p>Loading transaction...</p>
                )}
                {transaction && (
                    <div className="bg-white shadow-md rounded-xl p-6 mt-6 border">

                        <p className="text-gray-500">
                            Transaction ID
                        </p>

                        <p className="break-all">
                            {transaction._id}
                        </p>

                        <div className="mt-6">
                            <p className="text-gray-500">
                                Amount
                            </p>

                            <p className="text-3xl font-bold">
                                ₹{transaction.amount}
                            </p>
                        </div>

                        <div className="mt-6">
                            <p className="text-gray-500">
                                Status
                            </p>

                            <p>
                                {transaction.status}
                            </p>

                            <div className="mt-6">
                                <p className="text-gray-500">
                                    From Account
                                </p>

                                <p className="break-all">
                                    {transaction.fromAccount?._id}
                                </p>
                            </div>

                            <div className="mt-6">
                                <p className="text-gray-500">
                                    To Account
                                </p>

                                <p className="break-all">
                                    {transaction.toAccount?._id}
                                </p>
                            </div>

                            <div className="mt-6">
                                <p className="text-gray-500">
                                    Created At
                                </p>

                                <p>
                                    {new Date(
                                        transaction.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </Layout>
    );
}