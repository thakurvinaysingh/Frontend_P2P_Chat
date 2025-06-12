import React, { useState, useEffect } from 'react';


function ChatBox({ socket, userId, peerId }) {
    const [msg, setMsg] = useState('');
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const listener = ({ from, message }) => {
            setChats(prev => [...prev, `${from}: ${message}`]);
        };

        socket.on('receivePrivateMessage', listener);

        return () => {
            socket.off('receivePrivateMessage', listener);
        };
    }, [socket]);

    const sendMessage = () => {
        if (!msg.trim()) return;
        socket.emit('sendPrivateMessage', {
            from: userId,
            to: peerId,
            message: msg,
        });
        setChats(prev => [...prev, `You: ${msg}`]);
        setMsg('');
    };

    return (
        <div className="border mt-4 p-4 bg-white rounded shadow">
            <h4 className="font-semibold mb-2">Chat with {peerId}</h4>
            <div className="bg-gray-100 h-40 overflow-y-auto p-2 mb-2">
                {chats.map((c, i) => (
                    <div key={i} className="text-sm mb-1">{c}</div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="border px-2 py-1 flex-1 text-sm"
                    placeholder="Type message"
                />
                <button
                    onClick={sendMessage}
                    className="bg-green-600 text-white px-3 py-1 text-sm rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatBox;
  