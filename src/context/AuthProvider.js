import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../firebase/config';
import { Spin } from 'antd';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState({
        displayName: '',
        email: '',
        uid: '',
        photoURL: '',
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const { displayName, email, uid, photoURL } = user;
                setUser({
                    displayName,
                    email,
                    uid,
                    photoURL,
                });
                setLoading(false);
                navigate('/');
                // ...
            } else {
                // User is signed out
                // ...
                setLoading(false);
                navigate('/login');
            }
        });

        return () => {
            unsubscribed();
        };
    }, [navigate]);

    return <AuthContext.Provider value={{ user }}>{loading ? <Spin /> : children}</AuthContext.Provider>;
}

export default AuthProvider;
