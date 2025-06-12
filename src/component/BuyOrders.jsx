import { useEffect, useState } from 'react';
import { fetchBuyOrders } from '../contexts/P2PContext';

function BuyOrders({ onSelect }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            const data = await fetchBuyOrders();
            setOrders(data);
            setLoading(false);
        };

        loadOrders();
    }, []);

    return (
        <div className="scroll-x overflow-auto whitespace-nowrap p-4 bg-gray-100 rounded">
            {loading ? (
                <p>Loading orders...</p>
            ) : (
                orders.map((order) => (
                    <div
                        key={order.id}
                        className="inline-block bg-white border rounded shadow-sm p-2 m-2 w-60"
                    >
                        <div className="font-bold text-sm truncate">{order.upbAddress}</div>
                        <div className="text-xs text-gray-600">
                            {order.quantity} @ {order.price} {order.currency}
                        </div>
                        <button
                            onClick={() => onSelect(order)}
                            className="mt-2 bg-blue-600 text-white px-3 py-1 text-sm rounded"
                        >
                            BUY
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default BuyOrders;
