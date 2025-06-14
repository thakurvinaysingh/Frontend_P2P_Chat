// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://192.168.1.27:2001', {
    transports: ['websocket', 'polling'],
    withCredentials: true,
});

export default socket;
