import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Spinner from './ui/Spinner.jsx';

export default function ProtectedRoute({ children }) {
    const { user, loading, login } = useAuth();
    const location = useLocation();
    useEffect(() => { if (!user && !loading) login(); }, [user, loading, login]);
    if (loading) return <Spinner label="Проверяем сессию..." />;
    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    return children;
}
