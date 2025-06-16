// src/pages/ChatEntry.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatEntry() {
    const [userId, setUserId] = useState('');
    const [peerId, setPeerId] = useState('');
    const [orderId, setOrderId] = useState('');
    const navigate = useNavigate();

    const handleJoin = () => {
        if (!userId || !peerId || !orderId) {
            alert("All fields are required");
            return;
        }

        navigate('/chat', {
            state: { userId, peerId, orderId }
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow w-96 space-y-4">
                <h2 className="text-xl font-bold text-center">Join Chat Room</h2>
                <input
                    className="w-full border rounded p-2"
                    placeholder="Your ID (userId)"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input
                    className="w-full border rounded p-2"
                    placeholder="Other User ID (peerId)"
                    value={peerId}
                    onChange={(e) => setPeerId(e.target.value)}
                />
                <input
                    className="w-full border rounded p-2"
                    placeholder="Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                />
                <button
                    onClick={handleJoin}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Join Chat
                </button>
            </div>
        </div>
    );
}

export default ChatEntry;




// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function ChatEntry() {
//     const [userId, setUserId] = useState('');
//     const [peerId, setPeerId] = useState('');
//     const [orderId, setOrderId] = useState('');
//     const navigate = useNavigate();

//     const handleJoin = () => {
//         if (!userId || !peerId || !orderId) return alert("All fields are required");

//         navigate('/chat', {
//             state: { userId, peerId, orderId }
//         });
//     };

//     return (
//         <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
//             <div className="bg-white p-6 rounded shadow w-96 space-y-4">
//                 <h2 className="text-xl font-bold text-center">Join Chat Room</h2>

//                 <input
//                     className="w-full border rounded p-2"
//                     placeholder="Your ID (userId)"
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                 />
//                 <input
//                     className="w-full border rounded p-2"
//                     placeholder="Other User ID (peerId)"
//                     value={peerId}
//                     onChange={(e) => setPeerId(e.target.value)}
//                 />
//                 <input
//                     className="w-full border rounded p-2"
//                     placeholder="Order ID"
//                     value={orderId}
//                     onChange={(e) => setOrderId(e.target.value)}
//                 />
//                 <button
//                     onClick={handleJoin}
//                     className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//                 >
//                     Join Chat
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default ChatEntry;
