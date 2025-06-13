// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://192.168.1.26:2001', {
    transports: ['websocket'],
    withCredentials: true,
});

export default socket;
