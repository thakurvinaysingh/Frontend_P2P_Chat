// App.js
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';

function App() {
  return (
      <Routes>
        <Route path="/Chatroom" element={<Home />} />
      <Route path="/chat" element={<ChatPage />} />
      </Routes>
  );
}

export default App;



