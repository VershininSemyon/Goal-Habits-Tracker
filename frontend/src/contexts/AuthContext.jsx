import { createContext, useCallback, useEffect, useState } from 'react';
import { getMe } from '../services/userService.js';
import { logout as logoutService } from '../services/authService.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage('user', null);

    useEffect(() => {
        let mounted = true;
        const checkAuth = async () => {
            try {
                const userData = await getMe();
                if (mounted) { setUser(userData); setStoredUser(userData); }
            } catch {
                if (mounted) {
                    setUser(storedUser || null);
                    if (!storedUser) removeStoredUser();
                }
            } finally { if (mounted) setLoading(false); }
        };
        checkAuth();

        const handleExpired = () => {
            if (mounted) { setUser(null); setLoading(false); removeStoredUser(); }
        };
        window.addEventListener('authExpired', handleExpired);
        return () => { mounted = false; window.removeEventListener('authExpired', handleExpired); };
    }, []);

    const login = useCallback(async () => {
        setLoading(true);
        try {
            const userData = await getMe();
            setUser(userData); setStoredUser(userData); return userData;
        } catch {
            setUser(null); removeStoredUser(); return null;
        } finally { setLoading(false); }
    }, [setStoredUser, removeStoredUser]);

    const logout = useCallback(async () => {
        try { await logoutService(); } finally { setUser(null); removeStoredUser(); }
    }, [removeStoredUser]);

    const updateUser = useCallback((userData) => { setUser(userData); setStoredUser(userData); }, [setStoredUser]);

    return <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>{children}</AuthContext.Provider>;
};
