import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import BuyOrders from '../component/BuyOrders';
import ChatBox from '../component/ChatBox';

const socket = io('http://192.168.1.26:2001', {
    transports: ['websocket'],
    withCredentials: true,
});

function Home() {
    const [userId, setUserId] = useState('');
    const [registered, setRegistered] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [chatStarted, setChatStarted] = useState(false);

    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleRegister = () => {
        if (!userId.trim()) return alert('Please enter your UPB Address');
        socket.emit('register', userId);
        setRegistered(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-100 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
                {!registered ? (
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                            Register with UPB Address
                        </h2>
                        <input
                            type="text"
                            placeholder="Enter your UPB Address"
                            className="w-full border border-gray-300 rounded-md px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        <button
                            onClick={handleRegister}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all"
                        >
                            Register
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                            Available BUY Orders
                        </h2>
                        <BuyOrders onSelect={(order) => setSelectedOrder(order)} />

                        {selectedOrder && !chatStarted && (
                            <div className="mt-8 p-5 bg-gray-100 border border-gray-300 rounded-xl shadow-sm">
                                <h3 className="font-semibold text-xl mb-3 text-gray-700">
                                    Order Details
                                </h3>
                                <div className="space-y-1 text-gray-600 text-base">
                                    <p><span className="font-medium">UPB Address:</span> {selectedOrder.upbAddress}</p>
                                    <p><span className="font-medium">Quantity:</span> {selectedOrder.quantity}</p>
                                    <p><span className="font-medium">Price:</span> {selectedOrder.price}</p>
                                    <p><span className="font-medium">Currency:</span> {selectedOrder.currency}</p>
                                </div>
                                <button
                                    onClick={() => setChatStarted(true)}
                                    className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all"
                                >
                                    Start Chat
                                </button>
                            </div>
                        )}

                        {chatStarted && (
                            <div className="mt-10">
                                <ChatBox
                                    socket={socket}
                                    userId={userId}
                                    peerId={selectedOrder.upbAddress}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;




// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import BuyOrders from '../component/BuyOrders';
// import ChatBox from '../component/ChatBox';

// const socket = io('http://192.168.1.26:2001', {
//     transports: ['websocket'],
//     withCredentials: true,
// });

// function Home() {
//     const [userId, setUserId] = useState('');
//     const [registered, setRegistered] = useState(false);
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [chatStarted, setChatStarted] = useState(false);

//     useEffect(() => {
//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const handleRegister = () => {
//         if (!userId.trim()) return alert('Please enter your UPB Address');
//         socket.emit('register', userId);
//         setRegistered(true);
//     };

//     return (
//         <div className="p-4 max-w-2xl mx-auto">
//             {!registered ? (
//                 <div>
//                     <h2 className="text-xl font-bold mb-2">Register with UPB Address</h2>
//                     <input
//                         placeholder="Enter your UPB Address"
//                         className="border px-3 py-2 w-full mb-2"
//                         value={userId}
//                         onChange={(e) => setUserId(e.target.value)}
//                     />
//                     <button
//                         onClick={handleRegister}
//                         className="bg-blue-600 text-white px-4 py-2 rounded"
//                     >
//                         Register
//                     </button>
//                 </div>
//             ) : (
//                 <div>
//                     <h2 className="text-xl font-bold mb-4">Available BUY Orders</h2>
//                     <BuyOrders onSelect={(order) => setSelectedOrder(order)} />

//                     {selectedOrder && !chatStarted && (
//                         <div className="mt-4 p-4 bg-white border rounded shadow">
//                             <p><strong>Order Details:</strong></p>
//                             <p>UPB Address: {selectedOrder.upbAddress}</p>
//                             <p>Quantity: {selectedOrder.quantity}</p>
//                             <p>Price: {selectedOrder.price}</p>
//                             <p>Currency: {selectedOrder.currency}</p>
//                             <button
//                                 onClick={() => setChatStarted(true)}
//                                 className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
//                             >
//                                 Start Chat
//                             </button>
//                         </div>
//                     )}

//                     {chatStarted && (
//                         <ChatBox
//                             socket={socket}
//                             userId={userId}
//                             peerId={selectedOrder.upbAddress}
//                         />
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Home;



// const socket = io('http://localhost:2001');
