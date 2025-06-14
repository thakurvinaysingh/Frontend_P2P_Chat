// App.js
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import ChatEntry from './pages/ChatEntry'

function App() {
  return (
      <Routes>
        <Route path="/Chatroom" element={<Home />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/Entry" element={<ChatEntry/>} />
      </Routes>
  );
}

export default App;



