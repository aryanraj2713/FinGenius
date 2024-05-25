import React from 'react';

interface Transaction {
    _id: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    receiver: string;
}

interface TransactionLogProps {
    transactions: Transaction[];
}

const TransactionLog: React.FC<TransactionLogProps> = ({ transactions }) => {
    return (
        <div>
            <h2>Transaction Logs</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User ID</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Receipt</th>
                        <th>Status</th>
                        <th>Receiver</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{transaction.orderId}</td>
                            <td>{transaction.userId}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.currency}</td>
                            <td>{transaction.receipt}</td>
                            <td>{transaction.status}</td>
                            <td>{transaction.receiver}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionLog;
