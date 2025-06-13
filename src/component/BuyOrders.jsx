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
        <div className="bg-gray-100 rounded-lg p-4 shadow-md max-h-[500px] overflow-y-auto">
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">Buy Orders</h2>

            {loading ? (
                <p className="text-center text-gray-600">Loading orders...</p>
            ) : orders.length === 0 ? (
                <p className="text-center text-gray-600">No orders available.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200"
                        >
                            <div className="font-semibold text-gray-800 text-sm break-all">
                                {order.upbAddress}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                                {order.quantity} @ {order.price} {order.currency}
                            </div>
                            <button
                                onClick={() => onSelect(order)}
                                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded"
                            >
                                BUY
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BuyOrders;



// import { useEffect, useState } from 'react';
// import { fetchBuyOrders } from '../contexts/P2PContext';

// function BuyOrders({ onSelect }) {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const loadOrders = async () => {
//             setLoading(true);
//             const data = await fetchBuyOrders();
//             setOrders(data);
//             setLoading(false);
//         };

//         loadOrders();
//     }, []);

//     return (
//         <div className="scroll-x overflow-auto whitespace-nowrap p-4 bg-gray-100 rounded">
//             {loading ? (
//                 <p>Loading orders...</p>
//             ) : (
//                 orders.map((order) => (
//                     <div
//                         key={order.id}
//                         className="inline-block bg-white border rounded shadow-sm p-2 m-2 w-60"
//                     >
//                         <div className="font-bold text-sm truncate">{order.upbAddress}</div>
//                         <div className="text-xs text-gray-600">
//                             {order.quantity} @ {order.price} {order.currency}
//                         </div>
//                         <button
//                             onClick={() => onSelect(order)}
//                             className="mt-2 bg-blue-600 text-white px-3 py-1 text-sm rounded"
//                         >
//                             BUY
//                         </button>
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// }

// export default BuyOrders;
