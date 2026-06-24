import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Components/Layout";
import { getLedger } from "../services/Authapi";

export default function Ledger() {
    const { accountId } = useParams();

    const [ledgerData, setLedgerData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function loadLedger() {
            try {
                setLoading(true);
                const data =
                    await getLedger(accountId);

                console.log(data);

                setLedgerData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }

        loadLedger();
    }, [accountId]);

    return (
        <Layout>
            <div>
                <h1 className="text-3xl font-bold">
                    Account Ledger
                </h1>
                {loading && (
                    <p>Loading ledger...</p>
                )}

                {ledgerData && (
                    <div className="mt-6">

                        <p className="text-gray-500">
                            Current Balance
                        </p>

                        <p className="text-4xl font-bold text-green-600">
                            ₹{ledgerData.balance}
                        </p>

                        {ledgerData?.entries.map((entry) => (
                            <div
                                key={entry._id}
                                className="bg-white shadow-md rounded-xl p-4 mt-4 border"
                            >
                                <p>
                                    Type:
                                    {" "}
                                    {entry.type}
                                </p>

                                <p>
                                    Amount:
                                    ₹{entry.amount}
                                </p>

                                <p>
                                    Transaction:
                                    {entry.transaction?._id}
                                </p>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </Layout>
    );
}