import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socket from '../socket'; // singleton

function ChatBox() {
    const location = useLocation();
    const { userId, peerId, orderId } = location.state || {};
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sortedIds = [userId, peerId].sort().join('_');
    const roomId = `${orderId}_${sortedIds}`;

    useEffect(() => {
        if (!socket || !userId || !peerId || !orderId) return;

        socket.emit('register', userId);
        socket.emit('join_room', { roomId, userId });

        // Basic plain messages
        const handleMessage = (msg) => setMessages(prev => [...prev, msg]);

        // Step-wise handlers
        socket.on('receiveAvailabilityRequest', ({ from }) => {
            setMessages(prev => [...prev, { senderId: from, message: `User ${from} asked: Are you available?` }]);
        });

        socket.on('receiveAvailabilityResponse', ({ from, response }) => {
            // setMessages(prev => [...prev, { senderId: from, message: `User ${from} said: ${response}` }]);
            setMessages(prev => [
                ...prev,
                {
                    senderId: from,
                    message:
                        from === userId
                            ? `You responded: ${response === 'yes' ? '✅ Yes, available' : '❌ No, not available'}`
                            : `${from} responded: ${response === 'yes' ? '✅ Yes, available' : '❌ No, not available'}`,
                },
            ]);
           
        });

        socket.on('receiveAskForBankDetails', ({ from }) => {
            setMessages(prev => [...prev, { senderId: from, message: `User ${from} asked for your bank details.` }]);
        });

        socket.on('receiveBankDetails', ({ from, bankDetails }) => {
            setMessages(prev => [...prev, { senderId: from, message: `Bank Details: ${bankDetails}` }]);
        });

        socket.on('receivePaymentReceipt', ({ from, message }) => {
            setMessages(prev => [...prev, { senderId: from, message }]);
        });

        socket.on('paymentConfirmed', ({ from, message }) => {
            // setMessages(prev => [...prev, { senderId: from, message }]);
            setMessages(prev => [
                ...prev,
                {
                    senderId: from,
                    message: from === userId
                        ? `You confirmed: ${message}`
                        : `${from} confirmed: ${message}`,
                },
            ]);
        });

        socket.on('paymentConflict', ({ from, message }) => {
            setMessages(prev => [...prev, { senderId: from, message }]);
        });

        socket.on('receive_message', handleMessage);

        return () => {
            socket.off('receive_message', handleMessage);
            socket.off('receiveAvailabilityRequest');
            socket.off('receiveAvailabilityResponse');
            socket.off('receiveAskForBankDetails');
            socket.off('receiveBankDetails');
            socket.off('receivePaymentReceipt');
            socket.off('paymentConfirmed');
            socket.off('paymentConflict');
        };
    }, [roomId, userId, peerId, orderId]);

    // Text message sending
    const sendMessage = () => {
        if (!input.trim()) return;

        const messageData = {
            roomId,
            senderId: userId,
            message: input.trim(),
            type: 'text',
        };

        socket.emit('send_message', messageData);
        setMessages(prev => [...prev, messageData]);
        setInput('');
    };

    // Step 1: Ask availability
    const askAvailability = () => {
        socket.emit('askAvailability', { from: userId, to: peerId });
        setMessages(prev => [...prev, {
            senderId: userId,
            message: `You asked ${peerId}: Are you available?`
        }]);
    };

    // Step 2: Respond availability
    const respondAvailability = (response) => {
        socket.emit('availabilityResponse', { from: userId, to: peerId, response });
        
    };

    // Step 3: Ask for bank details
    const askForBankDetails = () => {
        socket.emit('askPaymentDetails', { from: userId, to: peerId });
        setMessages(prev => [...prev, {
            senderId: userId,
            message: `You asked ${peerId} for bank details.`
        }]);
    };

    // Step 4: Send bank details (as plain text)
    const sendBankDetails = () => {
        const details = prompt('Enter your bank details:');
        if (details) {
            socket.emit('sendBankDetails', { from: userId, to: peerId, bankDetails: details });
            setMessages(prev => [...prev, { senderId: userId, message: `Sent bank details: ${details}` }]);
        }
    };

    // Step 5: Send Receipt
    const sendReceipt = () => {
        socket.emit('sendReceipt', { from: userId, to: peerId });
        setMessages(prev => [...prev, { senderId: userId, message: `Payment Receipt Sent` }]);
    };

    // Step 6: Confirm payment
    const confirmPayment = (status) => {
        socket.emit('confirmPaymentStatus', { from: userId, to: peerId, status });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
            <div className="flex flex-col h-[600px] w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
                <div className="text-sm text-gray-600 bg-gray-200 px-4 py-2">
                    <p><span className="font-semibold">You:</span> {userId}</p>
                    <p><span className="font-semibold">Peer:</span> {peerId}</p>
                    <p><span className="font-semibold">Order ID:</span> {orderId}</p>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`mb-3 flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${msg.senderId === userId
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                <p>{msg.message}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-2 border-t bg-white flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2 justify-center text-xs">
                        <button onClick={askAvailability} className="bg-blue-100 px-3 py-1 rounded">Ask Available?</button>
                        <button onClick={() => respondAvailability('yes')} className="bg-green-100 px-3 py-1 rounded">Respond Yes</button>
                        <button onClick={() => respondAvailability('no')} className="bg-red-100 px-3 py-1 rounded">Respond No</button>
                        <button onClick={askForBankDetails} className="bg-yellow-100 px-3 py-1 rounded">Ask Bank Details</button>
                        <button onClick={sendBankDetails} className="bg-indigo-100 px-3 py-1 rounded">Send Bank Details</button>
                        <button onClick={sendReceipt} className="bg-pink-100 px-3 py-1 rounded">Send Receipt</button>
                        <button onClick={() => confirmPayment('yes')} className="bg-green-200 px-3 py-1 rounded">Confirm Yes</button>
                        <button onClick={() => confirmPayment('no')} className="bg-red-200 px-3 py-1 rounded">Confirm No</button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none"
                            placeholder="Type a message"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;


// // src/pages/ChatBox.jsx
// import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import socket from '../socket'; // singleton instance

// function ChatBox() {
//     const location = useLocation();
//     const { userId, peerId, orderId } = location.state || {};
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');

//     // Consistent roomId based on sorted IDs
//     const sortedIds = [userId, peerId].sort().join('_');
//     const roomId = `${orderId}_${sortedIds}`;

//     useEffect(() => {
//         if (!socket || !userId || !peerId || !orderId) return;

//         socket.emit('register', userId);
//         socket.emit('join_room', { roomId, userId });

//         const handleMessage = (msg) => {
//             setMessages((prev) => [...prev, msg]);
//         };

//         const handleRoomFull = ({ message }) => {
//             alert(message);
//             window.location.href = '/Entry'; // Redirect to join screen
//         };

//         socket.on('receive_message', handleMessage);

//         return () => {
//             socket.off('receive_message', handleMessage);
//             socket.off('room_full', handleRoomFull);
//         };
//     }, [roomId, userId, peerId, orderId]);

//     const sendMessage = () => {
//         if (!input.trim()) return;

//         const messageData = {
//             roomId,
//             senderId: userId,
//             message: input.trim(),
//             type: 'text',
//         };

//         socket.emit('send_message', messageData);
//         // setMessages((prev) => [...prev, messageData]);
//         setInput('');
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
//             <div className="flex flex-col h-[500px] w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="text-sm text-gray-600 bg-gray-200 px-4 py-2">
//                     <p><span className="font-semibold">You:</span> {userId}</p>
//                     <p><span className="font-semibold">Peer:</span> {peerId}</p>
//                     <p><span className="font-semibold">Order ID:</span> {orderId}</p>
//                 </div>
//                 <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
//                     {messages.map((msg, idx) => (
//                         <div
//                             key={idx}
//                             className={`mb-3 flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
//                         >
//                             <div
//                                 className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${msg.senderId === userId
//                                     ? 'bg-blue-600 text-white rounded-br-none'
//                                     : 'bg-gray-200 text-gray-800 rounded-bl-none'
//                                     }`}
//                             >
//                                 <p>{msg.message}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="p-3 border-t bg-white flex items-center gap-2">
//                     <input
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                         className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="Type a message"
//                     />
//                     <button
//                         onClick={sendMessage}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
//                     >
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ChatBox;




// import { useLocation } from 'react-router-dom';
// import ChatBox from '../component/ChatBox';
// import { io } from 'socket.io-client';

// const socket = io('http://192.168.1.26:2001', {
//     transports: ['websocket'],
//     withCredentials: true,
// });

// function ChatPage() {
//     const location = useLocation();
//     const { userId, peerId, orderId } = location.state || {};

//     if (!userId || !peerId || !orderId) {
//         return <div className="text-center mt-20 text-red-500">Invalid chat data.</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//             <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
//                 <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Chat with {peerId}</h2>
//                 <ChatBox socket={socket} userId={userId} peerId={peerId} orderId={orderId} />
//             </div>
//         </div>
//     );
// }

// export default ChatPage;
