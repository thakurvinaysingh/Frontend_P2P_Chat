// src/pages/ChatBox.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socket from '../socket'; // singleton instance

function ChatBox() {
    const location = useLocation();
    const { userId, peerId, orderId } = location.state || {};
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    // Consistent roomId based on sorted IDs
    const sortedIds = [userId, peerId].sort().join('_');
    const roomId = `${orderId}_${sortedIds}`;

    useEffect(() => {
        if (!socket || !userId || !peerId || !orderId) return;

        socket.emit('register', userId);
        socket.emit('join_room', { roomId, userId });

        const handleMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
        };

        const handleRoomFull = ({ message }) => {
            alert(message);
            window.location.href = '/Entry'; // Redirect to join screen
        };

        socket.on('receive_message', handleMessage);

        return () => {
            socket.off('receive_message', handleMessage);
            socket.off('room_full', handleRoomFull);
        };
    }, [roomId, userId, peerId, orderId]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const messageData = {
            roomId,
            senderId: userId,
            message: input.trim(),
            type: 'text',
        };

        socket.emit('send_message', messageData);
        // setMessages((prev) => [...prev, messageData]);
        setInput('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
            <div className="flex flex-col h-[500px] w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
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

                <div className="p-3 border-t bg-white flex items-center gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    );
}

export default ChatBox;




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
