import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import AuthProvider from './context/AuthProvider';
import AppProvider from './context/AppProvider';
import AddRoomModal from './components/Modals/AddRoomModal';
import InviteMember from './components/Modals/InviteMember';

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<ChatRoom />} />
                    </Routes>
                    <AddRoomModal />
                    <InviteMember />
                </AppProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
